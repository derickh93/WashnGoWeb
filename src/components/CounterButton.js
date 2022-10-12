import React, { Component } from "react";
import Button from "./Button";
import "../App.css";

export default class CounterButton extends Component {
  incrementCount = () => {
    this.props.increment()
    console.log("increment")
  };

  decrementCount = () => {
    this.props.decrement()
    console.log("decrement")
  };

  render() {
    return (
      <div>
        <div className="products">
        <h6>{this.props.description}</h6>
        <h6>{this.props.price}</h6>
        <div className="products">
          <Button
            cusClass="buttonEffects"
            title={"-"}
            action={() => {
              this.decrementCount();
            }}
          />
          <h1 style={{ padding: "10px" }}>{this.props.count}</h1>

          <Button
            cusClass="buttonEffects"
            title={"+"}
            action={() => {
              this.incrementCount();
            }}
          />
          </div>
        </div>
      </div>
    );
  }
}
