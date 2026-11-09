import GlCustomTable from "../tables/GlCustomTable";
import { GridColDef } from "@mui/x-data-grid";
import { useContext } from "react";
import { AuthGuardContext  ,AuthGuardPermissions } from "../core/AuthGuard";

import { GlCustomTableProps } from "../tables/GlCustomTable";


export type GLGridColDef = GridColDef & {
  permission: string;
  uiText?: string;
};
export type GLCustomTableSecureProps = GlCustomTableProps<any> & {
    // for the table itself 
  permission: string;
  columns: GLGridColDef[];
};


const GlCustomTableSecure = ({
  permission,
  ...props
}: GLCustomTableSecureProps) => {
  const ctx = useContext(AuthGuardContext);
  return (
    <AuthGuardPermissions secureId={permission}>
      {({t  }) => {

        return (
          <GlCustomTable
            {...props}
            columns={props.columns
              .filter((item: any) => ctx?.checkVisibility(item.permission))
              .map((item: any) => {
                return { ...item, headerName: t(item.uiText || item.permission ) || item.headerName };
              })}
          />
        );
      }}
    </AuthGuardPermissions>
  );
};

export default GlCustomTableSecure;
