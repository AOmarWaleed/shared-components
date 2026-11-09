// components/SecureInputs.tsx
import { AuthGuardPermissions } from "../core/AuthGuard";
import { useContext } from "react";
import { AuthGuardContext } from "../core/AuthGuard";
import { GlTextField, GlTextFieldProps } from "../forms/StandAlone/GlTextField";
import {
  Checkbox,
  FormControlLabel,
  FormControl,
  FormLabel,
  RadioGroup,
  Radio,
  Select,
  MenuItem,
  FormHelperText,
  Autocomplete,
  TextField,
} from "@mui/material";
import type { CheckboxProps } from "@mui/material/Checkbox";
import type { RadioGroupProps } from "@mui/material/RadioGroup";
import type { SelectProps } from "@mui/material/Select";
import type { AutocompleteProps } from "@mui/material/Autocomplete";

// ==================== Types ====================
type SecureInputProps = {
  permission: string;
  uiText?: string;
  label?: string;
  hideIfNoPermission?: boolean;
  disabled?: boolean;
  required?: boolean;
};

export type OptionType = {
  value: string | number;
  label: string;
};

// ==================== Base Component ====================
export type GLSecureTextFieldProps = GlTextFieldProps & SecureInputProps;

export function GLSecureTextField({
  permission,
  uiText,
  label,
  disabled: disabledLocal,
  required: requiredLocal,
  hideIfNoPermission = false,
  ...props
}: GLSecureTextFieldProps) {
  const ctx = useContext(AuthGuardContext);
  const hasPermission = ctx?.checkVisibility(permission);

  // disabled = localDisabled OR checkDisabled OR false
  const isDisabled = disabledLocal || ctx?.checkDisabled(permission) || false;
  const isRequired = requiredLocal || ctx?.checkRequired(permission) || false;
  if (hideIfNoPermission && !hasPermission) {
    return null;
  }

  return (
    <AuthGuardPermissions secureId={permission}>
      {({ t }) => (
        <GlTextField
          {...props}
          label={t(uiText || permission) || label}
          disabled={isDisabled}
          required={isRequired}
        />
      )}
    </AuthGuardPermissions>
  );
}

// ==================== Checkbox ====================
export type GLSecureCheckboxProps = CheckboxProps & SecureInputProps;

export function GLSecureCheckbox({
  permission,
  uiText,
  label,
  disabled: disabledLocal,
  hideIfNoPermission = false,
  ...props
}: GLSecureCheckboxProps) {
  const ctx = useContext(AuthGuardContext);
  const hasPermission = ctx?.checkVisibility(permission);

  const isDisabled = disabledLocal ?? ctx?.checkDisabled(permission) ?? false;

  if (hideIfNoPermission && !hasPermission) {
    return null;
  }

  return (
    <AuthGuardPermissions secureId={permission}>
      {({ t }) => (
        <FormControlLabel
          control={<Checkbox {...props} disabled={isDisabled} />}
          label={t(uiText || permission) || label}
        />
      )}
    </AuthGuardPermissions>
  );
}

// ==================== RadioGroup ====================
export type GLSecureRadioGroupProps = Omit<RadioGroupProps, "disabled"> &
  SecureInputProps & {
    options: OptionType[];
  };

export function GLSecureRadioGroup({
  permission,
  uiText,
  label,
  disabled: disabledLocal,
  hideIfNoPermission = false,
  options,
  ...props
}: GLSecureRadioGroupProps) {
  const ctx = useContext(AuthGuardContext);
  const hasPermission = ctx?.checkVisibility(permission);

  const isDisabled = disabledLocal ?? ctx?.checkDisabled(permission) ?? false;

  if (hideIfNoPermission && !hasPermission) {
    return null;
  }

  return (
    <AuthGuardPermissions secureId={permission}>
      {({ t }) => (
        <FormControl disabled={isDisabled}>
          <FormLabel>{t(uiText || permission) || label}</FormLabel>
          <RadioGroup {...props}>
            {options.map((option) => (
              <FormControlLabel
                key={option.value}
                value={option.value}
                control={<Radio />}
                label={option.label}
              />
            ))}
          </RadioGroup>
        </FormControl>
      )}
    </AuthGuardPermissions>
  );
}

// ==================== Select ====================
export type GLSecureSelectProps = Omit<SelectProps, "disabled"> &
  SecureInputProps & {
    options: OptionType[];
    error?: boolean;
    errorMessage?: string;
    helperText?: string;
  };

export function GLSecureSelect({
  permission,
  uiText,
  label,
  disabled: disabledLocal,
  hideIfNoPermission = false,
  options,
  error,
  errorMessage,
  helperText,
  children,
  ...props
}: GLSecureSelectProps) {
  const ctx = useContext(AuthGuardContext);
  const hasPermission = ctx?.checkVisibility(permission);

  const isDisabled = disabledLocal ?? ctx?.checkDisabled(permission) ?? false;

  if (hideIfNoPermission && !hasPermission) {
    return null;
  }

  return (
    <AuthGuardPermissions secureId={permission}>
      {({ t }) => (
        <FormControl fullWidth disabled={isDisabled} error={error}>
          <FormLabel>{t(uiText || permission) || label}</FormLabel>
          <Select {...props}>
            {options.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
            {children}
          </Select>
          {(errorMessage || helperText) && (
            <FormHelperText>{errorMessage || helperText}</FormHelperText>
          )}
        </FormControl>
      )}
    </AuthGuardPermissions>
  );
}

// ==================== Autocomplete ====================
export type GLSecureAutocompleteProps = Omit<
  AutocompleteProps<any, boolean, boolean, boolean>,
  "renderInput" | "disabled"
> &
  SecureInputProps & {
    options: OptionType[];
    error?: boolean;
    errorMessage?: string;
    helperText?: string;
  };

export function GLSecureAutocomplete({
  permission,
  uiText,
  label,
  disabled: disabledLocal,
  hideIfNoPermission = false,
  options,
  error,
  errorMessage,
  helperText,
  ...props
}: GLSecureAutocompleteProps) {
  const ctx = useContext(AuthGuardContext);
  const hasPermission = ctx?.checkVisibility(permission);

  const isDisabled = disabledLocal ?? ctx?.checkDisabled(permission) ?? false;

  if (hideIfNoPermission && !hasPermission) {
    return null;
  }

  return (
    <AuthGuardPermissions secureId={permission}>
      {({ t }) => (
        <Autocomplete
          {...props}
          options={options}
          disabled={isDisabled}
          renderInput={(params) => (
            <TextField
              {...params}
              label={t(uiText || permission) || label}
              error={error}
              helperText={errorMessage || helperText}
            />
          )}
        />
      )}
    </AuthGuardPermissions>
  );
}

// ==================== Export ====================
const SecureInputs = {
  TextField: GLSecureTextField,
  Checkbox: GLSecureCheckbox,
  RadioGroup: GLSecureRadioGroup,
  Select: GLSecureSelect,
  Autocomplete: GLSecureAutocomplete,
};

export default SecureInputs;
