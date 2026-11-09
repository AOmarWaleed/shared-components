import { IconButton, IconButtonProps, Tooltip } from "@mui/material";
import { AuthGuardPermissions } from "../core/AuthGuard";

export type GLIconButtonProps = IconButtonProps & {
  resource_key: string;
};

const GLIconButton = ({
  resource_key,
  disabled: disabledLocal,
  children,
  sx ,
  ...props

}: GLIconButtonProps) => {
  return (
    <AuthGuardPermissions secureId={resource_key}>
      {({ disabled, t }) => (
        <Tooltip title={t(resource_key)}>
          <span>
            <IconButton {...props} disabled={disabled || disabledLocal}  sx={{...(disabled ? {opacity : ".5" , cursor: 'not-allowed' } : {})   , ...sx }} >
              {children}
            </IconButton>
          </span>
        </Tooltip>
      )}
    </AuthGuardPermissions>
  );
};

export default GLIconButton;
