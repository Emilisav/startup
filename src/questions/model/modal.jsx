import React, { useEffect } from "react";
import "./modal.css";

// Modal.jsx - Update the component code
export default function Modal({ isOpen, onClose, children }) {
  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === "Escape") onClose();
    }
    if (isOpen) document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;
  return (
    <div
      className="modal-overlay"
      onClick={onClose} // This closes modal when clicking anywhere on overlay
      tabIndex={-1}
      aria-modal="true"
      role="dialog"
    >
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()} // This prevents clicks on content from closing
      >
        {children}
      </div>
    </div>
  );
}
