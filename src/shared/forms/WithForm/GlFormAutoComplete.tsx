import { useField, useFormikContext } from "formik";
import GlAutoComplete, {
  GlAutoCompleteProps,
} from "../StandAlone/GlAutoComplete";

export interface GlFormAutoCompleteProps
  extends Omit<
    GlAutoCompleteProps<any>,
    "value" | "onChange" | "error" | "helperText"
  > {
  name: string;
  onChange?: (newValue: any) => void;
  helperText?: string;
}

export function GlFormAutoComplete({
  name,
  helperText,
  onChange,
  idKey,
  ...other
}: GlFormAutoCompleteProps) {
  const { setFieldValue } = useFormikContext();
  const [field, meta] = useField(name);

  // Handle the error message properly
  const errorMessage = meta.touched && meta.error ? meta.error : undefined;
  const displayHelperText = errorMessage || helperText;
  // console.log("touched: ", meta.touched, "error: ", meta.error);
  return (
    <GlAutoComplete
      {...other}
      url={other.url}
      labelKeys={other.labelKeys}
      inputLabel={other.inputLabel}
      idKey={idKey}
      disabled={other.disabled}
      name={name}
      value={field.value}
      onBlur={() => {
        field.onBlur({ target: { name } } as any);
      }}
      onChange={(newValue) => {
        console.log("GlFormAutoComplete onChange", newValue);

        setFieldValue(name, newValue ? newValue[idKey] : null);
        onChange?.(newValue);
      }}
      error={meta.touched && !!meta.error}
      helperText={displayHelperText}
    />
  );
}