import { AuthGuardPermissions } from "../core/AuthGuard";
import { Tab } from "@mui/material";
import type { TabProps } from "@mui/material/Tab";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import type { TabPanelProps } from "@mui/lab/TabPanel";
import type { TabListProps } from "@mui/lab/TabList";
import { useContext } from "react";
import { AuthGuardContext } from "../core/AuthGuard";

// ==================== GLTab ====================
export type GLTabProps = TabProps & {
  permission: string;
  uiText?: string;
  fallBackText: string;
  disabled?: boolean; 
};

const GLTab = ({ 
  permission,
  uiText,
  fallBackText,
  disabled: disabledLocal,

  label,
  ...props 
}: GLTabProps) => {
  const ctx = useContext(AuthGuardContext);
  return (
    <AuthGuardPermissions secureId={permission}>
      {({ t }) => (
        <Tab 
          {...props} 
          label={t(uiText || permission) || fallBackText || label}
          disabled={disabledLocal || ctx?.checkDisabled(permission)}
        />
      )}
    </AuthGuardPermissions>
  );
};

// ==================== GLTabList ====================
export type GLTabListProps = TabListProps & {
  permission?: string;  // Optional permission for the tab list itself
};

const GLTabList = ({ 
  permission,
  children,
  ...props 
}: GLTabListProps) => {
  // If permission is provided, check it
  if (permission) {
    return (
      <AuthGuardPermissions secureId={permission}>
        {({ }) => (
          <TabList {...props}>
            {children}
          </TabList>
        )}
      </AuthGuardPermissions>
    );
  }
  
  return <TabList {...props}>{children}</TabList>;
};

// ==================== GLTabPanel ====================
export type GLTabPanelProps = TabPanelProps & {
  permission: string;
};

const GLTabPanel = ({ 
  permission,
  children,
  ...props 
}: GLTabPanelProps) => {
  return (
    <AuthGuardPermissions secureId={permission}>
      {({ }) => (
        <TabPanel {...props}>
          {children}
        </TabPanel>
      )}
    </AuthGuardPermissions>
  );
};

// ==================== GLTabContext ====================
export type GLTabContextProps = {
  value: string;
  children: React.ReactNode;
  permission: string;  //  permission for the tab context itself
};

const GLTabContext = ({ value, children, permission }: GLTabContextProps) => {
  return (
    <AuthGuardPermissions secureId={permission}>
      {({ }) => (
        <TabContext value={value}>
          {children}
        </TabContext>
      )}
    </AuthGuardPermissions>
  );
};

const GLLab = {
  Tab: GLTab,
  TabList: GLTabList,
  TabPanel: GLTabPanel,
  TabContext: GLTabContext,
};

export default GLLab;