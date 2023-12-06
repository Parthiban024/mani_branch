import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import MDButton from "components/MDButton/index";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import "react-datepicker/dist/react-datepicker.css";
import { useSelector } from "react-redux";
// Attandance
import React, { useState, useEffect } from "react";
import moment from "moment";
import { updateUserName, updateUserEmpId } from './userActions';
import { useDispatch } from 'react-redux';

function Attendance() {
  const dispatch = useDispatch();
  const [ctime, setTime] = useState(localStorage.getItem("checkinTime") || "");
  const [checkT, setCheckT] = useState(localStorage.getItem("checkoutTime") || "");
  const [total, setTotal] = useState(localStorage.getItem('total') || '');
  const [remain, setRemain] = useState();
  const name = useSelector((state) => state.auth.user.name);
  const empId = useSelector((state) => state.auth.user.empId);
  // const [outTime,setOutTime] = useState();
  const [isDisabled, setDisabled] = useState(false);
  const [isDisabledct, setDisabledct] = useState(false);
  function calc(checkoutTime) {
    // setInterval(()=>{})
    const time = new Date();
    // const checkoutTime = moment(ctime).add(570,'minutes').format('hh:mm a');
    const f = checkoutTime;
    console.log(checkoutTime);

    const a = moment(f, "hh:mm a");
    const b = moment(time, "hh:mm a");
    const c = moment.duration(a.diff(b));
    const d = `${c.hours()}hrs : ${c.minutes()}mins`;
    console.log(`${c.hours()}hrs : ${c.minutes()}mins`);
    setRemain(d);
  }

    // Function to reset state and enable buttons
    const resetStateAndButtons = () => {
      setTime('');
      setCheckT('');
      setTotal('');
      setRemain('');
      setDisabled(false);
      setDisabledct(false);
      localStorage.removeItem('checkinTime');
      localStorage.removeItem('checkoutTime');
      localStorage.removeItem('total');
    };
      // Set interval to reset state and enable buttons every 1 minute
  useEffect(() => {
    const intervalId = setInterval(resetStateAndButtons, 60000);
    return () => clearInterval(intervalId); // Cleanup on component unmount
  }, []);
  useEffect(() => {
    const totalResetIntervalId = setInterval(() => {
      localStorage.removeItem('total');
      setTotal('');
    }, 60000);

    return () => clearInterval(totalResetIntervalId); // Cleanup on component unmount
  }, []);
    
  useEffect(() => {
    const storedCheckinTime = localStorage.getItem("checkinTime");
    const storedCheckoutTime = localStorage.getItem("checkoutTime");
    const storedTotal = localStorage.getItem('total');
    const storedName = localStorage.getItem("name");
    const storedEmpId = localStorage.getItem("empId");

    if (storedName) {
      // If name is stored, update the Redux state
      // This assumes that you have a way to dispatch an action to update the user in the Redux store
      dispatch(updateUserName(storedName)); // Replace with the actual action you use

      if (storedEmpId) {
        // If empId is stored, update the Redux state
        dispatch(updateUserEmpId(storedEmpId)); // Replace with the actual action you use
      }
      
    if (storedTotal) {
      setTotal(storedTotal);
    }
    }
    

    if (storedCheckinTime) {
      setTime(storedCheckinTime);
      setDisabled(true);
    }

    if (storedCheckoutTime) {
      setCheckT(storedCheckoutTime);
      setDisabledct(true);
    }
  }, []);

  //    useEffect(()=>{
  //         calc()
  //    },[])
  //    setInterval(()=>{calc()},60000)
  const onCheck = async (e) => {
    e.preventDefault();
    const time = new Date();
    const checkoutTime = moment(time).add(570, 'minutes').format('hh:mm a');
    const timeNow = moment(time).format('hh:mm a');
  
    // Update the state
    setTime(timeNow);
    setDisabled(true);

      // Save data to local storage
      localStorage.setItem("checkinTime", timeNow);
      localStorage.setItem("name", name);
      localStorage.setItem("empId", empId);
  
    // Send data to the backend
    try {
      const response = await fetch('/attendance/att', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ checkInTime: timeNow, name: name, empId: empId }),
      });
  
      if (response.ok) {
        console.log('Attendance saved successfully');
      } else {
        console.error('Failed to save attendance');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };
  
  // Inside the onCheckout function
  const onCheckout = async (e) => {
    e.preventDefault();
    const cOut = new Date();
    const checkTime = moment(cOut).format('hh:mm a');
    setCheckT(checkTime);
    const a = moment(ctime, 'hh:mm a');
    const b = moment(checkTime, 'hh:mm a');
    const overAll = moment.duration(b.diff(a));
  
    // Update the state
    setTotal(`${overAll.hours()}hrs : ${overAll.minutes()}mins`);
    setDisabledct(true);
    // Send data to the backend

    localStorage.setItem("checkoutTime", checkTime);
    localStorage.setItem("name", name);
    localStorage.setItem("empId", empId);
    localStorage.setItem('total', `${overAll.hours()}hrs : ${overAll.minutes()}mins`);

    
    try {
      const response = await fetch('/attendance/att', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ checkOutTime: checkTime, name: name, empId: empId, total: `${overAll.hours()}hrs : ${overAll.minutes()}mins`, }),
      });
  
      if (response.ok) {
        console.log('Checkout time saved successfully');
      } else {
        console.error('Failed to save checkout time');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };
  // const onCheck = (e) => {
  //   e.preventDefault();
  //   const time = new Date();
  //   const checkoutTime = moment(time).add(570, "minutes").format("hh:mm a");
  //   console.log(checkoutTime);

  //   moment.defaultFormat = "hh:mm";
  //   console.log(time);
  //   const timeNow = moment(time).format("hh:mm a");
  //   console.log(timeNow);
  //   const a = moment("6:00 pm", "hh:mm a");
  //   const b = moment(time, "hh:mm a");
  //   const c = moment.duration(a.diff(b));
  //   calc(checkoutTime);
  //   // console.log(outTime)
  //   setInterval(() => {
  //     calc(checkoutTime);
  //   }, 60000);
  //   console.log(`${c.hours()}Hours &  Minutes ${c.minutes()}`);
  //   console.log(moment("08:30", moment.defaultFormat).fromNow());
  //   setTime(timeNow);
  //   setDisabled(true);
  //   // setOutTime(checkoutTime)
  //   // setTimeout(()=>{ var d = c.hours()+'Hours &  Minutes '+c.minutes();
  //   // console.log(c.hours()+'Hours &  Minutes '+c.minutes())
  //   // setRemain(d)},1000)
  //   // const check = {
  //   //   timeNow,
  //   // };
  //   // props.checkIn(check);
  // };
  return (
    <DashboardLayout>
      <DashboardNavbar />
      <Grid item xs={12} mt={1} mb={40}>
        {/* <MDBox py={6}> */}
        <MDBox mt={4} mb={8}>
          <Grid container spacing={3} justifyContent="center">
            <Grid item xs={12} lg={8}>
              <Card mb={3}>
                <MDBox
                  // mb={7}
                  display="flex"
                  flexDirection="column"
                  alignItems="center"
                  justifyContent="center"
                >
                  <MDTypography mt={2} mb={3} variant="caption" color="info" fontWeight="regular">
                    <h1>Employee Attendance</h1>
                  </MDTypography>
                  <MDBox
                    display="flex"
                    width="850px"
                    flexDirection="row"
                    alignItems="center"
                    justifyContent="space-evenly"
                  >
                    <Grid mt={3} item xs={12} md={6} lg={4}>
                      <MDButton
                        mb={3}
                        type="submit"
                        color="info"
                        onClick={onCheck}
                        disabled={isDisabled}
                      >
                        Check In!
                      </MDButton>
                      <MDBox display="flex" flexDirection="column">
                        <MDTypography
                          mt={3}
                          // mb={3}
                          variant="caption"
                          color="dark"
                          fontWeight="regular"
                          flexDirection="column"
                        >
                          <h3>Time:{ctime}</h3>
                        </MDTypography>
                      </MDBox>
                    </Grid>
                    <Grid mt={3} item xs={12} md={6} lg={4}>
                      <MDButton type="submit" color="success" onClick={onCheckout} disabled={isDisabledct}>
                        Check out!
                      </MDButton>
                      <MDBox display="flex" flexDirection="column">
                        <MDTypography
                          mt={3}
                          // mb={3}
                          variant="caption"
                          color="dark"
                          fontWeight="regular"
                          flexDirection="column"
                        >
                          <h3>Time:{checkT}</h3>
                        </MDTypography>
                      </MDBox>
                    </Grid>
                  </MDBox>
                </MDBox>
                {/* <Grid item xs={12} lg={8}> */}
                <MDBox mt={4} px={10} display="flex" flexDirection="column">
                  <MDTypography mb={1} variant="caption" color="dark" fontWeight="regular">
                    <h3>Over All Time: {total}</h3>
                  </MDTypography>

                  {/* <MDTypography mb={3} variant="caption" color="dark" fontWeight="regular">
                    <h3>Remaning Time: {remain}</h3>
                  </MDTypography> */}
                </MDBox>
                <MDBox mt={4} px={10} display="flex" flexDirection="column" justifyContent="center" alignItems="center">
                <MDTypography mb={3} variant="caption" color="error" fontWeight="regular">
                    <h1>🚧 Under Development Process 🚧</h1>
                  </MDTypography>
                  </MDBox>
                {/* </Grid> */}
              </Card>
            </Grid>
          </Grid>
        </MDBox>
        {/* </MDBox> */}
      </Grid>z
      <Footer />
    </DashboardLayout>
  );
}

export default Attendance;
