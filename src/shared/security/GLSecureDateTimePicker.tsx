import { AuthGuardPermissions } from "../core/AuthGuard";
import { GlDateTimePicker, GlDateTimePickerProps } from "../forms/StandAlone/GlDateTimePicker";
import {
  GLFormDateTimePicker,
  GLFormDateTimePickerProps,
} from "../forms/WithForm/GLFormDateTimePicker";

// ─── Standalone Secure ────────────────────────────────────────────────────────

export type GLSecureDateTimePickerProps = GlDateTimePickerProps & {
  resource_key: string;
};

export function GLSecureDateTimePicker({
  resource_key,
  disabled,
  ...props
}: GLSecureDateTimePickerProps) {
  return (
    <AuthGuardPermissions secureId={resource_key}>
      {({ disabled: guardDisabled }) => (
        <GlDateTimePicker
          {...props}
          disabled={guardDisabled || disabled}
        />
      )}
    </AuthGuardPermissions>
  );
}

// ─── Form (Formik) Secure ─────────────────────────────────────────────────────

export type GLSecureFormDateTimePickerProps = GLFormDateTimePickerProps & {
  resource_key: string;
};

export function GLSecureFormDateTimePicker({
  resource_key,
  disabled,
  ...props
}: GLSecureFormDateTimePickerProps) {
  return (
    <AuthGuardPermissions secureId={resource_key}>
      {({ disabled: guardDisabled }) => (
        <GLFormDateTimePicker
          {...props}
          disabled={guardDisabled || disabled}
        />
      )}
    </AuthGuardPermissions>
  );
}
