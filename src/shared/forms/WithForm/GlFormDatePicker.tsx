import { useField, useFormikContext } from 'formik';
import { GlDatePicker, GlDatePickerProps } from '../StandAlone/GlDatePicker';
import type { PickerValue } from '@mui/x-date-pickers/internals';

// ----------------------------------------------------------------------

export type GlFormDatePickerProps = Omit<
  GlDatePickerProps,
  'value' | 'onChange' | 'error' | 'errorMessage' | 'onBlur'
>;

export function GlFormDatePicker({ name, label, helperText = '', ...other }: GlFormDatePickerProps) {
  const { setFieldValue, setFieldTouched } = useFormikContext();
  const [field, meta] = useField(name);

  return (
    <GlDatePicker
      name={name}
      label={label}
      helperText={helperText}
      value={field.value}
      onChange={(date: PickerValue | null) => {
        setFieldValue(name, date);
      }}
      onBlur={() => {
        setFieldTouched(name, true);
      }}
      error={meta.touched && !!meta.error}
      errorMessage={meta.touched && meta.error ? meta.error : undefined}
      {...other}
    />
  );
}