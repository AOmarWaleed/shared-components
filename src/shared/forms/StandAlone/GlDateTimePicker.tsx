// import { DesktopTimePicker  } from '@mui/x-date-pickers/DesktopTimePicker';
import { DesktopDateTimePicker } from "@mui/x-date-pickers/DesktopDateTimePicker";

import { FormControl } from '@mui/material';
import { DateTimePickerProps } from '@mui/x-date-pickers';
import type { PickerValue } from '@mui/x-date-pickers/internals';

// ----------------------------------------------------------------------

export interface GlDateTimePickerProps extends Omit<DateTimePickerProps<any>, 'onChange' | 'value'> {
  name: string;
  helperText?: string;
  value?: PickerValue | undefined;
  onChange?: (date: PickerValue | null) => void;
  onBlur?: () => void;
  error?: boolean;
  errorMessage?: string;
}

export function GlDateTimePicker({
  name,
  label,
  helperText,
  value = null,
  onChange,
  onBlur,
  error = false,
  errorMessage,
  ...other
}: GlDateTimePickerProps) {
  const handleChange = (date: PickerValue | null) => {
    if (onChange) {
      onChange(date);
    }
  };

  return (
    <FormControl fullWidth error={error}>
      <DesktopDateTimePicker
        label={label}
        format="dd-MM-yyyy HH:mm:ss"
        value={value}
        onChange={handleChange}
        onClose={onBlur}
        slotProps={{
          textField: {
            fullWidth: true,
            size  :"small",
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