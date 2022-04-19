import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { format } from "date-fns";
import washngo from "../Assets/washngo.png";
import MyButton from "./Button";
import { Button } from "react-bootstrap";
import CardModal from "./CardModal";

import { useHistory } from "react-router-dom";

import "../App.css";

export default function Confirmation() {
  const [error, setError] = useState("");

  const { logout, readProfile, currentUser, customerPortal } = useAuth();

  const pickupTime = JSON.parse(sessionStorage.getItem("pickupTime"));
  const pickupDate = new Date(JSON.parse(sessionStorage.getItem("pickupDay")));
  const receipt = JSON.parse(sessionStorage.getItem("receipt"));

  const history = useHistory();

  const userData = JSON.parse(sessionStorage.getItem("stripeInstance"));
  if (!userData) {
    readProfile(currentUser.uid);
  }

  const stripeData = JSON.parse(sessionStorage.getItem("stripeInstance"));

  const firstName = stripeData.name.split(" ")[0];

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

  async function handleReceipt() {
    setError("");

    try {
      window.location = receipt;
    } catch (err) {
      setError("Failed open portal");
      console.log(err.message);
    }
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

  async function schedule() {
    try {
      sessionStorage.clear();
      history.push("/time");
    } catch (err) {}
  }

  return (
    <div>
      <div className="homepage">
        <img
          style={{ width: "100px", height: "100px" }}
          src={washngo}
          alt="washngo"
        />
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
        {/* <span>Order No. ###PlaceHolder###</span> */}
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
      <span style={{ fontWeight: "bold", textDecorationLine: "underline" }}>
        Summary of Charges
      </span>
      <div style={{ display: "flex" }}>
        $25 minimum
        <Button
          style={{
            width: "20%",
            height: "20%",
            fontSize: "12px",
            backgroundColor: "transparent",
            boxShadow: "none",
            marginLeft: "auto",
          }}
          variant="link"
          onClick={handleReceipt}
        >
          <u>Receipt</u>
        </Button>
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
          <CardModal
            styles={{
              fontSize: "12px",
              backgroundColor: "transparent",
              boxShadow: "none",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            btnTitle="Contact Us"
            header="Contact Us"
            text="Text or Call: (718) 479-2249 (Texting is FAST!)"
            email="Email: waglaundry@gmail.com"
            closeButton="Got it"
            onClick={true}
          ></CardModal>
        </div>
      </div>
    </div>
  );
}
