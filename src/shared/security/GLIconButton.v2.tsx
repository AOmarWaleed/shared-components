import { IconButton, IconButtonProps, Tooltip } from "@mui/material";
import { AuthGuardPermissions } from "../core/AuthGuard";
import { useContext } from "react";
import { AuthGuardContext } from "../core/AuthGuard";

export type GLIconButtonProps = IconButtonProps & {
  permission: string;
  uiText?: string;
  fallBackText: string;
};

const GLIconButton = ({
  permission,
  uiText,
  fallBackText,
  disabled: disabledLocal,
  children,
  sx,
  ...props
}: GLIconButtonProps) => {
  const ctx = useContext(AuthGuardContext);
  const isDisabled = disabledLocal || ctx?.checkDisabled(permission) || false;

  

  return (
    <AuthGuardPermissions secureId={permission}>
      {({ t }) => (
        <Tooltip title={t(uiText || permission) || fallBackText}>
          <span>
            <IconButton 
              {...props} 
              disabled={isDisabled}
              sx={{
                ...(isDisabled ? { 
                  opacity: 0.5, 
                  cursor: 'not-allowed' 
                } : {}),
                ...sx
              }}
            >
              {children}
            </IconButton>
          </span>
        </Tooltip>
      )}
    </AuthGuardPermissions>
  );
};

export default GLIconButton;