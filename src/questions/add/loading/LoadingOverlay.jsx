import React, { useState, useEffect, useRef } from "react";
import "./LoadingOverlay.css";

const tokenize = (text) => {
  // Split by space or punctuation, keeping them as tokens
  return text.match(/[\w'-]+|[.,!?;:]+|\s+/g) || [];
};

const LoadingOverlay = () => {
  const [joke, setJoke] = useState("");
  const [version, setVersion] = useState(0);
  const animationTimer = useRef(null);

  const fetchJoke = async () => {
    try {
      const response = await fetch(
        `https://icanhazdadjoke.com/?_=${Date.now()}`,
        {
          headers: {
            Accept: "application/json",
          },
        }
      );
      const data = await response.json();
      setJoke(data.joke);
    } catch (error) {
      setJoke("Fresh jokes coming soon...");
    }
  };

  useEffect(() => {
    const timer = setInterval(fetchJoke, 8000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    fetchJoke();
  }, []);

  useEffect(() => {
    if (animationTimer.current) clearTimeout(animationTimer.current);
    animationTimer.current = setTimeout(() => {
      setVersion((v) => v + 1);
    }, 50);
  }, [joke]);

  // Tokenize joke for wrapping
  const tokens = tokenize(joke || "LOADING");

  return (
    <div className="loading-container" key={version}>
      <div className="load-flex">
        {tokens.map((token, tokenIdx) => (
          <span key={`${version}-token-${tokenIdx}`} className="load-token">
            {token.split("").map((char, idx) => (
              <span
                key={`${version}-char-${tokenIdx}-${idx}`}
                className="load-letter"
                style={{ animationDelay: `${(tokenIdx + idx) * 0.03}s` }}
              >
                {char === " " ? "\u00A0" : char}
              </span>
            ))}
          </span>
        ))}
      </div>
    </div>
  );
};

export default LoadingOverlay;
