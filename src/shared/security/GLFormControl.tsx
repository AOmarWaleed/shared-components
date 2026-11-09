import { FormControl } from "@mui/material";
import { FormControlProps } from "@mui/material";
import { AuthGuardPermissions } from "../core/AuthGuard";

export type GLFormControlProps = FormControlProps & {
  resource_key: string;
};

const GLFormControl = ({
  resource_key,
  disabled: disabledLocal,
  children,
  ...props
}: GLFormControlProps) => {
  return (
    <AuthGuardPermissions secureId={resource_key}>
      {({ disabled }) => (
        <FormControl {...props} disabled={disabled || disabledLocal}>
          {children}
        </FormControl>
      )}
    </AuthGuardPermissions>
  );
};

export default GLFormControl;
