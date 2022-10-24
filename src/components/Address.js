import React, { useState, useRef } from "react";
import GooglePlacesAutocomplete from "react-google-places-autocomplete";
import "../App.css";
import { useAuth } from "../contexts/AuthContext";
import { useHistory } from "react-router-dom";
import { Alert, Button } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import {
  changeDoorman,
  changeHotel,
  setDoorCode,
  changeCode,
} from "../redux/account-prefs";

const QUEENS_CITIES = [
  'Arverne',
  'Astoria',
  'Bayside',
  'Bellerose',
  'Breezy Point',
  'Cambria Heights',
  'College Point',
  'Corona',
  'East Elmhurst',
  'Elmhurst',
  'Far Rockaway',
  'Floral Park',
  'Flushing',
  'Forest Hills',
  'Fresh Meadows',
  'Glen Oaks',
  'Hollis',
  'Howard Beach',
  'Jackson Heights',
  'Jamaica',
  'Kew Gardens',
  'Little Neck',
  'Long Island City',
  'Maspeth',
  'Middle Village',
  'Oakland Gardens',
  'Ozone Park',
  'Queens Village',
  'Rego Park',
  'Richmond Hill',
  'Ridgewood',
  'Rockaway Park',
  'Rosedale',
  'Saint Albans',
  'South Ozone Park',
  'South Richmond Hill',
  'Springfield Gardens',
  'Sunnyside',
  'Whitestone',
  'Woodhaven',
  'Woodside',
];


export default function Address() {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { addAddress, logout } = useAuth();
  const history = useHistory();
  const aptRef = useRef();
  const { doorman, code, hotel, code_door } = useSelector(
    (state) => state.accountPref
  );
  const { id, name } = useSelector((state) => state.user);
  const [value, setValue] = useState(null);

  const dispatch = useDispatch();

  async function handleDoorChange(e) {
    dispatch(setDoorCode(e.target.value));
  }

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      if (error.length > 0) {
        throw new Error("Not In Service Area");
      }
      setError("");
      setLoading(true);

      var aptVal;
      if (!aptRef.current) {
        aptVal = "N/A";
      } else {
        aptVal = aptRef.current.value;
      }

      if(!value) {
        setError("Please add an address");
      }

      const options = {
        Doorman: doorman,
        Hotel: hotel,
        Door_Gate_Code: code_door,
        Contact: document.querySelector('input[name="contact"]:checked').value,
      };
      addAddress(id, value.value.terms[0].value + " " + value.value.terms[1].value, value.value.terms[2].value, value.value.terms[3].value, aptVal, name, options);

      history.push("/time");
    } catch (err) {
      setError(err.message);
    }

    setLoading(false);
  }

  async function handleLogout() {
    setError("");

    try {
      setLoading(true);
      await logout()
        .then(() => {
          history.push("/login");
        });
    } catch (err) {
      setError("Failed to log out");
    }
    setLoading(false);
  }

  return (
    <div>
      <div className="homepage">
        {error && <Alert variant="danger">{error}</Alert>}
      </div>
      <span
        style={{
          fontWeight: "bold",
          display: "flex",
          justifyContent: "center",
        }}
      >
        Let's start with your address
      </span>

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
      <div style={{ display: "flex", flexDirection: "column" }}>
        <GooglePlacesAutocomplete
          apiKey="AIzaSyBF8DyH9rlRyQ_3rWiOJ6NdkR7D79D6S6A"
          autocompletionRequest={{
            componentRestrictions: {
              country: ["us"],
            },
          }}
          selectProps={{
            value,
            onChange: (val) => {
              setValue(val);
              if(!QUEENS_CITIES.includes(val.value.terms[2].value)) {
                setError("Not In Service Area");
              }
            },
          }}
        />

        <input
          type="text"
          id="apt"
          name="apt"
          placeholder="Apartment #"
          ref={aptRef}
          style={{marginBlock:'8px'}}
          className="form-control"
        />
      </div> 
      <div
        style={{
          fontWeight: "bold",
          alignItems: "center",
          justifyContent: "center",
          display: "flex",
          textAlign: "center",
          padding: "5px",
        }}
      >
        Other Information
      </div>
      <div>
        <div>
          <input
            type="checkbox"
            id="doorman"
            name="doorman"
            value={doorman}
            onChange={() => {
              dispatch(changeDoorman());
            }}
          />
          <span style={{ padding: "5px" }}>Live in a doorman building? </span>
        </div>
        <div>
          <input
            type="checkbox"
            id="hotel"
            name="hotel"
            value={hotel}
            onChange={() => {
              dispatch(changeHotel());
            }}
          />
          <span style={{ padding: "5px" }}>
            Are you a guest of a hotel or motel?{" "}
          </span>
        </div>
        <div style={{ display: "flex" }}>
          <input
            type="checkbox"
            id="code"
            name="code"
            value={code}
            onChange={() => {
              dispatch(changeCode());
            }}
          ></input>
          <span style={{ padding: "5px" }}>
            Will you give us a key or door code?
          </span>
          {code && (
            <input
            className="form-control"
              type="text"
              id="code"
              name="code"
              placeholder="Door/Gate Code"
              value={code_door}
              onChange={(e) => handleDoorChange(e)}
            />
          )}
        </div>
        <span style={{ padding: "20px" }}>(If Key, enter 'Yes') </span>
      </div>

      <div
        style={{
          fontWeight: "bold",
          alignItems: "center",
          justifyContent: "center",
          display: "flex",
          textAlign: "center",
          padding: "5px",
        }}
      >
        Contact Preference
      </div>
      <div className="d-flex flex-column">
        <div style={{ padding: 5 }}>
          {" "}
          <input
            type="radio"
            value="Call"
            name="contact"
            checked
            readOnly
          />{" "}
          Call
        </div>

        <div style={{ padding: 5 }}>
          {" "}
          <input type="radio" value="Text" name="contact" readOnly /> Text
        </div>
      </div>
      <div className="address">
        <button disabled={loading} onClick={handleSubmit}>
          Schedule Service
        </button>
      </div>
    </div>
  );
}
