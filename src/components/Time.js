import React, { useState } from "react";
import DatePicker from "react-horizontal-datepicker";
import { useHistory } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { Button, Alert } from "react-bootstrap";
import animation from "../Assets/8166-laundry-illustration-animation.gif";
import { useSelector,useDispatch } from "react-redux";
import { setPickupDate, setPickupTime } from "../redux/pickup";

export default function Time() {
  const {
    logout
  } = useAuth();

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const history = useHistory();

  const {pickupDate,pickupTime} = useSelector((state) => state.pickup)

  let date = pickupDate;


  const dispatch = useDispatch();

  dispatch(setPickupTime("5pm - 9pm"))
  async function handleLogout() {
    setError("");

    try {
      setLoading(true);
      await logout()
        .then(() => {
          history.push("/login");
        });
    } catch (err) {
      console.log(err.message);
      setError("Failed to log out");
    }
    setLoading(false);
  }

  function selectedDay(val) {
      let currentTime = new Date();
      if(currentTime.getHours() >= 17 && new Date(val).getDate() === currentTime.getDate() && new Date(val).getMonth() === currentTime.getMonth()){
        setError("Please select next available date");
      }
      else{
        setError("");
        date = new Date(val).toDateString();
      }
    }

  async function nextPage() {
    if(error === ""){
    try {
      setLoading(true);
      dispatch(setPickupDate(date));      
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
        {/* <Button
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
        </Button> */}
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
          getSelectedDay={(val) =>{
            selectedDay(val)
          }}
          endDate={31}
          selectDate={new Date(pickupDate)}
          labelFormat={"MMM"}
          color={"#1C2F74"}
        />
        <div style={{ padding: "10px",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center"}}>
          {pickupTime}


          <button className="nextBtn" onClick={() =>{
            nextPage()
          }}>Next</button>
        </div>
      </div>
    </>
  );
        }