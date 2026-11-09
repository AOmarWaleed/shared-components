import { useState } from "react";
import "./App.css";
import { DisplayMsgDialog } from "./shared/dialog/DisplayMsgDialog";
import GlCustomPagination from "./shared/tables/GlCustomPagination";
import { ExcelExportButton } from "./shared/components/ExcelExportButton";
import Secure from "./shared/security";
// import GlCustomTable from "./shared/tables/GlCustomTable";
import { Button } from "@mui/material";
import api from "./utils/Api";
const columns = [
  {
    field: "id",
    headerName: "ID",
    width: 10,
  },
  {
    field: "name",
    headerName: "User Name",
    width: 25,
  },
  {
    field: "email",
    headerName: "Email Address",
    width: 35,
  },
  {
    field: "status",
    headerName: "Status",
    width: 15,
    format: (value: any) => (value === "active" ? "🟢 Active" : "🔴 Inactive"),
  },
  {
    field: "createdAt",
    headerName: "Created Date",
    width: 20,
    format: (value: any) => new Date(value).toLocaleDateString(),
  },
];

const staticData = [
  {
    id: 1,
    name: "John Doe",
    email: "john@example.com",
    status: "active",
    createdAt: "2024-01-15",
  },
  {
    id: 2,
    name: "Jane Smith",
    email: "jane@example.com",
    status: "inactive",
    createdAt: "2024-01-20",
  },
];
function App() {
  const [open, setOpen] = useState(false);

  const handleDelete = async () => {
    console.log("Simulated delete action executed");
    setOpen(false);
  };
  // const [cliams, setclaims] = useState<Record<string, string>[]>();
  const handleClaims = async () => {
    const data = await api.post(
      "nphies/claim/filter/01-aug-2023/31-aug-2026/183",
    );
    console.log(data);
  };
  return (
    <>
      <ExcelExportButton
        columns={columns}
        data={staticData}
        fileName="users_export"
        sheetName="Users"
        color="primary"
      />

      <button onClick={() => setOpen(true)}>Delete demo</button>
      <GlCustomPagination
        totalCount={100}
        currentPage={1}
        pageSize={10}
        onPageChange={(page) => {
          console.log("Page changed to:", page);
        }}
        onPageSizeChange={(size) => {
          console.log("Page size changed to:", size);
        }}
        isLoading={false}
        pageSizeOptions={[5, 10, 20, 50]}
      ></GlCustomPagination>
      <Secure.GLSecureInputs.TextField name="test" permission="dd" />

        <Button onClick={() => setOpen(true)}>Open</Button>
      <DisplayMsgDialog
        open={open}
        onClose={() => setOpen(false)}
        status="DELETE"
        description="This action will permanently remove the selected resource."
        actionLabel="Delete"
        actionColor="error"
        // getResource={false}
        onAction={handleDelete}
        resourceId={10001}
      />

      <Button onClick={handleClaims}>Get Claims</Button>
      {/* <GlCustomTable /> */}
    </>
  );
}

export default App;
