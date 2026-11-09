import { AuthGuardPermissions } from "../core/AuthGuard";
import {
  GlMobileDateTimePicker,
  GlMobileDateTimePickerProps,
} from "../forms/StandAlone/GlMobileDateTimePicker";
import {
  GlFormMobileDateTimePicker,
  GlFormMobileDateTimePickerProps,
} from "../forms/WithForm/GlFormMobileDateTimePicker";

// ─── Standalone Secure ────────────────────────────────────────────────────────

export type GLSecureMobileDateTimePickerProps = GlMobileDateTimePickerProps & {
  resource_key: string;
};

export function GLSecureMobileDateTimePicker({
  resource_key,
  disabled,
  ...props
}: GLSecureMobileDateTimePickerProps) {
  return (
    <AuthGuardPermissions secureId={resource_key}>
      {({ disabled: guardDisabled }) => (
        <GlMobileDateTimePicker
          {...props}
          disabled={guardDisabled || disabled}
        />
      )}
    </AuthGuardPermissions>
  );
}

// ─── Form (Formik) Secure ─────────────────────────────────────────────────────

export type GLSecureFormMobileDateTimePickerProps = GlFormMobileDateTimePickerProps & {
  resource_key: string;
};

export function GLSecureFormMobileDateTimePicker({
  resource_key,
  disabled,
  ...props
}: GLSecureFormMobileDateTimePickerProps) {
  return (
    <AuthGuardPermissions secureId={resource_key}>
      {({ disabled: guardDisabled }) => (
        <GlFormMobileDateTimePicker
          {...props}
          disabled={guardDisabled || disabled}
        />
      )}
    </AuthGuardPermissions>
  );
}
