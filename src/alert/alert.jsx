import React, { useRef } from "react";
import "./alert.css"; // Import the custom styles for the alert

function CustomAlert({ message, onClose }) {
  const popupRef = useRef(null);

  // Handler for overlay click
  const handleOverlayClick = (e) => {
    // Only close if the click is on the overlay, not inside the popup
    if (popupRef.current && !popupRef.current.contains(e.target)) {
      onClose();
    }
  };

  return (
    <div id="popup1" className="overlay" onClick={handleOverlayClick}>
      <div className="popup" ref={popupRef}>
        <h2>{message}</h2>
      </div>
    </div>
  );
}

export default CustomAlert;
