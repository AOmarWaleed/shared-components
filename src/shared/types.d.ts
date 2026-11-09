interface GlListResponse<T> {
  data: T[];
  total: number;
}

interface UseGlListParams {
  url: string;
  initParams?: Record<string, any>;
  options?: any;
   customFetch ?: any
}

interface UseGlListReturn<T> {
  glList: GlListResponse<T> | undefined;
  isLoading: boolean;
  isError: any;
  mutateGlList: () => void;
  isValidatingGlList: boolean;
  handleParamsChange: (newParams: Record<string, any>) => void;
 
}


declare module 'xlsx' {


  export const write: (workbook: WorkBook, options: { bookType: string; type: string }) => ArrayBuffer;
  export interface WorkBook {
    SheetNames: string[];
    Sheets: {
      [sheet: string]: WorkSheet;
    };
  }
  
  export interface WorkSheet {
    [cell: string]: any;
  }
  
  export function read(data: any, options: any): WorkBook;
  export const utils : typeof import('xlsx').utils &{
    sheet_to_json(worksheet: WorkSheet): any[];
  };
}