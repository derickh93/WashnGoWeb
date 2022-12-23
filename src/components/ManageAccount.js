import React, { useState,useRef } from "react";
import { useAuth } from "../contexts/AuthContext";
import animation from "../Assets/8166-laundry-illustration-animation.gif";
import { Form, Button, Card,Alert} from "react-bootstrap";
import { useHistory } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useSelector } from "react-redux";


export default function ManageAccount() {
  const { logout,sendMessage} = useAuth();

  const emailRef = useRef();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const history = useHistory();
  const {name,email} = useSelector((state) => state.user);


  const [viewOption, setViewOption] = useState(false);


  async function handleSubmit(e) {
    e.preventDefault();

    try {
      setError("");
      setSuccess("")
      setLoading(true);
      if(emailRef.current.value === email){
        setSuccess("Success, our team will process your request and reach out within 48 hours with confirmation") 
        sendMessage(name+' : ' + email + ': Has requested to delete their account', process.env.REACT_APP_TWILIO_TO, true)
      } 
      else{
        setError("Email does not match");
      }

    } catch (err) {
    }

    emailRef.current.value = "";
    setLoading(false);
  }

  async function handleLogout() {
    setError("");

    try {
      setLoading(true);
      await logout().then(() => {
        history.push("/login");
      });
    } catch (err) {
      console.log(err.message);
      setError("Failed to log out");
    }
    setLoading(false);
  }


  async function nextPage() {
    if (error === "") {
      try {
        setLoading(true);
        history.push("/time");
      } catch (err) {
        console.log(err.message);
      }
      setLoading(false);
    }
  }

  return (
    <>
      {loading ? (
        <div className="homepage">
          <img src={animation} alt="loading..." />
        </div>
      ) : (
        <div>
        <div
        style={{
          display: "flex",
          flexDirection: "row",

          justifyContent: "flex-end",
        }}
      >
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
        <div>
          <Card>
            <Card.Body>
              <div
        onClick={() => {
          setViewOption(!viewOption);
        }}
        className="d-flex flex column mt-2"
      >
        <h6 className="text-center pr-5">Account and User Data Delete Request</h6>

        {viewOption ? (
          <FontAwesomeIcon icon="chevron-up" size="lg" color="#1C2F74" />
        ) : (
          <FontAwesomeIcon icon="chevron-down" size="lg" color="#1C2F74" />
        )}
        </div>
              {viewOption && 
              <Form onSubmit={handleSubmit}>
                <Form.Group id="email">
                  <Form.Control id="emaillabel" name="email" type="email" ref={emailRef} placeholder={"Please Enter Your Email to Confirm Request"} required />
                </Form.Group>
                <Button
                  style={{ margin: "0px", backgroundColor: "#1C2F74"}}
                  disabled={loading}
                  className="w-100 mb-3"
                  type="submit"
                >
                  Delete
                </Button>
                {error && <Alert variant="danger">{error}</Alert>}
                {success && <Alert variant="success">{success}</Alert>}

              </Form>
}
            </Card.Body>

          </Card>
          <div style={{display:"flex",alignItems:"center",justifyContent:"center",marginTop:'5px'}}>
          <button
            className="nextBtn"
            onClick={() => {
              nextPage();
            }}
          >
            Schedule Order
          </button>
          </div>
          
        </div>
        </div>
      )}
    </>
  );
}