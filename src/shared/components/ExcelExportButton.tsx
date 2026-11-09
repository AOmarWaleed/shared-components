import React, { useState } from 'react';
import {
  Button,
  CircularProgress,
  Tooltip,
  ButtonProps,
} from '@mui/material';
import { useExcelExport, ExcelColumn } from '../hooks/useExcelExport';

interface ExcelExportButtonProps extends ButtonProps {
  columns: ExcelColumn[];
  data: any[] | (() => Promise<any[]>);
  fileName?: string;
  sheetName?: string;
  buttonText?: string;
  autoWidth?: boolean;
  text ?: string ,
  onExportStart?: () => void;
  onExportSuccess?: () => void;
  onExportError?: (error: Error) => void;
}

export const ExcelExportButton: React.FC<ExcelExportButtonProps> = ({
  columns,
  data,
  fileName,
  sheetName,
  buttonText = 'Export to Excel',
  autoWidth = true,
  onExportStart,
  onExportSuccess,
  onExportError,
  disabled,
  children,
  text,
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
      });

      onExportSuccess?.();
    } catch (error) {
      console.error('Export error:', error);
      onExportError?.(error as Error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Tooltip title={text }>
      <span>
        <Button
          variant="contained"
          onClick={handleExport}
          disabled={disabled || loading}
          {...buttonProps}
        >
          {loading ? <CircularProgress size={20} /> : (children ?? ((text || buttonText)))}
        </Button>
      </span>
    </Tooltip>
  );
};