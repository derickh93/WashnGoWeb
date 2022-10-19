import React, { useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { Button } from "react-bootstrap";
import {useSelector,useDispatch} from "react-redux"
import { resetDry } from "../redux/dry-clean-qty";
import { resetWash } from "../redux/wash-qty";
import {clearAdditional, clearDetergentScent} from "../redux/preference"




import { useHistory } from "react-router-dom";

import "../App.css";
import { clearPickupDate, clearPickupTime } from "../redux/pickup";

export default function Confirmation() {

  const { logout, readProfile, currentUser, 
    //customerPortal, 
    sendMessage} = useAuth();

  const {pickupDate,pickupTime} = useSelector((state) => state.pickup);



  const history = useHistory();
  
  const userData = JSON.parse(sessionStorage.getItem("stripeInstance"));
  if (!userData) {
    readProfile(currentUser.uid);
  }

  const stripeData = JSON.parse(sessionStorage.getItem("stripeInstance"));

  const firstName = stripeData.name.split(" ")[0];

  const dispatch = useDispatch();


  // async function handlePortal() {


  //   try {
  //     customerPortal(userData.id,'thankyou').then((url) => {
  //       window.location = url;
  //     });
  //   } catch (err) {
  //     console.log(err.message);
  //   }
  // }

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

  const address = JSON.parse(sessionStorage.getItem("stripeInstance")).shipping.address;

  const { arr } = useSelector((state) => state.dryClean);
  const sumArr = arr.reduce((accumulator, value) => {
    return accumulator + value;
  }, 0);

  const { arrWash } = useSelector((state) => state.wash);
  const sumArrWash= arrWash.reduce((accumulator, value) => {
    return accumulator + value;
  }, 0);

  useEffect(()=>{
    const customerMSG = `Thank you for your order ${stripeData.name}. Please have your clothes ready for pickup on ${pickupDate} between ${pickupTime}.`;
    const adminMSG = `${stripeData.name} has placed an order for pickup on ${pickupDate} between ${pickupTime}.
    \nAddress: ${address.line1}\n${address.city}\n${address.postal_code}\nBags: ${sumArrWash}\nDry Clean: ${sumArr}`;
    sendMessage(customerMSG
      ,
      stripeData.phone,
      stripeData.metadata.Contact === 'Text'? true:false
    )
      .catch((error) => {
        console.log(error);
      })
      .then(() => {
        sendMessage(
          adminMSG,
          process.env.REACT_APP_TWILIO_TO,
          true
        ).catch((error) => {
          console.log(error);
        });
      });
    
      dispatch(resetWash());
      dispatch(resetDry());
      dispatch(clearAdditional());
      dispatch(clearDetergentScent());
      dispatch(clearPickupDate());
      dispatch(clearPickupTime());
    // eslint-disable-next-line
    },[]) // <-- empty dependency array

  return (
    <div>
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
      <h4>Hey, {firstName}!</h4>

      <p style={{ padding: "5", fontWeight: "bold" }}>
        Now that you've scheduled, you can cross laundry off your to do list.{" "}
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
          We will be seeing you {pickupDate} between {pickupTime}
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
          margin: "10px",
        }}
      >



<button className="nextBtn" onClick={() =>{
            schedule()
          }}>Schedule Another Order</button>
        <div style={{ padding: "8px" }}>
        <Button
          style={{
            width: "20%",
            height: "20%",
            fontSize: "11px",
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
