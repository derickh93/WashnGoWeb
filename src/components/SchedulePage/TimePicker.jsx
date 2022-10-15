import React, { useEffect } from "react";
import styled from "styled-components";

export const TimePicker = ({ children, onClick }) => {

  const bgColor = "#1C2F74";
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
    background-color: #1C2F74;
    margin: 5px

    &:hover {
      background-color: #1C2F74;
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
