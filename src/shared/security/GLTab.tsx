import { Tab } from "@mui/material";
import { TabProps } from "@mui/material";
import { AuthGuardPermissions } from "../core/AuthGuard";

export type GLTabProps = TabProps & {
  resource_key: string;
};

const GLTab = ({ resource_key, ...props }: GLTabProps) => {
  return (
    <AuthGuardPermissions secureId={resource_key}>
      {() => <Tab {...props} />}
    </AuthGuardPermissions>
  );
};

export default GLTab;
