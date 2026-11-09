import { MobileDateTimePicker } from '@mui/x-date-pickers/MobileDateTimePicker';
import { FormControl } from '@mui/material';
import { MobileDateTimePickerProps } from '@mui/x-date-pickers';
import type { PickerValue } from '@mui/x-date-pickers/internals';

// ----------------------------------------------------------------------

export interface GlMobileDateTimePickerProps extends Omit<MobileDateTimePickerProps<any>, 'onChange' | 'value'> {
  name: string;
  helperText?: string;
  value?: PickerValue | undefined;
  onChange?: (date: PickerValue | null) => void;
  onBlur?: () => void;
  error?: boolean;
  errorMessage?: string;
}

export function GlMobileDateTimePicker({
  name,
  label,
  helperText,
  value = null,
  onChange,
  onBlur,
  error = false,
  errorMessage,
  ...other
}: GlMobileDateTimePickerProps) {
  const handleChange = (date: PickerValue | null) => {
    if (onChange) {
      onChange(date);
    }
  };

  return (
    <FormControl fullWidth error={error}>
      <MobileDateTimePicker
        label={label}
        value={value}
        onChange={handleChange}
        onClose={onBlur} 
        slotProps={{
          textField: {
            fullWidth: true,
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