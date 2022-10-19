import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import ConfirmDetails from "../components/Preferences/ConfirmDetails";
import { format } from "date-fns";
import { Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import animation from "../Assets/8166-laundry-illustration-animation.gif";
import { useSelector } from "react-redux";
import dryCleanProds from "./product-data/products.json";
import washProds from "./product-data/product-wash.json";

import { useHistory } from "react-router-dom";

export default function Confirmation() {
  const { logout, readProfile, currentUser, 
    //customerPortal, 
    checkoutSession } =
    useAuth();

  const { arr } = useSelector((state) => state.dryClean);
  const { arrWash } = useSelector((state) => state.wash);
  const { additional} = useSelector((state) => state.preference);


  let arrWashSum = arrWash.reduce((accumulator, value) => {
    return accumulator + value;
  }, 0);

  const history = useHistory();
  const [loading, setLoading] = useState(false);
  let validSum = 0;
  //////////////////////////////////////////////////////////////////////
  const line_items = [];
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] > 0) {
      validSum += parseFloat(dryCleanProds[i].price.substring(1));
      line_items.push({
        price: dryCleanProds[i].price_id,
        adjustable_quantity: {
          enabled: true,
          minimum: 1,
          maximum: 99,
        },
        quantity: arr[i],
      });
    }
  }

  for (let i = 0; i < arrWash.length; i++) {
    if (arrWash[i] > 0) {
      validSum += parseFloat(washProds[i].price.substring(1));
      line_items.push({
        price: washProds[i].price_id,
        adjustable_quantity: {
          enabled: true,
          minimum: 1,
          maximum: 99,
        },
        quantity: arrWash[i],
      });
    }
  }

  if (validSum < 30) {
    const finalSum = 3000 - validSum * 100;
    line_items.push({
      price_data: {
        currency: "usd",
        unit_amount: finalSum,
        product_data: {
          name: "Minimum",
          description: "$30 minimum",
          images: ["https://example.com/t-shirt.png"],
        },
      },
      quantity: 1,
    });
  }
  /////////////////////////////////////////////////////////////////////
  const userData = JSON.parse(sessionStorage.getItem("stripeInstance"));
  if (!userData) {
    readProfile(currentUser.uid);
  }

  async function handlePayment(e) {
    e.preventDefault();
    setLoading(true);
    try {
      checkoutSession(userData.id, line_items).then((url) => {
        window.location = url;
      });
    } catch (err) {
      console.log(err.message);
      setLoading(false);
    }
  }

  // async function handlePortal() {
  //   try {
  //     customerPortal(userData.id, "confirmation").then((url) => {
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

  let commonProps;

  try {
    const data = JSON.parse(sessionStorage.getItem("stripeInstance"));
    var day = new Date(JSON.parse(sessionStorage.getItem("pickupDay")));
    var time = JSON.parse(sessionStorage.getItem("pickupTime"));

    var detergent = JSON.parse(sessionStorage.getItem("detergent"));
    // var dryer = JSON.parse(sessionStorage.getItem("dryer"));
    // var whites = JSON.parse(sessionStorage.getItem("whites"));
    // var softener = JSON.parse(sessionStorage.getItem("softener"));

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
      dayOfWeek: format(day, "EEEE"),
      det: detergent,
      // dry: dryer,
      // soft: softener,
      addit: additional,
      arrWashSum: arrWashSum,
      // whi: whites,
    };
  } catch (err) {
    console.log(err);
  }

  function goBack() {
    try {
      history.push("/preferences");
    } catch (err) {
      console.log(err.message);
    }
  }

  return (
    <div>
      {loading ? (
        <div className="homepage">
          <img src={animation} alt="loading..." />
        </div>
      ) : (
        <div>
          <div className="homepage"></div>
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
                color="#1C2F74"
              />
            </Button>{" "}
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
          <ConfirmDetails commonProps={commonProps}></ConfirmDetails>
          {commonProps.address !== "N/A" && (
            <div className="d-flex justify-content-center">
              {" "}
              <Button
                className="mt-2"
                style={{ backgroundColor: "#1C2F74" }}
                onClick={(e) => {
                  handlePayment(e);
                }}
              >
                PAY
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
