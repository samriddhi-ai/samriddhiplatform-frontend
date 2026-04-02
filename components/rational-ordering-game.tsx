"use client";

import { useMemo, useState } from "react";

const targetOrder = ["-3/4", "-1/2", "0", "2/3", "5/6"];

function fractionToNumber(value: string) {
  if (!value.includes("/")) return Number(value);
  const [a, b] = value.split("/").map(Number);
  return a / b;
}

export function RationalOrderingGame() {
  const [items, setItems] = useState(["2/3", "-3/4", "5/6", "0", "-1/2"]);
  const [message, setMessage] = useState("");

  const sorted = useMemo(
    () => [...items].sort((a, b) => fractionToNumber(a) - fractionToNumber(b)),
    [items],
  );

  function move(index: number, direction: -1 | 1) {
    const nextIndex = index + direction;
    if (nextIndex < 0 || nextIndex >= items.length) return;
    const next = [...items];
    [next[index], next[nextIndex]] = [next[nextIndex], next[index]];
    setItems(next);
    setMessage("");
  }

  function checkAnswer() {
    setMessage(
      items.join(",") === targetOrder.join(",")
        ? "Perfect order. Great number sense!"
        : "Not yet. Try placing more negative values first, then zero, then positives.",
    );
  }

  return (
    <section className="rounded-2xl border border-emerald-200/30 bg-slate-900/70 p-5">
      <h3 className="text-lg font-semibold text-white">Mini-game: Ordering Race</h3>
      <p className="mb-3 text-sm text-slate-200">
        Reorder chips into ascending order by moving each up/down.
      </p>
      <div className="space-y-2">
        {items.map((item, index) => (
          <div key={item} className="flex items-center justify-between rounded-lg border border-white/10 px-3 py-2">
            <span className="text-white">{item}</span>
            <div className="flex gap-2">
              <button type="button" onClick={() => move(index, -1)} className="rounded bg-slate-700 px-2 py-1 text-xs text-white">Up</button>
              <button type="button" onClick={() => move(index, 1)} className="rounded bg-slate-700 px-2 py-1 text-xs text-white">Down</button>
            </div>
          </div>
        ))}
      </div>
      <button type="button" onClick={checkAnswer} className="mt-3 rounded bg-emerald-300 px-4 py-2 font-medium text-slate-900">
        Check Order
      </button>
      {message && <p className="mt-2 text-sm text-emerald-100">{message}</p>}
      <p className="mt-2 text-xs text-slate-400">Reference sorted values: {sorted.join(" < ")}</p>
    </section>
  );
}
