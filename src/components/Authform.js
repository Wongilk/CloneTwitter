import React from "react";
import { useState } from "react";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
const Authform = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [newAccount, setNewAccount] = useState(true);
  const changeAccountState = () => {
    setNewAccount((prev) => !prev);
  };
  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      if (newAccount) {
        const auth = getAuth();
        await createUserWithEmailAndPassword(auth, email, password).then(
          (data) => {
            console.log(data);
          }
        );
      } else {
        const auth = getAuth();
        await signInWithEmailAndPassword(auth, email, password).then((data) => {
          console.log(data);
        });
      }
    } catch (error) {
      setError(error.message);
    }
  };
  const onChange = (e) => {
    if (e.target.name === "email") setEmail(e.target.value);
    else setPassword(e.target.value);
  };
  return (
    <>
      <form onSubmit={onSubmit} className="container">
        <input
          name="email"
          type="email"
          placeholder="Email"
          required
          value={email}
          onChange={onChange}
          className="authInput"
        />
        <input
          name="password"
          type="password "
          placeholder="Password"
          required
          value={password}
          onChange={onChange}
          className="authInput"
        />
        <input
          type="submit"
          value={newAccount ? "Create Account " : "Log In"}
          className="authInput authSubmit"
        />
        {error && <span className="authError">{error}</span>}
      </form>
      <span onClick={changeAccountState} className="authSwitch">
        {newAccount ? "Log in" : "Create Account"}
      </span>
    </>
  );
};
export default Authform;
