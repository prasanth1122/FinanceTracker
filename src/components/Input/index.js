import React from "react";
import "./styles.css";
export default function Input({ label, state, setState, placeholder, type }) {
  return (
    <div className="input_wrapper">
      <p className="label_input">{label}</p>
      <input
        type={type}
        value={state}
        placeholder={placeholder}
        onChange={(e) => setState(e.target.value)}
        className="custom_input"
      />
    </div>
  );
}
