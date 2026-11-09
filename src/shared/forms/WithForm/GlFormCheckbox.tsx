import { useField, useFormikContext } from 'formik';
import { GlCheckbox, GlCheckboxProps } from '../StandAlone/GlCheckbox';

// ----------------------------------------------------------------------

export type GlFormCheckboxProps = Omit<
  GlCheckboxProps,
  'value' | 'onChange' | 'error' | 'errorMessage'
>;

export function GlFormCheckbox({ name, label, helperText, ...other }: GlFormCheckboxProps) {
  const { setFieldValue } = useFormikContext();
  const [field, meta] = useField(name);

  return (
    <GlCheckbox
      name={name}
      label={label}
      helperText={helperText}
      value={field.value || false}
      onChange={(checked: boolean) => {
        setFieldValue(name, checked);
       
      }}
      onBlur={field.onBlur}
      error={meta.touched && !!meta.error}
      errorMessage={meta.touched && meta.error ? meta.error : undefined}
      {...other}
    />
  );
}