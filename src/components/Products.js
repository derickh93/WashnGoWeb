import React, { useState, useEffect} from "react";
import { Alert, Collapse, Button } from "react-bootstrap";
import { useAuth } from "../contexts/AuthContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useHistory } from "react-router-dom";

import { useSelector, useDispatch } from "react-redux";
import {
  increment,
  decrement,
  resetDry,
  sumDryCleanArr,
} from "../redux/dry-clean-qty";
import {
  incrementWash,
  decrementWash,
  resetWash,
  sumArrWash,
} from "../redux/wash-qty";
import {
  incrementBulky,
  decrementBulky,
  resetBulky,
  sumBulkyArr,
} from "../redux/bulky-qty";
import washingMachine from "../Assets/washing-machine.png";
import dryClean from "../Assets/dry-cleaning.png";
import bulkyPic from "../Assets/washing.png";
import { clearAdditional, setDetergentScent } from "../redux/preference";
import { setPickupTime } from "../redux/pickup";

export default function Products() {
  const { logout,getProducts} = useAuth();
  const [error, setError] = useState("");

  const { arr } = useSelector((state) => state.dryClean);
  const { arrWash } = useSelector((state) => state.wash);
  const { bulkyArr } = useSelector((state) => state.bulky);

  const sumArrWashValue = useSelector(sumArrWash);
  const sumArrDryCleanVal = useSelector(sumDryCleanArr);
  const sumBulkyValue = useSelector(sumBulkyArr);

  const [openDC, setOpenDC] = React.useState(false);
  const [openBulky, setOpenBulky] = React.useState(false);
  const [openWash, setOpenWash] = React.useState(true);

  const history = useHistory();
  const dispatch = useDispatch();

  let arrCount = sumArrWashValue + sumArrDryCleanVal + sumBulkyValue;

  const [dryCleanProds, setDryCleanProds] = useState([]);
  const [washProds, setWashProds] = useState([]);
  const [bulkyProds, setBuilkyProds] = useState([]);

  useEffect(() => {
    async function getProductList() {
      const res = await getProducts();
      return res;
    }

   getProductList().then((res) =>{
    setDryCleanProds(res.dry_clean);
    setWashProds(res.wash);
    setBuilkyProds(res.bulky_item);
   })

    }, [])

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

  async function nextPage() {
    try {
      if (arrCount === 0) {
        setError("Select an option");
      } else history.push("/preferences");
    } catch (err) {
      console.log(err.message);
    }
  }

  function goBack() {
    try {
      history.push("/time");
    } catch (err) {
      console.log(err.message);
    }
  }

  return (
    <>
      <div className="homepage">
        {error && <Alert variant="danger">{error}</Alert>}
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr",
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
              height: 'auto',
            }}
            variant="link"
            onClick={() => {
              dispatch(resetWash());
              dispatch(resetDry());
              dispatch(resetBulky());
              dispatch(clearAdditional());
              dispatch(setDetergentScent("Scented"));
              dispatch(setPickupTime("6pm - 9pm"));
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span>
                {arrCount}
                <FontAwesomeIcon icon="cart-arrow-down" />
              </span>
              <u>Clear</u>
            </div>
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
        <div
          onClick={() => {
            setOpenWash(!openWash);
          }}
          aria-controls="example-collapse-text1"
          aria-expanded={openWash}
        >
          <span>
            <u>Wash</u>
          </span>

          <img
            src={washingMachine}
            alt="washing machine"
            style={{ height: 50, width: 50, padding: 5 }}
          />
          {!openWash ? (
            <FontAwesomeIcon icon="chevron-down" size="lg" color="#1C2F74" />
          ) : (
            <FontAwesomeIcon icon="chevron-up" size="lg" color="#1C2F74" />
          )}
        </div>
        <Collapse in={openWash}>
          <div id="example-collapse-text1">
            {washProds.map((item, idx) => (
              <div
                key={idx + 100}
                style={{ backgroundColor: idx % 2 === 0 ? "#F0F8FF" : "" }}
              >
                <div className="row d-flex align-items-center">
                  <h6 className="col-4">{item.name}</h6>
                  <h6 className="col-2">{item.price}</h6>
                  <div className=" col-6 d-flex flex-row align-items-center">
                    <Button
                      style={{ backgroundColor: "#1C2F74", padding: 0 }}
                      className="buttonEffects"
                      onClick={() => {
                        dispatch(decrementWash(idx));
                      }}
                    >
                      -
                    </Button>
                    <h1 style={{ padding: "5px", fontSize: 30 }}>
                      {arrWash[idx]}
                    </h1>

                    <Button
                      style={{ backgroundColor: "#1C2F74", padding: 0 }}
                      className="buttonEffects"
                      onClick={() => {
                        dispatch(incrementWash(idx));
                      }}
                    >
                      +
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Collapse>
        <div
          onClick={() => {
            setOpenBulky(!openBulky);
          }}
          aria-controls="example-collapse-text3"
          aria-expanded={openBulky}
        >
          <span>
            <u>Bulky Items</u>
          </span>

          <img
            src={bulkyPic}
            alt="bulky items"
            style={{ height: 50, width: 50, padding: 5 }}
          />
          {!openBulky ? (
            <FontAwesomeIcon icon="chevron-down" size="lg" color="#1C2F74" />
          ) : (
            <FontAwesomeIcon icon="chevron-up" size="lg" color="#1C2F74" />
          )}
        </div>
        <Collapse in={openBulky}>
          <div id="example-collapse-text3">
            {bulkyProds.map((item, idx) => (
              <div
                key={idx}
                style={{ backgroundColor: idx % 2 === 0 ? "#F0F8FF" : "" }}
              >
                <div className="row d-flex align-items-center">
                  <h6 className="col-4">{item.name}</h6>
                  <h6 className="col-2">{item.price}</h6>
                  <div className=" col-6 d-flex flex-row align-items-center">
                    <Button
                      className="buttonEffects"
                      style={{ backgroundColor: "#1C2F74", padding: 0 }}
                      onClick={() => {
                        dispatch(decrementBulky(idx));
                      }}
                    >
                      -
                    </Button>
                    <h1 style={{ padding: "10px" }}>{bulkyArr[idx]}</h1>

                    <Button
                      className="buttonEffects"
                      style={{ backgroundColor: "#1C2F74", padding: 0 }}
                      onClick={() => {
                        dispatch(incrementBulky(idx));
                      }}
                    >
                      +
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Collapse>
        <div
          onClick={() => {
            setOpenDC(!openDC);
          }}
          aria-controls="example-collapse-text2"
          aria-expanded={openBulky}
        >
          <span>
            <u>Dry Clean</u>
          </span>

          <img
            src={dryClean}
            alt="dry clean"
            style={{ height: 50, width: 50, padding: 5 }}
          />
          {!openDC ? (
            <FontAwesomeIcon icon="chevron-down" size="lg" color="#1C2F74" />
          ) : (
            <FontAwesomeIcon icon="chevron-up" size="lg" color="#1C2F74" />
          )}
        </div>
        <Collapse in={openDC}>
          <div id="example-collapse-text2">
            {dryCleanProds.map((item, idx) => (
              <div
                key={idx}
                style={{ backgroundColor: idx % 2 === 0 ? "#F0F8FF" : "" }}
              >
                <div className="row d-flex align-items-center">
                  <h6 className="col-4">{item.name}</h6>
                  <h6 className="col-2">{item.price}</h6>
                  <div className=" col-6 d-flex flex-row align-items-center">
                    <Button
                      className="buttonEffects"
                      style={{ backgroundColor: "#1C2F74", padding: 0 }}
                      onClick={() => {
                        dispatch(decrement(idx));
                      }}
                    >
                      -
                    </Button>
                    <h1 style={{ padding: "10px" }}>{arr[idx]}</h1>

                    <Button
                      className="buttonEffects"
                      style={{ backgroundColor: "#1C2F74", padding: 0 }}
                      onClick={() => {
                        dispatch(increment(idx));
                      }}
                    >
                      +
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Collapse>
        <button
          className="nextBtn"
          onClick={() => {
            nextPage();
          }}
        >
          Next
        </button>{" "}
      </div>
    </>
  );
}
