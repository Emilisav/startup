import React, { useState, useEffect } from "react";
import LoadingOverlay from "./loading/LoadingOverlay";
import CustomAlert from "../../alert/alert.jsx";
import "./add.css";

export function Add({ isOpen, onClose }) {
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const [showCheck, setShowCheck] = useState(false);
  const [displayError, setDisplayError] = useState("");
  const [gptResponse, setGptResponse] = useState("");

  // Optional: close alert handler
  const closeAlert = () => setDisplayError("");

  const handleAddQuestion = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("api/questions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question }),
      });
      if (response.ok) {
        setShowCheck(true);
        setQuestion("");
        setTimeout(() => {
          setShowCheck(false);
          if (onClose) onClose();
        }, 1000);
      } else {
        const body = await response.json();
        setDisplayError(`⚠ Error: ${body.msg}`);
      }
    } catch (error) {
      setDisplayError(`⚠ Failed to add question`);
    }
  };

  const handleChatGPT = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch("api/gpt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question }),
      });
      const body = await response.json();

      if (response.ok) {
        // Stringify if response isn't a string
        const output =
          typeof body.response === "string"
            ? body.response
            : JSON.stringify(body.response || body);
        setGptResponse(output);
      } else {
        setDisplayError(`⚠ Error: ${body.msg}`);
      }
    } catch (error) {
      setDisplayError(`⚠ Failed to load response`);
    } finally {
      setLoading(false);
    }
  };

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
      className="add-wrapper modal-overlay"
      onClick={onClose} // This closes modal when clicking anywhere on overlay
      tabIndex={-1}
      aria-modal="true"
      role="dialog"
    >
      <div className="add-box">
        <h1 className="add-title">Add a question</h1>
        <form className="add-form" onSubmit={handleAddQuestion}>
          <div className="form-group">
            <label className="form-label" htmlFor="questionInput">
              Question
            </label>
            <input
              type="text"
              required
              className="form-input"
              id="questionInput"
              placeholder="Your question here"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              disabled={loading}
            />
          </div>
          <div className="button-row">
            {showCheck ? (
              <span
                style={{
                  color: "green",
                  fontSize: "2rem",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  minWidth: "120px", // keeps layout from shifting
                  minHeight: "44px",
                }}
                aria-label="Question added"
              >
                ✅
              </span>
            ) : (
              <button
                type="submit"
                className="add-btn"
                disabled={loading || !question}
              >
                Add Question
              </button>
            )}
            <button
              type="button"
              className="add-btn"
              onClick={handleChatGPT}
              disabled={loading || !question}
            >
              Call ChatGPT
            </button>
          </div>

          {loading && <LoadingOverlay />}
          {displayError && (
            <CustomAlert message={displayError} onClose={closeAlert} />
          )}
          {gptResponse && (
            <div className="gpt-response">
              <strong>ChatGPT says:</strong>
              <div>{gptResponse}</div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}

export default Add;
