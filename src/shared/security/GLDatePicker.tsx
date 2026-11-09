import { DatePicker, DatePickerProps } from "@mui/x-date-pickers";
import { AuthGuardPermissions } from "../core/AuthGuard";

export type GLDatePickerProps = DatePickerProps & {
  resource_key: string;
};

const GLDatePicker = ({
  resource_key,
  disabled: disabledLocal,
  ...props
}: GLDatePickerProps) => {
  return (
    <AuthGuardPermissions secureId={resource_key}>
      {({ disabled }) => {
        return (
          <DatePicker
            {...props}
            disabled={disabled || disabledLocal}
          />
        );
      }}
    </AuthGuardPermissions>
  );
};

export default GLDatePicker;