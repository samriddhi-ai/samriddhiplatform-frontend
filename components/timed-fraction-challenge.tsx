"use client";

import { useEffect, useMemo, useState } from "react";

const rounds = [
  { left: "1/2", right: "3/5", answer: "<" },
  { left: "-2/3", right: "-3/4", answer: ">" },
  { left: "4/7", right: "8/14", answer: "=" },
];

export function TimedFractionChallenge() {
  const [roundIndex, setRoundIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(20);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (done) return;
    if (timeLeft <= 0) {
      setDone(true);
      return;
    }
    const timer = setTimeout(() => setTimeLeft((prev) => prev - 1), 1000);
    return () => clearTimeout(timer);
  }, [timeLeft, done]);

  const round = useMemo(() => rounds[roundIndex], [roundIndex]);

  function select(choice: "<" | ">" | "=") {
    if (done) return;
    if (choice === round.answer) setScore((prev) => prev + 1);
    if (roundIndex === rounds.length - 1) {
      setDone(true);
    } else {
      setRoundIndex((prev) => prev + 1);
    }
  }

  function reset() {
    setRoundIndex(0);
    setTimeLeft(20);
    setScore(0);
    setDone(false);
  }

  return (
    <section className="rounded-2xl border border-amber-200/30 bg-slate-900/70 p-5">
      <h3 className="text-lg font-semibold text-white">Mini-game: Timed Challenge</h3>
      <p className="mb-3 text-sm text-slate-200">Beat the timer by comparing fractions quickly.</p>
      <div className="mb-3 flex items-center justify-between text-sm text-amber-100">
        <span>Time left: {timeLeft}s</span>
        <span>Score: {score}</span>
      </div>

      {!done ? (
        <div className="rounded-xl border border-white/10 p-4 text-center">
          <p className="text-xl text-white">
            {round.left} ? {round.right}
          </p>
          <div className="mt-3 flex justify-center gap-3">
            {(["<", "=", ">"] as const).map((symbol) => (
              <button
                key={symbol}
                type="button"
                onClick={() => select(symbol)}
                className="rounded bg-amber-300 px-3 py-2 font-semibold text-slate-900"
              >
                {symbol}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="rounded-xl border border-white/10 p-4 text-center">
          <p className="text-white">Challenge complete. Score: {score}/{rounds.length}</p>
          <button type="button" onClick={reset} className="mt-3 rounded bg-amber-300 px-3 py-2 font-semibold text-slate-900">
            Play again
          </button>
        </div>
      )}
    </section>
  );
}
