
import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import ConfirmDetails from "../components/Preferences/ConfirmDetails";
import { format } from "date-fns";
import StripeContainer from "./StripeContainer";
import CardList from "./Preferences/CardList";
import washngo from "../Assets/washngo.png";
import { Button, Card } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";


import { useHistory } from "react-router-dom";

export default function Confirmation() {
  const { pickupDate, logout, readProfile, currentUser, customerPortal } =
    useAuth();

  const history = useHistory();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);


  const userData = JSON.parse(sessionStorage.getItem("stripeInstance"));
  if (!userData) {
    readProfile(currentUser.uid);
  }

  async function handlePortal() {
    setError("");

    try {
      setLoading(true)
      customerPortal(userData.id).then((url) => {
        console.log(url);
        window.location = url;
      });
    } catch (err) {
      setError("Failed open portal");
      console.log(err.message);
    }
    setLoading(false)
  }

  async function handleLogout() {
    setError("");
    setLoading(true)

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
    setLoading(false)
  }

  var commonProps;
  var cardList;

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
    console.log(day);
    console.log(pickupDate);
    //currentStripeInstance.id;

    var address;
    if (data.shipping) {
      console.log("shipping valid");
      address = data.shipping.address;
    } else {
      console.log("shipping not valid");
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

    console.log(day);
    console.log(time);
    //console.log(data.shipping.address);
    console.log(bags);
    console.log(pieces);

    console.log(dryer);
    console.log(detergent);
    console.log(whites);
    console.log(softener);
    console.log(additional);
  } catch (err) {
    console.log(err.message);
    setError("Failed to log out");
  }

  function goBack() {
    try {
      setLoading(true)
      history.push("/products");
    } catch (err) {
      console.log(err.message);
    }
    setLoading(false)
  }

  //pull address from stripe
  //design confirmation page
  //pull saved credit cards

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
      <Card style={{ padding: "10px", color: "black",fontWeight:"bold",backgroundColor:"lightblue"}}>
        To schedule your pickup, we require a $22 deposit. This amount will be
        deducted from your final total.
      </Card>
      <CardList cardList={cardList}></CardList>
      <StripeContainer></StripeContainer>
    </div>
  );
}
