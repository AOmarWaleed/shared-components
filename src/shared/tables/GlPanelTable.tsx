import React, { createContext, useState } from "react";
import { Box, Stack } from "@mui/material";
import GlFilterBtn from "./GlFilterBtn";

function GlPanelTableInternal({ children, filterSection , showFilterIcon }: any) {
  return (
    <>
      <Stack sx={{py : 2}} direction={"row"}>
       {
        showFilterIcon &&
         <Box>
          <GlFilterBtn />
        </Box>
       }

        <Box sx={{flexGrow : "1" , display : "flex" , justifyContent : "flex-end"}}>{filterSection}</Box>
      </Stack>

      {children}
    </>
  );
}

export default function GlPanelTable({
  children,
  filterSection,
  showFilterIcon = false
}: {
  children: React.ReactNode;
  filterSection?: React.ReactNode;
  showFilterIcon ?: boolean
}) {
  return (
    <TableContextProvider>
      <GlPanelTableInternal showFilterIcon={showFilterIcon} filterSection={filterSection}>{children}</GlPanelTableInternal>
    </TableContextProvider>
  );
}

export const TableContext = createContext<any>(0);
function TableContextProvider({ children }: { children: React.ReactNode }) {
  const [openFilter, setOpenFilter] = useState(false);

  return (
    <TableContext.Provider value={{ openFilter, setOpenFilter }}>
      {children}
    </TableContext.Provider>
  );
}
