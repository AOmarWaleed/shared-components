import { AuthGuardPermissions } from "../core/AuthGuard";
import { ExcelImportButton } from "../components/ExcelImportButton";
import { ExcelImportResult } from "../hooks/useExcelImport";
import { ButtonProps } from "@mui/material";

export interface GLExcelImportButtonProps extends ButtonProps {
  resource_key: string;
  onImportSuccess?: (data: ExcelImportResult) => void;
  onImportError?: (error: Error) => void;
  buttonText?: string;
  accept?: string;
  maxFileSize?: number;
  showNotification?: boolean;
  headerSection?: any[][];
}

const GLExcelImportButton = ({
  resource_key,
  disabled: disabledLocal,
  ...props
}: GLExcelImportButtonProps) => {
  return (
    <AuthGuardPermissions secureId={resource_key}>
      {({ disabled, t }) => (
        <ExcelImportButton
          {...props}
          text={t(resource_key)}
          disabled={disabled || disabledLocal}
        />
      )}
    </AuthGuardPermissions>
  );
};

export default GLExcelImportButton;
