import React, { useState, useRef } from "react";
import { useAuth } from "../contexts/AuthContext";
import ConfirmDetails from "../components/Preferences/ConfirmDetails";
import { format } from "date-fns";
import StripeContainer from "./StripeContainer";
import CardList from "./Preferences/CardList";
import washngo from "../Assets/washngo.png";
import { Button, Card, Form, Collapse, Alert } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import animation from "../Assets/success.gif";

import { useHistory } from "react-router-dom";

export default function Confirmation() {
  const {
    pickupDate,
    logout,
    readProfile,
    currentUser,
    customerPortal,
    getPromos,
  } = useAuth();

  const history = useHistory();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const couponCode = useRef();
  const [open, setOpen] = useState(false);

  const [loading, setLoading] = useState(false);

  const userData = JSON.parse(sessionStorage.getItem("stripeInstance"));
  if (!userData) {
    readProfile(currentUser.uid);
  }

  async function handlePortal() {
    setError("");

    try {
      setLoading(true);
      customerPortal(userData.id).then((url) => {
        window.location = url;
      });
    } catch (err) {
      setError("Failed open portal");
      console.log(err.message);
    }
    setLoading(false);
  }

  async function handleLogout() {
    setError("");
    setLoading(true);

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
    setLoading(false);
  }

  let commonProps;
  let cardList;

  try {
    const data = JSON.parse(sessionStorage.getItem("stripeInstance"));
    var day = new Date(JSON.parse(sessionStorage.getItem("pickupDay")));
    var time = JSON.parse(sessionStorage.getItem("pickupTime"));

    var detergent = JSON.parse(sessionStorage.getItem("detergent"));
    var dryer = JSON.parse(sessionStorage.getItem("dryer"));
    var whites = JSON.parse(sessionStorage.getItem("whites"));
    var softener = JSON.parse(sessionStorage.getItem("softener"));
    var additional = JSON.parse(sessionStorage.getItem("additional"));

    var bags = JSON.parse(sessionStorage.getItem("bags"));
    var pieces = JSON.parse(sessionStorage.getItem("pieces"));

    cardList = data.id;

    var address;
    if (data.shipping) {
      address = data.shipping.address;
    } else {
      address = "N/A";
    }
    commonProps = {
      name: data.name,
      puDate: format(day, "MMMM do, yyyy"),
      puTime: time,
      address: address,
      bagsNo: bags,
      piecesNo: pieces,
      dayOfWeek: format(day, "EEEE"),
      det: detergent,
      dry: dryer,
      soft: softener,
      addit: additional,
      whi: whites,
    };
  } catch (err) {
    console.log(err);
    setError("Failed to log out");
  }

  function goBack() {
    try {
      setLoading(true);
      history.push("/products");
    } catch (err) {
      console.log(err.message);
    }
    setLoading(false);
  }

  function applyCoupon() {
    try {
      getPromos(couponCode.current.value).then((coupon) => {
        if (coupon) {
          setSuccess("Coupon Applied");
          setError("");
        } else {
          setError("Coupon not valid");
          setSuccess("");
        }
      });
    } catch (err) {
      console.log(err.message);
      setError(err.message);
    }
  }

  return (
    <div>
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
      <ConfirmDetails commonProps={commonProps}></ConfirmDetails>
      <Card
        style={{
          padding: "10px",
          color: "black",
          fontWeight: "bold",
          backgroundColor: "lightblue",
        }}
      >
        To schedule your pickup, we require a $25 deposit. This amount will be
        deducted from your final total.
      </Card>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          paddingTop: "5px",
        }}
      >
        <Button
          style={{
            margin: "0px",
            backgroundColor: "transparent",
            boxShadow: "none",
            border: "none",
          }}
          onClick={() => {
            setOpen(!open);
            setError("");
          }}
          aria-controls="example-collapse-text"
          aria-expanded={open}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {open ? (
              <FontAwesomeIcon icon="minus-circle" size="md" color="#336daf" />
            ) : (
              <div>
                <p
                  style={{
                    color: "black",
                    fontSize: "12px",
                    margin: "0px",
                    fontWeight: "bold",
                  }}
                >
                  Add Promo Code
                </p>
                <FontAwesomeIcon icon="plus-circle" size="md" color="#336daf" />
              </div>
            )}
          </div>
        </Button>
        <Collapse in={open}>
          <div id="example-collapse-text">
            <Form>
              <Form.Group id="coupon">
                <Form.Control ref={couponCode} placeholder="Promo Code" />
              </Form.Group>
              <Button
                style={{ margin: "0px" }}
                className="w-100"
                onClick={applyCoupon}
              >
                Apply
              </Button>
            </Form>
          </div>
        </Collapse>
      </div>
      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}
      <CardList cardList={cardList}></CardList>

      <StripeContainer></StripeContainer>
    </div>
  );
}
