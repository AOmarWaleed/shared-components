import {
  Autocomplete,
  TextField,
  Typography,
  Box,
  AutocompleteProps,
} from "@mui/material";
import { useMemo } from "react";

interface BaseItem {
  [key: string]: any;
}

export interface GlStaticAutoCompleteProps<T extends BaseItem> {
  options: T[];
  idKey?: string;
  labelKeys?: string[];
  inputLabel: string;
  name: string;
  value?: string | number | null;
  onChange: (newValue: OptionType | null) => void;
  onBlur?: () => void;

  separator?: string;
  error?: boolean;
  helperText?: string;
  disabled?: boolean;
  noOptionsText?: string;
  showId?: boolean;
  renderOption?: AutocompleteProps<
    OptionType,
    false,
    false,
    false
  >["renderOption"];
  filterOptions?: AutocompleteProps<
    OptionType,
    false,
    false,
    false
  >["filterOptions"];
}

export interface OptionType {
  label: string;
  id: string | number;
  original: any;
}

export default function GlStaticAutoComplete<T extends BaseItem>({
  options: staticOptions,
  showId = false,
  idKey = "id",
  labelKeys = ["label"],
  inputLabel,
  value,
  onChange,
  separator = " - ",
  error = false,
  helperText,
  disabled = false,
  noOptionsText = "No options",
  renderOption,
  name,
  filterOptions,
  onBlur,
}: GlStaticAutoCompleteProps<T>) {
  const mappedOptions = useMemo<OptionType[]>(() => {
    return staticOptions.map((o: T) => {
      const label = labelKeys
        .map((key) => o[key] || "")
        .filter((val) => val !== "")
        .join(separator);

      return { label, id: o[idKey], original: o };
    });
  }, [staticOptions, idKey, labelKeys, separator]);

  const selectedOption = useMemo(() => {
    if (value === null) return null;
    return mappedOptions.find((option) => option.id === value) || null;
  }, [value, mappedOptions]);

  const defaultRenderOption = (
    props: React.HTMLAttributes<HTMLLIElement>,
    option: OptionType
  ) => {
    return (
      <li {...props}>
        <Box>
          <Typography variant="body1">{option.label}</Typography>
          {showId && (
            <Typography variant="caption" color="textSecondary">
              ID: {option.id}
            </Typography>
          )}
        </Box>
      </li>
    );
  };

  return (
    <Autocomplete
      disablePortal
      options={mappedOptions}
      value={selectedOption}
      onChange={(_, newValue) => {
        onChange(newValue);
      }}
      onBlur={onBlur}
      disabled={disabled}
      isOptionEqualToValue={(option, val) => option.id === val?.id}
      getOptionLabel={(option) =>
        typeof option === "string" ? option : option.label || ""
      }
      renderOption={renderOption || defaultRenderOption}
      filterOptions={filterOptions}
      renderInput={(params) => (
        <TextField
          {...params}
          name={name}
          label={inputLabel}
          error={error}
          helperText={helperText}
          size="small"
        />
      )}
      noOptionsText={noOptionsText}
    />
  );
}
