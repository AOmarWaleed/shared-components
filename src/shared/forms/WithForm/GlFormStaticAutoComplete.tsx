import { useField, useFormikContext } from "formik";
import GlStaticAutoComplete, {
  GlStaticAutoCompleteProps,
  OptionType,
} from "../StandAlone/GlStaticAutoComplete";

export interface GlFormStaticAutoCompleteProps<T extends { [key: string]: any }>
  extends Omit<
    GlStaticAutoCompleteProps<T>,
    "value" | "onChange" | "error"
  > {
  name: string;
  onChange?: (newValue: OptionType | null) => void;
}

export function GlFormStaticAutoComplete<T extends { [key: string]: any }>({
  name,
  helperText,
  onChange,
  ...other
}: GlFormStaticAutoCompleteProps<T>) {
  const { setFieldValue } = useFormikContext();
  const [field, meta] = useField(name);

  const errorMessage = meta.touched && meta.error ? meta.error : undefined;
  const displayHelperText = errorMessage || helperText;

  return (
    <GlStaticAutoComplete<T>
      {...other}
      name={name}
      value={field.value}
      onChange={(newValue) => {
        setFieldValue(name, newValue ? newValue.id : null);
        onChange && onChange(newValue);
      }}
      onBlur={() => {
        field.onBlur({ target: { name } } as any);
      }}
      error={!!errorMessage}
      helperText={displayHelperText}
    />
  );
}
