import { TabPanel } from "@mui/lab";
import type { TabPanelProps } from "@mui/lab/TabPanel";
import { AuthGuardPermissions } from "../core/AuthGuard";

export type GLTabProps = TabPanelProps & {
  resource_key: string;
};

const GLTabPanel = ({ resource_key, children, ...props }: GLTabProps) => {
  return (
    <AuthGuardPermissions secureId={resource_key}>
      {() => <TabPanel {...props}>{children}</TabPanel>}
    </AuthGuardPermissions>
  );
};

export default GLTabPanel;
