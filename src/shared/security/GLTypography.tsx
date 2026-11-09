import { Typography, TypographyProps } from "@mui/material";
import { ReactNode } from "react";
import { AuthGuardPermissions } from "../core/AuthGuard";

type GLTypographyProps = TypographyProps & {
  resource_key: string;
  fallBackText?: string;
  children?: ReactNode;
};

const GLTypography = ({
  resource_key,
  fallBackText,
  children,
  ...props
}: GLTypographyProps) => {
  return (
    <AuthGuardPermissions secureId={resource_key}>
      {({ t }) => (
        <Typography {...props}>
          {children ?? (t && t(resource_key)) ?? fallBackText}
        </Typography>
      )}
    </AuthGuardPermissions>
  );
};

export default GLTypography;
