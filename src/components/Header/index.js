import React, { useEffect } from "react";
import "./styles.css";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { auth } from "../../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { signOut } from "firebase/auth";
import { toast } from "react-toastify";
import userImg from "../../assets/user.svg";
export default function Header() {
  const [user, loading] = useAuthState(auth);
  const navigate = useNavigate();
  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [user, loading]);
  function logout() {
    try {
      signOut(auth)
        .then(() => {
          toast.success("Logged out Successfully");
          navigate("/");
        })
        .catch((error) => {
          toast.error(error.message);
        });
    } catch (e) {
      toast.error(e.message);
    }
  }

  return (
    <div className="navbar">
      <p className="logo">Financly</p>
      {user && (
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <img
            alt="{image}"
            style={{ width: "2rem", height: "2rem", borderRadius: "50%" }}
            src={user.photoURL ? user.photoURL : userImg}
          />
          <p onClick={logout} className="logo link">
            Logout
          </p>
        </div>
      )}
    </div>
  );
}
