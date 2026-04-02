"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api/client";

type ProgressResponse = {
  attemptCount: number;
  bestScore: number;
  averageScore: number;
};

type Recommendation = {
  concept: string;
  misses: number;
};

const conceptLabel: Record<string, string> = {
  "equivalent-fractions": "Equivalent Fractions",
  "comparing-rationals": "Comparing Rational Numbers",
  "fraction-operations": "Fraction Operations",
};

export function InsightsClient({ displayName }: { displayName: string }) {
  const [progress, setProgress] = useState<ProgressResponse>({
    attemptCount: 0,
    bestScore: 0,
    averageScore: 0,
  });
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const [progressRes, recsRes] = await Promise.all([
          apiFetch<ProgressResponse>("/progress/me"),
          apiFetch<Recommendation[]>("/recommendations/me"),
        ]);
        setProgress(progressRes);
        setRecommendations(recsRes);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load insights.");
      }
    }
    load();
  }, []);

  return (
    <main className="mx-auto w-full max-w-6xl px-6 py-10">
      <h1 className="text-3xl font-bold text-white">Parent/Teacher Insights Snapshot</h1>
      <p className="mt-2 text-slate-200">
        Share this screen in PTM style reviews to discuss progress and next focus areas.
      </p>
      {error && <p className="mt-3 text-sm text-rose-200">{error}</p>}

      <section className="mt-6 grid gap-4 sm:grid-cols-4">
        <article className="rounded-2xl border border-white/20 bg-white/10 p-5">
          <p className="text-sm text-slate-300">Student</p>
          <p className="text-lg font-semibold text-white">{displayName}</p>
        </article>
        <article className="rounded-2xl border border-white/20 bg-white/10 p-5">
          <p className="text-sm text-slate-300">Attempts</p>
          <p className="text-3xl font-semibold text-white">{progress.attemptCount}</p>
        </article>
        <article className="rounded-2xl border border-white/20 bg-white/10 p-5">
          <p className="text-sm text-slate-300">Best score</p>
          <p className="text-3xl font-semibold text-white">{progress.bestScore}</p>
        </article>
        <article className="rounded-2xl border border-white/20 bg-white/10 p-5">
          <p className="text-sm text-slate-300">Average</p>
          <p className="text-3xl font-semibold text-white">{progress.averageScore}</p>
        </article>
      </section>

      <section className="mt-8 rounded-2xl border border-cyan-200/20 bg-slate-900/70 p-6">
        <h2 className="text-xl font-semibold text-white">Priority weak concepts</h2>
        {recommendations.length > 0 ? (
          <ul className="mt-3 space-y-3">
            {recommendations.map((item) => (
              <li key={item.concept} className="rounded-xl border border-white/10 p-4">
                <p className="text-white">{conceptLabel[item.concept] ?? item.concept}</p>
                <p className="text-sm text-slate-300">Misses: {item.misses}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-2 text-slate-200">No weak concepts detected yet.</p>
        )}
      </section>
    </main>
  );
}
