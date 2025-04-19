import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
} from "react";
import "./questions.css";

export default function Questions() {
  const [questions, setQuestions] = useState([]);
  const [userName, setUserName] = useState("");
  const wsRef = useRef(null);
  const reconnectTimeoutRef = useRef(null);

  function sanitizeQuestion(q) {
    return {
      question: typeof q.question === "string" ? q.question : "",
      stars: typeof q.stars === "number" ? q.stars : 0,
      date: q.date || new Date().toISOString(),
      userName: q.userName || "Guest",
    };
  }

  // Utility: get N unique random items from array
  function getRandomUnique(arr, n) {
    const copy = [...arr];
    const result = [];
    while (copy.length && result.length < n) {
      const idx = Math.floor(Math.random() * copy.length);
      result.push(copy.splice(idx, 1)[0]);
    }
    return result;
  }

  // Load questions on mount
  useEffect(() => {
    let storedName = localStorage.getItem("userName");
    if (!storedName || storedName === "undefined") {
      storedName = `Guest${Math.floor(Math.random() * 999)}`;
      localStorage.setItem("userName", storedName);
    }
    setUserName(storedName);

    async function loadQuestions() {
      try {
        const res = await fetch("/api/questions");
        const data = await res.json();
        const sanitized = data.map(sanitizeQuestion);
        localStorage.setItem("questions", JSON.stringify(sanitized));
        setQuestions(sanitized);
      } catch {
        const cached = localStorage.getItem("questions");
        if (cached) {
          const parsed = JSON.parse(cached);
          setQuestions(parsed);
        } else {
          setQuestions([]);
        }
      }
    }
    loadQuestions();
  }, []);

  // WebSocket logic
  useEffect(() => {
    const protocol = window.location.protocol === "http:" ? "ws" : "wss";
    const wsUrl = `${protocol}://${window.location.host}/ws`;

    function connectWebSocket() {
      if (wsRef.current) wsRef.current.close();

      const ws = new window.WebSocket(wsUrl);
      wsRef.current = ws;

      ws.onopen = () => {};

      ws.onmessage = (event) => {
        let data;
        try {
          data = JSON.parse(event.data);
        } catch {
          return;
        }
        if (data.type === "new_question" && data.question?.question) {
          setQuestions((prev) => {
            // Avoid duplicates
            const exists = prev.some(
              (q) =>
                q.question === data.question.question &&
                q.date === (data.question.date || "")
            );
            if (exists) return prev;
            const sanitized = sanitizeQuestion(data.question);
            const next = [...prev, sanitized];
            localStorage.setItem("questions", JSON.stringify(next));
            return next;
          });
        } else {
          // fallback: reload all questions
          fetch("/api/questions")
            .then((res) => res.json())
            .then((data) => {
              const sanitized = data.map(sanitizeQuestion);
              setQuestions(sanitized);
              localStorage.setItem("questions", JSON.stringify(sanitized));
            });
        }
      };

      ws.onclose = () => {
        reconnectTimeoutRef.current = setTimeout(connectWebSocket, 3000);
      };

      ws.onerror = () => {
        ws.close();
      };
    }

    connectWebSocket();

    return () => {
      if (wsRef.current) wsRef.current.close();
      if (reconnectTimeoutRef.current)
        clearTimeout(reconnectTimeoutRef.current);
    };
    // eslint-disable-next-line
  }, []);

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
      const sanitized = updated.map(sanitizeQuestion);
      setQuestions(sanitized);
      localStorage.setItem("questions", JSON.stringify(sanitized));
    } catch {
      setQuestions((qs) =>
        qs.map((qq) =>
          qq.question === q.question ? { ...qq, stars: newRating } : qq
        )
      );
    }
  }, []);

  // --- TOP 5 RANDOM QUESTIONS FROM TOP 10% ---
  const topQuestions = useMemo(() => {
    if (questions.length === 0) return [];
    const sorted = [...questions].sort((a, b) => b.stars - a.stars);
    const topCount = Math.max(1, Math.ceil(sorted.length * 0.1));
    let topSubset = sorted.slice(0, topCount);

    // If less than 5 in topSubset, fill from next highest (without repeats)
    if (topSubset.length < 5) {
      const remainder = sorted.slice(topCount);
      // Shuffle remainder
      const shuffledRemainder = getRandomUnique(remainder, remainder.length);
      topSubset = topSubset.concat(shuffledRemainder).slice(0, 5);
    } else {
      // Shuffle and pick 5
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
            {topQuestions.length > 0 ? (
              topQuestions.map((q, idx) => (
                <tr key={q.question + q.date}>
                  <td data-th="Question">{q.question}</td>
                  <td data-th="Stars">{renderStars(q)}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={2}>No questions yet.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <h2>These are the latest questions!</h2>
      <div id="new">
        <table className="table" id="player-messages">
          <tbody>
            {latestQuestions
              .filter((q) => q && q.question) // Skip empty/malformed
              .map((q) => (
                <tr key={q.question + q.date}>
                  <td data-th="Question">{q.question}</td>
                  <td data-th="Stars">{renderStars(q)}</td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
