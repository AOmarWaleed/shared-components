import React from "react";
import TextField, { TextFieldProps } from "@mui/material/TextField";

// ----------------------------------------------------------------------

export interface GlTextFieldProps extends Omit<TextFieldProps, "onChange"> {
  name: string;
  value?: string | number;
  onChange?: (value: string | number) => void;
  onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void;
  error?: boolean;
  errorMessage?: string;
}

export function GlTextField({
  name,
  helperText,
  type,
  value = "",
  onChange,
  onBlur,
  error = false,
  errorMessage,
  ...other
}: GlTextFieldProps) {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (onChange) {
      if (type === "number") {
        onChange(Number(event.target.value));
      } else {
        onChange(event.target.value);
      }
    }
  };

  const displayValue = type === "number" && value === 0 ? "" : value;

  return (
    <TextField
      name={name}
      value={displayValue}
      fullWidth
      size="small"
      type={type}
      onChange={handleChange}
      onBlur={onBlur}
      error={error}
      helperText={errorMessage ?? helperText}
      slotProps={{
        input: {
          autoComplete: "off",
        },
      }}
      {...other}
    />
  );
}
