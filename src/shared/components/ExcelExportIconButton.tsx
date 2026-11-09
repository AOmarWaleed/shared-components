import React, { useState } from "react";
import {
  CircularProgress,
  Tooltip,
  IconButton,
  IconButtonProps,
} from "@mui/material";
import { useExcelExport, ExcelColumn } from "../hooks/useExcelExport";

export type CellRange = {
  s: {
    r: number;
    c: number;
  };
  e: {
    r: number;
    c: number;
  };
};

interface ExcelExportIconButtonProps extends IconButtonProps {
  columns: ExcelColumn[];
  data: any[] | (() => Promise<any[]>);
  fileName?: string;
  sheetName?: string;
  buttonText?: string;
  autoWidth?: boolean;
  text?: string;
  onExportStart?: () => void;
  onExportSuccess?: () => void;
  onExportError?: (error: Error) => void;
  totalRows?: string;
  totalColumns?: string;
  headerSection?: any[][];
  mergeArray?: CellRange[];
}

export const ExcelExportIconButton: React.FC<ExcelExportIconButtonProps> = ({
  columns,
  data,
  fileName,
  sheetName,
  buttonText = "Export to Excel",
  autoWidth = true,
  onExportStart,
  onExportSuccess,
  onExportError,
  disabled,
  children,
  text,
  totalRows,
  totalColumns,
  headerSection = [],
  mergeArray = [],
  ...buttonProps
}) => {
  const { exportToExcel } = useExcelExport();
  const [loading, setLoading] = useState(false);

  const handleExport = async () => {
    try {
      setLoading(true);
      onExportStart?.();

      await exportToExcel({
        columns,
        data,
        fileName,
        sheetName,
        autoWidth,
        totalRows,
        totalColumns,
        headerSection,
        mergeArray,
      });

      onExportSuccess?.();
    } catch (error) {
      console.error("Export error:", error);
      onExportError?.(error as Error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Tooltip title={text}>
      <span>
        <IconButton
          onClick={handleExport}
          disabled={disabled || loading}
          {...buttonProps}
        >
          {loading ? (
            <CircularProgress size={20} />
          ) : (
            (children ?? (text || buttonText))
          )}
        </IconButton>
      </span>
    </Tooltip>
  );
};
