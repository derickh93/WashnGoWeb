import React, { Component } from "react";
import Button from "./Button";
import "../App.css";

export default class CounterButton extends Component {
  constructor() {
    super();
    this.state = {
      count: 0,
    };
  }

  incrementCount = () => {
    this.setState({
      count: this.state.count + 1,
    });
  };

  decrementCount = () => {
    if (this.state.count <= 0) {
    } else {
      this.setState({
        count: this.state.count - 1,
      });
    }
  };

  callBackMethod(val) {
    if (val === "+") {
      this.props.sendData(this.state.count + 1);
    } else {
      this.props.sendData(this.state.count - 1);
    }
  }

  render() {
    let { count } = this.state;
    const imageStyle = { width: "50px", height: "50px" };

    return (
      <div>
        <div className="productRow">
          <img
            style={imageStyle}
            src={this.props.imageSrc}
            alt={this.props.imageAlt}
          ></img>
          <h3>{this.props.label}:</h3>
        </div>
        <div className="products">
          <Button
            cusClass="buttonEffects"
            title={"-"}
            action={() => {
              this.decrementCount();
              this.callBackMethod("-");
            }}
          />
          <h1 style={{ padding: "10px" }}>{count}</h1>

          <Button
            cusClass="buttonEffects"
            title={"+"}
            action={() => {
              this.incrementCount();
              this.callBackMethod("+");
            }}
          />
        </div>
      </div>
    );
  }
}
