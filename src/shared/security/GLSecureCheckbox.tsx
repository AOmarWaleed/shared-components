import { AuthGuardPermissions } from "../core/AuthGuard";
import { GlCheckbox, GlCheckboxProps } from "../forms/StandAlone/GlCheckbox";
import { GlFormCheckbox, GlFormCheckboxProps } from "../forms/WithForm/GlFormCheckbox";

// ─── Standalone Secure ────────────────────────────────────────────────────────

export type GLSecureCheckboxProps = GlCheckboxProps & {
  resource_key: string;
};

export function GLSecureCheckbox({
  resource_key,
  disabled,
  ...props
}: GLSecureCheckboxProps) {
  return (
    <AuthGuardPermissions secureId={resource_key}>
      {({ disabled: guardDisabled }) => (
        <GlCheckbox
          {...props}
          disabled={guardDisabled || disabled}
        />
      )}
    </AuthGuardPermissions>
  );
}

// ─── Form (Formik) Secure ─────────────────────────────────────────────────────

export type GLSecureFormCheckboxProps = GlFormCheckboxProps & {
  resource_key: string;
};

export function GLSecureFormCheckbox({
  resource_key,
  disabled,
  ...props
}: GLSecureFormCheckboxProps) {
  return (
    <AuthGuardPermissions secureId={resource_key}>
      {({ disabled: guardDisabled }) => (
        <GlFormCheckbox
          {...props}
          disabled={guardDisabled || disabled}
        />
      )}
    </AuthGuardPermissions>
  );
}
