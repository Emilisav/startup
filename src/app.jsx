import React from "react";
import { BrowserRouter, NavLink, Route, Routes } from "react-router-dom";
import { Login } from "./login/login";
import { Questions } from "./questions/questions";
import { Add } from "./add/add";
import { AuthState } from "./login/authState";
import "bootstrap/dist/css/bootstrap.min.css";
import "./app.css";

function App() {
  const [userName, setUserName] = React.useState(
    localStorage.getItem("userName") || ""
  );
  const currentAuthState = userName
    ? AuthState.Authenticated
    : AuthState.Unauthenticated;
  const [authState, setAuthState] = React.useState(currentAuthState);

  function goBack() {
    localStorage.removeItem("userName");
    setAuthState(AuthState.Unauthenticated);
    try {
      fetch(`/api/auth/logout`, {
        method: "delete",
      });
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <BrowserRouter>
      <div className="body">
        <header>
          <h1>Welcome to TalkShow!</h1>

          <nav className="navbar">
            <menu className="navbar-nav">
              {authState === AuthState.Authenticated && (
                <li className="nav-item">
                  <NavLink className="nav-link" to="questions">
                    Questions
                  </NavLink>
                </li>
              )}
              {authState === AuthState.Authenticated && (
                <li className="nav-item">
                  <NavLink className="nav-link" to="add">
                    Add Questions
                  </NavLink>
                </li>
              )}
              {authState === AuthState.Authenticated && (
                <li className="nav-item">
                  <NavLink className="nav-link logout" to="">
                    <button
                      class="btn btn-sm btn-outline-secondary"
                      onclick="goBack()"
                      type="submit"
                    >
                      Back to Login
                    </button>
                  </NavLink>
                </li>
              )}
            </menu>
          </nav>
          <Button
            variant="btn btn-sm btn-outline-secondary"
            onClick={() => goBack()}
          >
            Logout
          </Button>
        </header>

        <Routes>
          <Route
            path="/"
            element={
              <Login
                userName={userName}
                authState={authState}
                onAuthChange={(userName, authState) => {
                  setAuthState(authState);
                  setUserName(userName);
                }}
              />
            }
            exact
          />
          <Route
            path="/questions"
            element={<Questions userName={userName} />}
          />
          <Route path="/add" element={<Add userName={userName} />} />
          <Route path="*" element={<NotFound />} />
        </Routes>

        <footer>
          <span className="text-reset">Emily De Graw</span>
          <a href="https://github.com/Emilisav/startup">GitHub</a>
        </footer>
      </div>
    </BrowserRouter>
  );
}

function NotFound() {
  return (
    <main className="container-fluid bg-secondary text-center">
      404: Return to sender. Address unknown.
    </main>
  );
}

export default App;
