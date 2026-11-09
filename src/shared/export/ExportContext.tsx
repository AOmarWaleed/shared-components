import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import type { ExportFilters, ExportSource, ExportTransport } from "./types";

interface ExportContextValue {
  transport: ExportTransport;
  activeSource: ExportSource | null;
  register: (source: ExportSource) => void;
  unregister: (pageKey: string) => void;
}

const ExportContext = createContext<ExportContextValue | null>(null);

export interface ExportProviderProps {
  /** App-specific transport implementation (set once per application). */
  transport: ExportTransport;
  children: ReactNode;
}

/**
 * App-level provider. Must sit ABOVE both the header (where the export control
 * lives) and the routed pages, so the header can read whichever page is
 * currently registered as the active export source.
 */
export const ExportProvider = ({ transport, children }: ExportProviderProps) => {
  const [activeSource, setActiveSource] = useState<ExportSource | null>(null);

  const register = useCallback((source: ExportSource) => {
    setActiveSource(source);
  }, []);

  const unregister = useCallback((pageKey: string) => {
    // Only clear if the leaving page is still the active one. Guards against
    // mount/unmount ordering during route transitions.
    setActiveSource((prev) => (prev?.pageKey === pageKey ? null : prev));
  }, []);

  const value = useMemo(
    () => ({ transport, activeSource, register, unregister }),
    [transport, activeSource, register, unregister]
  );

  return <ExportContext.Provider value={value}>{children}</ExportContext.Provider>;
};

/** Internal accessor used by the shared export component. */
export const useExportContext = (): ExportContextValue => {
  const ctx = useContext(ExportContext);
  if (!ctx) {
    throw new Error("useExportContext must be used within an <ExportProvider>");
  }
  return ctx;
};

/**
 * Derive the page key from the current browser URL path.
 * e.g. "http://host:3500/claim" -> "/claim" -> "claim"
 */
const derivePageKeyFromPath = (): string => {
  const segments = window.location.pathname.split("/").filter(Boolean);
  return segments[segments.length - 1] ?? "";
};

/**
 * Called by a page to declare itself as the current export source.
 *
 * The page only provides a `getParams` function returning a flat bag of its
 * live filter values (keys must match the SQL parameter names). The page key
 * is derived automatically from the current URL path (last segment), so pages
 * never pass their name. The latest `getParams` is always used, so values are
 * read at export time.
 */
export const useRegisterExport = (
  getParams: () => ExportFilters
): void => {
  const { register, unregister } = useExportContext();

  const getParamsRef = useRef(getParams);
  getParamsRef.current = getParams;

  const pageKey = derivePageKeyFromPath();

  useEffect(() => {
    register({ pageKey, getParams: () => getParamsRef.current() });
    return () => unregister(pageKey);
  }, [pageKey, register, unregister]);
};
