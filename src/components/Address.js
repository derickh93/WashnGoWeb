import React, { useState, useRef } from "react";
import GooglePlacesAutocomplete from "react-google-places-autocomplete";
import "../App.css";
import { useAuth } from "../contexts/AuthContext";
import { useHistory } from "react-router-dom";
import { Alert } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import {
  changeDoorman,
  changeHotel,
  setDoorCode,
  changeCode,
} from "../redux/account-prefs";

const ZIP_CODES = [
  "11236",
  "11208",
  "11226",
  "11220",
  "11234",
  "11207",
  "11214",
  "11219",
  "11221",
  "11235",
  "11223",
  "11206",
  "11229",
  "11204",
  "11230",
  "11233",
  "11218",
  "11203",
  "11212",
  "11215",
  "11213",
  "11210",
  "11209",
  "11211",
  "11201",
  "11238",
  "11216",
  "11225",
  "11237",
  "11228",
  "11205",
  "11224",
  "11217",
  "11222",
  "11231",
  "11249",
  "11232",
  "11239",
  "11242",
  "11256",
  "11252",
  "11243",
  "11240",
  "11241",
  "11244",
  "11245",
  "11247",
  "11248",
  "11251",
  "11254",
  "11255",
  "11202",
  "11368",
  "11385",
  "11373",
  "11377",
  "11355",
  "11375",
  "11691",
  "11372",
  "11434",
  "11432",
  "11435",
  "11354",
  "11420",
  "11419",
  "11413",
  "11374",
  "11365",
  "11367",
  "11421",
  "11357",
  "11101",
  "11418",
  "11412",
  "11106",
  "11378",
  "11358",
  "11379",
  "11105",
  "11433",
  "11364",
  "11103",
  "11369",
  "11102",
  "11422",
  "11417",
  "11001",
  "11423",
  "11361",
  "11416",
  "11414",
  "11429",
  "11104",
  "11370",
  "11356",
  "11427",
  "11692",
  "11426",
  "11694",
  "11411",
  "11428",
  "11436",
  "11360",
  "11362",
  "11415",
  "11366",
  "11004",
  "11693",
  "11096",
  "11363",
  "11697",
  "11439",
  "11005",
  "11109",
  "11424",
  "11430",
  "11425",
  "11359",
  "11351",
  "11352",
  "11371",
  "11380",
  "11381",
  "11386",
  "11390",
  "11405",
  "11431",
  "11451",
  "11499",
  "11690",
  "11695",
  "11120",
  "11437",
];

export default function Address() {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { addAddress, getZipCode } = useAuth();
  const history = useHistory();
  const aptRef = useRef();
  const zipRef = useRef();

  const { doorman, code, hotel, code_door } = useSelector(
    (state) => state.accountPref
  );
  const { id, name, phone} = useSelector((state) => state.user);
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

      if (!value) {
        setError("Please add an address");
      }

      const options = {
        Doorman: doorman,
        Hotel: hotel,
        Door_Gate_Code: code_door,
        Contact: document.querySelector('input[name="contact"]:checked').value,
      };
      addAddress(
        id,
        value.value.terms[0].value + " " + value.value.terms[1].value,
        value.value.terms[2].value,
        value.value.terms[3].value,
        aptVal,
        name,
        options,
        phone,
        zipRef.current.value
      );

      history.push("/time");
    } catch (err) {
      console.log(err.message);
    }

    setLoading(false);
  }

  async function getAddress(val) {
    const res = await getZipCode(val.value.place_id);
    setValue(val);
    zipRef.current.value = res;
    console.log(res)
    if (ZIP_CODES.includes(zipRef.current.value)) setError("");
    else setError("Not In Service Area");
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

      <div style={{ display: "flex", flexDirection: "column" }}>
        <GooglePlacesAutocomplete
          apiKey={process.env.REACT_APP_GOOGLE_API_KEY}
          autocompletionRequest={{
            componentRestrictions: {
              country: ["us"],
            },
          }}
          selectProps={{
            value,
            onChange: (val) => {
              getAddress(val);
            },
            placeholder : 'Enter Address'
          }}
        />
        <input
        maxLength={5}
          type="number"
          id="zipcode"
          name="zipcode"
          placeholder="Zip Code"
          ref={zipRef}
          style={{ marginBlock: "8px" }}
          className="form-control"
        />

        <input
          type="text"
          id="apt"
          name="apt"
          placeholder="Apartment #"
          ref={aptRef}
          style={{ marginBlock: "8px" }}
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
          <label>
            {" "}
            <input
              type="checkbox"
              id="code"
              name="code"
              value={code}
              onChange={() => {
                dispatch(changeCode());
              }}
            />
          </label>

          <span style={{ margin: "5px" }}>
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
          <label>
            {" "}
            <input
              type="radio"
              value="Call"
              name="contact"
              checked
              readOnly
            />{" "}
            Call
          </label>
        </div>

        <div style={{ padding: 5 }}>
          {" "}
          <label>
            <input type="radio" value="Text" name="contact" readOnly /> Text
          </label>
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
