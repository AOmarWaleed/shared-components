import { AuthGuardPermissions } from "../core/AuthGuard";
import { GlSelect, GlSelectProps } from "../forms/StandAlone/GlSelect";
import { GlFormSelect, GlFormSelectProps } from "../forms/WithForm/GlFormSelect";

// ─── Standalone Secure ────────────────────────────────────────────────────────

export type GLSecureSelectProps = GlSelectProps & {
  resource_key: string;
};

export function GLSecureSelect({
  resource_key,
  disabled,
  required,
  ...props
}: GLSecureSelectProps) {
  return (
    <AuthGuardPermissions secureId={resource_key}>
      {({ disabled: guardDisabled, required: guardRequired }) => (
        <GlSelect
          {...props}
          disabled={guardDisabled || disabled}
          required={guardRequired || required}
        />
      )}
    </AuthGuardPermissions>
  );
}

// ─── Form (Formik) Secure ─────────────────────────────────────────────────────

export type GLSecureFormSelectProps = GlFormSelectProps & {
  resource_key: string;
};

export function GLSecureFormSelect({
  resource_key,
  disabled,
  required,
  ...props
}: GLSecureFormSelectProps) {
  return (
    <AuthGuardPermissions secureId={resource_key}>
      {({ disabled: guardDisabled, required: guardRequired }) => (
        <GlFormSelect
          {...props}
          disabled={guardDisabled || disabled}
          required={guardRequired || required}
        />
      )}
    </AuthGuardPermissions>
  );
}
