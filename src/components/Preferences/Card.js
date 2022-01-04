import React, { useState, useEffect } from "react";
import styled from "styled-components";

export const Card = ({
  brand,
  funding,
  last4,
  name,
  exp_month,
  exp_year,
  onClick,
}) => {
  const [bgColor, setBGColor] = useState("#336daf");
  const [localTransform, setTransform] = useState("scale(1)");

  const Button = styled.button`
    width: 100%;
    height: 100%;
    border: none;
    color: white;
    text-align: center;
    text-decoration: none;
    display: inline-block;
    font-size: 13px;
    transition: 0.5s all ease-out;
    outline: invert;
    background-color: ${bgColor};
    transform: ${localTransform};

    &:hover {
      background-color: #61b258;
      color: white;
      opacity: 0.9;
      transform: scale(1.2);
    }
  `;
  useEffect(() => {}, [bgColor, localTransform]);
  //        <div>{`${name}`}</div>

  return (
    <Button
      style={{ margin: "0px" }}
      onClick={() => {
        onClick();
      }}
    >
      <div>
        <div>{`${brand} ${funding} card ****${last4}`}</div>
        <div>{`Expires ${exp_month}/${exp_year}`}</div>
      </div>
    </Button>
  );
};
