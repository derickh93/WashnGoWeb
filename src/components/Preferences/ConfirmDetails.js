import React, { Component } from "react";
import "../../App.css";
import {  Alert } from "react-bootstrap";
import { Link } from "react-router-dom";

export default class ConfirmDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: this.props.commonProps.name,
      address: this.props.commonProps.address,
      puDate: this.props.commonProps.puDate,
      puTime: this.props.commonProps.puTime,
      mixed: this.props.commonProps.mixed,
      seperate: this.props.commonProps.seperate,
      addition: this.props.commonProps.addition,
      dayOfWeek: this.props.commonProps.dayOfWeek,
      detergent: this.props.commonProps.det,

      dryer: this.props.commonProps.dry,
      softener: this.props.commonProps.soft,
      additional: this.props.commonProps.addit,
      whites: this.props.commonProps.whi,

      shirt: this.props.commonProps.shirt,
      slacks: this.props.commonProps.slacks,
      jacket: this.props.commonProps.jacket,

    };
    //binding in constuctor
    this.handleNameChange.bind(this);
  }

  handleNameChange(e) {
    const course = {
      name: e.target.value,
      address: e.target.value,
      puDate: e.target.value,
      puTime: e.target.value,
      mixed: e.target.value,
      seperate: e.target.value,
      addition: e.target.value,
      dayOfWeek: e.target.value,
      detergent: e.target.value,
      dryer: e.target.value,
      softener: e.target.value,
      additional: e.target.value,
      whites: e.target.value,
      shirt: e.target.value,
      slacks: e.target.value,
      jacket: e.target.value,

    };
    this.setState({ course });
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
              <div className="prefDetails" onChange={this.handlechange}>
                {this.state.address.line1}
              </div>
              {this.state.address.line2 ? (
                <div className="prefDetails" onChange={this.handlechange}>
                  {this.state.address.line2}
                </div>
              ) : (
                ""
              )}
              <div className="prefDetails" onChange={this.handlechange}>
                {this.state.address.city}, {this.state.address.state}
              </div>
              <div className="prefDetails" onChange={this.handlechange}>
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
            <div className="prefDetails" onChange={this.handlechange}>
              {this.state.dayOfWeek} {this.state.puDate} between{" "}
              {this.state.puTime}
            </div>
          </div>
          <div style={{ marginLeft: "auto" }}>
            <Link to="/time" className="EditLink">
              Edit
            </Link>
          </div>
        </div>
        <div style={{ display: "flex" }}>
          <div>
            <span className="prefTitle">Pickup Amount</span>
            <div className="prefDetails" onChange={this.handlechange}>
              No. Mixed: {this.state.mixed}
            </div>
            <div className="prefDetails" onChange={this.handlechange}>
              No. Seperate: {this.state.seperate}
            </div>
            <div className="prefDetails" onChange={this.handlechange}>
              No. Additional: {this.state.addition}
            </div>
            <div className="prefDetails" onChange={this.handlechange}>
              No. Shirts: {this.state.shirt}
            </div>
            <div className="prefDetails" onChange={this.handlechange}>
              No. Slacks: {this.state.slacks}
            </div>
            <div className="prefDetails" onChange={this.handlechange}>
              No. Jackets: {this.state.jacket}
            </div>
          </div>
          <div style={{ marginLeft: "auto" }}>
            <Link to="/products" className="EditLink">
              Edit
            </Link>
          </div>
        </div>
          <div style={{ display: "flex" }}>
            <div>
              <span className="prefTitle">Preferences</span>
              <div className="prefDetails" onChange={this.handlechange}>
                Detergent: {this.state.detergent}
              </div>
              <div className="prefDetails" onChange={this.handlechange}>
                Softener: {this.state.softener}
              </div>
              <div className="prefDetails" onChange={this.handlechange}>
                Whites: {this.state.whites}
              </div>
              <div className="prefDetails" onChange={this.handlechange}>
                Dryer: {this.state.dryer}
              </div>
              <div className="prefDetails" onChange={this.handlechange}>
                Additional Preferences: {this.state.additional}
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
