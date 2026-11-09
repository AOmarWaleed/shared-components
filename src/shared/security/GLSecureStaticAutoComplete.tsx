import { AuthGuardPermissions } from "../core/AuthGuard";
import GlStaticAutoComplete, {
  GlStaticAutoCompleteProps,
  OptionType,
} from "../forms/StandAlone/GlStaticAutoComplete";
import {
  GlFormStaticAutoComplete,
  GlFormStaticAutoCompleteProps,
} from "../forms/WithForm/GlFormStaticAutoComplete";

// ─── Standalone Secure ────────────────────────────────────────────────────────

export type GLSecureStaticAutoCompleteProps<T extends Record<string, any>> =
  GlStaticAutoCompleteProps<T> & {
    resource_key: string;
  };

export function GLSecureStaticAutoComplete<T extends Record<string, any>>({
  resource_key,
  disabled,
  ...props
}: GLSecureStaticAutoCompleteProps<T>) {
  return (
    <AuthGuardPermissions secureId={resource_key}>
      {({ disabled: guardDisabled }) => (
        <GlStaticAutoComplete<T>
          {...props}
          disabled={guardDisabled || disabled}
        />
      )}
    </AuthGuardPermissions>
  );
}

// ─── Form (Formik) Secure ─────────────────────────────────────────────────────

export type GLSecureFormStaticAutoCompleteProps<T extends Record<string, any>> =
  GlFormStaticAutoCompleteProps<T> & {
    resource_key: string;
    onChange?: (newValue: OptionType | null) => void;
  };

export function GLSecureFormStaticAutoComplete<T extends Record<string, any>>({
  resource_key,
  disabled,
  ...props
}: GLSecureFormStaticAutoCompleteProps<T>) {
  return (
    <AuthGuardPermissions secureId={resource_key}>
      {({ disabled: guardDisabled }) => (
        <GlFormStaticAutoComplete<T>
          {...props}
          disabled={guardDisabled || disabled}
        />
      )}
    </AuthGuardPermissions>
  );
}
