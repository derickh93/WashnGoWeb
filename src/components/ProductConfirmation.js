import React from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { sumBulkyArr } from "../redux/bulky-qty";
import { sumDryCleanArr } from "../redux/dry-clean-qty";

function ProductConfirmation() {
  const { arrWash } = useSelector((state) => state.wash);

  const sumBulkyValue = useSelector(sumBulkyArr);
  const sumDryCleanValue = useSelector(sumDryCleanArr)

  return (
    <div style={{ display: "flex" }}>
      <div>
        <span className="prefTitle">Pickup Amount</span>
        {arrWash[0] > 0 && (
          <div className="prefDetails">No. Mixed bags: {arrWash[0]}</div>
        )}
        {arrWash[1] > 0 && (
          <div className="prefDetails">No. Seperate bags: {arrWash[1]}</div>
        )}
        {arrWash[2] > 0 && (
          <div className="prefDetails">No. Additional bags: {arrWash[2]}</div>
        )}
        {sumBulkyValue > 0 && (
          <div className="prefDetails">Bulky Items: {sumBulkyValue}</div>
        )}
        {sumDryCleanValue > 0 && (
          <div className="prefDetails">Dry Clean Pieces: {sumDryCleanValue}</div>
        )}
      </div>
      <div style={{ marginLeft: "auto" }}>
        <Link to="/products" className="EditLink">
          Edit
        </Link>
      </div>
    </div>
  );
}

export default ProductConfirmation;
