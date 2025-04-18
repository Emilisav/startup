import React, { useState } from "react";
import LoadingOverlay from "./loading/LoadingOverlay";

export function Add() {
  const [question, setQuestion] = useState("");
  const [helpQuestion, setHelpQuestion] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAddQuestion = (e) => {
    e.preventDefault();
    alert(`Question added: ${question}`);
    setQuestion("");
  };

  const handleChatGPT = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Simulate API call to ChatGPT
      await new Promise((resolve) => setTimeout(resolve, 2000));
      alert(`ChatGPT called with: ${helpQuestion}`);
      setHelpQuestion("");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id="add">
      <h1>Add a question</h1>
      <form onSubmit={handleAddQuestion}>
        <div className="mb-3">
          <label className="form-label" htmlFor="addQuestion">
            Question
          </label>
          <input
            type="text"
            required
            className="form-control"
            id="addQuestion"
            placeholder="Your question here"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
          />
        </div>
        <button type="submit">Add Question</button>
      </form>

      <form onSubmit={handleChatGPT}>
        <div className="mb-3" id="gpt">
          <label className="form-label" htmlFor="helpQuestion">
            Get help from chatGPT
          </label>
          <input
            type="text"
            required
            className="form-control"
            id="helpQuestion"
            placeholder="What do I ask someone who likes oranges to discover what else they like?"
            value={helpQuestion}
            onChange={(e) => setHelpQuestion(e.target.value)}
            disabled={loading}
          />
        </div>
        <button type="submit" disabled={loading}>
          Call ChatGPT
        </button>
      </form>

      {loading && <LoadingOverlay />}
    </div>
  );
}

export default Add;
