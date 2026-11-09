import {
  Autocomplete,
  TextField,
  CircularProgress,
  TextFieldVariants,
} from "@mui/material";
import { useEffect, useState, useMemo, useCallback } from "react";
import debounce from "lodash.debounce";
import { useGlList } from "../../hooks/useGlList";
import { SxProps, Theme } from "@mui/material/styles";

export interface GlAutoCompleteProps<T extends Record<string, any>> {
  url: string;
  labelKeys: (keyof T)[];
  inputLabel: string;
  idKey: keyof T;
  name: string;
  separator?: string;
  value?: T | T[keyof T] | null;
  onChange?: (value: T | null) => void;
  onInputChange?: (value: string) => void;
  onKeyDown?: (event: any) => void;
  onBlur?: () => void;
  pageSize?: number;
  error?: boolean;
  helperText?: string;
  disabled?: boolean;
  variant?: TextFieldVariants | undefined;
  sx?: SxProps<Theme> | undefined;
  inputSx?: SxProps<Theme> | undefined;
  renderOptionLabel?: (option: T) => string;
  fetcher: (args: string | [string, any]) => Promise<any>;
}

export default function GlAutoComplete<T extends Record<string, any>>({
  url,
  labelKeys,
  inputLabel,
  idKey,
  name,
  value,
  onChange,
  onInputChange,
  onKeyDown,
  onBlur,
  pageSize = 20,
  error,
  helperText,
  separator = " ",
  disabled = false,
  variant,
  sx,
  inputSx,
  renderOptionLabel,
  fetcher,
}: GlAutoCompleteProps<T>) {
  const [options, setOptions] = useState<T[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [selectedValue, setSelectedValue] = useState<T | null>(null);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [hasMore, setHasMore] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const { glList, isLoading, isError, handleParamsChange } = useGlList<{
    data: T[];
    total: number;
  }>({
    url,
    initParams: { page: 1, limit: pageSize, _search: "" },
    fetcher,
  });

  const getOptionLabel = useCallback(
    (option: T | string) => {
      if (typeof option === "string") return option;
      if (renderOptionLabel) return renderOptionLabel(option);
      return labelKeys
        .map((key) => option[key])
        .filter(Boolean)
        .join(separator);
    },
    [labelKeys, separator, renderOptionLabel],
  );

  // Handle initial value only once on mount
  useEffect(() => {
    if (!isInitialized && value) {
      if (typeof value === "object") {
        setSelectedValue(value);
        setInputValue(getOptionLabel(value));
      } else {
        // setSelectedValue(value);
        // For ID values, we need to fetch the corresponding object
        console.log("Initial ID value detected:", value);
        if (glList) {
          const val = glList.data.find((item) => item[name] === value);
          if (val) {
            setSelectedValue(val);
            setInputValue(getOptionLabel(val));
          }
        }
      }
      setIsInitialized(true);
    } else if (!value) {
      setSelectedValue(null);
      setInputValue("");
    }
  }, [value, isInitialized]);

  // Reset initialization when value is cleared
  useEffect(() => {
    if (!value) {
      setIsInitialized(false);
    }
  }, [value]);

  // Update options and hasMore
  useEffect(() => {
    if (!glList) return;

    const newData = glList.data ?? [];
    if (page === 1) {
      setOptions(newData);
    } else {
      setOptions((prev) => {
        const existingIds = new Set(prev.map((item) => item[idKey]));
        const filteredNewData = newData.filter(
          (item) => !existingIds.has(item[idKey]),
        );
        return [...prev, ...filteredNewData];
      });
    }

    const totalItems = glList.total ?? 0;
    setHasMore(
      newData.length > 0 && options.length + newData.length < totalItems,
    );
  }, [glList, page, idKey, options.length]);

  // Debounced search
  const debouncedSearch = useMemo(
    () =>
      debounce((value: string) => {
        console.log("Debounced search triggered with value:", value);
        setSearch(value);
        setPage(1);
        setOptions([]);
        setHasMore(true);
        handleParamsChange({ page: 1, limit: pageSize, _search: value });
      }, 400),
    [handleParamsChange, pageSize],
  );

  // Immediate search (without debounce)
  const immediateSearch = useCallback(
    (value: string) => {
      console.log("Immediate search triggered with value:", value);
      setSearch(value);
      setPage(1);
      setOptions([]);
      setHasMore(true);
      handleParamsChange({ page: 1, limit: pageSize, _search: value });
    },
    [handleParamsChange, pageSize],
  );

  // Debounced scroll
  const debouncedScroll = useMemo(
    () =>
      debounce(() => {
        if (hasMore && !isLoading) {
          const nextPage = page + 1;
          setPage(nextPage);
          handleParamsChange({
            page: nextPage,
            limit: pageSize,
            _search: search,
          });
        }
      }, 200),
    [hasMore, isLoading, page, handleParamsChange, pageSize, search],
  );

  // Initialize
  useEffect(() => {
    console.log("Initializing with URL:", url);
    handleParamsChange({ page: 1, limit: pageSize, _search: "" });
  }, [handleParamsChange, pageSize, url]);

  // Handle focus - show options when input is focused
  const handleFocus = useCallback(() => {
    setIsOpen(true);
    // Trigger search with current input value when focused
    if (inputValue.trim() === "") {
      // If input is empty, load initial options
      immediateSearch("");
    } else {
      // If input has text, search with that text
      debouncedSearch(inputValue);
    }
  }, [inputValue, immediateSearch, debouncedSearch]);

  // Handle input change
  const handleInputChange = useCallback(
    (_: any, newInputValue: string) => {
      console.log("Input changed to:", newInputValue);
      setInputValue(newInputValue);
      onInputChange?.(newInputValue);

      // Only trigger search if the user is typing (not when clearing due to selection change)
      if (newInputValue !== getOptionLabel(selectedValue || "")) {
        debouncedSearch(newInputValue);
      }
    },
    [debouncedSearch, selectedValue, getOptionLabel, onInputChange],
  );

  // Handle selection change
  const handleChange = useCallback(
    (_: any, value: T | null) => {
      console.log("Selected value:", value);
      setSelectedValue(value);

      // Update input value to show the selected option's label
      if (value) {
        setInputValue(getOptionLabel(value));
      } else {
        setInputValue("");
      }

      onChange?.(value);
      setIsOpen(false); // Close dropdown after selection
    },
    [onChange, getOptionLabel],
  );

  // Handle blur - revert to selected value if no new selection was made
  const handleBlur = useCallback(() => {
    // If there's a selected value, revert the input to show its label
    if (selectedValue) {
      setInputValue(getOptionLabel(selectedValue));
    } else {
      setInputValue("");
    }

    setIsOpen(false);
    onBlur?.();
  }, [selectedValue, getOptionLabel, onBlur]);

  // Handle scroll
  const handleScroll = (event: React.UIEvent<HTMLElement>) => {
    const listboxNode = event.currentTarget;
    if (
      listboxNode.scrollTop + listboxNode.clientHeight >=
      listboxNode.scrollHeight - 5
    ) {
      debouncedScroll();
    }
  };

  // Cleanup debounce functions
  useEffect(() => {
    return () => {
      debouncedSearch.cancel();
      debouncedScroll.cancel();
    };
  }, [debouncedSearch, debouncedScroll]);

  return (
    <>
      {/* {value || "valueeee"} */}
      {/* <br /> */}
      {/* {JSON.stringify(selectedValue) || "valueeee"} */}
      <Autocomplete
        disabled={disabled}
        value={selectedValue}
        inputValue={inputValue}
        onInputChange={handleInputChange}
        onChange={(_, value) => handleChange(_, value as T | null)}
        onBlur={handleBlur}
        onFocus={handleFocus}
        onKeyDown={onKeyDown}
        open={isOpen}
        onOpen={() => setIsOpen(true)}
        onClose={() => setIsOpen(false)}
        options={options}
        filterOptions={(options) => options}
        getOptionLabel={getOptionLabel}
        loading={isLoading}
        sx={sx}
        noOptionsText={isLoading ? "Loading..." : "No options"}
        renderInput={(params) => (
          <TextField
            {...params}
            variant={variant}
            name={name}
            label={inputLabel}
            error={error || !!isError}
            helperText={
              helperText || (isError ? "Failed to load data" : undefined)
            }
            InputProps={{
              ...params.InputProps,
              endAdornment: (
                <>
                  {isLoading ? (
                    <CircularProgress color="inherit" size={20} />
                  ) : null}
                  {params.InputProps.endAdornment}
                </>
              ),
            }}
            onFocus={handleFocus}
            sx={inputSx}
          />
        )}
        isOptionEqualToValue={(option, value) => {
          if (!value) return false;
          return (option as T)[idKey] === (value as T)[idKey];
        }}
        slotProps={{
          listbox: {
            onScroll: handleScroll,
          },
        }}
        freeSolo // Allow free text input
        clearOnBlur={false} // Don't clear on blur
      />
    </>
  );
}
