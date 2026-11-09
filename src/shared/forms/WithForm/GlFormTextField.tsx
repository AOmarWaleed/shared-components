import { useField, useFormikContext } from "formik";
import { GlTextField, GlTextFieldProps } from "../StandAlone/GlTextField";

// ----------------------------------------------------------------------

export type GlFormTextFieldProps = Omit<
  GlTextFieldProps,
  "value" | "onChange" | "error" | "errorMessage" | "onBlur"
>;

export function GlFormTextField({
  name,
  helperText,
  type,
  ...other
}: GlFormTextFieldProps) {
  const { setFieldValue } = useFormikContext();
  const [field, meta] = useField(name);
  return (
    <GlTextField
      name={name}
      helperText={helperText}
      type={type}
      value={field.value}
      onChange={(value: string | number) => {
        setFieldValue(name, value);
      }}
      onBlur={field.onBlur}
      error={meta.touched && !!meta.error}
      errorMessage={meta.touched && meta.error ? meta.error : undefined}
      {...other}
    />
  );
}
