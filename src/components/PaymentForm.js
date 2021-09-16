import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import axios from "axios";
import React, { useState } from "react";
import "../App.css";
import { format } from "date-fns";
import { useAuth } from "../contexts/AuthContext";
import { useHistory } from "react-router-dom";
import { Alert } from "react-bootstrap";
import animation from "../Assets/890-loading-animation.gif";

require("dotenv").config();

const domain = process.env.REACT_APP_DOMAIN;

const CARD_OPTIONS = {
  iconStyle: "solid",
  style: {
    base: {
      iconColor: "#c4f0ff",
      color: "#fff",
      fontWeight: 500,
      fontFamily: "Roboto, Open Sans, Segoe UI, sans-serif",
      fontSize: "16px",
      fontSmoothing: "antialiased",
      ":-webkit-autofill": { color: "#fce883" },
      "::placeholder": { color: "#87bbfd" },
    },
    invalid: {
      iconColor: "#ffc7ee",
      color: "#ffc7ee",
    },
  },
};

export default function PaymentForm() {
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const stripe = useStripe();
  const elements = useElements();
  const { sendMessage, handleInvoice } = useAuth();
  const history = useHistory();
  const stripeData = JSON.parse(sessionStorage.getItem("stripeInstance"));
  const puTime = JSON.parse(sessionStorage.getItem("pickupTime"));
  const rawDay = new Date(JSON.parse(sessionStorage.getItem("pickupDay")));
  const puDay = format(rawDay, "MMMM do, yyyy");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();
    if (!stripeData.shipping) {
      setError("Please add an address");
    } else {
      const { error, paymentMethod } = await stripe.createPaymentMethod({
        type: "card",
        card: elements.getElement(CardElement),
      });

      if (!error) {
        try {
          const { id } = paymentMethod;
          const response = await axios.post(`${domain}payment`, {
            amount: parseInt(process.env.REACT_APP_PRICE),
            id,
            cid: stripeData.id,
            email: stripeData.email,
          });

          if (response.data.success) {
            console.log("Successful payment");
            setSuccess(true);
            sessionStorage.setItem(
              "receipt",
              JSON.stringify(
                response.data.stripeRes.charges.data[0].receipt_url
              )
            );
            handleInvoice(stripeData.id).then(() =>
              sendMessage(
                `Thank you for your order ${stripeData.name}.`,
                stripeData.phone,
                stripeData.metadata.Text
              )
                .catch((error) => {
                  console.log(error);
                })
                .then(() => {
                  sendMessage(
                    `${stripeData.name} has placed an order for pickup on ${puDay} between ${puTime}`,
                    process.env.REACT_APP_TWILIO_TO,
                    stripeData.metadata.Text
                  ).catch((error) => {
                    console.log(error);
                  });
                })
            );
            history.push("/thankyou");
          } else {
            setError(response.data.message);
            console.log(response.data.message);
          }
        } catch (error) {
          console.log("Error", error);
        }
      } else {
        try {
          const id = JSON.parse(sessionStorage.getItem("cardID"));
          const response = await axios.post(`${domain}payment`, {
            amount: parseInt(process.env.REACT_APP_PRICE),
            id,
            cid: stripeData.id,
            email: stripeData.email,
          });

          if (response.data.success) {
            sessionStorage.setItem(
              "receipt",
              JSON.stringify(
                response.data.stripeRes.charges.data[0].receipt_url
              )
            );
            console.log(response.data.stripeRes.charges.data[0].receipt_url);

            console.log("Successful payment");
            setSuccess(true);
            handleInvoice(stripeData.id).then(() =>
              sendMessage(
                `Thank you for your order ${stripeData.name}.`,
                stripeData.phone,
                stripeData.metadata.Text
              )
                .catch((error) => {
                  console.log(error);
                })
                .then(() => {
                  sendMessage(
                    `${stripeData.name} has placed an order for pickup on ${puDay} between ${puTime}`,
                    process.env.REACT_APP_TWILIO_TO,
                    stripeData.metadata.Text
                  ).catch((error) => {
                    console.log(error);
                  });
                })
            );
            history.push("/thankyou");
          }
        } catch (error) {
          console.log("Error", error);
        }
        console.log(error.message);
      }
    }
    setLoading(false);
  };

  return (
    <>
      {loading ? (
        <div className="homepage">
          <img src={animation} alt="loading..." />
        </div>
      ) : null}
      {error && <Alert variant="danger">{error}</Alert>}
      {!success ? (
        <div>
          <form onSubmit={handleSubmit}>
            <fieldset className="FormGroup">
              <div className="FormRow">
                <CardElement options={CARD_OPTIONS} />
              </div>
            </fieldset>

            <div className="formbtn">
              {" "}
              <button>Pay</button>
            </div>
          </form>
        </div>
      ) : (
        <div>
          <h2>You just scheduled laundry service!</h2>
        </div>
      )}
    </>
  );
}
