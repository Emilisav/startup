import React, { useState } from "react";
import LoadingOverlay from "./loading/LoadingOverlay";
import CustomAlert from "../alert/alert.jsx";
import "./add.css";

export function Add() {
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
        setTimeout(() => setShowCheck(false), 3000);
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

  return (
    <div className="add-wrapper">
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
            <div className="alert alert-info mt-3">
              <strong>ChatGPT says:</strong> {gptResponse}
            </div>
          )}
        </form>
      </div>
    </div>
  );
}

export default Add;
