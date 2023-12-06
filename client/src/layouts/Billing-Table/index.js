import * as React from "react";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import InputLabel from "@mui/material/InputLabel";
import Grid from "@mui/material/Grid";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import axios from "axios";
import Drawer from "@mui/material/Drawer";
import moment from "moment";
import Card from "@mui/material/Card";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";
import MDInput from "components/MDInput";
import { useState, useEffect, useMemo } from "react";
import "react-datepicker/dist/react-datepicker.css";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import EditIcon from "@mui/icons-material/Edit";
import { Link } from "react-router-dom";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import TableFooter from "@mui/material/TableFooter";
import DownloadIcon from "@mui/icons-material/Download";
import CloseIcon from "@mui/icons-material/Close";
import { CSVLink } from "react-csv";
import SaveAltIcon from "@mui/icons-material/SaveAlt";
import { ToastContainer, toast } from "react-toastify";
import { useSelector } from "react-redux";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import FilterListIcon from "@material-ui/icons/FilterList";
import DialogActions from "@mui/material/DialogActions";
import { useHistory } from "react-router-dom";

import "layouts/Billing-Table/table.css";

const columns = [
  { id: "jmanagerTeam", label: "Manager", minWidth: 100 },
  { id: "jstatus1", label: "Status", minWidth: 100 },
  { id: "jcDate", label: "EndDate", minWidth: 100 },
  { id: "action", label: "    Action", minWidth: 50 },
];

function createData(
  date,
  team,
  projectname,
  batch,
  jmanagerTeam,
  jstatus1,
  jcDate
) {
  return {
    date,
    team,
    batch,
    projectname,
    jmanagerTeam,
    jstatus1,
    jcDate,
  };
}

const rowData = [];

axios
  .get("/billing/")
  .then((res) => rowData[res.data])
  .catch((err) => console.log(err));
console.log(rowData);

const rows = [
  rowData.map((item, index) => {
    createData(
      item.reportDate,
      item.team,
      item.projectname,
      item.batch,
      item.jobs.managerTeam,
      item.jobs.status1,
      item.jobs.cDate
    );
  }),
];

export default function ColumnGroupingTable() {
  // drawer code

  const [count, setCount] = useState({ aTotal: "" });
  const [bill, setBill] = useState({
    tDate: "",
    team: "",
    projectname: "",
    batch: "",
    jobs: {
      managerTeam: "",
      status1: "",
      cDate: "",
    },
  });

  const [drawerOpen, setDrawerOpen] = useState(false);

  const openDrawer = () => {
    setDrawerOpen(true);
  };

  const closeDrawer = () => {
    setDrawerOpen(false);
  };

  const [filterDialogOpen, setFilterDialogOpen] = useState(false);

  const openFilterDialog = () => {
    setFilterDialogOpen(true);
  };

  const closeFilterDialog = () => {
    setFilterDialogOpen(false);
  };
  const handleCancel = () => {
    setValues(initialValues);
    setTeamList(null);

    // Close the filter popup
    closeFilterDialog();
  };

  const empId = useSelector((state) => state.auth.user.empId);
  const name = useSelector((state) => state.auth.user.name);

  const [teamList, setTeamList] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setBill({
      ...bill,
      [name]: value,
      team: teamList,
      // managerTeam: managerTeamList,
      // status1: status,
    });
  };

  const handleTeamChange = (event, value) => setTeamList(value);

  const handleManagerTeamChange = (event, value) => {
    setBill({
      ...bill,
      jobs: {
        ...bill.jobs,
        managerTeam: event.target.value,
      },
    });
  };

  const handleStatusChange = (event) => {
    setBill({
      ...bill,
      jobs: {
        ...bill.jobs,
        status1: event.target.value,
      },
    });
  };

  useEffect(() => {
    setCount({
      ...count,
    });
  }, [bill]);
  const list = ["CV", "NLP", "CM", "Sourcing"];
  const submit = (e) => {
    e.preventDefault();
    const billData = {
      name: name,
      team: bill.team,
      empId: empId,
      batch: bill.batch,
      reportDate: bill.tDate,
      projectname: bill.projectname,
      jobs: {
        managerTeam: bill.jobs.managerTeam,
        status1: bill.jobs.status1,
        cDate: bill.jobs.cDate,
      },
    };
    axios
      .post("/billing/new", billData)
      .then((res) => toast.success(res.data))
      // .then(() => (window.location = "/project-report"))
      .catch((err) => toast.error(err));
    closeDrawer();
    // console.log(bill.tDate)
  };

  // drawer code end

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [data, setData] = useState([]);
  const [total, setTotal] = useState({
    countTotal: 0,
    hoursTotal: 0,
    jobTotal: 0,
  });

  const headers = [
    { label: "Date", key: "reportDate" },
    { label: "Team", key: "team" },
    { label: "Projectname", key: "projectname" },
    { label: "Members", key: "batch" },
    { label: "Total Jobs worked on | Manager", key: "jobs.managerTeam" },
    { label: "Total Jobs worked on | Status", key: "jobs.status1" },
    { label: "Total Jobs worked on | EndDate", key: "jobs.cDate" },
  ];

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  useEffect(() => {
    var countTotal = 0;
    let activeCount = 0;
    let completedCount = 0;
    let projectTotal = 0;

    data.map((item) => {
      projectTotal += item.projectname ? 1 : 0;
      if (item.jobs.status1 === "Active") {
        activeCount++;
      } else if (item.jobs.status1 === "Completed") {
        completedCount++;
      }
    });

    setTotal({
      ...total,
      activeCount,
      completedCount,
      projectTotal,
    });
  }, [data]);

  // React.useEffect(()=>{
  //   axios.get("/billing/")
  //   .then((res)=>setData(res.data))
  //   .catch(err=>console.log(err))
  // },[])

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };
  const handleDelete = (id) => {
    axios
      .delete("/billing/" + id)
      .then((res) => toast.warn(res.data))
      .catch((err) => console.log(err));
    setData(data.filter((el) => el._id !== id));
  };

  // card
  const initialValues = {
    startDate: "",
    endDate: "",
    team: "",
  };
  const [values, setValues] = useState(initialValues);

  const [teamlist, setTeamlist] = useState(null);
  // const [report, setReport] = useState([]);

  const handleInputchange = (e) => {
    const { name, value } = e.target;

    setValues({
      ...values,
      [name]: value,
    });
  };
  // const handleChange = (event, value) => setEmpName(value);
  const handleTeamchange = (event, value) => setTeamlist(value);

  const handleSubmit = (e) => {
    e.preventDefault();

    const sDate = values.startDate;
    const eDate = values.endDate;
    const team = teamlist;

    if (team == null) {
      axios
        .get("billing/fetch/date/?sDate=" + sDate + "&eDate=" + eDate)
        .then((res) => {
          setData(res.data);
        })
        .catch((err) => console.log(err));
    } else {
      axios
        .get(
          "billing/fetch/report/?sDate=" +
            sDate +
            "&eDate=" +
            eDate +
            "&team=" +
            team
        )
        .then((res) => {
          // console.log(res.data);
          setData(res.data);
        })
        .catch((err) => console.log(`Error:${err}`));
    }
  };
  const allReport = (e) => {
    axios
      .get("/billing/")
      .then((res) => setData(res.data))
      .catch((err) => console.log(err));
  };

  // Team List
  const List = ["CV", "NLP", "CM", "Sourcing"];
  return (
    <DashboardLayout>
      <DashboardNavbar />
      <div
        style={{
          display: "flex",
          justifyContent: "end",
        }}
      >
        <MDButton
          variant="gradient"
          color="success"
          startIcon={<AddCircleOutlineIcon />}
          onClick={openDrawer}
          style={{
            display: "flex",
            justifyContent: "center",
            fontSize: "0.7rem",
            borderRadius: "10px",
            textAlign: "center",
            minHeight: "10px",
            minWidth: "120px",
          }}
        >
          Add Project
        </MDButton>
      </div>
      <Drawer
        anchor="right"
        PaperProps={{ style: { width: 712 } }}
        open={drawerOpen}
        onClose={closeDrawer}
      >
        <MDBox
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2,
          }}
        >
          <Typography variant="h6">New Project</Typography>
          <IconButton
            sx={{ position: "absolute", top: 10, right: 0 }}
            onClick={closeDrawer}
          >
            <CloseIcon />
          </IconButton>
        </MDBox>

        <MDBox pb={5} component="form" role="form" onSubmit={submit}>
          <MDBox
            sx={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              mt: 1,
            }}
          >
            <MDBox>
              <InputLabel sx={{ mt: 1, ml: 2 }} htmlFor="project-name">
                Project Name
              </InputLabel>
              <TextField
                sx={{ width: 305, mt: 1, ml: 2 }}
                id="project-name"
                variant="outlined"
                fullWidth
                name="projectname"
                value={bill.projectname}
                onChange={handleInputChange}
                required
              />
            </MDBox>
            <MDBox sx={{ width: 730, ml: 2, mt: 1 }}>
              <InputLabel htmlFor="department">Department</InputLabel>
              <Autocomplete
                disablePortal
                id="department"
                options={list}
                onChange={handleTeamChange}
                sx={{
                  width: 280,
                  mt: 1,
                  "& .MuiOutlinedInput-root": {
                    padding: 0.5,
                  },
                }}
                renderInput={(params) => <TextField {...params} />}
              />
            </MDBox>
          </MDBox>
          <MDBox
            sx={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              mt: 1,
            }}
          >
            <InputLabel sx={{ mt: 1, ml: 2 }} htmlFor="manager">
              Manager
            </InputLabel>
            <InputLabel sx={{ mt: 2, mr: 25 }} htmlFor="members">
              No.of.Resources
            </InputLabel>
          </MDBox>
          <MDBox sx={{ p: 1, ml: 1 }}>
            <TextField
              sx={{ width: 305 }}
              select
              fullWidth
              id="manager"
              name="managerTeam"
              value={bill.jobs.managerTeam}
              required
              onChange={handleManagerTeamChange}
              variant="outlined"
              InputLabelProps={{ shrink: true }}
              SelectProps={{
                native: true,
              }}
            >
              <option value="">Select Manager</option>
              <option value="Balamurugan">Balamurugan</option>
              <option value="Rajesh">Rajesh</option>
              <option value="Naveen">Naveen</option>
              <option value="Sowmiya">Sowmiya</option>
            </TextField>

            <TextField
              sx={{ width: 280, ml: 2 }}
              type="number"
              id="members"
              variant="outlined"
              fullWidth
              name="batch"
              value={bill.batch}
              onChange={handleInputChange}
            />
          </MDBox>
          <MDBox
            sx={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              mt: 1,
            }}
          >
            <InputLabel sx={{ mt: 2, ml: 2 }} htmlFor="start-date">
              Start date
            </InputLabel>
            <InputLabel sx={{ mt: 2, mr: 30.5 }} htmlFor="end-date">
              End date
            </InputLabel>
          </MDBox>
          <MDBox sx={{ display: "flex", flexDirection: "row", mt: 1 }}>
            <TextField
              sx={{ width: 685, ml: 2, mr: 2 }}
              type="date"
              variant="outlined"
              id="start-date"
              fullWidth
              name="tDate"
              value={bill.tDate}
              onChange={handleInputChange}
              required
            />
            <TextField
              sx={{ width: 620, mr: 2.5 }}
              type="date"
              variant="outlined"
              id="end-date"
              fullWidth
              name="cDate"
              value={bill.cDate}
              onChange={handleInputChange}
              required
              disabled
            />
          </MDBox>
          <MDBox sx={{ width: 200, p: 1, mt: 3, ml: 1 }}>
            <InputLabel htmlFor="status">Status</InputLabel>
            <TextField
              sx={{ width: 610, mt: 1, mr: 1 }}
              select
              fullWidth
              id="status"
              name="status1"
              value={bill.jobs.status1}
              required
              onChange={handleStatusChange}
              variant="outlined"
              InputLabelProps={{ shrink: true }}
              SelectProps={{
                native: true,
              }}
            >
              <option value="">Select Status</option>
              <option value="POC">POC</option>
              <option value="In-Progress">In Progress</option>
              <option value="Completed-Won">Completed Won</option>
              <option value="Completed-Lost">Completed Lost</option>
            </TextField>
          </MDBox>
          <MDBox
            pt={1}
            px={1}
            display="flex"
            justifycontent="center"
            alignItems="center"
          >
            <Grid>
              <Grid>
                <MDBox
                  pt={1}
                  pb={1}
                  px={2}
                  display="flex"
                  justifyContent="center"
                  alignItems="center"
                >
                  <MDButton variant="gradient" color="success" type="submit">
                    &nbsp;Save
                  </MDButton>
                </MDBox>
              </Grid>
            </Grid>
          </MDBox>
        </MDBox>
      </Drawer>
      <Grid item xs={12} mt={4} mb={1}>
        <Card>
          <Dialog
            open={filterDialogOpen}
            onClose={closeFilterDialog}
            fullWidth
            maxWidth="md"
          >
            <DialogTitle sx={{ textAlign: "left" }}>
              Your Dialog Title
            </DialogTitle>
            <DialogContent>
              <MDBox
                component="form"
                role="form"
                onSubmit={handleSubmit}
                className="filter-popup"
              >
                <Grid container spacing={3}>
                  {/* Row 1: Start Date and End Date */}
                  <Grid item xs={6}>
                    <MDTypography variant="h6" fontWeight="medium">
                      Start Date
                    </MDTypography>
                    <MDInput
                      type="date"
                      name="startDate"
                      sx={{ width: "100%" }}
                      value={values.startDate}
                      onChange={handleInputchange}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <MDTypography variant="h6" fontWeight="medium">
                      End Date
                    </MDTypography>
                    <MDInput
                      type="date"
                      name="endDate"
                      sx={{ width: "100%" }}
                      value={values.endDate}
                      onChange={handleInputchange}
                    />
                  </Grid>

                  {/* Row 2: Team and Name */}
                  <Grid item xs={6}>
                    <MDTypography variant="h6" fontWeight="medium">
                      Team
                    </MDTypography>
                    <Autocomplete
                      disablePortal
                      id="combo-box-demo"
                      options={list}
                      onChange={handleTeamchange}
                      sx={{ width: "100%" }}
                      renderInput={(params) => <TextField {...params} />}
                    />
                  </Grid>

                  {/* Row 3: Search Button */}
                  <Grid item xs={12}>
                    <Box
                      display="flex"
                      justifyContent="center"
                      alignItems="center"
                      pt={3}
                    >
                      <MDButton
                        variant="gradient"
                        size="small"
                        color="success"
                        type="submit"
                      >
                        Search
                      </MDButton>
                      <MDButton
                        variant="gradient"
                        size="small"
                        color="warning"
                        onClick={handleCancel}
                        style={{ marginLeft: "10px" }}
                      >
                        Cancel
                      </MDButton>
                    </Box>
                  </Grid>
                </Grid>
              </MDBox>
            </DialogContent>
          </Dialog>
        </Card>
      </Grid>
      <Grid item xs={12} mt={1} mb={10}>
        <Paper sx={{ width: "100%" }}>
          <TableContainer sx={{ maxHeight: 740 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell align="left" colSpan={2}>
                    <MDButton
                      type="submit"
                      color="info"
                      variant="outlined"
                      size="small"
                      style={{ marginRight: "13px" }}
                    >
                      <CSVLink
                        data={data}
                        filename={"Billing.csv"}
                        headers={headers}
                      >
                        <MDTypography variant="outlined" color="info">
                          <SaveAltIcon /> Export
                        </MDTypography>
                      </CSVLink>
                    </MDButton>
                    <MDButton
                      type="submit"
                      onClick={openFilterDialog}
                      color="info"
                      variant="outlined"
                      size="small"
                    >
                      <FilterListIcon
                        className="team-filter-icon"
                        style={{
                          cursor: "pointer",
                          color: "#3a87ea",
                          fontSize: "20px",
                        }}
                        onClick={openFilterDialog}
                        aria-label="Team Filter"
                      />
                      <MDTypography
                        variant="h6"
                        onClick={openFilterDialog}
                        style={{
                          color: "#3a87ea",
                          cursor: "pointer",
                          fontSize: "12.1px",
                          marginRight: "10px",
                        }}
                      >
                        TEAM FILTER
                      </MDTypography>
                    </MDButton>
                  </TableCell>
                  <TableCell align="right" colSpan={2}>
                    <MDButton
                      className="team-report-btn"
                      variant="outlined"
                      color="error"
                      size="small"
                      onClick={allReport}
                    >
                      &nbsp;All Report
                    </MDButton>
                  </TableCell>
                </TableRow>
              </TableHead>
            </Table>
            <Table>
              <TableHead sx={{ display: "table-header-group !important" }}>
                <TableRow>
                  <TableCell align="center" minwidth={150} rowSpan={2}>
                    Date
                  </TableCell>
                  <TableCell align="center" rowSpan={2}>
                    Team
                  </TableCell>
                  <TableCell align="center" rowSpan={2}>
                    No.of.Members
                  </TableCell>
                  <TableCell align="center" rowSpan={2}>
                    Projectname
                  </TableCell>
                </TableRow>
                <TableRow>
                  {columns.map((column) => (
                    <TableCell
                      key={column.id}
                      align={column.align}
                      style={{ top: 57, minwidth: column.minwidth }}
                    >
                      {column.label}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {data
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((item, index) => {
                    return (
                      <TableRow
                        hover
                        role="checkbox"
                        tabIndex={-1}
                        key={index}
                        align="center"
                      >
                        <TableCell align="center">
                          {moment(item.reportDate).format("DD/MM/YYYY")}
                        </TableCell>
                        <TableCell align="center">{item.team}</TableCell>
                        <TableCell align="center">{item.batch}</TableCell>
                        <TableCell align="center">{item.projectname}</TableCell>
                        <TableCell>{item.jobs?.managerTeam}</TableCell>
                        <TableCell>{item.jobs?.status1}</TableCell>
                        <TableCell>
                          {" "}
                          {moment(item.jobs?.cDate).format("DD/MM/YYYY")}
                        </TableCell>

                        <TableCell>
                          <Link to={"/project-entry/edit/" + item._id}>
                            <IconButton aria-label="edit">
                              <EditIcon />
                            </IconButton>{" "}
                          </Link>
                          |
                          <IconButton
                            onClick={(e) => handleDelete(item._id)}
                            color="error"
                            aria-label="delete"
                          >
                            <DeleteIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    );
                  })}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[10, 25, 100]}
            component="div"
            count={data.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Paper>
      </Grid>
      <Footer />
      <ToastContainer />
    </DashboardLayout>
  );
}
