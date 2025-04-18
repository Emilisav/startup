import React from "react";

const PETAL_COUNT = 10;
const ANIMATIONS = ["falling", "falling2", "falling3"];

function randomBetween(min, max) {
  return min + Math.random() * (max - min);
}

export default function Petals() {
  return (
    <>
      {Array.from({ length: PETAL_COUNT }).map((_, i) => {
        const width = randomBetween(11, 21);
        const height = randomBetween(14, 20);
        const duration = randomBetween(12, 30);
        const delay = randomBetween(0, 5);
        const leftStart = randomBetween(0, 100); // Random starting position
        const anim = ANIMATIONS[Math.floor(Math.random() * ANIMATIONS.length)];

        return (
          <i
            key={i}
            style={{
              "--w": `${width}px`,
              "--h": `${height}px`,
              "--duration": `${duration}s`,
              "--delay": `${delay}s`,
              "--left-start": `${leftStart}%`,
              "--anim": anim,
              top: "-10%", // Start position off-screen
              left: `${leftStart}%`,
            }}
          />
        );
      })}
    </>
  );
}
