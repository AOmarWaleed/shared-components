import { AuthGuardPermissions } from "../core/AuthGuard";
import GlAutoComplete, { GlAutoCompleteProps } from "../forms/StandAlone/GlAutoComplete";
import { GlFormAutoComplete, GlFormAutoCompleteProps } from "../forms/WithForm/GlFormAutoComplete";

// ─── Standalone Secure ────────────────────────────────────────────────────────

export type GLSecureAutoCompleteProps<T extends Record<string, any>> =
  GlAutoCompleteProps<T> & {
    resource_key: string;
  };

export function GLSecureAutoComplete<T extends Record<string, any>>({
  resource_key,
  disabled,
  ...props
}: GLSecureAutoCompleteProps<T>) {
  return (
    <AuthGuardPermissions secureId={resource_key}>
      {({ disabled: guardDisabled }) => (
        <GlAutoComplete<T>
          {...props}
          disabled={guardDisabled || disabled}
        />
      )}
    </AuthGuardPermissions>
  );
}

// ─── Form (Formik) Secure ─────────────────────────────────────────────────────

export type GLSecureFormAutoCompleteProps = GlFormAutoCompleteProps & {
  resource_key: string;
};

export function GLSecureFormAutoComplete({
  resource_key,
  disabled,
  ...props
}: GLSecureFormAutoCompleteProps) {
  return (
    <AuthGuardPermissions secureId={resource_key}>
      {({ disabled: guardDisabled }) => (
        <GlFormAutoComplete
          {...props}
          disabled={guardDisabled || disabled}
        />
      )}
    </AuthGuardPermissions>
  );
}
