import React, { useState } from "react";
import washngo from "../Assets/washngo.png";
import styled from "styled-components";
import DatePicker from "react-horizontal-datepicker";
import { TimePicker } from "./SchedulePage/TimePicker";
import { useHistory } from "react-router-dom";
import { RadioGroup, RadioButton } from "react-radio-buttons";
import { useAuth } from "../contexts/AuthContext";
import { Button, Alert } from "react-bootstrap";

export default function Time() {
  const {
    pickupDate,
    setPickupDate,
    setPickupTime,
    logout,
    readProfile,
    currentUser,
    customerPortal,
  } = useAuth();

  const [firstTimeSlot, setFirstTimeSlot] = useState("9am - 12pm");
  const [secondTimeSlot, setSecondTimeSlot] = useState("12pm - 3pm");
  const [thirdTimeSlot, setThirdTimeSlot] = useState("3pm - 6pm");
  const [error, setError] = useState("");
  //const [clicked, setClicked] = useState(false);

  const history = useHistory();

  const userData = JSON.parse(sessionStorage.getItem("stripeInstance"));
  if (!userData) {
    readProfile(currentUser.uid);
  }

  const timeData = sessionStorage.getItem("pickupTime");
  if (!timeData) {
    sessionStorage.setItem("pickupTime", JSON.stringify(firstTimeSlot));
  }

  async function handleLogout() {
    setError("");

    try {
      await logout()
        .then(() => {
          sessionStorage.clear();
        })
        .then(() => {
          history.push("/login");
        });
    } catch (err) {
      console.log(err.message);
      setError("Failed to log out");
    }
  }

  async function handlePortal() {
    setError("");

    try {
      customerPortal(userData.id).then((url) => {
        console.log(url);
        window.location = url;
      });
    } catch (err) {
      setError("Failed open portal");
      console.log(err.message);
    }
  }

  const PUTimePicker = styled(TimePicker)`
    font-weight: bold;
    cursor: pointer;
  `;

  const selectedDay = (val) => {
    console.log(val);
    setPickupDate(val);
    sessionStorage.setItem("pickupDay", JSON.stringify(val));
  };

  /**
   * 
   * 
  const selectedDay = (val) => {
    console.log(val);
    var data = sessionStorage.getItem("selectedDay");
    if (data) {
      setPickupDate(JSON.parse(data));
      console.log("data from session storage");
      val = data;
    } else {
      sessionStorage.setItem("selectedDay", JSON.stringify(val));
      console.log("data from picker");
    }
    setPickupDate(val);
  };
   */

  const handleClick = (val) => {
    console.log(val);
    setPickupTime(val);
    //setClicked((oldVal) => true);
    sessionStorage.setItem("pickupTime", JSON.stringify(val));
  };

  async function nextPage() {
    try {
      //if (clicked === false) {
      //console.log("choose date and time first");
      //setError("Choose date and time first");
      //} else {
      history.push("/products");
      //}
    } catch (err) {
      console.log(err.message);
    }
  }

  return (
    <>
      <div className="homepage">
        <img className="logo" src={washngo} alt="washngo" />
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "row",

          justifyContent: "flex-end",
        }}
      >
        <Button
          style={{
            width: "20%",
            height: "20%",
            fontSize: "12px",
            backgroundColor: "transparent",
            boxShadow: "none",
          }}
          variant="link"
          onClick={handlePortal}
        >
          <u>Manage Account</u>
        </Button>
        <Button
          style={{
            width: "20%",
            height: "20%",
            fontSize: "12px",
            backgroundColor: "transparent",
            boxShadow: "none",
          }}
          variant="link"
          onClick={handleLogout}
        >
          <u>Log Out</u>
        </Button>
      </div>
      <div className="w-100 text-center mt-3">
        {error && <Alert variant="danger">{error}</Alert>}

        <DatePicker
          getSelectedDay={(val) => {
            selectedDay(val);
          }}
          endDate={100}
          selectDate={pickupDate}
          labelFormat={"MMMM"}
          color={"#61b258"}
        />
        <div style={{ padding: "10px" }}>
          <RadioGroup
            onChange={handleClick}
            value={JSON.parse(sessionStorage.getItem("pickupTime"))}
          >
            <RadioButton
              iconSize={20}
              iconInnerSize={10}
              rootColor="#336daf"
              pointColor="green"
              value={firstTimeSlot}
            >
              {firstTimeSlot}
            </RadioButton>
            <RadioButton
              iconSize={20}
              iconInnerSize={10}
              rootColor="#336daf"
              pointColor="green"
              value={secondTimeSlot}
            >
              {secondTimeSlot}
            </RadioButton>
            <RadioButton
              iconSize={20}
              iconInnerSize={10}
              rootColor="#336daf"
              pointColor="green"
              value={thirdTimeSlot}
            >
              {thirdTimeSlot}
            </RadioButton>
          </RadioGroup>

          <PUTimePicker onClick={nextPage}>Next</PUTimePicker>
        </div>
      </div>
    </>
  );
}
