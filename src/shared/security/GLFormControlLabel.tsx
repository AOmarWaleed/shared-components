import {
  FormControlLabel,
  FormControlLabelProps,
} from "@mui/material";
import { AuthGuardPermissions } from "../core/AuthGuard";
import {
  cloneElement,
  isValidElement,
  ReactElement,
} from "react";

type GLFormControlLabelProps = FormControlLabelProps & {
  resource_key: string;
  name: string;
};

const GLFormControlLabel = ({
  resource_key,
  control,
  name,
  label,
  ...props
}: GLFormControlLabelProps) => {
  return (
    <AuthGuardPermissions secureId={resource_key}>
      {({ disabled, t }) => {
        const clonedElement = isValidElement(control)
          ? cloneElement(
              control as ReactElement<{
                disabled?: boolean;
              }>,
              {
                disabled,
              }
            )
          : control;

        return (
          <FormControlLabel
            {...props}
            name={name}
            control={clonedElement}
            label={t ? t(resource_key) : label}
          />
        );
      }}
    </AuthGuardPermissions>
  );
};

export default GLFormControlLabel;