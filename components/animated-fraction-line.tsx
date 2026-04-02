"use client";

import { motion } from "framer-motion";
import { useMemo, useState } from "react";

const values = [-1, -0.5, -0.25, 0, 0.25, 0.5, 0.75, 1];

export function AnimatedFractionLine() {
  const [index, setIndex] = useState(5);
  const selected = values[index];
  const left = useMemo(() => ((selected + 1) / 2) * 100, [selected]);

  return (
    <section className="rounded-2xl border border-cyan-200/30 bg-slate-900/70 p-5">
      <h3 className="text-lg font-semibold text-white">Number Line Explorer</h3>
      <p className="mb-4 text-sm text-slate-200">
        Move the slider to visualize how rational numbers sit on a line.
      </p>

      <input
        type="range"
        min={0}
        max={values.length - 1}
        value={index}
        onChange={(event) => setIndex(Number(event.target.value))}
        className="w-full"
      />

      <div className="relative mt-6 h-14 rounded-lg bg-slate-800 px-4">
        <div className="absolute left-4 right-4 top-1/2 h-1 -translate-y-1/2 rounded bg-slate-600" />
        <motion.div
          animate={{ left: `calc(${left}% - 8px)` }}
          transition={{ type: "spring", stiffness: 180, damping: 18 }}
          className="absolute top-1/2 h-4 w-4 -translate-y-1/2 rounded-full bg-cyan-300"
        />
      </div>
      <p className="mt-3 text-sm text-cyan-100">Selected value: {selected}</p>
    </section>
  );
}
