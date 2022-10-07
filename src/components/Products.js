import React, { useState,useEffect} from "react";
import { Alert,Collapse } from "react-bootstrap";
import { useAuth } from "../contexts/AuthContext";
import laundryBasket from "../Assets/laundry_basket.png";
import dryClean from "../Assets/dryclean.png";
import CounterButton from "./CounterButton";
import { TimePicker } from "./SchedulePage/TimePicker";
import { Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { useHistory } from "react-router-dom";
import { locales } from "validator/lib/isIBAN";

export default function Products() {
  const {

    logout,
    customerPortal,
    readProfile,
    currentUser,
  } = useAuth();
  const [error, setError] = useState("");

  console.log(sessionStorage.getItem("seperate"));
  const [localSeperate, setLocalSeperate] = React.useState(sessionStorage.getItem("seperate") == null ? 0:JSON.parse(sessionStorage.getItem("seperate")));
  const [localMixed, setLocalMixed] = React.useState(sessionStorage.getItem("mixed") == null ? 0:JSON.parse(sessionStorage.getItem("mixed")));
  const [localAdditional, setLocalAdditional] = React.useState(sessionStorage.getItem("addition") == null ? 0:JSON.parse(sessionStorage.getItem("addition")));

  const [localShirt, setLocalShirt] = React.useState(sessionStorage.getItem("shirt") == null ? 0:JSON.parse(sessionStorage.getItem("shirt")));
  const [localSlacks, setLocalSlacks] = React.useState(sessionStorage.getItem("slacks") == null ? 0:JSON.parse(sessionStorage.getItem("slacks")));
  const [localJacket, setLocalJacket] = React.useState(sessionStorage.getItem("jacket") == null ? 0:JSON.parse(sessionStorage.getItem("seperate")));

  const[openDC,setOpenDC] = React.useState(false);
  const[openWash,setOpenWash] = React.useState(true);

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
      customerPortal(userData.id,'products').then((url) => {
        window.location = url;
      });
    } catch (err) {
      setError("Failed open portal");
      console.log(err.message);
    }
  }

  async function nextPage() {
    try {
      if (localAdditional <= 0 && localMixed <= 0 && localSeperate <= 0 && localShirt <= 0 && localSlacks <= 0 && localJacket <= 0) {
        setError("Select an option");
      } else {
        if(localAdditional === 0){
          sessionStorage.setItem("addition", JSON.stringify(0));
        }
        if(localMixed === 0){
          sessionStorage.setItem("mixed", JSON.stringify(0));
        }
        if(localSeperate === 0){
          sessionStorage.setItem("seperate", JSON.stringify(0));
        }
        if(localShirt === 0){
          sessionStorage.setItem("shirt", JSON.stringify(0));
        }
        if(localSlacks === 0){
          sessionStorage.setItem("slacks", JSON.stringify(0));
        }
        if(localJacket === 0){
          sessionStorage.setItem("jacket", JSON.stringify(0));
        }
        history.push("/preferences");
      }
    } catch (err) {
      console.log(err.message);
    }
  }

  function getSeperate(val) {
    setLocalSeperate(val);
    sessionStorage.setItem("seperate", JSON.stringify(val));
  }

  function getMixed(val) {
    setLocalMixed(val);
    sessionStorage.setItem("mixed", JSON.stringify(val));
  }

  function getAdditional(val) {
    setLocalAdditional(val);
    sessionStorage.setItem("addition", JSON.stringify(val));
  }

  function getShirt(val) {
    setLocalShirt(val);
    sessionStorage.setItem("shirt", JSON.stringify(val));
  }

  function getSlacks(val) {
    setLocalSlacks(val);
    sessionStorage.setItem("slacks", JSON.stringify(val));
  }

  function getJacket(val) {
    setLocalJacket(val);
    sessionStorage.setItem("jacket", JSON.stringify(val));
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

{!openWash &&
      <Button
        onClick={() => {
          setOpenWash(!openWash)
          setOpenDC(!openDC)
        }}
        aria-controls="example-collapse-text"
        aria-expanded={openWash}
      >
        Wash
      </Button>
}
      <Collapse in={openWash}>
        <div id="example-collapse-text">


        <CounterButton
          imageSrc={laundryBasket}
          imageAlt="Mixed Washes"
          sendData={getMixed}
          count={localMixed}
          label="Mixed Wash"
        ></CounterButton>

        <CounterButton
          imageSrc={dryClean}
          imageAlt="Seperate Washes"
          sendData={getSeperate}
          count={localSeperate}
          label="Seperate Wash"
        ></CounterButton>

    <CounterButton
          imageSrc={dryClean}
          imageAlt="Additional Washes"
          sendData={getAdditional}
          count={localAdditional}
          label="Additional Washes"
        ></CounterButton>
        </div>
      </Collapse>


      {!openDC &&
<Button
        onClick={() => 
          {
            setOpenDC(!openDC)
            setOpenWash(!openWash)
          }
      }
        aria-controls="example-collapse-text"
        aria-expanded={openDC}
      >
        Dry Clean
      </Button>}
      <Collapse in={openDC}>
        <div id="example-collapse-text">


<CounterButton
          imageSrc={dryClean}
          imageAlt="Shirt"
          sendData={getShirt}
          count={localShirt}
          label="Shirt"
        ></CounterButton>

<CounterButton
          imageSrc={dryClean}
          imageAlt="Slack"
          sendData={getSlacks}
          count={localSlacks}
          label="Slacks"
        ></CounterButton>
        <CounterButton
          imageSrc={dryClean}
          imageAlt="Jacket"
          sendData={getJacket}
          count={localJacket}
          label="Jacket"
        ></CounterButton>
        </div>
      </Collapse>


        <TimePicker onClick={nextPage}>Next</TimePicker>
      </div>
    </>
  );
}
