import React, { useState } from "react";
import { Alert } from "react-bootstrap";
import { useAuth } from "../contexts/AuthContext";
import washngo from "../Assets/washngo.png";
import laundryBasket from "../Assets/laundry_basket.png";
import dryClean from "../Assets/dryclean.png";
import CounterButton from "./CounterButton";
import { TimePicker } from "./SchedulePage/TimePicker";
import { Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { useHistory } from "react-router-dom";

export default function Products() {
  const {
    setBags,
    setPieces,
    logout,
    customerPortal,
    readProfile,
    currentUser,
  } = useAuth();
  const [error, setError] = useState("");
  const [localBags, setLocalBags] = React.useState(0);
  const [localPieces, setLocalPieces] = React.useState(0);

  const history = useHistory();
  const userData = JSON.parse(sessionStorage.getItem("stripeInstance"));
  if (!userData) {
    readProfile(currentUser.uid);
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

  async function handleAccount() {
    setError("");

    try {
      history.push("/dashboard");
    } catch {
      setError("Failed to go to account");
    }
  }

  async function handlePortal() {
    setError("");

    try {
      customerPortal(userData.id).then((url) => {
        window.location = url;
      });
    } catch (err) {
      setError("Failed open portal");
      console.log(err.message);
    }
  }

  async function nextPage() {
    try {
      if (localBags <= 0 && localPieces <= 0) {
        setError("Select an option");
      } else if (localBags === 0) {
        sessionStorage.setItem("bags", JSON.stringify(0));
        history.push("/confirmation");
      } else {
        history.push("/preferences");
      }
    } catch (err) {
      console.log(err.message);
    }
  }

  function getBags(val) {
    setLocalBags(val);
    sessionStorage.setItem("bags", JSON.stringify(val));
  }

  function getPieces(val) {
    setLocalPieces(val);
    sessionStorage.setItem("pieces", JSON.stringify(val));
  }

  function goBack() {
    try {
      history.push("/time");
    } catch (err) {
      console.log(err.message);
    }
  }

  return (
    <>
      <div className="homepage">
        <img className="logo" src={washngo} alt="washngo" />
        {error && <Alert variant="danger">{error}</Alert>}
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "row",

          justifyContent: "flex-end",
        }}
      >
        <Button
          variant="outline-primary"
          style={{
            width: "20%",
            height: "20%",
            fontSize: "12px",
            backgroundColor: "transparent",
            boxShadow: "none",
          }}
          onClick={goBack}
        >
          <FontAwesomeIcon
            icon="chevron-circle-left"
            size="lg"
            color="#336daf"
          />
        </Button>{" "}
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
        <CounterButton
          imageSrc={laundryBasket}
          imageAlt="laundryBasket"
          sendData={getBags}
          count={localBags}
          label="Laundry Bag(s)"
        ></CounterButton>

        <CounterButton
          imageSrc={dryClean}
          imageAlt="dryclean"
          sendData={getPieces}
          count={localPieces}
          label="Dry Clean Item(s)"
        ></CounterButton>

        <TimePicker onClick={nextPage}>Next</TimePicker>
      </div>
    </>
  );
}
