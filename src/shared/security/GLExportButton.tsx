
import { AuthGuardPermissions } from "../core/AuthGuard";
import { Snackbar, Alert } from "@mui/material";
import FileUploadRoundedIcon from "@mui/icons-material/FileUploadRounded";
import { saveAs } from "file-saver";
import * as XLSX from "xlsx";
import { Tooltip, IconButton, CircularProgress } from "@mui/material";
import { useState } from "react";

export interface ExportButtonProps {
  fetchData: () => Promise<any[]>; 
  fileName: string;
  tooltip?: string;
  disabled?: boolean;
}

const exportToExcel = (data: any[], fileName: string) => {
  const worksheet = XLSX.utils.json_to_sheet(data);

  if (data.length > 0) {
    const headerKeys = Object.keys(data[0]);
    const columnWidths = headerKeys.map((key) => ({
      wch: Math.max(
        10,
        key.length + 2,
        ...data.map((row) => (row[key] ? String(row[key]).length : 0))
      ),
    }));
    worksheet["!cols"] = columnWidths;

    headerKeys.forEach((_, index) => {
      const cellAddress = XLSX.utils.encode_cell({ c: index, r: 0 });
      if (worksheet[cellAddress]) {
        worksheet[cellAddress].s = {
          font: { bold: true, color: { rgb: "FFFFFF" } },
          fill: { fgColor: { rgb: "4472C4" } },
          alignment: { horizontal: "center", vertical: "center" },
        };
      }
    });

    data.forEach((row, rowIndex) => {
      headerKeys.forEach((key, colIndex) => {
        const cellAddress = XLSX.utils.encode_cell({
          c: colIndex,
          r: rowIndex + 1,
        });
        if (!worksheet[cellAddress]) return;

        if (typeof row[key] === "number") {
          worksheet[cellAddress].z = row[key] % 1 === 0 ? "#,##0" : "#,##0.00";
          worksheet[cellAddress].s = {
            ...(worksheet[cellAddress].s || {}),
            alignment: { horizontal: "right" },
          };
        }

        if (row[key] instanceof Date) {
          worksheet[cellAddress].z = "yyyy-mm-dd";
          worksheet[cellAddress].v = row[key];
        }
      });
    });
  }

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

  const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
  const blob = new Blob([excelBuffer], { type: "application/octet-stream" });

  const currentDate = new Date().toISOString().split("T")[0];
  const fullFileName = `${fileName}_${currentDate}`;
  saveAs(blob, `${fullFileName}.xlsx`);
};

const ExportButton = ({
  fetchData,
  fileName,
  tooltip = "Export",
  disabled = false,
}: ExportButtonProps) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleExport = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchData();
      exportToExcel(data, fileName);
    } catch (err: any) {
      setError(err.message || "Failed to export.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Tooltip title={tooltip}>
        <span>
          <IconButton onClick={handleExport} disabled={disabled || loading}>
            {loading ? (
              <CircularProgress size={24} />
            ) : (
              <FileUploadRoundedIcon />
            )}
          </IconButton>
        </span>
      </Tooltip>

      <Snackbar
        open={!!error}
        autoHideDuration={5000}
        onClose={() => setError(null)}
      >
        <Alert severity="error" onClose={() => setError(null)}>
          {error}
        </Alert>
      </Snackbar>
    </>
  );
};



export interface ExportButtonProps {
  fetchData: () => Promise<any[]>; // fetches full data to export
  fileName: string;
  tooltip?: string;
  disabled?: boolean;
}

type GLExportButtonProps = ExportButtonProps & { resource_key: string };

const GLExportButton = ({ resource_key, ...props }: GLExportButtonProps) => {
  return (
    <AuthGuardPermissions secureId={resource_key}>
      {({ disabled }) => <ExportButton {...props} disabled={disabled} />}
    </AuthGuardPermissions>
  );
};

export default GLExportButton;
