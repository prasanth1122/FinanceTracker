import React from "react";
import "./styles.css";

export default function Button({ text, onClick, blue, disabled }) {
  return (
    <div
      className={blue ? "btn btn_blue" : "btn"}
      onClick={onClick}
      disabled={disabled}
    >
      {text}
    </div>
  );
}
