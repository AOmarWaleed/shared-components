import { useState } from "react";
import {
  Button,
  CircularProgress,
  Tooltip,
} from "@mui/material";
import FileUploadRoundedIcon from "@mui/icons-material/FileUploadRounded";
import { useExcelExport, ExcelColumn } from "../hooks/useExcelExport";
import { AuthGuardPermissions } from "../core/AuthGuard";

export interface GenericExcelExportButtonProps {
  data: any[] | (() => Promise<any[]>);
  fileName: string;
  resource_key: string;
  tooltip?: string;
  disabled?: boolean;
  onExportStart?: () => void;
  onExportSuccess?: () => void;
  onExportError?: (error: Error) => void;
}

const deriveColumns = (rows: any[]): ExcelColumn[] => {
  if (!rows.length) return [];
  return Object.keys(rows[0]).map((key) => ({
    field: key,
    headerName: key
      .replace(/_/g, " ")
      .replace(/\b\w/g, (c) => c.toUpperCase()),
  }));
};

const GenericExcelExportButton = ({
  data,
  fileName,
  resource_key,
  tooltip = "Export to Excel",
  disabled = false,
  onExportStart,
  onExportSuccess,
  onExportError,
}: GenericExcelExportButtonProps) => {
  const [loading, setLoading] = useState(false);
  const { exportToExcel } = useExcelExport();

  const handleExport = async () => {
    try {
      setLoading(true);
      onExportStart?.();

      const rows = typeof data === "function" ? await data() : data;

      if (!rows?.length) {
        onExportError?.(new Error("No data to export"));
        return;
      }

      const columns = deriveColumns(rows);

      await exportToExcel({
        columns,
        data: rows,
        fileName,
        autoWidth: true,
      });

      onExportSuccess?.();
    } catch (error) {
      console.error("Export failed:", error);
      onExportError?.(error as Error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthGuardPermissions secureId={resource_key}>
      {({ disabled: permDisabled }) => (
        <Tooltip title={tooltip}>
          <Button
            variant="contained"
            onClick={handleExport}
            disabled={disabled || permDisabled || loading}
            startIcon={
              loading ? (
                <CircularProgress size={18} />
              ) : (
                <FileUploadRoundedIcon />
              )
            }
            sx={{ textTransform: "none", my: 1 }}
          >
            {loading ? "Exporting..." : "Export to Excel"}
          </Button>
        </Tooltip>
      )}
    </AuthGuardPermissions>
  );
};

export default GenericExcelExportButton;
