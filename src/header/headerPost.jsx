import React from "react";
import { NavLink } from "react-router-dom";
import "./header.css";

const HeaderPost = ({ onLogout, isAuthenticated }) => (
  <header>
    <nav>
      <h1>Talkshow</h1>
      <ul>
        <li>
          <NavLink to="/add">Add</NavLink>
        </li>
        <li>
          <NavLink to="/questions">Questions</NavLink>
        </li>
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
