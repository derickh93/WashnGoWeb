import React, { useRef, useState } from "react";
import { Form, Button, Card, Alert } from "react-bootstrap";
import { useAuth } from "../contexts/AuthContext";
import { Link, useHistory, Redirect } from "react-router-dom";
import animation from "../Assets/8166-laundry-illustration-animation.gif";
import eyeShow from "../Assets/eye-regular.svg";
import eyeHide from "../Assets/eye-slash-regular.svg";

export default function Login() {
  const emailRef = useRef();
  const passwordRef = useRef();
  const { login, currentUser} = useAuth();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const history = useHistory();

  const [type, setType] = useState("password");

  function showHide(e) {
    setType(type === "text" ? "password" : "text");
  }

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      setError("");
      setLoading(true);
      await login(emailRef.current.value, passwordRef.current.value)
        .then(() => {
          history.push("/orders");
        })
        .catch((err) => {
          if (
            err.message ===
            "Error: There is no user record corresponding to this identifier. The user may have been deleted."
          ) {
            setError(
              "There is no account associated with this email. Please sign up below."
            );
          } else {
            setError(err.message);
          }
        });
    } catch (err) {
      if (
        err.message ===
        "Error: There is no user record corresponding to this identifier. The user may have been deleted."
      ) {
        setError(
          "There is no account associated with this email. Please sign up below."
        );
      } else {
        setError(err.message);
      }
    }

    setLoading(false);
  }

  return (
    <>
      {currentUser ? <Redirect to="/time" /> : ""}
      {loading ? (
        <div className="homepage">
          <img src={animation} alt="loading..." />
        </div>
      ) : (
        <div>
          <Card>
            <Card.Body>
              <h2 className="text-center mb-4">Log In</h2>
              {error && <Alert variant="danger">{error}</Alert>}
              <Form onSubmit={handleSubmit}>
                <Form.Group id="email">
                  <Form.Label htmlFor="emaillabel">Email</Form.Label>
                  <Form.Control id="emaillabel" name="email" type="email" ref={emailRef} required />
                </Form.Group>
                <Form.Group id="password">
                  <Form.Label htmlFor="passwordlabel">Password</Form.Label>
                  <div className="d-flex align-items-center justify-content-center">
                    <Form.Control
                    id="passwordlabel"
                    name="password"
                      type={type}
                      ref={passwordRef}
                      required
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
                <Button
                  style={{ margin: "0px", backgroundColor: "#1C2F74" }}
                  disabled={loading}
                  className="w-100"
                  type="submit"
                >
                  Log In
                </Button>
              </Form>
              <div className="w-100 text-center mt-3">
                <Link to="/forgot-password">Forgot Password?</Link>
              </div>
            </Card.Body>
          </Card>
          <div className="w-100 text-center mt-2">
            Need an account? <Link to="/signup">Sign Up</Link>
          </div>
        </div>
      )}
    </>
  );
}
