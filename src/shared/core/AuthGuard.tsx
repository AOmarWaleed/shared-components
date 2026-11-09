import {
  createContext,
  useContext,
  ReactNode,
  useState,
  useEffect,
} from "react";
import { useGetResources } from "../hooks/useGetResources";

export interface PermissionField {
  resource_id: string;
  show: boolean;
  disabled: boolean;
  required: boolean;
  resource_type: string;
  label_en: string | null;
  label_ar: string | null;
}

export interface PermissionsResponse {
  success: boolean;
  function_id: number;
  group_id: number;
  total_fields: number;
  visible_fields: number;
  resource_ids: string[];
  fields: Record<string, PermissionField>;
}

interface AuthGuardProps {
  children: ReactNode;
  functionID: string;
  api: any;
  userLang?: string;
}

interface AuthGuardPermissionsProps {
  children: (props: {
    t: (key: string) => string | undefined;
    visible: boolean;
    disabled: boolean;
    required: boolean;
  }) => ReactNode;
  secureId: string;
}

interface AuthGuardContextType {
  resourcesData: PermissionsResponse | Record<string, unknown> | null;
  userLang: string;
  t: (key: string) => string | undefined;
  formatString: (template: string, values: Record<string, any>) => string;
  checkVisibility: (key: string) => boolean;
  checkDisabled: (key: string) => boolean;
  checkRequired: (key: string) => boolean;
}

export const AuthGuardContext = createContext<AuthGuardContextType>({
  resourcesData: {},
  userLang: "en",
  t: (key) => key,
  formatString: (template, _) => template,
  checkVisibility: (_) => true,
  checkDisabled: (_) => false,
  checkRequired: (_) => false,
});

const AuthGuard = ({
  children,
  functionID,
  api,
  userLang = "en",
}: AuthGuardProps) => {
  // const userLang = localStorage.getItem("lang") as string;
  const { resourcesData: data } = useGetResources(userLang, functionID, api);
  const { resourcesData: genericData } = useGetResources(userLang, "0", api);

  // const resourcesData  : PermissionsResponse | Record<string, unknown> = data ?? {}; // Ensure resourcesData is never null
  const [resourcesData, setResourcesData] = useState(data ?? {}); // Ensure resourcesData is never null
  useEffect(() => {
    console.log("AuthGuard: resourcesData updated:", data);
    if (!data) return;
    setResourcesData({
      ...data,

      fields: {
        ...genericData?.fields,
        ...data?.fields,
      },
    });
  }, [data, genericData]);

  const t = (key: string): string | undefined => {
    if (!resourcesData) return key;

    const field = (resourcesData as PermissionsResponse)?.fields?.[key];
    if (!field) return undefined;

    return userLang === "ar"
      ? field.label_ar || undefined
      : field.label_en || undefined;
  };

  const formatString = (template: string, values: Record<string, any> = {}) => {
    return template.replace(/{(\w+)}/g, (_, key) => values[key] ?? "");
  };
  function checkVisibility(key: string) {
    return (resourcesData as PermissionsResponse)?.fields?.[key]?.show ?? true;
  }

  function checkDisabled(key: string) {
    return (
      (resourcesData as PermissionsResponse)?.fields?.[key]?.disabled ?? false
    );
  }

  function checkRequired(key: string) {
    return (
      (resourcesData as PermissionsResponse)?.fields?.[key]?.required ?? false
    );
  }
  const contextValue: AuthGuardContextType = {
    resourcesData: resourcesData,
    userLang: userLang,
    t,
    formatString,
    checkVisibility,
    checkDisabled,
    checkRequired,
  };

  return (
    <AuthGuardContext.Provider value={contextValue}>
      {children}
    </AuthGuardContext.Provider>
  );
};

export const AuthGuardPermissions = ({
  children,
  secureId,
}: AuthGuardPermissionsProps) => {
  const ctx = useContext(AuthGuardContext);

  if (!ctx) return null;

  const { checkDisabled, checkRequired, checkVisibility, t } = ctx;

  const visible = checkVisibility(secureId);
  const disabled = checkDisabled(secureId);
  const required = checkRequired(secureId);
  if (!visible) return null;

  return <>{children({ visible, disabled, required, t })}</>;
};

export default AuthGuard;
