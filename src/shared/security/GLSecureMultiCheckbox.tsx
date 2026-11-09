import { AuthGuardPermissions } from "../core/AuthGuard";
import { GlMultiCheckbox, GlMultiCheckboxProps } from "../forms/StandAlone/GlMultiCheckbox";
import { GlFormMultiCheckbox, GlFormMultiCheckboxProps } from "../forms/WithForm/GlFormMultiCheckbox";

// ─── Standalone Secure ────────────────────────────────────────────────────────

export type GLSecureMultiCheckboxProps = GlMultiCheckboxProps & {
  resource_key: string;
};

export function GLSecureMultiCheckbox({
  resource_key,
  ...props
}: GLSecureMultiCheckboxProps) {
  return (
    <AuthGuardPermissions secureId={resource_key}>
      {({ disabled: guardDisabled }) => (
        <GlMultiCheckbox
          {...props}
          checkboxProps={{
            ...props.checkboxProps,
            disabled: guardDisabled || props.checkboxProps?.disabled,
          }}
        />
      )}
    </AuthGuardPermissions>
  );
}

// ─── Form (Formik) Secure ─────────────────────────────────────────────────────

export type GLSecureFormMultiCheckboxProps = GlFormMultiCheckboxProps & {
  resource_key: string;
};

export function GLSecureFormMultiCheckbox({
  resource_key,
  ...props
}: GLSecureFormMultiCheckboxProps) {
  return (
    <AuthGuardPermissions secureId={resource_key}>
      {({ disabled: guardDisabled }) => (
        <GlFormMultiCheckbox
          {...props}
          checkboxProps={{
            ...props.checkboxProps,
            disabled: guardDisabled || props.checkboxProps?.disabled,
          }}
        />
      )}
    </AuthGuardPermissions>
  );
}
