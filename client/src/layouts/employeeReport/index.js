import React, { useState, useEffect } from "react";
import axios from "axios";
import MDButton from "components/MDButton";
import { GetApp } from "@mui/icons-material";
import { MoreVert } from "@mui/icons-material";
import { Menu, MenuItem } from "@mui/material";
import { Box } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import 'layouts/Billing-Table/table.css'
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { CSVLink } from "react-csv";
const TeamTable = () => {
  const [teamData, setTeamData] = useState([]);
  const [menu, setMenu] = useState(null);

  const handleMenuClick = ({ currentTarget }) => setMenu(currentTarget);
  const handleMenuClose = () => setMenu(null);

  const handleDrawerOpen = () => {
    // Define the logic to open the drawer
    console.log("Drawer opened");
    handleMenuClose(); // Close the menu after opening the drawer if needed
  };

  const handleAdditionalOption = () => {
    // Your logic for the additional option goes here
    console.log("Additional Option Clicked");
    handleMenuClose();
  };

  useEffect(() => {
    // Fetch data from the API to get project names
    axios
      .get("http://localhost:8080/api/mongodb-data")
      .then((response) => {
        const projectNames = response.data.map((item) => item.team);
        // Deduplicate project names
        const uniqueProjectNames = [...new Set(projectNames)];
        // Generate team data based on project names
        const teamData = uniqueProjectNames.map((projectName) => {
          // Filter members for this team
          const teamMembers = response.data.filter(
            (item) => item.team === projectName
          );
          // Count the number of members
          const members = teamMembers.length;
          // Calculate working and idle member counts
          const workingMembers = teamMembers.filter(
            (member) => member.status === "Working"
          ).length;
          const idleMembers = teamMembers.filter(
            (member) => member.status === "Idle"
          ).length;
          // Extract department and manager (Assuming the first entry has the same department and manager)
          const firstEntry = teamMembers[0];
          return {
            teamName: projectName,
            members,
            workingMembers,
            idleMembers,
            department: firstEntry.department,
            manager: firstEntry.manager,
          };
        });
        setTeamData(teamData);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);
  const csvHeaders = [
    { label: "Team", key: "teamName" },
    { label: "Members", key: "members" },
    { label: "Working", key: "workingMembers" },
    { label: "Idle", key: "idleMembers" },
    { label: "Department", key: "department" },
    { label: "Manager", key: "manager" },
  ];

  return (
    <DashboardLayout>
    <DashboardNavbar />
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          marginBottom: "10px",
        }}
      > 
        <Box>
          <Box sx={{ position: "relative", marginRight: 1 }}>
            <MDButton
              variant="gradient"
              color="success"
              type="button"
              onClick={handleDrawerOpen}
              style={{
                padding: "6px 12px", // Adjusted padding
                fontSize: "0.7rem", // Adjusted font size
                borderRadius: "24px",
                textAlign: "center",
                minHeight: "10px", // Adjust the height as needed
                minWidth: "120px", // Adjust the width as needed  
              }}
            >
              <AddIcon style={{ marginRight: 2 }} />Add employee
            </MDButton>
          </Box>
          {/* The rest of your buttons */}
        </Box>
        
        <CSVLink
          data={teamData}
          headers={csvHeaders}
          filename={"team_data.csv"}
        >
          <MDButton
            // style={{ color: 'green' }}
            variant="gradient"
            color="success"
            type="button"
            style={{
              padding: "6px 12px", // Adjusted padding
              fontSize: "0.7rem", // Adjusted font size
              borderRadius: "24px",
              textAlign: "center",
              minHeight: "10px", // Adjust the height as needed
              minWidth: "120px", // Adjust the width as needed  
            }}
          >
            Export to CSV <GetApp style={{ marginLeft: 5 }} />
          </MDButton>
        </CSVLink>
        <div>
          <IconButton onClick={handleMenuClick}>
            <MoreVert />
          </IconButton>
          <Menu
            id="simple-menu"
            anchorEl={menu}
            anchorOrigin={{
              vertical: "top",
              horizontal: "right", // Adjusted for top-right corner
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            open={Boolean(menu)}
            onClose={handleMenuClose}
          >
            <MenuItem onClick={handleAdditionalOption}>Export CSV</MenuItem>
            <MenuItem onClick={handleAdditionalOption}>Help</MenuItem>
          </Menu>
        </div>
      </div>
      <TableContainer component={Paper}>
        <Table className="color">
          <TableHead>
            <TableRow>
              <TableCell
                style={{
                  color: "rgb(123, 128, 154)",
                  fontFamily: "Roboto, Helvetica, Arial, sans-serif",
                  fontWeight: 600,
                  fontSize: "0.80rem",
                  textTransform: "uppercase",
                  width: "14%",
                }}
              >
                user id
              </TableCell>
              <TableCell
                style={{
                  color: "rgb(123, 128, 154)",
                  fontFamily: "Roboto, Helvetica, Arial, sans-serif",
                  fontWeight: 600,
                  fontSize: "0.80rem",
                  textTransform: "uppercase",
                  width: "14%",
                }}
              >
                Name
              </TableCell>
              <TableCell
                style={{
                  color: "rgb(123, 128, 154)",
                  fontFamily: "Roboto, Helvetica, Arial, sans-serif",
                  fontWeight: 600,
                  fontSize: "0.80rem",
                  textTransform: "uppercase",
                  width: "14%",
                }}
              >
                Email id
              </TableCell>
              <TableCell
                style={{
                  color: "rgb(123, 128, 154)",
                  fontFamily: "Roboto, Helvetica, Arial, sans-serif",
                  fontWeight: 600,
                  fontSize: "0.80rem",
                  textTransform: "uppercase",
                  width: "14%",
                }}
              >
                Department
              </TableCell>
              <TableCell
                style={{
                  color: "rgb(123, 128, 154)",
                  fontFamily: "Roboto, Helvetica, Arial, sans-serif",
                  fontWeight: 600,
                  fontSize: "0.80rem",
                  textTransform: "uppercase",
                  width: "14%",
                }}
              >
                Manager
              </TableCell>
              <TableCell
                style={{
                  color: "black",
                  fontFamily: "Roboto, Helvetica, Arial, sans-serif",
                  fontWeight: 600,
                  fontSize: "0.80rem",
                  textTransform: "uppercase",
                  width: "14%",
                }}
              >
                Actions
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {teamData.map((team) => (
              <TableRow key={team.teamName}>
                <TableCell
                  style={{
                  color: "rgb(123, 128, 154)",
                  fontFamily: "Roboto, Helvetica, Arial, sans-serif",
                  fontWeight: 600,
                  fontSize: "0.80rem",
                  textTransform: "uppercase",
                  }}
                >
                  {team.teamName}
                </TableCell>
                <TableCell
                  style={{
                    color: "rgb(123, 128, 154)",
                  fontFamily: "Roboto, Helvetica, Arial, sans-serif",
                  fontWeight: 600,
                  fontSize: "0.80rem",
                  textTransform: "uppercase",
                  }}
                >
                  {team.members}
                </TableCell>
                <TableCell
                  style={{
                    color: "rgb(123, 128, 154)",
                  fontFamily: "Roboto, Helvetica, Arial, sans-serif",
                  fontWeight: 600,
                  fontSize: "0.80rem",
                  textTransform: "uppercase",
                  }}
                >
                  {team.workingMembers}
                </TableCell>
                <TableCell
                  style={{
                    color: "rgb(123, 128, 154)",
                  fontFamily: "Roboto, Helvetica, Arial, sans-serif",
                  fontWeight: 600,
                  fontSize: "0.80rem",
                  textTransform: "uppercase",
                  }}
                >
                  {team.idleMembers}
                </TableCell>
                <TableCell
                  style={{
                    color: "rgb(123, 128, 154)",
                  fontFamily: "Roboto, Helvetica, Arial, sans-serif",
                  fontWeight: 600,
                  fontSize: "0.80rem",
                  textTransform: "uppercase",
                  }}
                >
                  {team.department}
                </TableCell>
                <TableCell
                  style={{
                    color: "rgb(123, 128, 154)",
                  fontFamily: "Roboto, Helvetica, Arial, sans-serif",
                  fontWeight: 600,
                  fontSize: "0.80rem",
                  textTransform: "uppercase",
                  }}
                >
                  {team.manager}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
    </DashboardLayout>
  );
};
// Rest of your code remains the same
export default TeamTable;