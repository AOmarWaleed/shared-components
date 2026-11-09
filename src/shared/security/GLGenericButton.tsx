import { Button } from "@mui/material";
import { ButtonProps } from "@mui/material";
import { AuthGuardPermissions } from "../core/AuthGuard";

export type GLButtonProps = ButtonProps & {
  resource_key: string;
};

const GLGenericButton = ({
  resource_key,
  disabled: disabledLocal,
  children,
  ...props
}: GLButtonProps) => {
  return (
    <AuthGuardPermissions secureId={resource_key}>
      {({ disabled }) => (
        <Button {...props} disabled={disabled || disabledLocal}>
          {children}
        </Button>
      )}
    </AuthGuardPermissions>
  );
};

export default GLGenericButton;
