import { AuthGuardPermissions } from "../core/AuthGuard";
import { ExcelExportIconButton } from "../components/ExcelExportIconButton";
import { ExcelColumn } from "../hooks/useExcelExport";
import { ButtonProps } from "@mui/material";

type ExportMergeRange = {
  s: { r: number; c: number };
  e: { r: number; c: number };
};

export interface GLExcelExportIconButtonProps extends ButtonProps {
  resource_key: string;
  columns: ExcelColumn[];
  data: any[] | (() => Promise<any[]>);
  fileName?: string;
  sheetName?: string;
  buttonText?: string;
  autoWidth?: boolean;
  totalRows?: string;
  totalColumns?: string;
  onExportStart?: () => void;
  onExportSuccess?: () => void;
  onExportError?: (error: Error) => void;
  headerSection?: (string | null)[][];
  mergeArray?: ExportMergeRange[];
}

const GLExcelExportIconButton = ({
  resource_key,
  disabled: disabledLocal,
  ...props
}: GLExcelExportIconButtonProps) => {
  return (
    <AuthGuardPermissions secureId={resource_key}>
      {({ disabled, t }) => (
        <ExcelExportIconButton
          {...props}
          text={t(resource_key)}
          disabled={disabled || disabledLocal}
        />
      )}
    </AuthGuardPermissions>
  );
};

export default GLExcelExportIconButton;
