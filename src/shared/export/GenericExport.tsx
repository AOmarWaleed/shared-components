import { useEffect, useRef, useState } from "react";
import {
  Button,
  CircularProgress,
  Menu,
  MenuItem,
  ListItemText,
  Tooltip,
} from "@mui/material";
import FileDownloadRoundedIcon from "@mui/icons-material/FileDownloadRounded";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { useExcelExport, ExcelColumn } from "../hooks/useExcelExport";
import { useExportContext } from "./ExportContext";
import type { ExportDefinition } from "./types";
import { DisplayMsgDialog } from "../dialog/DisplayMsgDialog";

export interface GenericExportProps {
  label?: string;
  tooltip?: string;
  sx?: object;
  /**
   * "standalone" (default) — renders a Button that opens a dropdown Menu.
   * "submenu"              — renders a MenuItem; clicking reveals export options
   *                          as a nested submenu — designed for use inside an existing Menu.
   */
  mode?: "standalone" | "submenu";
  onExportSuccess?: (definition: ExportDefinition) => void;
  onExportError?: (error: Error) => void;
}

const deriveColumns = (rows: Record<string, unknown>[]): ExcelColumn[] => {
  if (!rows.length) return [];
  return Object.keys(rows[0]).map((key) => ({
    field: key,
    headerName: key.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
  }));
};

/** Extract the most meaningful message from any thrown value. */
const extractMessage = (error: unknown): string => {
  if (typeof error === "object" && error !== null) {
    // Axios-style error: error.response.data.error.message
    const axiosLike = error as {
      response?: { data?: { error?: { message?: string } | string } };
    };
    const payload = axiosLike.response?.data?.error;
    if (typeof payload === "string") return payload;
    if (typeof payload === "object" && payload?.message) return payload.message;
  }
  if (error instanceof Error) return error.message;
  return "Export failed. Please try again.";
};

/**
 * Generic Excel export control — fully page-agnostic.
 *
 * mode="standalone" (default): renders a Button that opens a dropdown.
 * mode="submenu": renders a MenuItem; clicking reveals export options as a
 *                 nested submenu — designed for use inside an existing Menu.
 */
const GenericExport = ({
  label = "Export",
  tooltip = "Export data",
  sx,
  mode = "standalone",
  onExportSuccess,
  onExportError,
}: GenericExportProps) => {
  const { transport, activeSource } = useExportContext();
  const { exportToExcel } = useExcelExport();

  const [exports, setExports] = useState<ExportDefinition[]>([]);
  const [loadingList, setLoadingList] = useState(false);
  const [exportingCode, setExportingCode] = useState<string | null>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Used in submenu mode to anchor the nested menu to the parent MenuItem.
  const submenuAnchorRef = useRef<HTMLLIElement | null>(null);
  const [submenuOpen, setSubmenuOpen] = useState(false);

  const pageKey = activeSource?.pageKey ?? null;

  useEffect(() => {
    if (!pageKey) { setExports([]); return; }

    let cancelled = false;
    setLoadingList(true);

    transport
      .fetchExports(pageKey)
      .then((list) => { if (!cancelled) setExports(list); })
      .catch(() => { if (!cancelled) setExports([]); })
      .finally(() => { if (!cancelled) setLoadingList(false); });

    return () => { cancelled = true; };
  }, [pageKey, transport]);

  const isBusy = loadingList || exportingCode !== null;

  const handleRun = async (definition: ExportDefinition) => {
    setAnchorEl(null);
    setSubmenuOpen(false);
    if (!activeSource) return;

    const filters = activeSource.getParams();

    const required = definition.required_params ?? [];
    const missing = required.filter((key) => {
      const v = filters[key];
      return v === undefined || v === null || v === "";
    });
    if (missing.length > 0) {
      setErrorMessage(
        `Missing required filter(s): ${missing.join(", ")}. ` +
          `Please fill in the required fields before exporting.`
      );
      return;
    }

    try {
      setExportingCode(definition.code);
      const rows = await transport.runExport(definition.code, filters);

      if (!rows?.length) {
        setErrorMessage("No data found for the selected filters.");
        onExportError?.(new Error("No data to export"));
        return;
      }

      await exportToExcel({
        columns: deriveColumns(rows),
        data: rows,
        fileName: definition.code.toLowerCase(),
        autoWidth: true,
      });

      onExportSuccess?.(definition);
    } catch (error) {
      const message = extractMessage(error);
      setErrorMessage(message);
      onExportError?.(error instanceof Error ? error : new Error(message));
    } finally {
      setExportingCode(null);
    }
  };

  // Nothing to offer for this page → render nothing.
  if (!pageKey || (!loadingList && exports.length === 0)) return null;

  const exportMenuItems = exports.map((definition) => (
    <MenuItem
      key={definition.code}
      onClick={() => handleRun(definition)}
      disabled={exportingCode !== null}
      sx={{
        "&:hover": {
          backgroundColor: "action.hover",
        },
      }}
    >
      <ListItemText primary={definition.description || definition.code} />
    </MenuItem>
  ));

  const errorDialog = (
    <DisplayMsgDialog
      open={errorMessage !== null}
      onClose={() => setErrorMessage(null)}
      getResource={false}
      status="ERROR"
      description={errorMessage ?? ""}
    />
  );

  // ── Submenu mode ─────────────────────────────────────────────────────────
  if (mode === "submenu") {
    return (
      <>
        <MenuItem
          ref={submenuAnchorRef}
          onClick={() => setSubmenuOpen((prev) => !prev)}
          disabled={isBusy}
          sx={sx}
        >
          {isBusy
            ? <CircularProgress size={16} sx={{ mr: 1 }} />
            : <FileDownloadRoundedIcon fontSize="small" sx={{ mr: 1 }} />}
          <ListItemText primary={exportingCode ? "Exporting..." : label} />
          <ChevronRightIcon fontSize="small" sx={{ ml: "auto", opacity: 0.5 }} />
        </MenuItem>

        <Menu
          anchorEl={submenuAnchorRef.current}
          open={submenuOpen}
          onClose={() => setSubmenuOpen(false)}
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
          transformOrigin={{ vertical: "top", horizontal: "left" }}
          disableRestoreFocus
          disableScrollLock
        >
          {exportMenuItems}
        </Menu>

        {errorDialog}
      </>
    );
  }

  // ── Standalone mode (default) ─────────────────────────────────────────────
  const startIcon = isBusy
    ? <CircularProgress size={18} color="inherit" />
    : <FileDownloadRoundedIcon />;

  return (
    <>
      <Tooltip title={tooltip}>
        <span>
          <Button
            onClick={(e) => setAnchorEl(e.currentTarget)}
            disabled={isBusy || exports.length === 0}
            startIcon={startIcon}
            sx={{ textTransform: "none", ...sx }}
          >
            {exportingCode ? "Exporting..." : label}
          </Button>
        </span>
      </Tooltip>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
      >
        {exportMenuItems}
      </Menu>

      {errorDialog}
    </>
  );
};

export default GenericExport;
