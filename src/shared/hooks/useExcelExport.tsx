import { useCallback } from "react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { CellRange } from "../components/ExcelExportIconButton";
export interface ExcelColumn {
  field: string;
  headerName: string;
  width?: number; // Width in characters (Excel column width)
  format?: (value: any) => string | number; // Custom formatter
}

export interface ExportOptions {
  fileName?: string;
  sheetName?: string;
  columns: ExcelColumn[];
  data: any[] | (() => Promise<any[]>); // Static or async data source
  autoWidth?: boolean;
  totalRows?: string; // if defined  a column with header ${totalRows} and every cell sums a row
  totalColumns?: string; // if defined a final row with first cell ${totalColumns} each cell sumz a column
  headerSection?: any[][]; // if defined any array inside the main array represents a row and every element represents a cell
  mergeArray?: CellRange[];
}

export const useExcelExport = () => {
  const exportToExcel = useCallback(async (options: ExportOptions) => {
    const {
      fileName = `export_${new Date().toISOString().slice(0, 19)}`,
      sheetName = "Sheet1",
      columns,
      data,
      totalRows,
      totalColumns,
      autoWidth = true,
      headerSection = [],
      mergeArray = [],
    } = options;

    try {
      // Get data (support both static and async)
      const exportData = typeof data === "function" ? await data() : data;

      if (!exportData?.length) {
        console.warn("No data to export");
        return;
      }

      // Format data according to columns
      const formattedData = exportData.map((item: any) => {
        const row: any = {};
        columns.forEach((col) => {
          let value = item[col.field];
          if (col.format) {
            value = col.format(value);
          }
          row[col.headerName] = value ?? "";
        });
        return row;
      });

      // Add a column to sum every cell in a row
      if (totalRows) {
        const keys = Object.keys(formattedData);
        if (keys.length > 0) {
          formattedData.forEach((row) => {
            row[totalRows] = Object.values(row).reduce(
              (total: number, value: any) => {
                /*
                 * Here we are adding an object with for total row to columns array for sake of width formatting later in the code
                 * since there is no dependancy on columns again except for width formattin this is ok
                 * if in the future columns will be needed in other part of code I suggest making a copy of columns first to be used
                 * for formatting purpose only
                 * POSSIABLY I will do it in the future
                 **/
                if (isNaN(Number(value))) {
                  columns.push({ field: totalRows, headerName: totalRows });
                  return 0;
                }
                return total + Number(value) || 0;
              },
              0,
            );
          });
        }
      }
      // Add a row to sum every cell in coloumn
      if (totalColumns) {
        const row: Record<string, string | number> = {};
        if (formattedData.length > 0) {
          const keys = Object.keys(formattedData[0]);
          for (const key of keys) {
            const value = formattedData.reduce((acc, curr) => {
              const value = Number(curr[key]);
              return Number.isNaN(value) ? totalColumns : value + acc;
            }, 0);
            row[key] = value;
          }
        }
        formattedData.push(row);
      }

      // Create worksheet
      const ws = XLSX.utils.json_to_sheet(formattedData, {
        origin: "A4",
      });

      // Add rows at the begining of file as a Header
      if (mergeArray.length > 0) {
        ws["!merges"] = mergeArray;
      }
      if (headerSection.length > 0) {
        XLSX.utils.sheet_add_aoa(ws, headerSection, { origin: "A1" });
      }

      // Set column widths
      if (autoWidth) {
        const colWidths = columns.map((col) => ({
          wch:
            col.width ||
            Math.max(
              col.headerName.length,
              ...exportData.map((item) => String(item[col.field] || "").length),
            ),
        }));
        ws["!cols"] = colWidths;
      }

      // Create workbook and export
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, sheetName);

      const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
      const blob = new Blob([excelBuffer], {
        type: "application/octet-stream",
      });
      saveAs(blob, `${fileName}.xlsx`);
    } catch (error) {
      console.error("Export failed:", error);
      throw error;
    }
  }, []);

  return { exportToExcel };
};
