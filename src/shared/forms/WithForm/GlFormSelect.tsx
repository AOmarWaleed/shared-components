import { useField, useFormikContext } from "formik";
import { GlSelect, GlSelectProps } from "../StandAlone/GlSelect";

// ----------------------------------------------------------------------

export type GlFormSelectProps = Omit<
  GlSelectProps,
  "value" | "onChange" | "error" | "errorMessage" | "onBlur"
>;

export function GlFormSelect({
  name,
  helperText,
  options,
  label,
  ...other
}: GlFormSelectProps) {
  const { setFieldValue, setFieldTouched } = useFormikContext();
  const [field, meta] = useField(name);

  return (
    <GlSelect
      name={name}
      helperText={helperText}
      options={options}
      label={label}
      value={field.value}
      onChange={(value: any) => {
        setFieldValue(name, value);
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
