import { useState } from 'react';
import * as XLSX from 'xlsx';

export interface ExcelImportResult {
  data: any[];
  columns: string[];
  fileName: string;
}

export interface UseExcelImportOptions {
  onSuccess?: (result: ExcelImportResult) => void;
  onError?: (error: Error) => void;
}

export const useExcelImport = (options?: UseExcelImportOptions) => {
  const [loading, setLoading] = useState(false);

  const importFromExcel = (file: File): Promise<ExcelImportResult> => {
    return new Promise((resolve, reject) => {
      setLoading(true);
      
      const reader = new FileReader();
      
      reader.onload = (e) => {
        try {
          const data = e.target?.result;
          const workbook = XLSX.read(data, { type: 'binary' });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          
          // Convert sheet to JSON
          const jsonData = XLSX.utils.sheet_to_json(worksheet);
          
          // Get column names from first row
          const columns = jsonData.length > 0 
            ? Object.keys(jsonData[0]) 
            : [];
          
          const result: ExcelImportResult = {
            data: jsonData,
            columns,
            fileName: file.name,
          };
          
          options?.onSuccess?.(result);
          resolve(result);
        } catch (error) {
          const importError = error as Error;
          options?.onError?.(importError);
          reject(importError);
        } finally {
          setLoading(false);
        }
      };
      
      reader.onerror = () => {
        const error = new Error('Failed to read file');
        options?.onError?.(error);
        setLoading(false);
        reject(error);
      };
      
      reader.readAsBinaryString(file);
    });
  };

  return {
    importFromExcel,
    loading,
  };
};