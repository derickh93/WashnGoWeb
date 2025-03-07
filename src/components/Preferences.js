import React, { useState } from "react";
import { Form, Card, Alert } from "react-bootstrap";
import { useHistory } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useSelector, useDispatch } from "react-redux";
import { setAdditional, setDetergentScent } from "../redux/preference";
import { sumArrWash } from "../redux/wash-qty";
import { sumBulkyArr } from "../redux/bulky-qty";

export default function Preferences() {
  const [error, setError] = useState("");
  const detergentChoice = "Scented";
  const detergentChoiceTwo = "Non-Scented";

  const { additional, detergentScent } = useSelector(
    (state) => state.preference
  );

  const dispatch = useDispatch();

  const handleMessageChange = (event) => {
    dispatch(setAdditional(event.target.value));
  };

  const sumArrWashValue = useSelector(sumArrWash);
  const sumBulkyValue = useSelector(sumBulkyArr);

  const { logout } = useAuth();

  const history = useHistory();

  async function handleLogout() {
    setError("");

    try {
      await logout().then(() => {
        history.push("/login");
      });
    } catch (err) {
      console.log(err.message);
      setError("Failed to log out");
    }
  }

  const handleDetergent = () => {
    const val = document.querySelector(
      'input[name="detergentScent"]:checked'
    ).value;
    dispatch(setDetergentScent(val));
  };

  async function nextPage(e) {
    e.preventDefault();

    try {
      setError("");
      history.push("/confirmation");
    } catch (err) {
      console.log(err.message);
    }
  }

  function goBack() {
    try {
      history.push("/products");
    } catch (err) {
      console.log(err.message);
    }
  }

  return (
    <>
   <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          alignItems: "center",
          justifyItems: 'center',
        }}
      >
        <Button
          variant="outline-primary"
          style={{
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
        </Button>
        <Button
          style={{
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
      <div className="w-100 text-center mt-3">
        {(sumArrWashValue > 0 || sumBulkyValue > 0) && (
          <div style={{ padding: "10px" }}>
            <span>Detergent Scent</span>
            <div style={{ padding: "10px" }}>
              <div className="d-flex flex-column">
                <div style={{ padding: 5 }}>
                  {" "}
                  {detergentScent === "Scented" ? (
                    <input
                      type="radio"
                      value={detergentChoice}
                      name="detergentScent"
                      defaultChecked
                      onChange={() => {
                        handleDetergent();
                      }}
                    />
                  ) : (
                    <input
                      type="radio"
                      value={detergentChoice}
                      name="detergentScent"
                      onChange={() => {
                        handleDetergent();
                      }}
                    />
                  )}
                  Scented
                </div>

                <div style={{ padding: 5 }}>
                  {" "}
                  {detergentScent === "Non-Scented" ? (
                    <input
                      type="radio"
                      value={detergentChoiceTwo}
                      name="detergentScent"
                      defaultChecked
                      onChange={() => {
                        handleDetergent();
                      }}
                    />
                  ) : (
                    <input
                      type="radio"
                      value={detergentChoiceTwo}
                      name="detergentScent"
                      onChange={() => {
                        handleDetergent();
                      }}
                    />
                  )}
                  Non-Scented
                </div>
              </div>
            </div>
          </div>
        )}
        {error && <Alert variant="danger">{error}</Alert>}
      </div>
      <span
        style={{
          alignItems: "center",
          justifyContent: "center",
          display: "flex",
        }}
      >
        Additional Instructions
      </span>
      <Card>
        <Card.Body>
          <Form onSubmit={nextPage}>
            <Form.Group id="additional">
              <Form.Control
                as="textarea"
                rows={3}
                value={additional}
                onChange={handleMessageChange}
              />
            </Form.Group>
            <div className="d-flex align-items-center justify-content-center">
              {" "}
              <button className="nextBtn" type="submit">
                Next
              </button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </>
  );
}
