/**
 * secure.form.index.tsx
 *
 * Central export for all permission-aware form components.
 *
 * Every component comes in two flavours:
 *   • GLSecure[Name]      — standalone (you manage state)
 *   • GLSecureForm[Name]  — Formik-integrated (reads value / error from Formik context)
 *
 * Both variants accept a `resource_key` prop that is looked up via AuthGuardPermissions
 * to automatically apply `disabled` and `required` rules from the back-end permissions API.
 *
 * Usage example:
 *   import SecureForms from '@shared/security/secure.form.index';
 *
 *   // Standalone
 *   <SecureForms.GLSecureTextField resource_key="FIELD_USERNAME" name="username" label="Username" />
 *
 *   // Inside <Formik>
 *   <SecureForms.GLSecureFormTextField resource_key="FIELD_USERNAME" name="username" label="Username" />
 */

// ─── TextField ────────────────────────────────────────────────────────────────
export {
  GLSecureTextField,
  GLSecureFormTextField,
} from "./GLSecureTextField";
export type {
  GLSecureTextFieldProps,
  GLSecureFormTextFieldProps,
} from "./GLSecureTextField";

// ─── Select ───────────────────────────────────────────────────────────────────
export {
  GLSecureSelect,
  GLSecureFormSelect,
} from "./GLSecureSelect";
export type {
  GLSecureSelectProps,
  GLSecureFormSelectProps,
} from "./GLSecureSelect";

// ─── AutoComplete (server-side / paginated) ───────────────────────────────────
export {
  GLSecureAutoComplete,
  GLSecureFormAutoComplete,
} from "./GLSecureAutoComplete";
export type {
  GLSecureAutoCompleteProps,
  GLSecureFormAutoCompleteProps,
} from "./GLSecureAutoComplete";

// ─── StaticAutoComplete (client-side options) ─────────────────────────────────
export {
  GLSecureStaticAutoComplete,
  GLSecureFormStaticAutoComplete,
} from "./GLSecureStaticAutoComplete";
export type {
  GLSecureStaticAutoCompleteProps,
  GLSecureFormStaticAutoCompleteProps,
} from "./GLSecureStaticAutoComplete";

// ─── Checkbox ─────────────────────────────────────────────────────────────────
export {
  GLSecureCheckbox,
  GLSecureFormCheckbox,
} from "./GLSecureCheckbox";
export type {
  GLSecureCheckboxProps,
  GLSecureFormCheckboxProps,
} from "./GLSecureCheckbox";

// ─── MultiCheckbox ────────────────────────────────────────────────────────────
export {
  GLSecureMultiCheckbox,
  GLSecureFormMultiCheckbox,
} from "./GLSecureMultiCheckbox";
export type {
  GLSecureMultiCheckboxProps,
  GLSecureFormMultiCheckboxProps,
} from "./GLSecureMultiCheckbox";

// ─── RadioGroup ───────────────────────────────────────────────────────────────
export {
  GLSecureRadioGroup,
  GLSecureFormRadioGroup,
} from "./GLSecureRadioGroup";
export type {
  GLSecureRadioGroupProps,
  GLSecureFormRadioGroupProps,
} from "./GLSecureRadioGroup";

// ─── DatePicker ───────────────────────────────────────────────────────────────
export {
  GLSecureDatePicker,
  GLSecureFormDatePicker,
} from "./GLSecureDatePicker";
export type {
  GLSecureDatePickerProps,
  GLSecureFormDatePickerProps,
} from "./GLSecureDatePicker";

// ─── DateTimePicker ───────────────────────────────────────────────────────────
export {
  GLSecureDateTimePicker,
  GLSecureFormDateTimePicker,
} from "./GLSecureDateTimePicker";
export type {
  GLSecureDateTimePickerProps,
  GLSecureFormDateTimePickerProps,
} from "./GLSecureDateTimePicker";

// ─── MobileDateTimePicker ─────────────────────────────────────────────────────
export {
  GLSecureMobileDateTimePicker,
  GLSecureFormMobileDateTimePicker,
} from "./GLSecureMobileDateTimePicker";
export type {
  GLSecureMobileDateTimePickerProps,
  GLSecureFormMobileDateTimePickerProps,
} from "./GLSecureMobileDateTimePicker";

// ─── Convenience namespace object ─────────────────────────────────────────────
// Mirrors the pattern used in security/index.tsx (Secure.*)

import {
  GLSecureTextField,
  GLSecureFormTextField,
} from "./GLSecureTextField";
import {
  GLSecureSelect,
  GLSecureFormSelect,
} from "./GLSecureSelect";
import {
  GLSecureAutoComplete,
  GLSecureFormAutoComplete,
} from "./GLSecureAutoComplete";
import {
  GLSecureStaticAutoComplete,
  GLSecureFormStaticAutoComplete,
} from "./GLSecureStaticAutoComplete";
import {
  GLSecureCheckbox,
  GLSecureFormCheckbox,
} from "./GLSecureCheckbox";
import {
  GLSecureMultiCheckbox,
  GLSecureFormMultiCheckbox,
} from "./GLSecureMultiCheckbox";
import {
  GLSecureRadioGroup,
  GLSecureFormRadioGroup,
} from "./GLSecureRadioGroup";
import {
  GLSecureDatePicker,
  GLSecureFormDatePicker,
} from "./GLSecureDatePicker";
import {
  GLSecureDateTimePicker,
  GLSecureFormDateTimePicker,
} from "./GLSecureDateTimePicker";
import {
  GLSecureMobileDateTimePicker,
  GLSecureFormMobileDateTimePicker,
} from "./GLSecureMobileDateTimePicker";

const SecureForms = {
  // Standalone
  GLSecureTextField,
  GLSecureSelect,
  GLSecureAutoComplete,
  GLSecureStaticAutoComplete,
  GLSecureCheckbox,
  GLSecureMultiCheckbox,
  GLSecureRadioGroup,
  GLSecureDatePicker,
  GLSecureDateTimePicker,
  GLSecureMobileDateTimePicker,

  // Formik-integrated
  GLSecureFormTextField,
  GLSecureFormSelect,
  GLSecureFormAutoComplete,
  GLSecureFormStaticAutoComplete,
  GLSecureFormCheckbox,
  GLSecureFormMultiCheckbox,
  GLSecureFormRadioGroup,
  GLSecureFormDatePicker,
  GLSecureFormDateTimePicker,
  GLSecureFormMobileDateTimePicker,
};

export default SecureForms;
