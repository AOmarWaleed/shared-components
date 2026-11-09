import { createContext, useContext } from "react";
import type { AxiosInstance } from "axios";
import type { ReactNode } from "react";

const ApiContext = createContext<AxiosInstance | null>(null);
interface ApiProviderProps {
  api: AxiosInstance;
  children: ReactNode;
}
function useApi(): AxiosInstance | null {
  const api = useContext(ApiContext);
  return api;
}

function ApiProvider({ api, children }: ApiProviderProps) {
  return <ApiContext.Provider value={api}>{children}</ApiContext.Provider>;
}

export { ApiContext, ApiProvider, useApi };
