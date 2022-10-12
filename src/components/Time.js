import React, { useState } from "react";
import styled from "styled-components";
import DatePicker from "react-horizontal-datepicker";
import { TimePicker } from "./SchedulePage/TimePicker";
import { useHistory } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { Button, Alert } from "react-bootstrap";
import animation from "../Assets/8166-laundry-illustration-animation.gif";

export default function Time() {
  const {
    pickupDate,
    setPickupDate,
    logout,
    readProfile,
    currentUser,
    customerPortal,
  } = useAuth();

  const fourthTimeSlot = "5pm - 9pm";

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const history = useHistory();

  const userData = JSON.parse(sessionStorage.getItem("stripeInstance"));
  if (!userData) {
    readProfile(currentUser.uid);
  }

  const timeData = sessionStorage.getItem("pickupTime");
  if (!timeData) {
    sessionStorage.setItem("pickupTime", JSON.stringify(fourthTimeSlot));
  }

  async function handleLogout() {
    setError("");

    try {
      setLoading(true);
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
    setLoading(false);
  }

  async function handlePortal() {
    setError("");

    try {
      setLoading(true);
      customerPortal(userData.id,'time').then((url) => {
        window.location = url;
      });
    } catch (err) {
      setError("Failed open portal");
      console.log(err.message);
    }
    setLoading(false);
  }

  const PUTimePicker = styled(TimePicker)`
    font-weight: bold;
    cursor: pointer;
  `;

  const selectedDay = (val) => {
    setPickupDate(val);
    sessionStorage.setItem("pickupDay", JSON.stringify(val));
  };

  async function nextPage() {
    try {
      setLoading(true);
      history.push("/products");
      //}
    } catch (err) {
      console.log(err.message);
    }
    setLoading(false);
  }

  return (
    <>
      {loading ? (
        <div className="homepage">
          <img src={animation} alt="loading..." />
        </div>
      ) : null}
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
          color={"#1C2F74"}
        />
        <div style={{ padding: "10px" }}>
          {fourthTimeSlot}


          <PUTimePicker onClick={nextPage}>Next</PUTimePicker>
        </div>
      </div>
    </>
  );
}
