import React from "react";
import { useAuth } from "../contexts/AuthContext";
import { format } from "date-fns";
import MyButton from "./Button";
import { Button } from "react-bootstrap";

import { useHistory } from "react-router-dom";

import "../App.css";

export default function Confirmation() {

  const { logout, readProfile, currentUser, customerPortal } = useAuth();

  const pickupTime = JSON.parse(sessionStorage.getItem("pickupTime"));
  const pickupDate = new Date(JSON.parse(sessionStorage.getItem("pickupDay")));

  const history = useHistory();

  const userData = JSON.parse(sessionStorage.getItem("stripeInstance"));
  if (!userData) {
    readProfile(currentUser.uid);
  }

  const stripeData = JSON.parse(sessionStorage.getItem("stripeInstance"));

  const firstName = stripeData.name.split(" ")[0];

  async function handlePortal() {

    try {
      customerPortal(userData.id,'thankyou').then((url) => {
        window.location = url;
      });
    } catch (err) {
      console.log(err.message);
    }
  }

  async function handleLogout() {

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
    }
  }

  async function schedule() {
    try {
      sessionStorage.clear();
      history.push("/time");
    } catch (err) {}
  }

  return (
    <div>
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
      <h4>Hey, {firstName}!</h4>

      <p style={{ padding: "5", fontWeight: "bold" }}>
        Now that you've scheduled you can cross laundry off your to do list{" "}
      </p>

      <div style={{ backgroundColor: "#f5f9fc", padding: "10px" }}>
        <span>
          We've received your order. You can expect to receive a confirmation
          email at
        </span>
        <span style={{ fontWeight: "bold" }}> {stripeData.email}</span>
      </div>
      <div style={{ padding: "10px" }}>
      </div>
      <div style={{ backgroundColor: "#f5f9fc", padding: "10px" }}>
        <span>
          We will be seeing you {format(pickupDate, "EEEE")} -{" "}
          {format(pickupDate, "MMMM do, yyyy")} {pickupTime}
        </span>
        <div className="prefDetails">{stripeData.shipping.line1}</div>
        <div className="prefDetails">{stripeData.shipping.city}</div>
        <div className="prefDetails">{stripeData.shipping.state}</div>
        <div className="prefDetails">{stripeData.shipping.postal_code}</div>
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: "10px",
        }}
      >
        <MyButton
          cusClass="thankBtn"
          title={"Schedule another order"}
          action={() => {
            schedule();
          }}
        />
        <div style={{ padding: "10px" }}>
        <Button
          style={{
            width: "20%",
            height: "20%",
            fontSize: "12px",
            backgroundColor: "transparent",
            boxShadow: "none",
          }}
          variant="link"
          onClick={(event) => {
            event.preventDefault();
            window.Tawk_API.toggle();
          }}
        >
          <u>Contact Us</u>
        </Button>
        </div>
      </div>
    </div>
  );
}
