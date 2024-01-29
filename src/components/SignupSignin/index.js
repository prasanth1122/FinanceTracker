import React, { useState } from "react";
import "./styles.css";
import Input from "../Input";
import Button from "../Button";
import {
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  getAuth,
  signInWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";

import { auth, db, provider } from "../../firebase";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
export default function SignupSignin() {
  const [name, setname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [loginForm, setloginForm] = useState(false);
  const navigate = useNavigate();
  function loginwithemail() {
    console.log("email");
    setLoading(true);
    if (email != "" && password != "") {
      signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          // Signed in
          const user = userCredential.user;
          toast.success("User Logged In");
          navigate("/dashboard");
          setLoading(false);
          // ...
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          toast.error(errorMessage);
          setLoading(false);
        });
    } else {
      toast.error("All Fields are mandatory!");
      setLoading(false);
    }
  }
  function signupwithemail() {
    setLoading(true);
    console.log("hello");
    if (name != "" && email != "" && password != "" && confirmPassword != "") {
      if (password == confirmPassword) {
        createUserWithEmailAndPassword(auth, email, password)
          .then((userCredential) => {
            // Signed up
            const user = userCredential.user;
            toast.success("User created");
            setLoading(false);
            setConfirmPassword("");
            setEmail("");
            setname("");
            setPassword("");
            createDoc(user);
            navigate("/dashboard");
            // ...
          })
          .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            toast.error(errorMessage);
            setLoading(false);
            // ..
          });
      } else {
        toast.error("Passwords doesn't match");
        setLoading(false);
      }
    } else {
      setLoading(false);
      toast.error("All fields are mandatory");
    }
  }
  async function createDoc(user) {
    setLoading(true);
    if (!user) return;

    const userRef = doc(db, "users", user.uid);
    const userData = await getDoc(userRef);

    if (!userData.exists()) {
      // Checking id user already exists
      try {
        await setDoc(doc(db, "users", user.uid), {
          // creating new DOC for the user if not existed
          name: user.displayName ? user.displayName : name,
          email: user.email,
          photoURL: user.photoURL ? user.photoURL : "",
          createdAt: new Date(),
        });
        toast.success("User DOC created successfuly!");
        setLoading(false);
      } catch (e) {
        toast.error(e.message);
        setLoading(false);
      }
    } else {
      //toast.error("User DOC already exists!");
      setLoading(false);
    }
  }
  function googleAuth() {
    setLoading(true);
    try {
      signInWithPopup(auth, provider)
        .then((result) => {
          // This gives you a Google Access Token. You can use it to access the Google API.
          const credential = GoogleAuthProvider.credentialFromResult(result);
          const token = credential.accessToken;
          // The signed-in user info.
          const user = result.user;
          createDoc(user);
          setLoading(false);
          navigate("/dashboard");

          toast.success("User Authenticated");
          // IdP data available using getAdditionalUserInfo(result)
          // ...
        })
        .catch((error) => {
          setLoading(false);
          // Handle Errors here.
          const errorCode = error.code;
          const errorMessage = error.message;
          // The email of the user's account used.
          toast.error(errorMessage);
          // ...
        });
    } catch (e) {
      setLoading(false);
      toast.error(e.message);
    }
  }

  return (
    <>
      {loginForm ? (
        <div className="signup_wrapper">
          <h2 className="title">
            Login on <span style={{ color: "var(--theme)" }}>Financly.</span>
          </h2>
          <form>
            <Input
              type="email"
              label={"Email"}
              state={email}
              setState={setEmail}
              placeholder={"abc@gmail.com"}
            />
            <Input
              type="password"
              label={"Password"}
              state={password}
              setState={setPassword}
              placeholder={"Password1122@"}
            />

            <Button
              disabled={loading}
              text={loading ? "Loading..." : "Login Using Email and password"}
              onClick={loginwithemail}
            />
            <p style={{ textAlign: "center" }}>or</p>
            <Button
              text={loading ? "Loading..." : "Login Using Google"}
              blue={true}
              onClick={googleAuth}
            />
            <p
              className="p_login"
              style={{ textAlign: "center", cursor: "pointer" }}
              onClick={() => {
                setloginForm(!loginForm);
                setConfirmPassword("");
                setEmail("");
                setname("");
                setPassword("");
              }}
            >
              Or Don't have An Account? <span>Click Here</span>
            </p>
          </form>
        </div>
      ) : (
        <div className="signup_wrapper">
          <h2 className="title">
            Sign up on <span style={{ color: "var(--theme)" }}>Financly.</span>
          </h2>
          <form>
            <Input
              type="text"
              label={"Full Name"}
              state={name}
              setState={setname}
              placeholder={"Your name"}
            />
            <Input
              type="email"
              label={"Email"}
              state={email}
              setState={setEmail}
              placeholder={"abc@gmail.com"}
            />
            <Input
              type="password"
              label={"Password"}
              state={password}
              setState={setPassword}
              placeholder={"Password1122@"}
            />
            <Input
              type="password"
              label={"Confirm Password"}
              state={confirmPassword}
              setState={setConfirmPassword}
              placeholder={"Password1122@"}
            />
            <Button
              disabled={loading}
              text={loading ? "Loading..." : "Signup Using Email and password"}
              onClick={signupwithemail}
            />
            <p style={{ textAlign: "center" }} className="p_login">
              or
            </p>
            <Button
              text={loading ? "Loading..." : "Signup Using Google"}
              blue={true}
              onClick={googleAuth}
            />
            <p
              style={{ textAlign: "center", cursor: "pointer" }}
              className="p_login"
              onClick={() => setloginForm(!loginForm)}
            >
              Or Have An Account? <span>Click Here</span>
            </p>
          </form>
        </div>
      )}
    </>
  );
}
