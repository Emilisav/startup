import React from "react";
import "./add.css";

export function Add() {
  return (
    <div id="add">
      <h1>Add a question</h1>
      <div class="mb-3">
        <label class="form-label">Question</label>
        <input
          onfocus="this.value=''"
          type="text"
          required
          class="form-control"
          id="addQuestion"
          placeholder="Your question here"
        />
      </div>
      <button type="submit" onclick="question()">
        Add Question
      </button>

      <div class="mb-3" id="gpt">
        <label class="form-label">Get help from chatGPT</label>
        <input
          onfocus="this.value=''"
          type="text"
          required
          class="form-control"
          id="helpQuestion"
          placeholder="What do I ask someone who like oranges to discover what else they like?"
        />
      </div>

      <button type="submit" onclick="chatGPT()">
        Call ChatGPT
      </button>
    </div>
  );
}
