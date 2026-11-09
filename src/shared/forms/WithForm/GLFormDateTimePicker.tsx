import { useField, useFormikContext } from "formik";
import {
  GlDateTimePicker,
  GlDateTimePickerProps,
} from "../StandAlone/GlDateTimePicker";

// ----------------------------------------------------------------------

export type GLFormDateTimePickerProps = Omit<
  GlDateTimePickerProps,
  "value" | "onChange" | "error" | "errorMessage" | "onBlur"
>;

export function GLFormDateTimePicker({
  name,
  label,
  helperText,
  ...other
}: GLFormDateTimePickerProps) {
  const { setFieldValue, setFieldTouched } = useFormikContext();
  const [field, meta] = useField(name);

  return (
    <GlDateTimePicker
      name={name}
      label={label}
      helperText={helperText}
      value={field.value}
      onChange={(date) => {
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
