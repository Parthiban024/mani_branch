import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";
import MDInput from "components/MDInput";
import * as React from "react";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import Box from "@mui/material/Box";
// import FormControl from "@mui/material/FormControl";
// import Select from "@mui/material/Select";
import { useState, useEffect, useMemo } from "react";
import "react-datepicker/dist/react-datepicker.css";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import axios from "axios";
import moment from "moment";
// import { height } from "@mui/system";

function AdminReport() {
  const initialValues = {
    startDate: "",
    endDate: "",
    team: "",
  };
  const [values, setValues] = useState(initialValues);
  const [name, setName] = useState([]);
  const [empName, setEmpName] = useState(null);
  const [teamList, setTeamList] = useState(null);
  const [report, setReport] = useState([]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setValues({  
      ...values,
      [name]: value,
    });
  };
  const handleChange = (event, value) => setEmpName(value);
  const handleTeamChange = (event, value) => setTeamList(value);

  // const allReport = (e) =>{
    axios.get('analyst/')
    .then((res)=>{
      setReport(res.data);
    })
    .catch((err)=>console.log(err));
  // }
// console.log(values.endDate)
// console.log(empName)

  const handleSubmit = (e) => {
    e.preventDefault();
    const userData = {
      startDate: values.startDate,
      endDate: values.endDate,
      empname: empName,
      team: teamList,
    };
    console.log(userData);

    const sDate = values.startDate;
    const eDate = values.endDate;
    const name = empName;
    const  team  = teamList;
    // console.log(name !== "");
    if(name==null&&team==null){
      axios.get('analyst/fetch/report/date/?sDate='+sDate+'&eDate='+eDate)
      .then((res)=>{
        setReport(res.data);
      })
      .catch(err=>console.log(err))
    }
     else if (name === null) {
      axios
        .get(`analyst/fetch/report/team/?sDate=${sDate}&eDate=${eDate}&team=${team}`)
        .then((res) => {
          // console.log(res.data);
          setReport(res.data);
        })
        .catch((err) => console.log(`Error:${err}`));
    } else if (team === null) {
      axios
        .get(`analyst/fetch/report/user/?sDate=${sDate}&eDate=${eDate}&name=${name}`)
        .then((res) => {
          // console.log(res.data);
          setReport(res.data);
        })
        .catch((err) => console.log(`Error:${err}`));
    } else {
      axios
        .get(`analyst/fetch/report/?sDate=${sDate}&eDate=${eDate}&name=${name}&team=${team}`)
        .then((res) => {
          // console.log(res.data);
          setReport(res.data);
        })
        .catch((err) => console.log(`Error:${err}`));
    }
  };

  useEffect(() => {
    userName();
  }, []);

  const userName = () => {
    axios.get("authentication/user/users").then((res) => {
      setName(res.data);
    });
    // console.log(name);
  };

  // tabel report
  const columns = [
    { field: "id", headerName: "ID", width: 50 },
    {
      field: "name",
      headerName: "Name",
      width: 200,
      editable: false,
      flex: 1,
    },
    {
      field: "team",
      headerName: "Team",
      width: 150,
      editable: false,
      flex: 1,
    },
    {
      field: "date",
      headerName: "Date",
      // type: 'date',
      width: 130,
      editable: false,
      flex: 1,
    },
    {
      field: "projectName",
      headerName: "Project Name",
      // type: 'time',
      width: 150,
      editable: false,
      flex: 1,
    },
    {
      field: "task",
      headerName: "Task",
      // type: 'number',
      width: 150,
      editable: false,
      flex: 1,
    },
    {
      field: "managerTask",
      headerName: "Project Manager",
      // type: 'number',
      width: 150,
      editable: false,
      flex: 1,
    },
    {
      field: "sessionOne",
      headerName: "Hours",
      // type: 'number',
      width: 150,
      editable: false,
      flex: 1,
    },
    // {
    //   field: "sessionTwo",
    //   headerName: "Session Two",
    //   // type: 'number',
    //   width: 150,
    //   editable: false,
    //   flex: 1,
    // },
    // {
    //   field: "others",
    //   headerName: "Others",
    //   // type: 'number',
    //   width: 150,
    //   editable: false,
    //   flex: 1,
    // },
    // {
    //   field: "comments",
    //   headerName: "Comments",
    //   // type: 'number',
    //   width: 150,
    //   editable: false,
    //   flex: 1,
    // },
    // {
    //   field: "total",
    //   headerName: "Toltal Hours",
    //   // type: 'number',
    //   width: 150,
    //   editable: false,
    //   flex: 1,
    // },
  ];
  const row = useMemo(
    () =>
      report.map((item, index) => ({
        ...item,
        id: index + 1,
        name: item.name,
        team: item.team,
        date: moment(item.createdAt).format("DD-MM-YYYY"),
        // TotalTime: moment
        //   .utc(moment.duration(item.TotalTime, "seconds").as("milliseconds"))
        //   .format("HH:mm:ss"),
        // ActiveTime: moment
        //   .utc(moment.duration(item.ActiveTime, "seconds").as("milliseconds"))
        //   .format("HH:mm:ss"),
        // EntityTime: moment
        //   .utc(moment.duration(item.EntityTime, "seconds").as("milliseconds"))
        //   .format("HH:mm:ss"),
        projectName: item.projectName,
        task: item.task,
        managerTask: item.managerTask,
        sessionOne: item.sessionOne,
        // sessionTwo: item.sessionTwo,
        // others: item.others,
        // comments: item.comments,
        // total: item.total,
      })),
    [report]
  );

  // Team List
  const list = [
    "CV",
    "NLP",
    "CM",
  ];

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <Grid item xs={12} mt={3} mb={10}>
        <Card>
          <MDBox component="form" role="form" onSubmit={handleSubmit}>
            {/* <MDBox
              mx={2}
              // mt={-3}
              py={3}
              pt={3}
              px={2}
              variant="gradient"
              bgColor="info"
              borderRadius="lg"
              coloredShadow="info"
            >
              <MDTypography variant="h6" color="white">
                Reports
              </MDTypography>
            </MDBox> */}
            <MDBox pt={3} px={3} display="flex" justifycontent="space-evenly" alignItems="center">
              <Grid container spacing={3}>
                {/* <Grid item xs={12} md={4}> */}
                <Grid item xs={3} md={2}>
                  <MDTypography variant="h6" fontWeight="medium">
                    Start Date
                  </MDTypography>
                  <MDInput
                    type="date"
                    name="startDate"
                    value={values.startDate}
                    onChange={handleInputChange}
                  />
                </Grid>
                <Grid item xs={3} md={2}>
                  <MDTypography variant="h6" fontWeight="medium">
                    End Date
                  </MDTypography>
                  <MDInput
                    type="date"
                    name="endDate"
                    value={values.endDate}
                    onChange={handleInputChange}
                  />
                </Grid>
                <Grid item xs={1} md={3}>
                  <MDTypography variant="h6" fontWeight="medium">
                    Team
                  </MDTypography>
                  <Autocomplete
                    disablePortal
                    id="combo-box-demo"
                    options={list}
                    onChange={handleTeamChange}
                    sx={{ width: 200 }}
                    renderInput={(params) => <TextField {...params} />}
                  />
                </Grid>
                <Grid item xs={1} md={2}>
                  <MDTypography variant="h6" fontWeight="medium">
                    Name
                  </MDTypography>
                  <Autocomplete
                    id="combo-box-demo"
                    options={name.map((option) => option.name)}
                    onChange={handleChange}
                    renderInput={(params) => <TextField {...params} size="medium" />}
                    // sx={{ width: "180px" }}
                    sx={{ width: 200 }}
                  />
                </Grid>
                <Grid item xs={1} md={2}>
                  <MDBox
                    pt={4}
                    pb={3}
                    // px={2}
                    display="flex"
                    justifyContent="end"
                    alignItems="center"
                  >
                    <MDButton variant="outlined" color="error" type="submit">
                      &nbsp;Search
                    </MDButton>
                  </MDBox>
                  {/* <MDBox pt={3} pb={3} display="flex" justifyContent="end" alignItems="center">
              <MDButton
                variant="gradient"
                color="error"
                // onClick={allReport}
                // onClick={() => setShow(!show)}
              >
                &nbsp;Get All Report
              </MDButton>
            </MDBox> */}
                </Grid>
              </Grid>
            </MDBox>

          </MDBox>
        </Card>

        <MDBox pt={1}>
          <Grid item xs={12}>
            <Card>
              {/* <MDBox
                mx={2}
                mt={-3}
                py={3}
                px={2}
                variant="gradient"
                bgColor="info"
                borderRadius="lg"
                coloredShadow="info"
              >
                <MDTypography variant="h6" color="white">
                  Reports Table
                </MDTypography>
              </MDBox> */}
              <MDBox pt={0}>
                {/* <Datatable tableHead={mytableHead} dataSrc={mydataSrc} /> */}
                {/* <DataTable
                  table={{ columns, rows }}
                  isSorted={false}
                  entriesPerPage={false}
                  showTotalEntries={false}
                  noEndBorder
                /> */}
                <Box sx={{ height: 400, width: "100%" }}>
                  <DataGrid
                    rows={row}
                    columns={columns}
                    pageSize={10}
                    rowsPerPageOptions={[10]}
                    checkboxSelection
                    disableSelectionOnClick
                    components={{ Toolbar: GridToolbar }}
                  />
                </Box>
              </MDBox>
            </Card>
          </Grid>
        </MDBox>
      </Grid>
      <Footer />
    </DashboardLayout>
  );
}
export default AdminReport;
