import { TableCell } from "@mui/material";
import { TableCellProps } from "@mui/material/TableCell";
import { AuthGuardPermissions } from "../core/AuthGuard";

export type GLTableCellProps = TableCellProps & {
  resource_key: string;
  fallBackText?: string;
};

const GLTableCell = ({
  resource_key,
  fallBackText,
  children,
  ...props
}: GLTableCellProps) => {
  return (
    <AuthGuardPermissions secureId={resource_key}>
      {({ t }) => (
        <TableCell {...props}>
          {children ?? ((t && t(resource_key)) || fallBackText)}
        </TableCell>
      )}
    </AuthGuardPermissions>
  );
};

export default GLTableCell;
