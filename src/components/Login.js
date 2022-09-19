import React, { useRef, useState } from "react";
import { Form, Button, Card, Alert } from "react-bootstrap";
import { useAuth } from "../contexts/AuthContext";
import { Link, useHistory, Redirect } from "react-router-dom";
import animation from "../Assets/8166-laundry-illustration-animation.gif";

export default function Login() {
  const emailRef = useRef();
  const passwordRef = useRef();
  const { login, currentUser, readProfile, getCustomer } = useAuth();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const history = useHistory();

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      setError("");
      setLoading(true);
      await login(emailRef.current.value, passwordRef.current.value)
        .then(() => {
          history.push("/time");
        })
        .catch((err) => {
          if (
            err.message ===
            "There is no user record corresponding to this identifier. The user may have been deleted."
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
        "There is no user record corresponding to this identifier. The user may have been deleted."
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
      ) : null}
      <Card>
        <Card.Body>
          <h2 className="text-center mb-4">Log In</h2>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form onSubmit={handleSubmit}>
            <Form.Group id="email">
              <Form.Label>Email</Form.Label>
              <Form.Control type="email" ref={emailRef} required />
            </Form.Group>
            <Form.Group id="password">
              <Form.Label>Password</Form.Label>
              <Form.Control type="password" ref={passwordRef} required />
            </Form.Group>
            <Button
              style={{ margin: "0px" }}
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
    </>
  );
}
