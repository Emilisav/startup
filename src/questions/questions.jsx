// Questions.jsx

import React, { useMemo, useState } from "react";
import useQuestions from "./useQuestions";
import QuestionsTable from "./questionsTable";
import { getRandomUnique } from "./utils";
import "./questions.css";
import Modal from "./model/modal";
import Add from "./add/add";

export default function Questions() {
  const { questions, handleStar } = useQuestions();
  const [isAddModalOpen, setAddModalOpen] = useState(false);

  function renderStars(q) {
    return (
      <div className="stars">
        {[...Array(5)].map((_, i) => (
          <label key={i}>
            <input
              type="checkbox"
              checked={i < q.stars}
              onChange={() => handleStar(q, i)}
              className="star-checkbox"
              aria-label={`${i + 1} stars`}
              tabIndex={0}
              style={{ display: "inline-block" }}
            />
          </label>
        ))}
      </div>
    );
  }

  // --- TOP 5 RANDOM QUESTIONS FROM TOP 10% ---
  const topQuestions = useMemo(() => {
    if (questions.length === 0) return [];
    const sorted = [...questions].sort((a, b) => b.stars - a.stars);
    const topCount = Math.max(1, Math.ceil(sorted.length * 0.1));
    let topSubset = sorted.slice(0, topCount);

    if (topSubset.length < 5) {
      const remainder = sorted.slice(topCount);
      const shuffledRemainder = getRandomUnique(remainder, remainder.length);
      topSubset = topSubset.concat(shuffledRemainder).slice(0, 5);
    } else {
      topSubset = getRandomUnique(topSubset, 5);
    }
    return topSubset;
  }, [questions]);

  // --- LATEST 3 QUESTIONS BY DATE ---
  const latestQuestions = useMemo(() => {
    return [...questions]
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 3);
  }, [questions]);

  return (
    <main className="questions__main" style={{ position: "relative" }}>
      {/* Plus button at the top right */}
      <button
        className="plus-btn"
        onClick={() => setAddModalOpen(true)}
        aria-label="Add Question"
      >
        +
      </button>

      {/* Modal for Add Question */}
      <Modal isOpen={isAddModalOpen} onClose={() => setAddModalOpen(false)}>
        <Add onClose={() => setAddModalOpen(false)} />
      </Modal>

      <div className="tables-flex-wrapper">
        <div>
          <h2>Top Questions</h2>
          <QuestionsTable questions={topQuestions} renderStars={renderStars} />
        </div>
        <div>
          <h2>Latest Questions</h2>
          <QuestionsTable
            questions={latestQuestions.filter((q) => q && q.question)}
            renderStars={renderStars}
          />
        </div>
      </div>
    </main>
  );
}
