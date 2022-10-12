import React, { useRef, useState } from "react";
import { Form, Button, Card, Alert } from "react-bootstrap";
import { useAuth } from "../contexts/AuthContext";
import { Link, useHistory, Redirect } from "react-router-dom";
import InputMask from "react-input-mask";
import validator from "validator";

export default function Signup() {
  const emailRef = useRef();
  const passwordRef = useRef();
  const passwordConfirmRef = useRef();
  const firstNameRef = useRef();
  const lastNameRef = useRef();
  //const cellPhoneRef = useRef();
  const [phone, setPhone] = React.useState("");

  const { signup, sendMessage, currentUser } = useAuth();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const history = useHistory();

  async function handleSubmit(e) {
    e.preventDefault();

    if (passwordRef.current.value !== passwordConfirmRef.current.value) {
      return setError("Passwords do not match");
    }

    try {
      console.log("entered signup page");
      setError("");
      setLoading(true);
      if (!validator.isMobilePhone(phone)) {
        setError("Please enter a valid phone number");
        throw Error("Please enter a valid phone number");
      }
      let stripeUser = {
        firstName: firstNameRef.current.value,
        lastName: lastNameRef.current.value,
        phone: phone,
        email: emailRef.current.value,
      };

      signup(emailRef.current.value, passwordRef.current.value, stripeUser)
        .then(() =>
          sendMessage(
            `Welcome to Laundry Pickup NYC  ${firstNameRef.current.value}.`,
            phone
          )
            .catch((error) => {
              console.log(error);
              setError(error.message);
            })
            .then(() => history.push("/address"))
            .catch((error) => {
              console.log(error);
              setError(error.message);
            })
        )
        .catch((err) => {
          setError(err.message);
        });
    } catch (err) {
      console.log(err);
      setError(err.message);
    }

    setLoading(false);
  }
  return (
    <>
      {currentUser ? <Redirect to="/address" /> : ""}
      <Card>
        <Card.Body>
          <h2 className="text-center mb-4">Sign Up Below</h2>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form onSubmit={handleSubmit}>
            <Form.Group id="firstname">
              <Form.Control
                type="text"
                ref={firstNameRef}
                required
                placeholder="First Name"
              />
            </Form.Group>

            <Form.Group id="lastname">
              <Form.Control
                type="text"
                ref={lastNameRef}
                required
                placeholder="Last Name"
              />
            </Form.Group>

            <div style={{ paddingBottom: "15px" }}>
              <InputMask
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                mask="+1\(999) 999-9999"
                maskchar=""
              />
            </div>
            <Form.Group id="email">
              <Form.Control
                type="email"
                ref={emailRef}
                required
                placeholder="Email"
              />
            </Form.Group>

            <Form.Group id="password">
              <Form.Control
                type="password"
                ref={passwordRef}
                required
                placeholder="Password"
              />
            </Form.Group>

            <Form.Group id="password-confirm">
              <Form.Control
                type="password"
                ref={passwordConfirmRef}
                required
                placeholder="Confirm Password"
              />
            </Form.Group>
            <Button style={{backgroundColor:'#1C2F74'}} disabled={loading} className="w-100" type="submit">
              Sign Up
            </Button>
          </Form>
        </Card.Body>
      </Card>

      <div className="w-100 text-center mt-2">
        Already have an account? <Link to="/login">Log In</Link>
      </div>
    </>
  );
}
