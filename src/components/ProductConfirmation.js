import React from 'react'
import { Link } from 'react-router-dom'
import {useSelector} from "react-redux"

function ProductConfirmation() {
    const { arr } = useSelector((state) => state.dryClean);
    const { arrWash } = useSelector((state) => state.wash);
    const sumArr = arr.reduce((accumulator, value) => {
      return accumulator + value;
    }, 0);
  return ( 
    <div style={{ display: "flex" }}>
    <div>
      <span className="prefTitle">Pickup Amount</span>
      <div className="prefDetails">
        No. Mixed bags: {arrWash[0]}
      </div>
      <div className="prefDetails">
        No. Seperate bags: {arrWash[1]}
      </div>
      <div className="prefDetails">
        No. Additional bags: {arrWash[2]}
      </div>
      <div className="prefDetails">
        Dry Clean Pieces: {sumArr}
      </div>
    </div>
    <div style={{ marginLeft: "auto" }}>
      <Link to="/products" className="EditLink">
        Edit
      </Link>
    </div>
  </div>  )
}

export default ProductConfirmation