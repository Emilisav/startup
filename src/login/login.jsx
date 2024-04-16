import React from "react";

import Button from "react-bootstrap/Button";
import { MessageDialog } from "./messageDialog";
import { AuthState } from "./authState";

export function Login({ userName, authState, onAuthChange }) {
  const [name, setName] = React.useState("");
  const [psw, setPsw] = React.useState("");
  const [displayError, setDisplayError] = React.useState(null);

  async function login() {
    try {
      const response = await fetch(`/api/auth/login`, {
        method: "post",
        body: JSON.stringify({ name: name, password: psw }),
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
      });

      if (response.ok) {
        localStorage.setItem("userName", name);
        onAuthChange(name, AuthState.Authenticated);
      } else {
        const body = response.json();
        setDisplayError(`⚠ Error: ${body.msg}`);
      }
    } catch (error) {
      console.log(error);
    }
  }

  async function guest() {
    setName(`Guest${Math.floor(Math.random() * 999)}`);
    setPsw("password");

    try {
      const response = await fetch(`/api/auth/login`, {
        method: "post",
        body: JSON.stringify({ name: name, password: psw }),
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
      });

      if (response.ok) {
        localStorage.setItem("userName", name);
        onAuthChange(name, AuthState.Authenticated);
      } else {
        const body = await response.json();
        setDisplayError(`⚠ Error: ${body.msg}`);
      }
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <main>
      <p id="title">Login to add questions or use a guest account</p>

      <div>
        <div id="left">
          <label>Name</label>
          <input
            type="text"
            required
            id="name"
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name here"
          />

          <label>Password</label>
          <input
            type="password"
            id="psw"
            required
            placeholder="Your password here"
            onChange={(e) => setPsw(e.target.value)}
          />
          <Button variant="btn btn-outline-primary" onClick={() => login()}>
            Login
          </Button>
        </div>

        <div id="right">
          <Button variant="btn btn-outline-primary" onClick={() => guest()}>
            Guest
          </Button>
        </div>
      </div>
      <MessageDialog
        message={displayError}
        onHide={() => setDisplayError(null)}
      />
    </main>
  );
}
