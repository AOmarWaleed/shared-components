import {
  FormControl,
  FormLabel,
  RadioGroup as MuiRadioGroup,
  FormControlLabel,
  Radio,
  FormHelperText,
} from '@mui/material';

// ----------------------------------------------------------------------

interface Option {
  value: string | number;
  label: string;
}

export interface GlRadioGroupProps {
  name: string;
  label: string;
  options: Option[];
  helperText?: string;
  row?: boolean;
  value?: string | number;
  onChange?: (value: string | number) => void;
  onBlur?: () => void;
  error?: boolean;
  errorMessage?: string;
}

// Standalone GlRadioGroup component
export function GlRadioGroup({
  name,
  label,
  options,
  helperText,
  row = false,
  value,
  onChange,
  onBlur,
  error = false,
  errorMessage,
  ...other
}: GlRadioGroupProps) {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (onChange) {
      onChange(event.target.value);
    }
  };

  return (
    <FormControl component="fieldset" error={error}>
      <FormLabel component="legend">{label}</FormLabel>
      <MuiRadioGroup
        name={name}
        value={value}
        onChange={handleChange}
        onBlur={onBlur} // Add onBlur to the RadioGroup
        row={row}
        {...other}
      >
        {options.map((option) => (
          <FormControlLabel
            key={option.value}
            value={option.value}
            control={<Radio onBlur={onBlur} />} // Add onBlur to each Radio
            label={option.label}
          />
        ))}
      </MuiRadioGroup>
      <FormHelperText>{errorMessage ?? helperText}</FormHelperText>
    </FormControl>
  );
}