import React, { useState } from "react";
import { Form, Card, Alert } from "react-bootstrap";
import { useHistory } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useSelector,useDispatch} from "react-redux";
import { setAdditional,setDetergentScent} from "../redux/preference";

export default function Preferences() {
  const [error, setError] = useState("");
  const detergentChoice = "Scented";
  const detergentChoiceTwo = "Non-Scented";

  const { additional,detergentScent} = useSelector((state) => state.preference);


const dispatch = useDispatch();

const handleMessageChange = event => {
  // 👇️ update textarea value
  dispatch(setAdditional(event.target.value));
};

  const { arrWash } = useSelector((state) => state.wash);

  const {
    logout,
    //customerPortal,
    readProfile,
    currentUser,
  } = useAuth();

  const history = useHistory();
  const userData = JSON.parse(sessionStorage.getItem("stripeInstance"));

  //   const detergentData = JSON.parse(sessionStorage.getItem("detergent"));
  // if (!detergentData) {
  //   sessionStorage.setItem("detergent", JSON.stringify(detergentChoice));
  // }

  let sumArrWash = arrWash.reduce((accumulator, value) => {
    return accumulator + value;
  }, 0);

  if (!userData) {
    readProfile(currentUser.uid);
  }

  // async function handlePortal() {
  //   setError("");

  //   try {
  //     customerPortal(userData.id, "preferences").then((url) => {
  //       window.location = url;
  //     });
  //   } catch (err) {
  //     setError("Failed open portal");
  //     console.log(err.message);
  //   }
  // }

  async function handleLogout() {
    setError("");

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
  }

  const handleDetergent = () => {
    const val = document.querySelector('input[name="detergentScent"]:checked').value
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
      <div className="w-100 text-center mt-3">


        {sumArrWash > 0 && (
          <div style={{ padding: "10px" }}>
            <span>Detergent Scent</span>
            <div style={{ padding: "10px" }}>
              <div className="d-flex flex-column">
                <div style={{ padding: 5 }}>
                  {" "}

                  {
                  detergentScent === 'Scented'?
                  <input
                    type="radio"
                    value={detergentChoice}
                    name="detergentScent"
                    defaultChecked
                    onChange={() =>{
                      handleDetergent()
                    }}
                  />
:


                  <input
                    type="radio"
                    value={detergentChoice}
                    name="detergentScent"
                    onChange={() =>{
                      handleDetergent()
                    }}
                  />
}
                  Scented
                </div>

                <div style={{ padding: 5 }}>
                  {" "}
                  {
                  detergentScent === 'Non-Scented'?
                  <input
                    type="radio"
                    value={detergentChoiceTwo}
                    name="detergentScent"
                    defaultChecked
                    onChange={() =>{
                      handleDetergent()
                    }}
                  />:
                  <input
                  type="radio"
                  value={detergentChoiceTwo}
                  name="detergentScent"
                  onChange={() =>{
                    handleDetergent()
                  }}
                />}
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
