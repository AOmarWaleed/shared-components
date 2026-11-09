import Tooltip, { TooltipProps } from "@mui/material/Tooltip";

import { AuthGuardPermissions } from "../core/AuthGuard";

export type GLTooltipProps = Omit<TooltipProps, "title"> & {
  resource_key: string;
  title?: string;
};

const GLTooltip = ({
  resource_key,
  title,
  children,
  ...props
}: GLTooltipProps) => {
  return (
    <AuthGuardPermissions secureId={resource_key}>
      {({ t }) => (
        <Tooltip {...props} title={title ?? (t && t(resource_key))}>
          {children}
        </Tooltip>
      )}
    </AuthGuardPermissions>
  );
};

export default GLTooltip;
