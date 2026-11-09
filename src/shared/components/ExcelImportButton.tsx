import React, { useRef, useState } from 'react';
import {
  Button,
  CircularProgress,
  Tooltip,
  ButtonProps,
  Snackbar,
  Alert,
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { useExcelImport, ExcelImportResult } from '../hooks/useExcelImport';

interface ExcelImportButtonProps extends ButtonProps {
  onImportSuccess?: (data: ExcelImportResult) => void;
  onImportError?: (error: Error) => void;
  buttonText?: string;
  accept?: string;
  maxFileSize?: number; // in MB
  showNotification?: boolean;
  text?: string;
}

export const ExcelImportButton: React.FC<ExcelImportButtonProps> = ({
  onImportSuccess,
  onImportError,
  buttonText = 'Import from Excel',
  accept = '.xlsx, .xls, .csv',
  maxFileSize = 10, // 10MB default
  showNotification = true,
  disabled,
  children,
  text,
  ...buttonProps
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { importFromExcel, loading } = useExcelImport({
    onSuccess: onImportSuccess,
    onError: onImportError,
  });
  
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    
    if (!file) return;
    
    // Validate file size
    if (file.size > maxFileSize * 1024 * 1024) {
      const errorMsg = `File size exceeds ${maxFileSize}MB limit`;
      setError(errorMsg);
      onImportError?.(new Error(errorMsg));
      return;
    }
    
    // Validate file extension
    const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
    const validExtensions = accept.split(',').map(ext => ext.trim());
    
    if (!validExtensions.includes(fileExtension)) {
      const errorMsg = `Invalid file type. Please upload ${accept}`;
      setError(errorMsg);
      onImportError?.(new Error(errorMsg));
      return;
    }
    
    try {
      await importFromExcel(file);
      if (showNotification) {
        setSuccess(`Successfully imported ${file.name}`);
      }
    } catch (error) {
      const importError = error as Error;
      if (showNotification) {
        setError(importError.message);
      }
    } finally {
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleCloseNotification = () => {
    setError(null);
    setSuccess(null);
  };

  return (
    <>
      <Tooltip title={text || 'Import data from Excel file'}>
        <span>
          <Button
            variant="contained"
            onClick={handleClick}
            disabled={disabled || loading}
            startIcon={!loading && <CloudUploadIcon />}
            {...buttonProps}
          >
            {loading ? <CircularProgress size={20} /> : (children ?? (text || buttonText))}
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            accept={accept}
            onChange={handleFileSelect}
            style={{ display: 'none' }}
          />
        </span>
      </Tooltip>
      
      {showNotification && (
        <Snackbar
          open={!!error || !!success}
          autoHideDuration={4000}
          onClose={handleCloseNotification}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        >
          <Alert
            onClose={handleCloseNotification}
            severity={error ? 'error' : 'success'}
            variant="filled"
          >
            {error || success}
          </Alert>
        </Snackbar>
      )}
    </>
  );
};