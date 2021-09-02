import React, { useState } from "react";
import washngo from "../Assets/washngo.png";
import "../App.css";
import { useHistory } from "react-router-dom";

export default function HomePage() {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const history = useHistory();

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      setError("");
      setLoading(true);
      history.push("/login");
    } catch {
      setError("Failed to load order page");
    }

    setLoading(false);
  }
  return (
    <div className="homepage">
      <h3>Laundry Day?</h3> <h3> Schedule and it's done.</h3>
      <img className="logo" src={washngo} alt="washngo" />
      <button disabled={loading} onClick={handleSubmit}>
        Schedule Service
      </button>
    </div>
  );
}
