import React, { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import * as XLSX from 'xlsx';
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";

const columns = [
  { field: 'id', headerName: 'Employee ID', width: 150 },
  { field: 'Employee Name', headerName: 'Employee Name', width: 200 },
  { field: 'Department', headerName: 'Department', width: 150 },
  { field: 'Role', headerName: 'Role', width: 150 },
];

const UserDataUpload = () => {
  const [rows, setRows] = useState(() => {
    // Attempt to retrieve data from localStorage on component mount
    const storedData = localStorage.getItem('userData');
    return storedData ? JSON.parse(storedData) : [];
  });

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: 'array' });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const jsonRows = XLSX.utils.sheet_to_json(sheet);

      // Add an 'id' property to each row
      const rowsWithId = jsonRows.map((row, index) => ({ ...row, id: index }));

      setRows(rowsWithId);

      // Save data to localStorage
      localStorage.setItem('userData', JSON.stringify(rowsWithId));
    };

    reader.readAsArrayBuffer(file);
  };

  useEffect(() => {
    // Clear localStorage on component unmount (page refresh)
    return () => {
      localStorage.removeItem('userData');
    };
  }, []);

  return (
    <div>
        <DashboardLayout>
      <DashboardNavbar />
      <input type="file" accept=".xlsx, .xls" onChange={handleFileUpload} style={{ margin: '10px' }} />
      {rows.length > 0 ? (
        <div style={{ height: 400, width: '100%' }}>
          <DataGrid rows={rows} columns={columns} pageSize={5} rowsPerPageOptions={[5, 10, 20]} checkboxSelection />
        </div>
      ) : (
        <p>No data available</p>
      )}
          </DashboardLayout>
    </div>
  );
};

export default UserDataUpload;
