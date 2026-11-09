import { useEffect, useState } from "react";

interface PermissionField {
  resource_id: string;
  show: boolean;
  disabled: boolean;
  required: boolean;
  resource_type: string;
  label_en: string;
  label_ar: string;
}

interface PermissionsResponse {
  success: boolean;
  function_id: number;
  group_id: number;
  total_fields: number;
  visible_fields: number;
  resource_ids: string[];
  fields: Record<string, PermissionField>;
}

export function useGetResources(lng: string, ns: string , api: any) {
  const [resourcesData, setResourcesData] =
    useState<PermissionsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchResources = async () => {
      try {
        const url = `api/auth/get-field-permissions?function_id=${ns}`;
        const res = await api.get(url);

        const data = res.data;
        setResourcesData(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchResources();
  }, [lng, ns]);

  // =========================
  // =========================

  return { resourcesData, loading, error };
}
