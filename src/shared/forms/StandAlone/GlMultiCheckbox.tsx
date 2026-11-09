import {
  FormGroup,
  FormControlLabel,
  Checkbox,
  FormHelperText,
  FormControl,
  FormLabel,
  CheckboxProps,
} from '@mui/material';

// ----------------------------------------------------------------------

export interface Option {
  label: string;
  value: string | number;
}

export interface GlMultiCheckboxProps {
  name: string;
  label: string;
  options: Option[];
  helperText?: string;
  row?: boolean;
  value?: (string | number)[];
  onChange?: (values: (string | number)[]) => void;
  onBlur?: () => void;
  error?: boolean;
  errorMessage?: string;
  checkboxProps?: CheckboxProps;
}

export function GlMultiCheckbox({
  name,
  label,
  options,
  helperText,
  row = false,
  value = [],
  onChange,
  onBlur,
  error = false,
  errorMessage,
  checkboxProps,
  ...other
}: GlMultiCheckboxProps) {
  const handleChange = (optionValue: string | number, checked: boolean) => {
    if (onChange) {
      if (checked) {
        onChange([...value, optionValue]);
      } else {
        onChange(value.filter((val) => val !== optionValue));
      }
    }
  };

  return (
    <FormControl error={error} component="fieldset" variant="standard" {...other}>
      <FormLabel component="legend">{label}</FormLabel>
      <FormGroup row={row}>
        {options.map((option) => (
          <FormControlLabel
            key={option.value}
            control={
              <Checkbox
                checked={value.includes(option.value)}
                onChange={(e) => handleChange(option.value, e.target.checked)}
                onBlur={onBlur} 
                name={name}
                {...checkboxProps}
              />
            }
            label={option.label}
          />
        ))}
      </FormGroup>
      <FormHelperText>{errorMessage ?? helperText}</FormHelperText>
    </FormControl>
  );
}