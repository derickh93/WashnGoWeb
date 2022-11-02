import React, { Component } from "react";
import "../../App.css";
import {  Alert } from "react-bootstrap";
import { Link } from "react-router-dom";
import ProductConfirmation from "../ProductConfirmation";


export default class ConfirmDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: this.props.commonProps.name,
      address: this.props.commonProps.address,
      puDate: this.props.commonProps.puDate,
      puTime: this.props.commonProps.puTime,

      dayOfWeek: this.props.commonProps.dayOfWeek,
      detergent: this.props.commonProps.det,
      additional: this.props.commonProps.addit,
      arrWashSum : this.props.commonProps.arrWashSum,
      bulkySum : this.props.commonProps.arrBulkySum
    };
  }
  
  render() {
    return (
      <div style={{ padding: "10px" }}>
        <div style={{ display: "flex" }}>
          {this.state.address === "N/A" ? (
            <Alert variant="danger">Enter a pickup address</Alert>
          ) : (
            <div>
              <span className="prefTitle">Pickup Address</span>
              <div className="prefDetails" >
                {this.state.address.line1}
              </div>
              {this.state.address.line2 ? (
                <div className="prefDetails" >
                  {this.state.address.line2}
                </div>
              ) : (
                ""
              )}
              <div className="prefDetails" >
                {this.state.address.city}, {this.state.address.state}
              </div>
              <div className="prefDetails" >
                {this.state.address.postal_code}
              </div>
            </div>
          )}
          <div style={{ marginLeft: "auto" }}>
            <Link to="/address" className="EditLink">
              Edit
            </Link>
          </div>
        </div>
        <div style={{ display: "flex" }}>
          <div>
            <span className="prefTitle">Pickup Date</span>
            <div className="prefDetails" >
              {this.state.puDate} between{" "}
              {this.state.puTime}
            </div>
          </div>
          <div style={{ marginLeft: "auto" }}>
            <Link to="/time" className="EditLink">
              Edit
            </Link>
          </div>
        </div>
        <ProductConfirmation/>
          <div style={{ display: "flex" }}>
            <div>
            <span className="prefTitle">Preferences</span>
              {(this.state.arrWashSum > 0 || this.state.bulkySum > 0) && <div>
              <div className="prefDetails">
                Detergent: {this.state.detergent}
              </div></div>}
              <div className="prefDetails">
                {this.state.additional === "" ? "": 'Instructions: ' + this.state.additional}
              </div>
            </div>
            <div style={{ marginLeft: "auto" }}>
              <Link to="/preferences" className="EditLink">
                Edit
              </Link>
            </div>
          </div>
      </div>
    );
  }
}
