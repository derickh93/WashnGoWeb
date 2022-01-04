import React, { Component } from "react";
import "../../App.css";
import { Card } from "./Card";
import axios from "axios";
import { RadioGroup, RadioButton } from "react-radio-buttons";

export default class CardList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      cards: [],
      error: "",
    };
    //binding in constuctor
    this.handleNameChange.bind(this);
  }

  componentDidMount() {
    const domain = process.env.REACT_APP_DOMAIN;

    const getCardList = async (cst) => {
      const response = await axios
        .post(`${domain}get-cards`, {
          custID: cst,
        })
        .then(({ data }) => {
          this.setState({
            cards: data.result.data,
          });
        })
        .catch((err) => {
          this.setState({ error: err.message });
        });
    };
    ///////////////////////////////////////////////////////////////////

    getCardList(this.props.cardList);
  }

  handleNameChange(e) {
    const course = {
      cardList: e.target.value,
    };
    this.setState({ course });
  }
  render() {
    var rows = [];

    this.state.cards.map((card) => {
      <li key={card.card.id}></li>;
      rows.push(
        <RadioButton
          iconSize={20}
          iconInnerSize={10}
          rootColor="#336daf"
          pointColor="#61b258"
          value={card.id}
        >
          <Card
            brand={card.card.brand}
            name={card.name}
            exp_month={card.card.exp_month}
            exp_year={card.card.exp_year}
            last4={card.card.last4}
            funding={card.card.funding}
            onClick={() => {
              console.log("changed card");
            }}
          ></Card>
        </RadioButton>
      );
    });
    return this.state.cards ? (
      <div style={{ padding: "5px" }}>
        {this.state.cards.length > 0 ? <div>Choose a saved card</div> : ""}
        <div style={{ padding: "5px" }}>
          <RadioGroup
            onChange={(val) => {
              sessionStorage.setItem("cardID", JSON.stringify(val));
            }}
            value={"test"}
          >
            {rows}
          </RadioGroup>
        </div>
        {this.state.cards.length > 0 ? <div>Or enter a new card</div> : ""}
      </div>
    ) : this.state.error ? (
      <div>{this.state.error}</div>
    ) : (
      <div />
    );
  }
}
