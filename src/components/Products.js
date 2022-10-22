import React, { useState } from "react";
import { Alert, Collapse, Button } from "react-bootstrap";
import { useAuth } from "../contexts/AuthContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useHistory } from "react-router-dom";
import dryCleanProds from "./product-data/products-prod.json";
import washProds from "./product-data/product-wash-prod.json";
import { useSelector, useDispatch } from "react-redux";
import { increment, decrement, resetDry } from "../redux/dry-clean-qty";
import { incrementWash, decrementWash, resetWash } from "../redux/wash-qty";
import washingMachine from "../Assets/washing-machine.png";
import dryClean from "../Assets/dry-cleaning.png";
import { clearAdditional, setDetergentScent } from "../redux/preference";
import { setPickupTime } from "../redux/pickup";


export default function Products() {
  const { logout } = useAuth();
  const [error, setError] = useState("");

  const { arr } = useSelector((state) => state.dryClean);
  const { arrWash } = useSelector((state) => state.wash);

  const [openDC, setOpenDC] = React.useState(false);
  const [openWash, setOpenWash] = React.useState(true);

  const history = useHistory();
  const dispatch = useDispatch();

  let sumArr = arr.reduce((accumulator, value) => {
    return accumulator + value;
  }, 0);

  let sumArrDry = arrWash.reduce((accumulator, value) => {
    return accumulator + value;
  }, 0);

  let arrCount = sumArr + sumArrDry;

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

  // async function handlePortal() {
  //   setError("");

  //   try {
  //     customerPortal(userData.id, "products").then((url) => {
  //       window.location = url;
  //     });
  //   } catch (err) {
  //     setError("Failed open portal");
  //     console.log(err.message);
  //   }
  // }

  async function nextPage() {
    try {
      const sumArr = arr.reduce((accumulator, value) => {
        return accumulator + value;
      }, 0);

      const sumArrWash = arrWash.reduce((accumulator, value) => {
        return accumulator + value;
      }, 0);
      if (sumArr === 0 && sumArrWash === 0) {
        window.scrollTo(0, 0)

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
        </Button>

          {arrCount > 0 &&
        <Button
          style={{
            width: "20%",
            height: "20%",
            fontSize: "12px",
            backgroundColor: "transparent",
            boxShadow: "none",
          }}
          variant="link"
          onClick={() =>{
            dispatch(resetWash());
            dispatch(resetDry());
            dispatch(clearAdditional());
            dispatch(setDetergentScent('Scented'));
            dispatch(setPickupTime("5pm - 9pm"))
          }}
        >
          <div className="d-flex flex-column justify-content-center align-items-center">
            {arrCount}
          <FontAwesomeIcon icon="cart-arrow-down" />
          <u>Clear</u>
          </div>
        </Button>}

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

        {!openWash && (
          <Button
            style={{ backgroundColor: "#1C2F74",margin:5}}
            onClick={() => {
              setOpenWash(!openWash);
              setOpenDC(!openDC);
            }}
            aria-controls="example-collapse-text1"
            aria-expanded={openWash}
          >
            Wash
          </Button>
        )}
        <Collapse in={openWash}>
          <div id="example-collapse-text1">
          <img
          src={washingMachine}
          alt="washing machine"
          style={{ height: 50, width: 50, padding: 5 }}
        />
            {washProds.map((item, idx) => (
              <div key={idx+100} style={{backgroundColor: idx%2 === 0 ? "#F0F8FF" : ""}}>
              <div className="row d-flex align-items-center">
                  <h6 className="col-4">{item.description}</h6>
                  <h6 className="col-2">{item.price}</h6>
                  <div className=" col-6 d-flex flex-row align-items-center">
                    <Button
                      style={{ backgroundColor: "#1C2F74",padding:0}}
                      className="buttonEffects"
                      onClick={() => {
                        dispatch(decrementWash(idx));
                      }}
                    >
                      -
                    </Button>
                    <h1 style={{ padding: "5px",fontSize:30}}>{arrWash[idx]}</h1>

                    <Button
                      style={{ backgroundColor: "#1C2F74" ,padding:0}}
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
        {!openDC && (
          <div>

            <Button
              style={{ backgroundColor: "#1C2F74", margin:20}}
              onClick={() => {
                setOpenDC(!openDC);
                setOpenWash(!openWash);
              }}
              aria-controls="example-collapse-text2"
              aria-expanded={openDC}
            >
              Dry Clean
            </Button>
          </div>
        )}
        <Collapse in={openDC}>
  
          <div id="example-collapse-text2">
          <img
              src={dryClean}
              alt="dry clean"
              style={{ height: 50, width: 50, padding: 5 }}
            />
            {dryCleanProds.map((item, idx) => (
              <div key={idx} style={{backgroundColor: idx%2 === 0 ? "#F0F8FF" : ""}}>
                <div className="row d-flex align-items-center">
                  <h6 className="col-4">{item.description}</h6>
                  <h6 className="col-2">{item.price}</h6>
                  <div className=" col-6 d-flex flex-row align-items-center">
                  <Button
                    className="buttonEffects"
                    style={{ backgroundColor: "#1C2F74", padding:0}}
                    onClick={() => {
                      dispatch(decrement(idx));
                    }}
                  >
                    -
                  </Button>
                  <h1 style={{ padding: "10px" }}>{arr[idx]}</h1>

                  <Button
                    className="buttonEffects"
                    style={{ backgroundColor: "#1C2F74", padding:0}}
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


        <button className="nextBtn" onClick={() =>{

            nextPage()
          }}>Next</button>      </div>
    </>
  );
}
