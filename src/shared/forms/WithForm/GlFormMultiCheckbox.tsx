import { useField, useFormikContext } from 'formik';
import { GlMultiCheckbox, GlMultiCheckboxProps } from '../StandAlone/GlMultiCheckbox';

// ----------------------------------------------------------------------

export type GlFormMultiCheckboxProps = Omit<
  GlMultiCheckboxProps,
  'value' | 'onChange' | 'error' | 'errorMessage' | 'onBlur'
>;

export function GlFormMultiCheckbox({
  name,
  label,
  options,
  helperText,
  row = false,
  checkboxProps,
  ...other
}: GlFormMultiCheckboxProps) {
  const { setFieldValue, setFieldTouched } = useFormikContext();
  const [field, meta] = useField(name);

  // Ensure field.value is always an array
  const values = Array.isArray(field.value) ? field.value : [];

  return (
    <GlMultiCheckbox
      name={name}
      label={label}
      options={options}
      helperText={helperText}
      row={row}
      value={values}
      onChange={(newValue: any[]) => {
        setFieldValue(name, newValue);
      }}
      onBlur={() => {
        setFieldTouched(name, true);
      }}
      error={meta.touched && !!meta.error}
      errorMessage={meta.touched && meta.error ? meta.error : undefined}
      checkboxProps={checkboxProps}
      {...other}
    />
  );
}