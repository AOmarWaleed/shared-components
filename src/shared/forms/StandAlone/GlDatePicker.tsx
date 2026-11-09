import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { FormControl } from '@mui/material';
import { DesktopDatePickerProps } from '@mui/x-date-pickers';
import type { PickerValue } from '@mui/x-date-pickers/internals';

// ----------------------------------------------------------------------

export interface GlDatePickerProps extends Omit<DesktopDatePickerProps<any>, 'onChange' | 'value'> {
  name: string;
  helperText?: string;
  value?: PickerValue | undefined;
  onChange?: (date: PickerValue | null) => void;
  onBlur?: () => void;
  error?: boolean;
  errorMessage?: string;
}

export function GlDatePicker({
  name,
  label,
  helperText,
  value = null,
  onChange,
  onBlur,
  error = false,
  errorMessage,
  ...other
}: GlDatePickerProps) {
  const handleChange = (date: PickerValue | null) => {
    if (onChange) {
      onChange(date);
    }
  };

  return (
    <FormControl fullWidth error={error}>
      <DesktopDatePicker
      
        label={label}
        value={value}
        onChange={handleChange}
        format='dd-MM-yyyy'
        onClose={onBlur} 
        slotProps={{
          textField: {
            fullWidth: true,
            size: 'small',
            error: error,
            helperText: errorMessage ?? helperText,
            name: name,
            onBlur: onBlur, 
          },
        }}
        {...other}
      />
    </FormControl>
  );
}