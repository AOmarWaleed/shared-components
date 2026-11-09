import { AuthGuardPermissions } from "../core/AuthGuard";
import { GlRadioGroup, GlRadioGroupProps } from "../forms/StandAlone/GlRadioGroup";
import { GlFormRadioGroup, GlFormRadioGroupProps } from "../forms/WithForm/GlFormRadioGroup";

// ─── Standalone Secure ────────────────────────────────────────────────────────

export type GLSecureRadioGroupProps = GlRadioGroupProps & {
  resource_key: string;
};

export function GLSecureRadioGroup({
  resource_key,
  ...props
}: GLSecureRadioGroupProps) {
  return (
    <AuthGuardPermissions secureId={resource_key}>
      {({ disabled: guardDisabled }) => (
        <GlRadioGroup
          {...props}
          // RadioGroup doesn't have a top-level disabled prop; pass it down via sx or wrap
          // For individual Radio items, we rely on the fieldset being aria-disabled
          {...(guardDisabled ? { "aria-disabled": true, sx: { pointerEvents: "none", opacity: 0.5 } } : {})}
        />
      )}
    </AuthGuardPermissions>
  );
}

// ─── Form (Formik) Secure ─────────────────────────────────────────────────────

export type GLSecureFormRadioGroupProps = GlFormRadioGroupProps & {
  resource_key: string;
};

export function GLSecureFormRadioGroup({
  resource_key,
  ...props
}: GLSecureFormRadioGroupProps) {
  return (
    <AuthGuardPermissions secureId={resource_key}>
      {({ disabled: guardDisabled }) => (
        <GlFormRadioGroup
          {...props}
          {...(guardDisabled ? { "aria-disabled": true, sx: { pointerEvents: "none", opacity: 0.5 } } : {})}
        />
      )}
    </AuthGuardPermissions>
  );
}
