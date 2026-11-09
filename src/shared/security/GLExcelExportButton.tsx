import { AuthGuardPermissions } from "../core/AuthGuard";
import { ExcelExportButton } from "../components/ExcelExportButton";
import { ExcelColumn } from "../hooks/useExcelExport";
import { ButtonProps } from "@mui/material";

export interface GLExcelExportButtonProps extends ButtonProps {
  resource_key: string;
  columns: ExcelColumn[];
  data: any[] | (() => Promise<any[]>);
  fileName?: string;
  sheetName?: string;
  buttonText?: string;
  autoWidth?: boolean;
  onExportStart?: () => void;
  onExportSuccess?: () => void;
  onExportError?: (error: Error) => void;
}

const GLExcelExportButton = ({
  resource_key,
  disabled: disabledLocal,
  ...props
}: GLExcelExportButtonProps) => {
  return (
    <AuthGuardPermissions secureId={resource_key}>
      {({ disabled , t }) => (
        <ExcelExportButton
          {...props}
          text={t(resource_key)}
          disabled={disabled || disabledLocal}
        />
      )}
    </AuthGuardPermissions>
  );
};

export default GLExcelExportButton;
