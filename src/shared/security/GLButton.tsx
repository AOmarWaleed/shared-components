import { Button, Tooltip } from "@mui/material";
import { ButtonProps } from "@mui/material";
import { AuthGuardPermissions } from "../core/AuthGuard";

export type GLButtonProps = ButtonProps & {
  resource_key: string;
  fallBackText?: string;
};

const GLButton = ({
  resource_key,
  fallBackText,
  disabled: disabledLocal,
  children,
  sx,
  ...props
}: GLButtonProps) => {
  return (
    <AuthGuardPermissions secureId={resource_key}>
      {({ disabled, t }) => (
        <Tooltip title={t(resource_key)}>
          <span>
            <Button
              {...props}
              disabled={disabled || disabledLocal}
              sx={{
                ...(disabled || disabledLocal
                  ? { opacity: 0.5, cursor: "not-allowed" }
                  : {}),
                ...sx,
              }}
            >
              {children ?? ((t && t(resource_key)) || fallBackText)}
            </Button>
          </span>
        </Tooltip>
      )}
    </AuthGuardPermissions>
  );
};

export default GLButton;
