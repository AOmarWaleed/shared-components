import { FormControlLabel } from "@mui/material";
import { FormControlLabelProps } from "@mui/material";
import { AuthGuardPermissions } from "../core/AuthGuard";

export type GLGenericFormControlLabel = FormControlLabelProps & {
  resource_key: string;
};

const GLGenericFormControlLabel = ({
  resource_key,
  disabled: disabledLocal,
  ...props
}: GLGenericFormControlLabel) => {
  return (
    <AuthGuardPermissions secureId={resource_key}>
      {({ disabled }) => (
        <FormControlLabel {...props} disabled={disabled || disabledLocal} />
      )}
    </AuthGuardPermissions>
  );
};

export default GLGenericFormControlLabel;
