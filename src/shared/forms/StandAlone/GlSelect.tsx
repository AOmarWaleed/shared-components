import {
  Select as MuiSelect,
  FormControl,
  InputLabel,
  FormHelperText,
  SelectProps as MuiSelectProps,
  MenuItem,
} from "@mui/material";

// ----------------------------------------------------------------------

export interface Option {
  value: string | number;
  label: string;
}

export interface GlSelectProps extends Omit<MuiSelectProps, "onChange"> {
  name: string;
  options: Option[];
  helperText?: string;
  value?: string | number;
  onChange?: (value: string | number) => void;
  error?: boolean;
  errorMessage?: string;
}

export function GlSelect({
  name,
  helperText,
  options,
  value = "",
  onChange,
  error = false,
  errorMessage,
  label,
  ...other
}: GlSelectProps) {
  const handleChange = (event: any) => {
    if (onChange) {
      onChange(event.target.value);
    }
  };
  return (
    <FormControl fullWidth error={error}>
      <InputLabel>{label}</InputLabel>
      <MuiSelect
        name={name}
        value={value}
        onChange={handleChange}
        label={label}
        size="small"
        {...other}
      >
        {options.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </MuiSelect>
      {error && <FormHelperText>{errorMessage ?? helperText}</FormHelperText>}
    </FormControl>
  );
}
