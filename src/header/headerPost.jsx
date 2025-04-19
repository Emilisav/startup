import React from "react";
import { NavLink } from "react-router-dom";
import "./header.css";

const HeaderPost = ({ onLogout, isAuthenticated }) => (
  <header>
    <nav>
      <h1>Talkshow</h1>
      <ul>
        {isAuthenticated && (
          <li>
            <button onClick={onLogout} className="logout-btn">
              Logout
            </button>
          </li>
        )}
      </ul>
    </nav>
  </header>
);

export default HeaderPost;
