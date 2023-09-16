import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { Button, Alert } from "react-bootstrap";
import animation from "../Assets/8166-laundry-illustration-animation.gif";
import { useSelector, useDispatch } from "react-redux";
import { setPickupDate } from "../redux/pickup";
import AirDatepickerReact from "./DatePicker";
import localeEn from "air-datepicker/locale/en";

export default function Time() {
  const { logout } = useAuth();

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const history = useHistory();

  const { pickupDate, pickupTime } = useSelector((state) => state.pickup);
  const minDate = new Date(); //get current date

  const maxdate = new Date(); //get current date
  maxdate.setDate(maxdate.getDate() + 30); //add 30 days

  let selectedDate = pickupDate;

  const dispatch = useDispatch();

  async function handleLogout() {
    setError("");

    try {
      setLoading(true);
      await logout().then(() => {
        history.push("/login");
      });
    } catch (err) {
      console.log(err.message);
      setError("Failed to log out");
    }
    setLoading(false);
  }

  function selectedDay(val) {
    let {date} = val;
    console.log("val: " + new Date(date).toDateString());
    let currentTime = new Date();
    if (
      currentTime.getHours() >= 17 &&
      new Date(date).getDate() === currentTime.getDate() &&
      new Date(date).getMonth() === currentTime.getMonth()
    ) {
      setError("Please select next available date");
    } else {
      setError("");
      selectedDate = new Date(date).toDateString();
    }
  }

  async function manageAccount() {
    setError("");

    try {
      setLoading(true);
      history.push("/manageAccount");
    } catch (err) {
      console.log(err.message);
      setError("Failed to redirect");
    }
    setLoading(false);
  }

  async function nextPage() {
    if (error === "") {
      try {
        setLoading(true);
        dispatch(setPickupDate(selectedDate));
        history.push("/products");
        //}
      } catch (err) {
        console.log(err.message);
      }
      setLoading(false);
    }
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
          onClick={manageAccount}
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
      <div className="w-100 text-center mt-3" id="datePicker">
        {error && <Alert variant="danger">{error}</Alert>}
        <AirDatepickerReact
          multipleDates={false}
          dateFormat={'E MMM d yyyy'}
          isMobile={true}
          autoClose={true}
          locale={localeEn}
          onSelect={(val) => {
            selectedDay(val);
          }}
          disableNavWhenOutOfRange={true}
          minDate={minDate}
          maxDate={maxdate}
          selectDate={new Date(pickupDate).toDateString()}
          setViewDate={new Date(pickupDate).toDateString()}
        />
        <div
          style={{
            padding: "10px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <span>Time Slot: {pickupTime}</span>
          <button
            className="nextBtn"
            onClick={() => {
              nextPage();
            }}
          >
            Next
          </button>
        </div>
      </div>
    </>
  );
}
