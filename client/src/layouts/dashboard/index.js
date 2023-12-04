import Grid from "@mui/material/Grid";
import MDBox from "components/MDBox";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import Card from "@mui/material/Card";
import MDButton from "components/MDButton/index";
import MDInput from "components/MDInput";
import * as React from "react";
import MDTypography from "components/MDTypography";
import ComplexStatisticsCard from "examples/Cards/StatisticsCards/ComplexStatisticsCard";
import papa from "papaparse";
import convert from "convert-seconds-to-human";
import TextareaAutosize from "@mui/material/TextareaAutosize";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import Drawer from "@mui/material/Drawer";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import CloseIcon from "@mui/icons-material/Close";
import IconButton from "@mui/material/IconButton";

function Dashboard() {
  const [data, setData] = useState([]);
  const [disable, setDisable] = useState(true);
  // const [seconds, setSeconds] = useState({ TotalTime: "", ActiveTime: "", EntityTime: "" });
  // const [timeData, setTimeData] = useState({ TotalTime: "", ActiveTime: "", EntityTime: "" });
  // const [count, setCount] = useState({ aTotal: "" });
  const [teamList, setTeamList] = useState([]);
  const [taskList, setTaskList] = useState([]);
  const [projectNames, setProjectNames] = useState([]);
  const [managers, setManagers] = useState([]);
  const name = useSelector((state) => state.auth.user.name);
  const empId = useSelector((state) => state.auth.user.empId);
  const initialValues = {
    team: "",
    projectName: "",
    task: "",
    managerTask: "",
    dateTask: "",
    sessionOne: 0,
    sessionTwo: 0,
    others: 0,
    comments: "",

  };
  const [values, setValues] = useState(initialValues);
  const handleTeamChange = (event, value) => setTeamList(value);
  const handleTaskChange = (event, value) => setTaskList(value);
  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setValues({
      ...values,
      [name]: value,
    });
  };
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Function to handle opening the drawer
  const openDrawer = () => {
    setDrawerOpen(true);
  };

  // Function to handle closing the drawer
  const closeDrawer = () => {
    setDrawerOpen(false);
  };

  // Define getCurrentDate function
  const getCurrentDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    let month = today.getMonth() + 1;
    let day = today.getDate();

    month = month < 10 ? `0${month}` : month;
    day = day < 10 ? `0${day}` : day;

    return `${year}-${month}-${day}`;
  };

  useEffect(() => {
    axios.get("/billing/").then((response) => {
      const projects = response.data.map((item) => item.projectname);
      const managers = response.data.map((item) => item.jobs?.managerTeam).filter(Boolean);

      setProjectNames(projects);
      setManagers(managers);

      const currentDate = getCurrentDate();

      // Find the selected project in the response data
      const selectedProject = response.data.find((item) => item.projectname === values.projectName);

      if (selectedProject) {
        const projectManager = selectedProject.jobs?.managerTeam;
        const projectTeam = selectedProject.team; // Assuming the team information is available in the API response

        setValues((prevValues) => ({
          ...prevValues,
          dateTask: currentDate,
          managerTask: projectManager || '',
          team: projectTeam || '', // Set the team based on the selected project
        }));
      } else {
        // Reset date, manager, and team when another project name is selected
        setValues((prevValues) => ({
          ...prevValues,
          dateTask: '',
          managerTask: '',
          team: '', // Reset team value
        }));
      }
    });
  }, [values.projectName]);







  // file handling         29/11/2023
  // const handlingFileUpload = (e) => {
  //   const { files } = e.target;
  //   setData([]);
  // console.log(files);
  // console.log(files[0]);
  //   papa.parse(files[0], {
  //     header: true,
  //     column: true,
  //     complete(results) {
  //       setData((existing) => [...existing, ...results.data]);
  //       return results.data;
  //     },
  //   });
  //   disable?setDisable(!disable):null
  // };

  // file handling
  // const handlingFileUpload = (e) => {
  //   const { files } = e.target;
  //   setData([]);
  //   papa.parse(files[0], {
  //     header: true,
  //     column: true,
  //     complete(results) {
  //       setData((existing) => [...existing, ...results.data]);
  //       return results.data;
  //     },
  //   });
  //   setDisable(!disable); // Updated this line
  // };

  // useEffect(() => {
  //   var assTotal =
  //   values.sessionOne + values.sessionTwo + values.others;
  //   setCount({
  //     ...count,
  //     aTotal: assTotal,
  //   });
  // }, [values]);
  const calculateTotal = (values) => {
    const sessionOne = parseInt(values.sessionOne, 10) || 0;
    const sessionTwo = parseInt(values.sessionTwo, 10) || 0;
    const others = parseInt(values.others, 10) || 0;

    const total = sessionOne + sessionTwo + others;
    return isNaN(total) ? '' : total;
  };

  // Upload Data
  const handleSubmit = (e) => {
    e.preventDefault();
    const userData = {
      name,
      empId,
      team: teamList,
      task: taskList,
      projectName: values.projectName,
      // task: values.task,
      managerTask: values.managerTask,
      dateTask: values.dateTask,
      // dailyLog: values.dailyLog,
      sessionOne: values.sessionOne,
      sessionTwo: values.sessionTwo,
      others: values.others,
      comments: values.comments,
      total: calculateTotal(values),

      // TotalTime: timeData.TotalTime,
      // ActiveTime: timeData.ActiveTime,
      // EntityTime: timeData.EntityTime,
    };

    axios
      .post("/analyst/add", userData)
      .then(() => toast.success("Successfully Data Submitted 👌"))
      .catch((err) => toast.error(`Try Again Followed Error Acquired: ${err}☹️`));

    // console.log(userData);
  };

  // useEffect(() => {
  //   let activeTime = 0;
  //   let totalTime = 0;
  //   let entityTime = 0;
  //   data.map((item) => {
  //     if (item.URL.match(/sagemaker\.aws\/#\/work\//gm) !== null) {
  //       activeTime += Number(item["Active(sec)"]);
  //     }

  //     if (item.URL.match(/inAll/gm) !== null) {
  //       totalTime = Number(item["Active(sec)"]);
  //     }
  //     return null;
  //   });
  //   const active = convert(activeTime, "cal");
  //   const total = convert(totalTime, "cal");
  //   entityTime = totalTime - activeTime;
  //   const entity = convert(entityTime, "cal");
  //   // console.log(Object.keys(data).length);
  //   // console.log(totalTime);
  //   // console.log(activeTime);
  //   // console.log(entityTime);
  //   setSeconds({
  //     TotalTime: total,
  //     ActiveTime: active,
  //     EntityTime: entity,
  //   });
  //   setTimeData({
  //     TotalTime: totalTime,
  //     ActiveTime: activeTime,
  //     EntityTime: entityTime,
  //   });

  // }, [data]);
  // Team List


  const list = [
    "CV",
    "NLP",
    "CM",
  ];

  const tasklist = [
    "Idle",
    "Training",
    "Production",
    "QualityCheck",
    "SpotQC",
    "Guidelines",
    "POC"
  ];
  return (
    <>
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
            // padding: "6px 12px", // Adjusted padding
            fontSize: "0.7rem", // Adjusted font size
            borderRadius: "10px",
            textAlign: "center",
            minHeight: "10px", // Adjust the height as needed
            minWidth: "120px", // Adjust the width as needed
          }}
        >
          Add Project
        </MDButton>
      </div>
        <Drawer anchor="right" open={drawerOpen} onClose={closeDrawer}>
        <IconButton
            sx={{ position: "absolute", top: 10, right: 0 }} // Positioned to the top right corner
            onClick={closeDrawer}
          >
            <CloseIcon />
          </IconButton>
        <Grid item xs={12} mt={1} mb={40}>
          <Card>
            <MDBox pb={5} component="form" role="form" onSubmit={handleSubmit}>
              <MDBox
                mx={2}
                py={3}
                pt={3}
                px={2}
                variant="gradient"
                bgColor="info"
                borderRadius="lg"
                coloredShadow="info"
              >
                <MDTypography variant="h6" color="white">
                  Add Task
                </MDTypography>
              </MDBox>
              <MDBox pb={5} pt={6} px={4} display="flex">
                <Grid
                  container
                  spacing={3}
                  // justifyContent="space-evenly"
                  alignItems="center"
                >
                  {/* First Row */}
                  <Grid item xs={2} md={3}>
                    <MDTypography variant="h6" fontWeight="medium">
                      Date
                    </MDTypography>
                    <MDInput
                      type="date"
                      name="dateTask"
                      value={values.dateTask}
                      onChange={handleInputChange}
                      sx={{ width: 200 }}
                    />
                  </Grid>
                  <Grid item xs={2} md={3}>
                    <MDTypography variant="h6" fontWeight="medium">
                      Select Project Name
                    </MDTypography>
                    <Autocomplete
                      disablePortal
                      id="project-name-autocomplete"
                      options={projectNames}
                      value={values.projectName}
                      onChange={(event, newValue) => {
                        setValues({
                          ...values,
                          projectName: newValue,
                        });
                      }}
                      sx={{ width: 200 }}
                      renderInput={(params) => (
                        <TextField {...params} />
                      )}
                    />
                  </Grid>
                  {/* <Grid item xs={2} md={3}>
                  <MDTypography variant="h6" fontWeight="medium">
                    Team
                  </MDTypography>
                  <Autocomplete
                    disablePortal
                    id="team-autocomplete"
                    options={teamList}
                    value={values.team}
                    onChange={(event, newValue) => {
                      setValues({
                        ...values,
                        team: newValue,
                      });
                    }}
                    renderInput={(params) => (
                      <TextField {...params} label="Team" />
                    )}
                  />
                </Grid> */}

                  {/* Second Row */}
                  <Grid item xs={2} md={3}>
                    <MDTypography variant="h6" fontWeight="medium">
                      Department
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

                  <Grid item xs={2} md={3}>
                    <MDTypography variant="h6" fontWeight="medium">
                      Task
                    </MDTypography>
                    <Autocomplete
                      disablePortal
                      id="combo-box-demo"
                      options={tasklist}
                      onChange={handleTaskChange}
                      sx={{ width: 200 }}
                      renderInput={(params) => <TextField {...params} />}
                    />
                  </Grid>

                  <Grid item xs={2} md={3}>
                    <MDTypography variant="h6" fontWeight="medium">
                      Select Manager
                    </MDTypography>
                    <Autocomplete
                      id="manager-autocomplete"
                      options={managers}
                      value={values.managerTask}
                      onChange={(event, newValue) => {
                        setValues({
                          ...values,
                          managerTask: newValue,
                        });
                      }}
                      sx={{ width: 200 }}
                      renderInput={(params) => <TextField {...params} />}
                    />
                  </Grid>
                </Grid>
              </MDBox>

              <MDBox
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
                  Count of Associates
                </MDTypography>
              </MDBox>
              <MDBox
                pb={5}
                pt={6}
                px={4}
                display="flex"
                justifycontent="space-evenly"
                alignItems="center"
              >
                <Grid container spacing={1}>
                  <Grid item xs={2} md={3}>
                    <MDTypography variant="h6" fontWeight="medium">
                      Session One
                    </MDTypography>
                    <MDInput
                      type="number"
                      name="sessionOne"
                      value={values.sessionOne}
                      onChange={handleInputChange}
                    />
                  </Grid>
                  <Grid item xs={2} md={3}>
                    <MDTypography variant="h6" fontWeight="medium">
                      Session Two
                    </MDTypography>
                    <MDInput
                      type="number"
                      name="sessionTwo"
                      value={values.sessionTwo}
                      onChange={handleInputChange}
                    />
                  </Grid>
                  <Grid item xs={2} md={3}>
                    <MDTypography variant="h6" fontWeight="medium">
                      Others
                    </MDTypography>
                    <MDInput
                      type="number"
                      name="others"
                      value={values.others}
                      onChange={handleInputChange}
                    />
                  </Grid>
                  <Grid item xs={2} md={3}>
                    <MDTypography variant="h6" fontWeight="medium">
                      Comments
                    </MDTypography>
                    <TextareaAutosize
                      aria-label="minimum height"
                      minRows={4}
                      name="comments"
                      value={values.comments}
                      onChange={handleInputChange}
                      // placeholder="Minimum 3 rows"
                      style={{ width: 200 }}
                    />
                  </Grid>
                  <Grid item xs={2} md={3}>
                    <MDTypography variant="h6" fontWeight="medium">
                      Total
                    </MDTypography>
                    <MDInput
                      type="number"
                      name="total"
                      InputProps={{ readOnly: true }}
                      value={calculateTotal(values)}
                      onChange={handleInputChange}
                    />
                  </Grid>
                  <MDBox
                    pt={3}
                    px={2}
                    display="flex"
                    justifyContent="end"
                    alignItems="center"
                  >
                    <MDButton type="submit" color="success">
                      Save
                    </MDButton>
                  </MDBox>
                </Grid>

              </MDBox>
              {/* <Grid item xs={12} lg={11}>
              <MDBox py={6}>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6} lg={4}>
                    <MDBox mb={2.5}>
                      <ComplexStatisticsCard
                        color="warning"
                        icon="work_history"
                        title="Active Time"
                        count={`${seconds.TotalTime.hours}hr:${seconds.TotalTime.minutes}min`}
                        percentage={{
                          color: "success",
                          amount: "",
                          label: "Your over all Active page time",
                        }}
                      />
                    </MDBox>
                  </Grid>
                  <Grid item xs={12} md={6} lg={4}>
                    <MDBox mb={1.5}>
                      <ComplexStatisticsCard
                        icon="more_time"
                        title="Working Time"
                        count={`${seconds.ActiveTime.hours}hr:${seconds.ActiveTime.minutes}min`}
                        percentage={{
                          color: "success",
                          amount: "",
                          label: "your work portal time",
                        }}
                      />
                    </MDBox>
                  </Grid>
                  <Grid item xs={12} md={6} lg={4}>
                    <MDBox mb={1.5}>
                      <ComplexStatisticsCard
                        color="success"
                        icon="pending_actions"
                        title="Entity Time"
                        count={`${seconds.EntityTime.hours}hr:${seconds.EntityTime.minutes}min`}
                        percentage={{
                          color: "success",
                          amount: "",
                          label: "Your over all  Entity Time",
                        }}
                      />
                    </MDBox>
                  </Grid>
                </Grid>
                <MDBox mt={6} mb={8} component="form" role="form" onSubmit={handleSubmit}>
                  <Grid container spacing={3} justifyContent="center">
                    <Grid item xs={12} lg={8}>
                      <Card mb={3}>
                        <MDBox
                          mb={7}
                          display="flex"
                          flexDirection="column"
                          alignItems="center"
                          justifyContent="center"
                        >
                          <MDTypography
                            mt={4}
                            mb={3}
                            variant="caption"
                            color="info"
                            fontWeight="regular"
                          >
                            <h1>Upload your CSV file</h1>
                          </MDTypography>
                          <MDBox
                            // mt={4}
                            display="flex"
                            width="550px"
                            flexDirection="row"
                            alignItems="center"
                            justifyContent="space-evenly"
                          >
                            <Grid item xs={4} md={7}>
                              <Autocomplete required
                                disablePortal
                                id="combo-box-demo"
                                options={list}
                                onChange={handleTeamChange}
                                sx={{ width: 250 }}
                                renderInput={(params) => <TextField {...params} label="Team" />}
                              />
                            </Grid>
                            <Grid item xs={6}>
                              <input type="file" accept={".csv"} onChange={handlingFileUpload} />
                            </Grid>
                          </MDBox>

                        </MDBox>
                      </Card>
                    </Grid>
                  </Grid>
                </MDBox>
                <MDBox mt={6} mb={8}>
                <Grid container spacing={3} justifyContent="center">
                  <Grid item xs={12} lg={8}>
                    <Card mb={3}>
                      <MDBox
                        mb={7}
                        display="flex"
                        flexDirection="column"
                        alignItems="center"
                        justifyContent="center"
                      >
                        <MDTypography
                          mt={4}
                          mb={3}
                          variant="h3"
                          color="error"
                          // fontWeight="regular"
                        >
                          * Note *
                        </MDTypography>
                        <Grid item xs={12} lg={9}>
                          <MDBox
                            display="flex"
                            flexDirection="column"
                            alignItems="center"
                            justifyContent="center"
                          >
                            <MDTypography
                              variant="caption"
                              color="dark"
                              fontSize="16px"
                              fontWeight="regular"
                            >
                              <ul>
                                <li>
                                  <p>
                                    Please ensure the time details are shown above successfully, in
                                    case of any mistakes please refresh the page. If the still not
                                    resolved please get in touch with us
                                  </p>
                                </li>
                                <br />
                                <li>
                                  <p>Please Don't make more than one Upload. So please check all the
                                  data are correct and then upload your data.
                                  </p>
                                </li>
                                <br />
                                <li> <p>In case of any issuse to reach us<b> development@objectways.com</b></p>
                                  </li>
                              </ul>
                            </MDTypography>
                          </MDBox>
                        </Grid>
                      </MDBox>
                    </Card>
                  </Grid>
                </Grid>
              </MDBox>
              </MDBox>
            </Grid> */}
            </MDBox>
          </Card>
        </Grid>
        </Drawer>
        <Footer />
      </DashboardLayout>
      <ToastContainer />
    </>
  );
}

export default Dashboard;

