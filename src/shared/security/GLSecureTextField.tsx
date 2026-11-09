import { AuthGuardPermissions } from "../core/AuthGuard";
import { GlTextField, GlTextFieldProps } from "../forms/StandAlone/GlTextField";
import { GlFormTextField, GlFormTextFieldProps } from "../forms/WithForm/GlFormTextField";

// ─── Standalone Secure ────────────────────────────────────────────────────────
// Wraps GlTextField with permission-based disabled / required enforcement.

export type GLSecureTextFieldProps = GlTextFieldProps & {
  resource_key: string;
};

export function GLSecureTextField({
  resource_key,
  disabled,
  required,
  ...props
}: GLSecureTextFieldProps) {
  return (
    <AuthGuardPermissions secureId={resource_key}>
      {({ disabled: guardDisabled, required: guardRequired }) => (
        <GlTextField
          {...props}
          disabled={guardDisabled || disabled}
          required={guardRequired || required}
        />
      )}
    </AuthGuardPermissions>
  );
}

// ─── Form (Formik) Secure ─────────────────────────────────────────────────────
// Wraps GlFormTextField — Formik integration + permission enforcement.

export type GLSecureFormTextFieldProps = GlFormTextFieldProps & {
  resource_key: string;
};

export function GLSecureFormTextField({
  resource_key,
  disabled,
  required,
  ...props
}: GLSecureFormTextFieldProps) {
  return (
    <AuthGuardPermissions secureId={resource_key}>
      {({ disabled: guardDisabled, required: guardRequired }) => (
        <GlFormTextField
          {...props}
          disabled={guardDisabled || disabled}
          required={guardRequired || required}
        />
      )}
    </AuthGuardPermissions>
  );
}
