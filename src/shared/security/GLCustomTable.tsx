import GlCustomTable from "../tables/GlCustomTable";
import { GridColDef } from "@mui/x-data-grid";
import { useContext } from "react";
import { AuthGuardContext  ,AuthGuardPermissions } from "../core/AuthGuard";

import { GlCustomTableProps } from "../tables/GlCustomTable";
export type GLCustomTableSecureProps = GlCustomTableProps<any> & {
  resource_key: string;
};

export type GLGridColDef = GridColDef & {
  resource_key: string;
};

const GlCustomTableSecure = ({
  resource_key,
  ...props
}: GLCustomTableSecureProps) => {
  const ctx = useContext(AuthGuardContext);
  return (
    <AuthGuardPermissions secureId={resource_key}>
      {({}) => {
        return (
          <GlCustomTable
            {...props}
            columns={props.columns
              .filter((item: any) => ctx?.checkVisibility(item.resource_key))
              .map((item: any) => {
                const translated = ctx?.t(item.resource_key);
                const fallback = item.headerName || item.field || translated || item.resource_key;
                const headerName = translated && translated !== item.resource_key ? translated : fallback;
                return { ...item, headerName };
              })}
          />
        );
      }}
    </AuthGuardPermissions>
  );
};

export default GlCustomTableSecure;
