import React from "react";
import { Unauthenticated } from "./unauthenticated";
import { AuthState } from "./authState";
import "./login.css";
import Questions from "../questions/questions";

export function Login({ userName, authState, onAuthChange }) {
  return (
    <div className="container-fluid bg-secondary text-center login-wrapper">
      <div>
        {authState === AuthState.Authenticated && <Questions />}
        {authState === AuthState.Unauthenticated && (
          <Unauthenticated
            userName={userName}
            onLogin={(loginUserName) => {
              onAuthChange(loginUserName, AuthState.Authenticated);
            }}
          />
        )}
      </div>
    </div>
  );
}
