import { Button, Tooltip } from "@mui/material";
import { ButtonProps } from "@mui/material";
import { AuthGuardPermissions } from "../core/AuthGuard";

export type GLButtonProps = ButtonProps & {
  // !
  uiText?: string;
  permission: string;
  fallBackText: string;
};

const GLButton = ({
  disabled: disabledLocal,
  children,
  sx,
  uiText,
  permission,
  fallBackText,
  ...props
}: GLButtonProps) => {
  const textKey = permission || uiText;

  return (
    <AuthGuardPermissions secureId={permission}>
      {({ disabled, t }) => (
        
        <Tooltip title={t(textKey!) || fallBackText}>
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
              {children ?? ((t && t(textKey!)) || fallBackText)}
            </Button>
          </span>
        </Tooltip>
      )}
    </AuthGuardPermissions>
  );
};

export default GLButton;
