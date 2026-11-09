import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  memo,
} from "react";
import {
  DataGrid,
  GridFilterModel,
  GridSortModel,
  GridColDef,
  GridRowId,
} from "@mui/x-data-grid";
import { Box, IconButton, Stack, Typography } from "@mui/material";
import { useGlList } from "../hooks/useGlList";
import { useGlSetState } from "../hooks/useGlState";
import GlCustomPagination from "./GlCustomPagination";
import { format } from "date-fns";
import { useGlLocalStorage } from "../hooks/useGlLocalStorage";
import { useGlDeepCompareEffect } from "../hooks/useGlDeepCompareEffect";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import { SWRConfiguration } from "swr";

// --- Types -------------------------------------------------------------------

interface TableState {
  page: number;
  limit: number;
  _sort: string;
  _filter: string;
  selectedRowId: GridRowId | null;
}

export interface GlCustomTableProps<T> {
  url: string;
  params?: Record<string, any>;
  columns: GridColDef[];
  /** Initial server-side sort applied when the table mounts. */
  initialSort?: {
    field: string;
    direction: "asc" | "desc";
  };
  customSortColumns?: string[];
  getRowId?: (row: T) => string | number;
  handleDataChange?: (list: any[]) => void;
  loading?: boolean;
  onRowSelected?: (selectedRow: T | null) => void;
  /** Ref that exposes a refetch function to the parent. */
  refetchRef?: React.MutableRefObject<(() => void) | null>;
  resetRef?: React.MutableRefObject<(() => void) | null>;
  enableKeyboardNavigation?: boolean;
  autoSelectFirstRow?: boolean;
  smallSize?: boolean;
  hideHeader?: boolean;
  footer?: React.ReactNode;
  sx?: any;
  fetcher: (args: string | [string, any]) => Promise<any>;
  hideFooter?: boolean;
  /** Ref that exposes a resetSelectedRow function to the parent. */
  resetSelectedRowRef?: React.MutableRefObject<(() => void) | null>;
  /** Externally controlled page number. */
  page?: number;
  /** Externally controlled page size. */
  limit?: number;
  onPageChangeExternal?: (page: number) => void;
  onLimitChangeExternal?: (limit: number) => void;
  /**
   * If true, allows unselecting a row by clicking it again.
   * @default true
   */
  enableUnselectRow?: boolean;
  /**
   * Optional transform applied to fetched rows before rendering.
   */
  updateData?: (rows: T[] | undefined) => T[];
  /**
   * If true, pagination is handled locally after the initial fetch.
   * Page and limit are omitted from request params in this mode.
   */
  clientPagination?: boolean;
  /**
   * Optional dot-notated path to rows array in the API response.
   * Example: "payload.customers"
   */
  rowsPath?: string;
  /**
   * Optional dot-notated path to total count in the API response.
   * Example: "payload.total"
   */
  totalPath?: string;
  /**
   * Called when fetching data fails (after all retries).
   */
  onFetchError?: (error: any) => void;

  initialHiddenColumns?: string[];

  actionsSideSort?: React.ReactNode;

  /**
   * optional to control dropdown list that shows how many rows is shown
   */
  pageSizeOptions?: number[];
}

// --- CustomFooter (extracted to prevent re-creation on every render) ----------

interface CustomFooterProps {
  total: number;
  page: number;
  limit: number;
  smallSize: boolean;
  footer?: React.ReactNode;
  onPageSizeChange: (size: number) => void;
  onPageChange: (page: number) => void;
  pageSizeOptions?: number[];
}

const CustomFooter = memo(function CustomFooter({
  total,
  page,
  limit,
  smallSize,
  footer,
  onPageSizeChange,
  onPageChange,
  pageSizeOptions,
}: CustomFooterProps) {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        p: 1,
        borderTop: "1px solid",
        borderColor: "divider",
      }}
    >
      <GlCustomPagination
        totalCount={total}
        currentPage={page}
        pageSize={limit}
        onPageSizeChange={onPageSizeChange}
        onPageChange={onPageChange}
        smallSize={smallSize}
        showPageInput={!smallSize}
        showPageSizeText={!smallSize}
        pageSizeOptions={pageSizeOptions}
      />
      {footer && <Box>{footer}</Box>}
    </Box>
  );
});

// --- GlCustomTable -----------------------------------------------------------

export default function GlCustomTable<T extends Record<string, any>>({
  url,
  params = {},
  columns,
  initialSort,
  getRowId,
  loading: externalLoading,
  onRowSelected,
  enableKeyboardNavigation = true,
  autoSelectFirstRow = true,
  smallSize = false,
  enableUnselectRow = false,

  footer,
  handleDataChange,
  refetchRef,
  resetRef,
  hideHeader = false,
  customSortColumns,
  fetcher,
  hideFooter = false,
  resetSelectedRowRef,
  page: externalPage,
  limit: externalLimit,
  onPageChangeExternal,
  onLimitChangeExternal,
  updateData,
  clientPagination = false,
  rowsPath,
  totalPath,
  onFetchError,
  sx,
  initialHiddenColumns = [],
  actionsSideSort,
  pageSizeOptions,
  ...props
}: GlCustomTableProps<T>) {
  // -- Local state -------------------------------------------------------------

  const [data, setData] = useState<T[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [customSort, setCustomSort] = useState<{
    field: string;
    direction: "asc" | "desc";
  } | null>(null);

  // -- Table state (page / limit / sort / filter / selectedRowId) --------------

  const initialTableState = useRef<TableState>({
    page: externalPage ?? 1,
    limit: externalLimit ?? 10,
    _sort: initialSort ? `${initialSort.field},${initialSort.direction}` : "",
    _filter: "",
    selectedRowId: null,
  });

  const {
    state: tableState,
    setState: setTableState,
    setField: setTableField,
    onResetState,
  } = useGlSetState<TableState>(initialTableState.current);

  // -- Column-visibility persistence -------------------------------------------

  const storageKey = `gl_table_visibility_${url}`;

  // Create initial visibility model with initialHiddenColumns set to false
  const getInitialVisibilityModel = useCallback(() => {
    const initialModel: Record<string, boolean> = {};
    columns.forEach((column) => {
      // If column field is in initialHiddenColumns, set to false, otherwise true
      initialModel[column.field] = !initialHiddenColumns.includes(column.field);
    });
    return initialModel;
  }, [columns, initialHiddenColumns]);

  const { state: columnVisibilityModel, setState: setColumnVisibilityModel } =
    useGlLocalStorage<Record<string, boolean>>(
      storageKey,
      getInitialVisibilityModel(),
    );

  // -- Stable helpers ----------------------------------------------------------

  const stableCustomSortColumns = useMemo(
    () => customSortColumns ?? [],
    [customSortColumns],
  );

  const sortModel = useMemo<GridSortModel>(() => {
    if (!tableState._sort) return [];
    const [field, direction] = tableState._sort.split(",");
    if (direction !== "asc" && direction !== "desc") return [];
    return [{ field, sort: direction }];
  }, [tableState._sort]);

  // Memoize error handler + options so useGlList's swrConfig memo stays stable
  const handleError = useCallback(
    (err: any, _: string | [string, any], __: SWRConfiguration) => {
      setData([]);
      setTotal(0);
      onFetchError?.(err);
    },
    [onFetchError],
  );

  const swrOptions = useMemo(
    () => ({ handleError, rowsPath, totalPath }),
    [handleError, rowsPath, totalPath],
  );

  const stableInitParams = useMemo(
    () =>
      clientPagination
        ? { ...params, _sort: tableState._sort, _filter: tableState._filter }
        : { ...params, ...tableState },
    [clientPagination, params, tableState],
  );

  // -- Data fetching -----------------------------------------------------------

  const { glList, isLoading, handleParamsChange, mutateGlList } = useGlList<T>({
    url,
    initParams: stableInitParams,
    fetcher,
    options: swrOptions,
  });

  useEffect(() => {
    if (glList) {
      const rows = updateData ? updateData(glList.data) : glList.data;
      setData(rows ?? []);
      setTotal(clientPagination ? rows.length : glList.total);
    } else {
      setData([]);
      setTotal(0);
    }
  }, [glList, updateData, clientPagination]);

  const visibleData = useMemo(() => {
    if (!clientPagination) return data;

    const start = (tableState.page - 1) * tableState.limit;
    return data.slice(start, start + tableState.limit);
  }, [clientPagination, data, tableState.page, tableState.limit]);

  // Notify parent when rows change
  useEffect(() => {
    handleDataChange?.(data);
  }, [data, handleDataChange]);

  const isLoadingInternal = externalLoading ?? isLoading;

  const tableRef = useRef<HTMLDivElement>(null);

  // -- Event handlers ----------------------------------------------------------

  const handleColumnVisibilityChange = useCallback(
    (newModel: Record<string, boolean>) => {
      setColumnVisibilityModel(newModel);
    },
    [setColumnVisibilityModel],
  );

  const handleRowClick = useCallback(
    (rowParams: any) => {
      const clickedRowId = rowParams.id;
      if (tableState.selectedRowId === clickedRowId) {
        if (enableUnselectRow) {
          setTableField("selectedRowId", null);
          onRowSelected?.(null);
        }
      } else {
        setTableField("selectedRowId", clickedRowId);
        onRowSelected?.(rowParams.row);
      }
    },
    [onRowSelected, tableState.selectedRowId, enableUnselectRow, setTableField],
  );

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (
        !enableKeyboardNavigation ||
        !tableRef.current ||
        visibleData.length === 0
      )
        return;
      if (!tableRef.current.contains(event.target as Node)) return;
      if (event.key !== "ArrowDown" && event.key !== "ArrowUp") return;

      event.preventDefault();

      const currentIndex = visibleData.findIndex((row: any) => {
        const rowId = getRowId?.(row) ?? row.id ?? row._id;
        return rowId === tableState.selectedRowId;
      });

      if (currentIndex === -1 && autoSelectFirstRow) {
        const firstRowId =
          getRowId?.(visibleData[0]) ??
          visibleData[0].id ??
          visibleData[0]._id ??
          0;
        setTableField("selectedRowId", firstRowId);
        onRowSelected?.(visibleData[0]);
        return;
      }

      const newIndex =
        event.key === "ArrowDown"
          ? Math.min(currentIndex + 1, visibleData.length - 1)
          : Math.max(currentIndex - 1, 0);

      if (newIndex !== currentIndex) {
        const newRow = visibleData[newIndex];
        const newRowId = getRowId?.(newRow) ?? newRow.id ?? newRow._id;
        setTableField("selectedRowId", newRowId);
        onRowSelected?.(newRow);
        document
          .querySelector(`[data-id="${newRowId}"]`)
          ?.scrollIntoView({ block: "nearest" });
      }
    },
    [
      visibleData,
      tableState.selectedRowId,
      enableKeyboardNavigation,
      autoSelectFirstRow,
      getRowId,
      onRowSelected,
      setTableField,
    ],
  );

  const handleSortModelChange = useCallback(
    (sortModel: GridSortModel) => {
      if (sortModel.length === 0) {
        setTableState({ _sort: "" });
        return;
      }
      const { field: sortField, sort: sortDirection } = sortModel[0];
      setTableState({
        _sort: sortDirection ? `${sortField},${sortDirection}` : "",
        page: 1,
      });
    },
    [setTableState],
  );

  const toggleSort = useCallback(
    (field: string) => {
      setCustomSort((prev) => {
        const newDirection: "asc" | "desc" =
          prev?.field === field && prev.direction === "asc" ? "desc" : "asc";
        setTableState({ _sort: `${field},${newDirection}`, page: 1 });
        return { field, direction: newDirection };
      });
    },
    [setTableState],
  );

  const handleFilterChange = useCallback(
    (filterModel: GridFilterModel) => {
      if (filterModel.items.length === 0 || !filterModel.items[0]?.value) {
        setTableState({ _filter: "", page: 1 });
        return;
      }

      const filterItem = { ...filterModel.items[0] };
      if (filterItem.field?.includes("date") && filterItem.value) {
        filterItem.value = format(
          new Date(filterItem.value),
          "yyyy-MM-dd HH:mm:ss",
        );
      }
      setTableState({
        _filter: `${filterItem.field},${filterItem.operator},${filterItem.value}`,
        page: 1,
      });
      setTableField("selectedRowId", null);
      onRowSelected?.(null);
    },
    [setTableState, setTableField, onRowSelected],
  );

  const handlePageSizeChange = useCallback(
    (newPageSize: number) => {
      if (onLimitChangeExternal) {
        onLimitChangeExternal(newPageSize);
      } else {
        setTableState({ limit: newPageSize, page: 1 });
      }
      setTableField("selectedRowId", null);
      onRowSelected?.(null);
    },
    [setTableState, setTableField, onRowSelected, onLimitChangeExternal],
  );

  const handlePageChange = useCallback(
    (newPage: number) => {
      if (onPageChangeExternal) {
        onPageChangeExternal(newPage);
      } else {
        setTableState({ page: newPage });
      }
      setTableField("selectedRowId", null);
      onRowSelected?.(null);
    },
    [setTableState, setTableField, onRowSelected, onPageChangeExternal],
  );

  // -- Memoized columns --------------------------------------------------------

  const memoizedColumns = useMemo(
    () =>
      columns.map((column) =>
        column.type === "actions"
          ? { ...column, filterable: false, sortable: false }
          : { ...column },
      ),
    [columns],
  );

  // -- Effects -----------------------------------------------------------------

  // Sync query params on every table-state change
  useGlDeepCompareEffect(() => {
    handleParamsChange(
      clientPagination
        ? {
            page: undefined,
            limit: undefined,
            _sort: tableState._sort,
            _filter: tableState._filter,
            ...params,
          }
        : {
            page: tableState.page,
            limit: tableState.limit,
            _sort: tableState._sort,
            _filter: tableState._filter,
            ...params,
          },
    );
  }, [clientPagination, tableState, handleParamsChange, params]);
  // Sync external page prop -> internal state
  useEffect(() => {
    if (typeof externalPage === "number" && externalPage !== tableState.page) {
      setTableState({ page: externalPage });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [externalPage]);

  // Sync external limit prop -> internal state
  useEffect(() => {
    if (
      typeof externalLimit === "number" &&
      externalLimit !== tableState.limit
    ) {
      setTableState({ limit: externalLimit });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [externalLimit]);

  // Auto-select first row / clear selection when visible rows change
  useEffect(() => {
    if (visibleData.length === 0) {
      setTableField("selectedRowId", null);
      onRowSelected?.(null);
    } else if (autoSelectFirstRow) {
      const firstRowId =
        getRowId?.(visibleData[0]) ??
        visibleData[0].id ??
        visibleData[0]._id ??
        0;
      setTableField("selectedRowId", firstRowId);
      onRowSelected?.(visibleData[0]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visibleData, autoSelectFirstRow]);

  // Keyboard navigation listener
  useEffect(() => {
    if (!enableKeyboardNavigation) return;
    const el = document.getElementById(url);
    el?.addEventListener("keydown", handleKeyDown);
    return () => el?.removeEventListener("keydown", handleKeyDown);
  }, [enableKeyboardNavigation, handleKeyDown, url]);

  // Expose refetch to parent

  useEffect(() => {
    if (resetRef) {
      resetRef.current = () => onResetState();
    }
  }, [resetRef, onResetState]);

  useEffect(() => {
    if (refetchRef) {
      refetchRef.current = () => mutateGlList();
    }
  }, [mutateGlList, refetchRef]);

  // Expose reset-selected-row to parent
  useEffect(() => {
    if (resetSelectedRowRef) {
      resetSelectedRowRef.current = () => {
        setTableField("selectedRowId", null);
        onRowSelected?.(null);
      };
    }
  }, [resetSelectedRowRef, onRowSelected, setTableField]);

  // -- Footer slot -------------------------------------------------------------

  const FooterSlot = useCallback(
    () =>
      hideFooter ? null : (
        <CustomFooter
          total={total}
          page={tableState.page}
          limit={tableState.limit}
          smallSize={smallSize}
          footer={footer}
          onPageSizeChange={handlePageSizeChange}
          onPageChange={handlePageChange}
          pageSizeOptions={pageSizeOptions}
        />
      ),
    [
      hideFooter,
      total,
      tableState.page,
      tableState.limit,
      smallSize,
      footer,
      handlePageSizeChange,
      handlePageChange,
    ],
  );

  // -- Render ------------------------------------------------------------------

  return (
    <div id={url}>
      {stableCustomSortColumns.length > 0 && (
        <Stack direction="row" spacing={2}>
          {stableCustomSortColumns.map((field) => (
            <Box key={field} sx={{ display: "flex", alignItems: "center" }}>
              <Typography sx={{ textTransform: "capitalize" }}>
                {field.replace("_", " ")}
              </Typography>
              <IconButton onClick={() => toggleSort(field)} color="primary">
                {customSort?.field === field &&
                customSort.direction === "asc" ? (
                  <ArrowUpwardIcon />
                ) : (
                  <ArrowDownwardIcon />
                )}
              </IconButton>
            </Box>
          ))}
          {actionsSideSort && <>{actionsSideSort}</>}
        </Stack>
      )}

      <Box ref={tableRef} sx={{ width: "100%", overflowX: "auto" }}>
        <DataGrid
          sx={{
            ".MuiDataGrid-scrollbar": { display: "none" },
            ...sx,
          }}
          rows={visibleData}
          columns={memoizedColumns}
          sortingMode="server"
          filterMode="server"
          onFilterModelChange={handleFilterChange}
          sortModel={sortModel}
          onSortModelChange={handleSortModelChange}
          loading={isLoadingInternal}
          onRowClick={handleRowClick}
          rowSelectionModel={
            tableState.selectedRowId ? [tableState.selectedRowId] : []
          }
          getRowId={
            getRowId ?? ((row: T) => row.id ?? row._id ?? JSON.stringify(row))
          }
          columnVisibilityModel={columnVisibilityModel}
          onColumnVisibilityModelChange={handleColumnVisibilityChange}
          slots={{
            footer: FooterSlot,
            ...(hideHeader ? { columnHeaders: () => null } : {}),
          }}
          {...props}
        />
      </Box>
    </div>
  );
}
