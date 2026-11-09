import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  TextField,
  Box,
  Button,
  IconButton,
  Typography,
  MenuItem,
  Select,
  FormControl,
  SelectChangeEvent,
} from "@mui/material";
import {
  KeyboardArrowRight,
  KeyboardArrowLeft,
  FirstPage,
  LastPage,
} from "@mui/icons-material";
import { debounce } from "lodash";

interface GlCustomPaginationProps {
  totalCount: number;
  currentPage: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange?: (size: number) => void;
  isLoading?: boolean;
  pageSizeOptions?: number[];
  showPageSizeControls?: boolean;
  showPageInput?: boolean;
  smallSize?: boolean;
  showPageSizeText?: boolean;
}

const GlCustomPagination: React.FC<GlCustomPaginationProps> = ({
  totalCount,
  currentPage,
  pageSize,
  onPageChange,
  onPageSizeChange,
  isLoading = false,
  pageSizeOptions = [5, 10, 25, 50],
  showPageSizeControls = true,
  showPageInput = true,
  showPageSizeText = false,
}) => {
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
  const [inputPage, setInputPage] = useState(currentPage.toString());

  useEffect(() => {
    setInputPage(currentPage.toString());
  }, [currentPage]);
  // useEffect(() => {
  //   showPageInput = false;
  // }, [smallSize]);

  const debouncedPageChange = useMemo(
    () =>
      debounce((pageNum: number) => {
        if (pageNum >= 1 && pageNum <= totalPages) {
          onPageChange(pageNum);
        }
      }, 500),
    [onPageChange, totalPages],
  );

  useEffect(() => {
    return () => {
      debouncedPageChange.cancel();
    };
  }, [debouncedPageChange]);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setInputPage(value);

      const pageNum = parseInt(value, 10);
      if (!isNaN(pageNum)) {
        debouncedPageChange(pageNum);
      }
    },
    [debouncedPageChange],
  );

  const handleInputBlur = useCallback(() => {
    const pageNum = parseInt(inputPage, 10);
    if (isNaN(pageNum) || pageNum < 1 || pageNum > totalPages) {
      setInputPage(currentPage.toString());
    }
  }, [inputPage, currentPage, totalPages]);

  const handleInputKeyPress = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter") {
        e.preventDefault();
        const pageNum = parseInt(inputPage, 10);
        if (!isNaN(pageNum) && pageNum >= 1 && pageNum <= totalPages) {
          onPageChange(pageNum);
        } else {
          setInputPage(currentPage.toString());
        }
      }
    },
    [inputPage, currentPage, totalPages, onPageChange],
  );

  const handlePageSizeChange = useCallback(
    (e: SelectChangeEvent<number>) => {
      const newSize = Number(e.target.value);
      onPageSizeChange?.(newSize);
      // Reset to first page when changing page size
      onPageChange(1);
    },
    [onPageSizeChange, onPageChange],
  );

  const navigateToPage = useCallback(
    (page: number) => {
      if (page >= 1 && page <= totalPages && !isLoading) {
        onPageChange(page);
      }
    },
    [totalPages, isLoading, onPageChange],
  );

  // Generate page numbers to display (current page and neighbors)
  const visiblePages = useMemo(() => {
    const pages = [];
    const maxVisible = 3; // Show current page and one on each side

    let start = Math.max(1, currentPage - 1);
    let end = Math.min(totalPages, start + maxVisible - 1);

    // Adjust if we're near the end
    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1);
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    return pages;
  }, [currentPage, totalPages]);

  // Calculate range of items being shown
  const itemRange = useMemo(() => {
    const start = (currentPage - 1) * pageSize + 1;
    const end = Math.min(currentPage * pageSize, totalCount);
    return { start, end };
  }, [currentPage, pageSize, totalCount]);

  // Disable state for navigation buttons
  const isFirstPage = currentPage === 1;
  const isLastPage = currentPage === totalPages;

  return (
    <Box
      className="GlCustomPagination"
      display="flex"
      alignItems="center"
      justifyContent="space-between"
      flexWrap="wrap"
      gap={2}
      p={1}
      sx={{ opacity: isLoading ? 0.7 : 1, color: "footer.color" }}
    >
      {/* Item range info */}
      {showPageSizeText && (
        <Typography variant="body2">
          Showing {itemRange.start}-{itemRange.end} of {totalCount}
        </Typography>
      )}

      <Box display="flex" alignItems="center" gap={1}>
        {/* Page size selector */}
        {showPageSizeControls && onPageSizeChange && (
          <Box display="flex" alignItems="center" gap={1}>
            <Typography variant="body2">Rows per page:</Typography>
            <FormControl size="small" variant="outlined">
              <Select
                value={pageSize}
                onChange={handlePageSizeChange}
                disabled={isLoading}
                // sx={{ minWidth: 80 }}
                sx={{
                  width: 80,
                  color: "inherit",
                  "& .MuiInputBase-root": { color: "inherit" },
                }}
              >
                {pageSizeOptions.map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        )}

        {/* Page navigation */}
        <Box display="flex" alignItems="center" gap={0.5}>
          <IconButton
            onClick={() => navigateToPage(1)}
            disabled={isFirstPage || isLoading}
            size="small"
            aria-label="First page"
            sx={{ color: "inherit !important" }}
          >
            <FirstPage color="inherit" />
          </IconButton>

          <IconButton
            onClick={() => navigateToPage(currentPage - 1)}
            disabled={isFirstPage || isLoading}
            size="small"
            aria-label="Previous page"
            sx={{ color: "inherit !important" }}
          >
            <KeyboardArrowLeft />
          </IconButton>

          {/* Page numbers */}
          {visiblePages.map((page) => (
            <Button
              key={page}
              className="GlCustomPagination-button"
              variant={page === currentPage ? "contained" : "outlined"}
              onClick={() => navigateToPage(page)}
              disabled={isLoading}
              size="small"
              sx={[
                {
                  minWidth: 0,
                  width: 30,
                  height: 30,
                  borderRadius: "50%",
                  padding: 0,
                },
                page !== currentPage && { color: "inherit !important" },
              ]}
            >
              {page}
            </Button>
          ))}

          <IconButton
            onClick={() => navigateToPage(currentPage + 1)}
            disabled={isLastPage || isLoading}
            size="small"
            aria-label="Next page"
            sx={{ color: "inherit !important" }}
          >
            <KeyboardArrowRight />
          </IconButton>

          <IconButton
            onClick={() => navigateToPage(totalPages)}
            disabled={isLastPage || isLoading}
            size="small"
            aria-label="Last page"
            sx={{ color: "inherit !important" }}
          >
            <LastPage />
          </IconButton>
        </Box>

        {/* Page input */}
        {showPageInput && (
          <Box display="flex" alignItems="center" gap={1}>
            <Typography variant="body2">Go to page:</Typography>
            <TextField
              type="number"
              value={inputPage}
              onChange={handleInputChange}
              onBlur={handleInputBlur}
              onKeyPress={handleInputKeyPress}
              inputProps={{
                min: 1,
                max: totalPages,
                style: { textAlign: "center" },
              }}
              disabled={isLoading}
              size="small"
              sx={{
                width: 70,
                color: "inherit",
                "& .MuiInputBase-root": { color: "inherit" },
              }}
            />
            <Typography variant="body2">of {totalPages}</Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default React.memo(GlCustomPagination);
