import React from "react";
import { useLocation, Route, Routes, useNavigate } from "react-router-dom";
import { Login } from "./login/login";
import { AuthState } from "./login/authState";
import HeaderPost from "./header/headerPost";
import HeaderPre from "./header/headerPre";
import Footer from "./footer/footer";
import Questions from "./questions/questions";
import Add from "./add/add";
import Petals from "./petals/Petals.jsx";
import "./petals/petals.css";

function App() {
  const navigate = useNavigate();
  const [userName, setUserName] = React.useState(
    localStorage.getItem("userName") || ""
  );
  const [authState, setAuthState] = React.useState(
    userName ? AuthState.Authenticated : AuthState.Unauthenticated
  );

  const handleAuthChange = (newUserName, newAuthState) => {
    setUserName(newUserName);
    setAuthState(newAuthState);
    if (newAuthState === AuthState.Authenticated) {
      localStorage.setItem("userName", newUserName);
    } else {
      localStorage.removeItem("userName");
    }
  };

  const handleLogout = async () => {
    const response = await fetch("/api/auth/logout", {
      method: "DELETE",
      credentials: "include",
    });
    if (response.ok) {
      localStorage.removeItem("userName");
      setAuthState(AuthState.Unauthenticated);
      navigate("/", { replace: true });
    }
  };

  return (
    <div>
      <div id="petals">
        <Petals />
      </div>
      <div
        className="app-container"
        style={{ position: "relative", zIndex: 2 }}
      >
        {authState === AuthState.Authenticated ? (
          <HeaderPost onLogout={handleLogout} isAuthenticated={true} />
        ) : (
          <HeaderPre />
        )}
        <Routes>
          <Route
            path="/"
            element={
              <Login
                userName={userName}
                authState={authState}
                onAuthChange={handleAuthChange}
              />
            }
          />
          <Route path="*" element={<NotFound />} />
          {authState === AuthState.Authenticated && (
            <>
              <Route path="/questions" element={<Questions />} />
              <Route path="/add" element={<Add />} />
            </>
          )}
        </Routes>
        <FooterWithLocation />
      </div>
    </div>
  );
}

function NotFound() {
  return <main>404: Return to sender. Address unknown.</main>;
}

function FooterWithLocation() {
  const location = useLocation();
  const hideFooter =
    location.pathname === "/questions" || location.pathname === "/add";
  return !hideFooter ? <Footer /> : null;
}

export default App;
