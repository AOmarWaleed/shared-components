import {
  FormControlLabel,
  Checkbox as MuiCheckbox,
  FormHelperText,
  FormControl,
  CheckboxProps as MuiCheckboxProps,
} from '@mui/material';

// ----------------------------------------------------------------------

export interface GlCheckboxProps extends Omit<MuiCheckboxProps, 'onChange'> {
  name: string;
  label: string;
  helperText?: string;
  value?: boolean;
  onChange?: (checked: boolean) => void;
  error?: boolean;
  errorMessage?: string;
}

export function GlCheckbox({
  name,
  label,
  helperText,
  value = false,
  onChange,
  error = false,
  errorMessage,
  ...other
}: GlCheckboxProps) {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (onChange) {
      onChange(event.target.checked);
    }
  };

  return (
    <FormControl error={error}>
      <FormControlLabel
        control={
          <MuiCheckbox
            name={name}
            checked={value}
            onChange={handleChange}
            {...other}
          />
        }
        label={label}
      />
      <FormHelperText>{errorMessage ?? helperText}</FormHelperText>
    </FormControl>
  );
}