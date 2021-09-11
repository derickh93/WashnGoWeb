import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import React from "react";
import PaymentForm from "./PaymentForm";

const PUBLIC_KEY =
  "pk_test_51Hn72gHoaCWF2X26do1lf3M6YEMdzxUSeIgpyWXPw1XIkKA1Uxt73Kis3VRbgwwvN2PGoHi0ciMU2dksP6PeZE6U0065XvJjk3";

const stripeTestPromise = loadStripe(PUBLIC_KEY);
export default function StripeContainer() {
  return (
    <Elements stripe={stripeTestPromise}>
      <PaymentForm />
    </Elements>
  );
}
