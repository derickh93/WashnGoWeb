import React, { useState, useRef } from "react";
import { Form, Card, Alert } from "react-bootstrap";
import { RadioGroup, RadioButton } from "react-radio-buttons";
import { useHistory, Redirect } from "react-router-dom";
import { TimePicker } from "./SchedulePage/TimePicker";
import { useAuth } from "../contexts/AuthContext";
import { Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import washngo from "../Assets/washngo.png";

export default function Preferences() {
  const [error, setError] = useState("");

  const [detergentChoice, setDetergentChoice] = useState("All free and clear");
  const [detergentChoiceTwo, setDetergentChoiceTwo] =
    useState("Tide simply clean");

  const [whiteChoice, setWhitesChoice] = useState("Bleach");
  const [whiteChoiceTwo, setWhitesChoiceTwo] = useState("No Bleach");

  const [softenerChoice, setSoftenerChoice] = useState(
    "Suavitel and Dry Sheets"
  );
  const [softenerChoiceTwo, setSoftenerChoiceTwo] = useState("No Softener");

  const [dryerChoice, setDryerChoice] = useState("High");
  const [dryerChoiceTwo, setDryerChoiceTwo] = useState("Medium");
  const [dryerChoiceThree, setDryerChoiceThree] = useState("Low");

  const {
    detergent,
    setDetergent,
    softener,
    setSoftener,
    dryer,
    setDryer,
    whites,
    setWhites,
    setAdditional,
    logout,
    customerPortal,
    readProfile,
    currentUser,
  } = useAuth();
  const additionalRef = useRef();

  const history = useHistory();
  const userData = JSON.parse(sessionStorage.getItem("stripeInstance"));
  if (!userData) {
    readProfile(currentUser.uid);
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

  const detergentData = JSON.parse(sessionStorage.getItem("detergent"));
  if (!detergentData) {
    sessionStorage.setItem("detergent", JSON.stringify(detergentChoice));
  }

  const whitesData = JSON.parse(sessionStorage.getItem("whites"));
  if (!whitesData) {
    sessionStorage.setItem("whites", JSON.stringify(whiteChoice));
  }

  const dryerData = JSON.parse(sessionStorage.getItem("dryer"));
  if (!dryerData) {
    sessionStorage.setItem("dryer", JSON.stringify(dryerChoice));
  }

  const softenerData = JSON.parse(sessionStorage.getItem("softener"));
  if (!softenerData) {
    sessionStorage.setItem("softener", JSON.stringify(softenerChoice));
  }

  const [additionalData, setAdditionalData] = useState(
    JSON.parse(sessionStorage.getItem("additional"))
  );

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

  const handleDetergent = (val) => {
    setDetergent(val);
    sessionStorage.setItem("detergent", JSON.stringify(val));
  };

  const handleDryer = (val) => {
    setDryer(val);
    sessionStorage.setItem("dryer", JSON.stringify(val));
  };

  const handleWhites = (val) => {
    setWhites(val);
    sessionStorage.setItem("whites", JSON.stringify(val));
  };

  const handleSoftener = (val) => {
    setSoftener(val);
    sessionStorage.setItem("softener", JSON.stringify(val));
  };

  async function nextPage() {
    try {
      setError("");
      history.push("/confirmation");
      setAdditional(additionalRef.current.value);
      sessionStorage.setItem(
        "additional",
        JSON.stringify(additionalRef.current.value)
      );
    } catch (err) {
      console.log(err.message);
    }
  }

  function goBack() {
    try {
      history.push("/products");
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
        <div style={{ padding: "10px" }}>
          <span>Detergent Scent</span>
          <div style={{ padding: "10px" }}>
            <RadioGroup
              horizontal
              onChange={handleDetergent}
              value={JSON.parse(sessionStorage.getItem("detergent"))}
            >
              <RadioButton
                iconSize={20}
                iconInnerSize={10}
                rootColor="#336daf"
                pointColor="#61b258"
                value={detergentChoice}
              >
                All Free & Clear
              </RadioButton>
              <RadioButton
                iconSize={20}
                iconInnerSize={10}
                rootColor="#336daf"
                pointColor="#61b258"
                value={detergentChoiceTwo}
              >
                Tide
              </RadioButton>
            </RadioGroup>
          </div>

          <div style={{ padding: "10px" }}>
            <span>Whites</span>
            <RadioGroup
              horizontal
              onChange={handleWhites}
              value={JSON.parse(sessionStorage.getItem("whites"))}
            >
              <RadioButton
                iconSize={20}
                iconInnerSize={10}
                rootColor="#336daf"
                pointColor="#61b258"
                value={whiteChoice}
              >
                Bleach
              </RadioButton>
              <RadioButton
                iconSize={20}
                iconInnerSize={10}
                rootColor="#336daf"
                pointColor="#61b258"
                value={whiteChoiceTwo}
              >
                No Bleach
              </RadioButton>
            </RadioGroup>
          </div>

          <span>Softener</span>

          <div style={{ padding: "10px" }}>
            <RadioGroup
              horizontal
              onChange={handleSoftener}
              value={JSON.parse(sessionStorage.getItem("softener"))}
            >
              <RadioButton
                iconSize={20}
                iconInnerSize={10}
                rootColor="#336daf"
                pointColor="#61b258"
                value={softenerChoice}
              >
                Suavitel and Dry Sheets
              </RadioButton>
              <RadioButton
                iconSize={20}
                iconInnerSize={10}
                rootColor="#336daf"
                pointColor="#61b258"
                value={softenerChoiceTwo}
              >
                No Softener
              </RadioButton>
            </RadioGroup>

            <span>Dryer Setting</span>

            <div style={{ padding: "10px" }}>
              <RadioGroup
                horizontal
                onChange={handleDryer}
                value={JSON.parse(sessionStorage.getItem("dryer"))}
              >
                <RadioButton
                  iconSize={20}
                  iconInnerSize={10}
                  rootColor="#336daf"
                  pointColor="#61b258"
                  value={dryerChoice}
                >
                  High
                </RadioButton>
                <RadioButton
                  iconSize={20}
                  iconInnerSize={10}
                  rootColor="#336daf"
                  pointColor="#61b258"
                  value={dryerChoiceTwo}
                >
                  Medium
                </RadioButton>
                <RadioButton
                  iconSize={20}
                  iconInnerSize={10}
                  rootColor="#336daf"
                  pointColor="#61b258"
                  value={dryerChoiceThree}
                >
                  Low
                </RadioButton>
              </RadioGroup>
            </div>
          </div>
          {error && <Alert variant="danger">{error}</Alert>}
        </div>
      </div>
      <span
        style={{
          alignItems: "center",
          justifyContent: "center",
          display: "flex",
        }}
      >
        Additional Instructions
      </span>
      <Card>
        <Card.Body>
          <Form>
            <Form.Group id="additional">
              <Form.Control
                type="text"
                ref={additionalRef}
                value={additionalData}
              />
            </Form.Group>
          </Form>
          <div className="w-100 text-center mt-3"></div>
        </Card.Body>
      </Card>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {" "}
        <TimePicker onClick={nextPage}>Next</TimePicker>
      </div>
    </>
  );
}
