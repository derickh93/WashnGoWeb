import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import React from "react";
import PaymentForm from "./PaymentForm";

const PUBLIC_KEY =
  "pk_test_51Hi7bWEkFqXnuEeNPS2AM0R1240RpwhpKqKch8Ywu8GvkHEBPd7sgnXW9gikdqaaTK9c2fWebMfe1VKK3TO7igeW000LknCLVS";

const stripeTestPromise = loadStripe(PUBLIC_KEY);
export default function StripeContainer() {
  return (
    <Elements stripe={stripeTestPromise}>
      <PaymentForm />
    </Elements>
  );
}
