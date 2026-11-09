import { Typography } from "@mui/material";
import type { TypographyProps } from "@mui/material/Typography";
import { AuthGuardPermissions } from "../core/AuthGuard";
import { useContext } from "react";
import { AuthGuardContext } from "../core/AuthGuard";

export type GLTypographyProps = TypographyProps & {
  permission: string;
  uiText?: string;
  fallBackText: string;
  disabled?: boolean;
};

const GLTypography = ({ 
  permission,
  uiText,
  fallBackText,
  disabled: disabledLocal,
  children,
  ...props 
}: GLTypographyProps) => {
  const ctx = useContext(AuthGuardContext);
  const isDisabled = disabledLocal || ctx?.checkDisabled(permission);

  return (
    <AuthGuardPermissions secureId={permission}>
      {({ t }) => {
        const text = children ?? (t(uiText || permission) || fallBackText);
        
        return (
          <Typography 
            {...props}
            sx={{
              ...(isDisabled ? { 
                opacity: 0.5,
                cursor: "not-allowed",
                pointerEvents: "none",
                userSelect: "none"
              } : {}),
              ...props.sx
            }}
          >
            {text}
          </Typography>
        );
      }}
    </AuthGuardPermissions>
  );
};

export default GLTypography;