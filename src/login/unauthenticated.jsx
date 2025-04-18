import React from "react";

import "./unauthenticated.css";
import CustomAlert from "../alert/alert.jsx";

export function Unauthenticated(props) {
  const [userName, setUserName] = React.useState(props.userName);
  const [password, setPassword] = React.useState("");
  const [displayError, setDisplayError] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);

  async function loginUser() {
    const response = await fetch("api/auth/login", {
      method: "POST", // Always POST since both login and create are POST requests
      body: JSON.stringify({ email: userName, password: password }),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    });

    if (response.status === 200) {
      localStorage.setItem("userName", userName);
      const body = await response.json();
      props.onLogin(userName);
    } else {
      const body = await response.json();
      setDisplayError(`⚠ Error: ${body.msg}`);
    }
  }

  const closeAlert = () => {
    setDisplayError("");
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <main className="login">
      <form>
        <div className="input__container username-container">
          <div className="shadow__input"></div>
          <button
            className="input__button__shadow"
            onClick={(e) => e.preventDefault()}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="#000000"
              width="20px"
              height="20px"
            >
              <path d="M0 0h24v24H0z" fill="none"></path>
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"></path>
            </svg>
          </button>
          <input
            type="text"
            name="username"
            className="input__search"
            onChange={(e) => setUserName(e.target.value)}
            placeholder="Enter username"
          />
        </div>

        <div className="input__container password-container">
          <div className="shadow__input"></div>
          <button
            type="button"
            className="input__button__shadow"
            onClick={togglePasswordVisibility}
          >
            {showPassword ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="#000000"
                width="20px"
                height="20px"
              >
                <path d="M0 0h24v24H0z" fill="none"></path>
                <path d="M12 4.5C7.05 4.5 2.73 7.61 1 12c1.73 4.39 6.05 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6.05-7.5-11-7.5zm0 12c-2.48 0-4.5-2.02-4.5-4.5S9.52 7.5 12 7.5s4.5 2.02 4.5 4.5-2.02 4.5-4.5 4.5zm0-7.5c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"></path>
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="#000000"
                width="20px"
                height="20px"
              >
                <path d="M0 0h24v24H0z" fill="none"></path>
                <path d="M12 4.5C7.05 4.5 2.73 7.61 1 12c1.73 4.39 6.05 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6.05-7.5-11-7.5zm0 12c-2.48 0-4.5-2.02-4.5-4.5S9.52 7.5 12 7.5s4.5 2.02 4.5 4.5-2.02 4.5-4.5 4.5zm0-7.5c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"></path>
              </svg>
            )}
          </button>
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            className="input__search"
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter Password"
          />
        </div>
      </form>

      <form>
        <button
          type="button"
          onClick={() => loginUser()}
          disabled={!userName || !password}
        >
          Login
        </button>
      </form>
      {displayError && (
        <CustomAlert message={displayError} onClose={closeAlert} />
      )}
    </main>
  );
}
