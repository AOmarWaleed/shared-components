import React from "react";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { Box, CssBaseline, Theme, ThemeProvider } from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

export const withNeededDependencies = <P extends object>(
  Component: any
): React.FC<P & { theme: Theme }> => {
  const WrappedComponent = ({ theme, ...props }: P & { theme: Theme }) => (
  
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <Box>
              <Component {...(props as P)} />
            </Box>
          </ThemeProvider>
        
      </LocalizationProvider>
   
  );

  // Set display name for better debugging
  WrappedComponent.displayName = `withNeededDependencies(${
    Component.displayName || Component.name
  })`;

  return WrappedComponent;
};
