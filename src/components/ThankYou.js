import React, { useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { Button } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import { resetDry, sumDryCleanArr } from "../redux/dry-clean-qty";
import { resetWash, sumArrWash } from "../redux/wash-qty";
import { clearAdditional, setDetergentScent } from "../redux/preference";
import { useHistory } from "react-router-dom";
import "../App.css";
import { resetBulky, sumBulkyArr } from "../redux/bulky-qty";
import { resetAccountPrefs } from "../redux/account-prefs";
import axios from "axios";

export default function Confirmation() {
  const { logout, sendMessage } = useAuth();
  const { name, phone, email, shipping, contact, id } = useSelector(
    (state) => state.user
  );

  const { pickupDate, pickupTime } = useSelector((state) => state.pickup);

  const { additional, detergentScent } = useSelector(
    (state) => state.preference
  );

  const history = useHistory();

  const firstName = name?.split(" ")?.[0];

  const dispatch = useDispatch();

  async function postOrder(
    name,
    address,
    bagCount,
    dryCount,
    bulkyCount,
    prefs,
    puTime,
    puDate,
    id
  ) {
    const data = new FormData();
    data.append(
      "data",
      JSON.stringify({
        customer_Name: name,
        pickup_Address: address,
        laundryBag_Count: bagCount,
        dryClean_Count: dryCount,
        bulky_Count: bulkyCount,
        preferences: prefs,
        pickup_Time: puTime,
        pickup_Date: puDate,
        customer_id: id,
      })
    );

    const config = {
      headers: {
        Authorization: `Bearer ${process.env.REACT_APP_STRAPI_API_KEY}`,
      },
    };
    const returnVal = await axios
      .post("https://lpday-strapi.herokuapp.com/api/Orders", data, config)
      .then((res) => {
        console.log(res);
      });
    return returnVal;
  }

  async function handleLogout() {
    try {
      await logout().then(() => {
        history.push("/login");
      });
    } catch (err) {
      console.log(err.message);
    }
  }

  async function schedule() {
    try {
      history.push("/orders");
    } catch (err) {}
  }

  const sumArrValue = useSelector(sumArrWash);
  const sumDryCleanValue = useSelector(sumDryCleanArr);
  const sumBulkyValue = useSelector(sumBulkyArr);

  const data = {
    Name: name,
    Bags: sumArrValue,
    Dry_Clean: sumDryCleanValue,
    Bulky: sumBulkyValue,
    Scent: detergentScent,
    Instructions: additional,
  };

  async function postGSheets() {
    await axios
      .post(
        "https://sheet.best/api/sheets/bb593659-47c1-4214-897b-9981436d0d2a",
        data
      )
      .then((res) => {
        console.log(res);
      });
  }

  useEffect(() => {
    if (
      (sumArrValue > 0 || sumDryCleanArr > 0 || sumBulkyArr > 0)
    ) {
      postGSheets();
      const customerMSG = `Thank you for your order ${name}. Please have your clothes ready for pickup on ${pickupDate} between ${pickupTime}.`;
      const adminMSG = `${name} has placed an order for pickup on ${pickupDate} between ${pickupTime}.
    \nAddress: ${shipping.address.line1}, ${shipping.address.line2}\n${shipping.address.city},\n${shipping.address.state}\nBags: ${sumArrValue}\nDry Clean: ${sumDryCleanValue}\nBulky Items: ${sumBulkyValue}`;
      sendMessage(customerMSG, phone, contact === "Text" ? true : false)
        .catch((error) => {
          console.log(error);
        })
        .then(() => {
          sendMessage(adminMSG, process.env.REACT_APP_TWILIO_TO, true).catch(
            (error) => {
              console.log(error);
            }
          );
        })
        .then(() => {
          postOrder(
            name,
            JSON.stringify(shipping.address),
            sumArrValue,
            sumDryCleanValue,
            sumBulkyValue,
            detergentScent + " : " + additional,
            pickupTime,
            pickupDate,
            id
          ).then((res) => {
            dispatch(resetWash());
            dispatch(resetDry());
            dispatch(resetBulky());
            dispatch(clearAdditional());
            dispatch(setDetergentScent("Scented"));
            dispatch(resetAccountPrefs());
          });
        });
    }
    // eslint-disable-next-line
  }, [contact, phone, sumArrValue, sumDryCleanValue, sumBulkyValue]); // <-- empty dependency array

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
        <span style={{ fontWeight: "bold" }}> {email}</span>
      </div>
      <div style={{ padding: "10px" }}></div>
      <div style={{ backgroundColor: "#f5f9fc", padding: "10px" }}>
        <span>
          We will be seeing you {pickupDate} between {pickupTime}
        </span>
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          margin: "10px",
        }}
      >
        <button
          className="nextBtn"
          onClick={() => {
            schedule();
          }}
        >
          View Orders
        </button>
        <div style={{ padding: "8px" }}>
          <Button
            style={{
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
