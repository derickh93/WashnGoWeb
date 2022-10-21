import React, { useState, useRef } from "react";
import GoogleMap from "./GoogleMap";
import "../App.css";
import { useAuth } from "../contexts/AuthContext";
import { useHistory } from "react-router-dom";
import { Alert, Button } from "react-bootstrap";
import { useSelector,useDispatch } from "react-redux";
import {changeDoorman,changeHotel,setDoorCode,changeCode} from "../redux/account-prefs"


export default function Address() {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const {
    addAddress,
    setCurrentAddress,
    currentAddress,
    logout,
    readProfile,
    currentUser,
  } = useAuth();
  const history = useHistory();
  const aptRef = useRef();
  const {doorman,code,hotel,code_door} = useSelector((state) => state.accountPref)
  const dispatch = useDispatch();


  let stripeData = "test"//****************************************** */

  const handleDoorChange = event => {
    dispatch(setDoorCode(event.target.value));
    console.log(code_door)
  };

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      if (error.length > 0) {
        throw new Error("Out of Zone");
      }
      setError("");
      setLoading(true);

      var aptVal;
      if (!aptRef.current) {
        aptVal = "N/A";
      } else {
        aptVal = aptRef.current.value;
      }

      try {
        var nameArr = currentAddress.split(",");
      } catch (err) {
        setError("Please add an address");
        console.log(err);
        throw new Error("Please add an address");
      }

      const options = {
        Doorman: doorman,
        Hotel: hotel,
        Door_Gate_Code: code_door,
        Contact: document.querySelector('input[name="contact"]:checked').value
        ,
      };
      addAddress(
        stripeData.id,
        nameArr[0],
        nameArr[1],
        nameArr[2],
        aptVal,
        stripeData.name,
        options
      );
      history.push("/time");
    } catch (err) {
      setError(err.message);
      console.log(err);
    }

    setLoading(false);
  }

  const handleCallback = (childData) => {
    setError("");
    const { address, zone } = childData;
    setCurrentAddress(address);
    if (zone === "In") {
    } else {
      setError("Out of Zone, We currently do not serve your area.");
    }
  };

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

  // async function handlePortal() {
  //   setError("");

  //   try {
  //     setLoading(true);
  //     customerPortal(userData.id, "time").then((url) => {
  //       window.location = url;
  //     });
  //   } catch (err) {
  //     setError("Failed open portal");
  //     console.log(err.message);
  //   }
  //   setLoading(false);
  // }
  return (
    <div>
      <div className="homepage">
        {error && <Alert variant="danger">{error}</Alert>}
      </div>
      <span
        style={{
          fontWeight: "bold",
          display: "flex",
          justifyContent: "center",
        }}
      >
        Let's start with your address
      </span>

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
      <div style={{ display: "flex", flexDirection: "column" }}>
        <GoogleMap parentCallback={handleCallback} />
        <input
          type="text"
          id="apt"
          name="apt"
          placeholder="Apartment #"
          ref={aptRef}
        />
      </div>
      <div
        style={{
          fontWeight: "bold",
          alignItems: "center",
          justifyContent: "center",
          display: "flex",
          textAlign: "center",
          padding: "5px",
        }}
      >
        Other Information
      </div>
      <div>
        <div>
          <input
            type="checkbox"
            id="doorman"
            name="doorman"
            value={doorman}
            onChange={() => {
              dispatch(changeDoorman());
              console.log("Doorman: " + !doorman);
            }}
          />
          <span style={{ padding: "5px" }}>Live in a doorman building? </span>
        </div>
        <div>
          <input
            type="checkbox"
            id="hotel"
            name="hotel"
            value={hotel}
            onChange={() => {
              dispatch(changeHotel());
              console.log("Hotel: " + !hotel);
            }}
          />
          <span style={{ padding: "5px" }}>
            Are you a guest of a hotel or motel?{" "}
          </span>
        </div>
        <div style={{ display: "flex" }}>
          <input
            type="checkbox"
            id="code"
            name="code"
            value={code}
            onChange={() => {
              dispatch(changeCode());
            }}
          ></input>
          <span style={{ padding: "5px" }}>
            Will you give us a key or door code?
          </span>
          {code && (
            <input
              type="text"
              id="code"
              name="code"
              placeholder="Door/Gate Code"
              value={code_door}
              onChange={
                handleDoorChange()}
            />
          )}
        </div>
        <span style={{ padding: "20px" }}>(If Key, enter 'Yes') </span>
      </div>

      <div
        style={{
          fontWeight: "bold",
          alignItems: "center",
          justifyContent: "center",
          display: "flex",
          textAlign: "center",
          padding: "5px",
        }}
      >
        Contact Preference
      </div>
      <div className="d-flex flex-column">
        <div style={{ padding: 5 }}>
          {" "}
          <input type="radio" value="Call" name="contact" checked/> Call
        </div>

        <div style={{ padding: 5 }}>
          {" "}
          <input type="radio" value="Text" name="contact" /> Text
        </div>
      </div>
      <div className="address">
        <button disabled={loading} onClick={handleSubmit}>
          Schedule Service
        </button>
      </div>
    </div>
  );
}
