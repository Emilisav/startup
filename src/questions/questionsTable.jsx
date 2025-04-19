// QuestionsTable.jsx

import React from "react";
import { timeAgo } from "./utils";

export default function QuestionsTable({ questions, renderStars }) {
  return (
    <div className="questions-table-wrapper">
      <table className="questions-table">
        <thead>
          <tr>
            <th>User</th>
            <th>Question</th>
            <th>Stars</th>
            <th>Asked</th>
          </tr>
        </thead>
        <tbody>
          {questions.length === 0 ? (
            <tr>
              <td colSpan={4} style={{ textAlign: "center", color: "#aaa" }}>
                No questions yet.
              </td>
            </tr>
          ) : (
            questions.map((q) => (
              <tr key={q.question + q.date}>
                <td className="q-user">{q.userName}</td>
                <td className="q-text">{q.question}</td>
                <td className="q-stars">{renderStars(q)}</td>
                <td className="q-date">{timeAgo(q.date)}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
