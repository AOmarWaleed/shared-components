import { TextField } from "@mui/material";
import { TextFieldProps } from "@mui/material";
import { AuthGuardPermissions } from "../core/AuthGuard";

export type GLTextFieldProps = TextFieldProps & {
  resource_key: string;
};

const GLTextField = ({
  resource_key,
  disabled: disabledLocal,
  required: requiredLocal,
  ...props
}: GLTextFieldProps) => {
  return (
    <AuthGuardPermissions secureId={resource_key}>
      {({ disabled, required }) => (
        <TextField
          {...props}
          disabled={disabled || disabledLocal}
          required={required || requiredLocal}
        />
      )}
    </AuthGuardPermissions>
  );
};

export default GLTextField;
