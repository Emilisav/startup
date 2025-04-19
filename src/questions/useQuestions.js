// useQuestions.js

import { useState, useEffect, useRef, useCallback } from "react";
import { sanitizeQuestion } from "./utils";

export default function useQuestions() {
  const [questions, setQuestions] = useState([]);
  const [userName, setUserName] = useState("");
  const wsRef = useRef(null);
  const reconnectTimeoutRef = useRef(null);

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

  useEffect(() => {
    const protocol = window.location.protocol === "http:" ? "ws" : "wss";
    const wsUrl = `${protocol}://${window.location.host}/ws`;

    function connectWebSocket() {
      if (wsRef.current) wsRef.current.close();

      const ws = new window.WebSocket(wsUrl);
      wsRef.current = ws;

      ws.onmessage = (event) => {
        let data;
        try {
          data = JSON.parse(event.data);
        } catch {
          return;
        }
        if (data.type === "new_question" && data.question?.question) {
          setQuestions((prev) => {
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

  return { questions, setQuestions, userName, handleStar };
}
