import { AuthGuardPermissions } from "../core/AuthGuard";
import { GlDatePicker, GlDatePickerProps } from "../forms/StandAlone/GlDatePicker";
import { GlFormDatePicker, GlFormDatePickerProps } from "../forms/WithForm/GlFormDatePicker";

// ─── Standalone Secure ────────────────────────────────────────────────────────

export type GLSecureDatePickerProps = GlDatePickerProps & {
  resource_key: string;
};

export function GLSecureDatePicker({
  resource_key,
  disabled,
  ...props
}: GLSecureDatePickerProps) {
  return (
    <AuthGuardPermissions secureId={resource_key}>
      {({ disabled: guardDisabled }) => (
        <GlDatePicker
          {...props}
          disabled={guardDisabled || disabled}
        />
      )}
    </AuthGuardPermissions>
  );
}

// ─── Form (Formik) Secure ─────────────────────────────────────────────────────

export type GLSecureFormDatePickerProps = GlFormDatePickerProps & {
  resource_key: string;
};

export function GLSecureFormDatePicker({
  resource_key,
  disabled,
  ...props
}: GLSecureFormDatePickerProps) {
  return (
    <AuthGuardPermissions secureId={resource_key}>
      {({ disabled: guardDisabled }) => (
        <GlFormDatePicker
          {...props}
          disabled={guardDisabled || disabled}
        />
      )}
    </AuthGuardPermissions>
  );
}
