import React, { useRef, useState } from "react";
import { Form, Button, Card, Alert } from "react-bootstrap";
import { useAuth } from "../contexts/AuthContext";
import { Link, useHistory, Redirect } from "react-router-dom";
import InputMask from "react-input-mask";
import validator from "validator";
import eyeShow from "../Assets/eye-regular.svg";
import eyeHide from "../Assets/eye-slash-regular.svg";

export default function Signup() {
  const emailRef = useRef();
  const passwordRef = useRef();
  const passwordConfirmRef = useRef();
  const firstNameRef = useRef();
  const lastNameRef = useRef();
  const [phone, setPhone] = React.useState("");

  const { signup, sendMessage, currentUser, checkPhoneNum } = useAuth();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const history = useHistory();
  const [type, setType] = useState("password");

  function showHide(e) {
    setType(type === "text" ? "password" : "text");
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (passwordRef.current.value !== passwordConfirmRef.current.value) {
      return setError("Passwords do not match");
    }

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

    try {
      checkPhoneNum(phone).then((res) => {
        if (!res) {
          signup(
            emailRef.current.value,
            passwordRef.current.value,
            stripeUser,
            phone
          )
            .then(() =>
              sendMessage(
                `Welcome to St. Albans Laundromat  ${firstNameRef.current.value}.`,
                phone,
                false
              ).then(() => history.push("/address"))
            )
            .catch((err) => {
              setError(err.message);
            });
        }
        else{
          setError("An account already exist associated with this phone number")
        }
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

            <Form.Group id="phonenumber">
              <div style={{ paddingBottom: "15px" }}>
                <InputMask
                  className="form-control"
                  placeholder="Phone Number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  mask="+1\(999) 999-9999"
                  maskchar=""
                  required
                />
              </div>
            </Form.Group>

            <Form.Group id="email">
              <Form.Control
                type="email"
                ref={emailRef}
                required
                placeholder="Email"
              />
            </Form.Group>

            <Form.Group id="password">
              <div className="d-flex align-items-center justify-content-center">
                <Form.Control
                  type={type}
                  ref={passwordRef}
                  required
                  placeholder="Password"
                  autoComplete="on"
                />
                <img
                      style={{ height: '1em', width: '1em', paddingInlineStart: '0.5em', paddingInlineEnd: '0.25em', boxSizing: 'content-box' }}
                      alt="eye"
                  src={type === "password" ? eyeShow : eyeHide}
                  onClick={() => {
                    showHide();
                  }}
                />
              </div>
            </Form.Group>

            <Form.Group id="password-confirm">
              <div className="d-flex align-items-center justify-content-center">
                <Form.Control
                  type={type}
                  ref={passwordConfirmRef}
                  required
                  placeholder="Confirm Password"
                  autoComplete="on"
                />
              </div>
            </Form.Group>
            <Button
              style={{ backgroundColor: "#1C2F74" }}
              disabled={loading}
              className="w-100"
              type="submit"
            >
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
