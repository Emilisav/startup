import React from "react";
import "./alert.css"; // Import the custom styles for the alert

function CustomAlert({ message, onClose }) {
  const displayMessage =
    message === "⚠ Error: Unauthorized"
      ? "Wrong password"
      : message === "⚠ Error: Existing user"
      ? "Choose another username, username already exist"
      : message === "⚠ Error: No user exist"
      ? "Create account"
      : message;

  return (
    <div id="popup1" className="overlay">
      <div className="popup">
        <h2>{message}</h2>
        <a className="close" href="#" onClick={onClose}>
          &times;
        </a>
        <div className="content">{displayMessage}</div>
      </div>
    </div>
  );
}

export default CustomAlert;
