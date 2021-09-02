import React, { useState, useEffect } from "react";
import styled from "styled-components";

export const TimePicker = ({ children, onClick }) => {

  const [bgColor, setBGColor] = useState("#336daf");
  const Button = styled.button`
    width: 200px;
    height: 40px;
    border: none;
    border-radius: 20px;
    color: white;
    text-align: center;
    text-decoration: none;
    display: inline-block;
    font-size: 16px;
    transition: 0.5s all ease-out;
    outline: invert;
    background-color: #336daf;

    &:hover {
      background-color: #61b258;
      color: white;
      opacity: 0.9;
      transform: scale(1.2);
    }
  `;
  useEffect(() => {}, [bgColor]);

  return (
    <div style={{ padding: "10px" }}>
      <Button onClick={onClick}>{children}</Button>
    </div>
  );
};
