import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import Order from "./Order";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useHistory } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { Button } from "react-bootstrap";
import animation from "../Assets/8166-laundry-illustration-animation.gif";

function Orders() {
  const [activeOrders, setActiveOrders] = useState([]);
  const [completeOrders, setCompleteOrders] = useState([]);

  const { id } = useSelector((state) => state.user);
  const [viewActiveOrders, setViewActiveOrders] = useState(false);
  const [viewCompleteOrders, setViewCompleteOrders] = useState(false);

  const { logout } = useAuth();

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const history = useHistory();

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
        //}
      } catch (err) {
        console.log(err.message);
      }
      setLoading(false);
    }
  }

  const config = {
    headers: {
      Authorization: `Bearer ${process.env.REACT_APP_STRAPI_API_KEY}`,
    },
  };

  const getActiveOrderData = async () => {
    const orderData = await axios
      .get(
        `https://lpday-strapi.herokuapp.com/api/Orders?filters[customer_id][$eq]=${id}&filters[status][$ne]=delivered`,
        config
      )
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
    return orderData.data.data;
  };

  const getCompleteOrderData = async () => {
    const orderData = await axios
      .get(
        `https://lpday-strapi.herokuapp.com/api/Orders?filters[customer_id][$eq]=${id}&filters[status][$eq]=delivered`,
        config
      )
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
    return orderData.data.data;
  };

  useEffect(() => {
    if (id) {
      getActiveOrderData().then((res) => {
        console.log(res);
        setActiveOrders(res);
      });

      getCompleteOrderData().then((res) => {
        console.log(res);
        setCompleteOrders(res);
      });
    }
    // eslint-disable-next-line
  }, [id]); // <-- empty dependency array
  return (
    <div>
      {loading ? (
        <div className="homepage">
          <img src={animation} alt="loading..." />
        </div>
      ) : null}
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
      </div>{" "}
      <div
        onClick={() => {
          setViewActiveOrders(!viewActiveOrders);
        }}
        className="d-flex flex column mt-2"
      >
        <h6>
          <u className="pr-2">View Active Orders</u>
        </h6>
        {viewActiveOrders ? (
          <FontAwesomeIcon icon="chevron-up" size="lg" color="#1C2F74" />
        ) : (
          <FontAwesomeIcon icon="chevron-down" size="lg" color="#1C2F74" />
        )}
      </div>
      {viewActiveOrders && (
        <div className="border d-flex flex-column w-100 m-2">
          {activeOrders.length > 0 ? (
            activeOrders.map((item, idx) => (
              <div key={idx}>
                <Order item={item} />
              </div>
            ))
          ) : (
            <span>No active orders at this time.</span>
          )}
        </div>
      )}
      {/* /////////////////////////////////////////////////////// */}
      <div
        onClick={() => {
          setViewCompleteOrders(!viewCompleteOrders);
        }}
        className="d-flex flex column mt-2"
      >
        <h6>
          <u className="pr-2">View Completed Orders</u>
        </h6>
        {viewCompleteOrders ? (
          <FontAwesomeIcon icon="chevron-up" size="lg" color="#1C2F74" />
        ) : (
          <FontAwesomeIcon icon="chevron-down" size="lg" color="#1C2F74" />
        )}
      </div>
      {viewCompleteOrders && (
        <div className="border d-flex flex-column w-100 m-2">
          {completeOrders.length > 0 ? (
            completeOrders.map((item, idx) => (
              <div key={idx}>
                <Order item={item} />
              </div>
            ))
          ) : (
            <span>Schedule your first order below</span>
          )}
        </div>
      )}
      {/* /////////////////////////////////////////////////////// */}
      <div
        style={{
          padding: "10px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
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
  );
}

export default Orders;
