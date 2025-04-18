import React, { useState, useEffect, useRef, useCallback } from "react";
import "./questions.css";

export default function Questions() {
  const [questions, setQuestions] = useState([]);
  const [userName, setUserName] = useState("");
  const wsRef = useRef(null);
  const reconnectTimeoutRef = useRef(null);

  // Load userName and questions on mount
  useEffect(() => {
    let storedName = localStorage.getItem("userName");
    if (!storedName || storedName === "undefined") {
      storedName = `Guest${Math.floor(Math.random() * 999)}`;
      localStorage.setItem("userName", storedName);
    }
    setUserName(storedName);

    // Fetch questions from API or localStorage
    async function loadQuestions() {
      try {
        const res = await fetch("/api/questions");
        const data = await res.json();
        // Ensure all questions have required fields
        const sanitized = data.map((q) => ({
          question: q.question,
          stars: typeof q.stars === "number" ? q.stars : 0,
          date: q.date || new Date().toISOString(),
          userName: q.userName || "Guest",
        }));
        localStorage.setItem("questions", JSON.stringify(sanitized));
        setQuestions(sanitized);
      } catch {
        const cached = localStorage.getItem("questions");
        if (cached) setQuestions(JSON.parse(cached));
        else setQuestions([]);
      }
    }
    loadQuestions();
  }, []);

  // WebSocket setup
  useEffect(() => {
    const protocol = window.location.protocol === "http:" ? "ws" : "wss";
    const wsUrl = `${protocol}://${window.location.host}/ws`;

    function connectWebSocket() {
      if (wsRef.current) wsRef.current.close();

      const ws = new window.WebSocket(wsUrl);
      wsRef.current = ws;

      ws.onopen = () => {
        // Connection established
      };

      ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if (data.type === "new_question" && data.question?.question) {
          setQuestions((prev) => {
            const exists = prev.some(
              (q) => q.question === data.question?.question
            );
            return exists
              ? prev
              : [
                  ...prev,
                  {
                    ...data.question,
                    stars:
                      typeof data.question.stars === "number"
                        ? data.question.stars
                        : 0,
                    date: data.question.date || new Date().toISOString(),
                    userName: data.question.userName || "Guest",
                  },
                ];
          });
        } else {
          // For star updates and other events, refetch questions
          fetch("/api/questions")
            .then((res) => res.json())
            .then((data) => {
              const sanitized = data.map((q) => ({
                question: q.question,
                stars: typeof q.stars === "number" ? q.stars : 0,
                date: q.date || new Date().toISOString(),
                userName: q.userName || "Guest",
              }));
              setQuestions(sanitized);
              localStorage.setItem("questions", JSON.stringify(sanitized));
            });
        }
      };

      ws.onclose = () => {
        // Try to reconnect after 3 seconds
        reconnectTimeoutRef.current = setTimeout(connectWebSocket, 3000);
      };

      ws.onerror = (err) => {
        // Optionally handle error
        ws.close();
      };
    }

    connectWebSocket();

    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
    };
  }, []);

  // Star or unstar a question
  const handleStar = useCallback(async (q, index) => {
    const newRating = index + 1;
    const add = newRating > q.stars;

    try {
      const res = await fetch("/api/star", {
        method: add ? "POST" : "DELETE",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ question: q.question }),
      });
      const updated = await res.json();
      setQuestions(updated);
      localStorage.setItem("questions", JSON.stringify(updated));
    } catch (err) {
      // Local fallback
      setQuestions((qs) =>
        qs.map((qq) =>
          qq.question === q.question ? { ...qq, stars: newRating } : qq
        )
      );
    }
  }, []);

  // Top and latest logic
  const topQuestions = [...questions]
    .sort((a, b) => b.stars - a.stars)
    .slice(0, 5);

  const latestQuestions = [...questions]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 3);

  // Render star-shaped checkboxes
  function renderStars(q) {
    return (
      <div className="stars">
        {[...Array(5)].map((_, i) => (
          <input
            key={i}
            type="checkbox"
            checked={i < q.stars}
            onChange={() => handleStar(q, i)}
            className="star-checkbox"
            aria-label={`${i + 1} stars`}
          />
        ))}
      </div>
    );
  }

  return (
    <main>
      <h2>Top Questions</h2>
      <div id="top">
        <table className="table">
          <tbody>
            {topQuestions.map((q, idx) => (
              <tr key={q.question}>
                <td data-th="Question">
                  {idx + 1}. {q.question}
                </td>
                <td data-th="Stars">{renderStars(q)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2>These are the latest questions!</h2>
      <div id="new">
        <table className="table" id="player-messages">
          <tbody>
            {latestQuestions.map((q) => (
              <tr key={q.question + q.date}>
                <td data-th="Question">
                  {q.question} - {q.userName}
                </td>
                <td data-th="Stars">{renderStars(q)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
