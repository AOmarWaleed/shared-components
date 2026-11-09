/**
 * Public contract for the Generic Export system.
 *
 * The shared export component knows nothing about any concrete page. It only
 * depends on these abstractions, which every consuming application implements.
 */

/** A single export definition as advertised by the backend for a page. */
export interface ExportDefinition {
  code: string;
  description: string;
  cat?: string | null;
  /** Ordered list of parameter names the underlying SQL expects. */
  required_params?: string[];
}

/**
 * A flat bag of filter values. Keys MUST match the parameter names used by the
 * export's SQL (e.g. `payer_id`, `from_date`). The page is the only place that
 * knows how to produce this bag from its own internal filter state.
 */
export type ExportFilters = Record<string, unknown>;

/**
 * Transport abstraction (Dependency Inversion). Each application implements
 * this once, wrapping its own configured HTTP client. The shared component
 * never imports axios or any app-specific networking.
 */
export interface ExportTransport {
  /** Fetch the export definitions available for a page. */
  fetchExports(pageKey: string): Promise<ExportDefinition[]>;
  /** Execute an export by code and return the resulting rows. */
  runExport(code: string, filters: ExportFilters): Promise<any[]>;
}

/**
 * The contract a page registers so the header-level export component can
 * collect that page's live filter values without ever coupling to the page.
 */
export interface ExportSource {
  pageKey: string;
  getParams: () => ExportFilters;
}
