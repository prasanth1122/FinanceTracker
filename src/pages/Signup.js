import React from "react";
import { Link } from "react-router-dom";
import Header from "../components/Header";
import SignupSignin from "../components/SignupSignin";
export default function Signup() {
  return (
    <div>
      <Header />
      <div className="wrapper">
        <SignupSignin />
      </div>
    </div>
  );
}
