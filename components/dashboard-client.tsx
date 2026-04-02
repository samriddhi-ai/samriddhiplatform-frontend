"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { modules, subjects } from "@/lib/data";
import { apiFetch } from "@/lib/api/client";
import { motion, Variants } from "framer-motion";

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

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

export function DashboardClient({ displayName }: { displayName: string }) {
  const [progress, setProgress] = useState<ProgressResponse>({
    attemptCount: 0,
    bestScore: 0,
    averageScore: 0,
  });
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

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
        setError(err instanceof Error ? err.message : "Failed to load dashboard data.");
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, []);

  return (
    <main className="mx-auto w-full max-w-7xl px-6 py-12">
      <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
        <h1 className="text-4xl font-extrabold text-white">
          Welcome back, <span className="text-gradient">{displayName}</span>
        </h1>
        <p className="mt-2 text-lg text-slate-300">Your personalized learning hub.</p>
        {error && <p className="mt-3 text-sm text-rose-400 p-3 bg-rose-500/10 rounded-lg border border-rose-500/20">{error}</p>}
      </motion.div>

      {!isLoading && (
        <motion.section 
          variants={containerVariants} 
          initial="hidden" 
          animate="show" 
          className="mt-10 grid gap-6 sm:grid-cols-3"
        >
          <motion.article variants={itemVariants} className="glass-panel overflow-hidden rounded-3xl p-6 relative group">
            <div className="absolute inset-0 bg-gradient-to-br from-primary-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <p className="text-sm font-medium text-slate-400">Total Quizzes</p>
            <p className="mt-2 text-5xl font-black text-white">{progress.attemptCount}</p>
          </motion.article>
          <motion.article variants={itemVariants} className="glass-panel overflow-hidden rounded-3xl p-6 relative group">
            <div className="absolute inset-0 bg-gradient-to-br from-accent/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <p className="text-sm font-medium text-slate-400">High Score</p>
            <p className="mt-2 text-5xl font-black text-white">{progress.bestScore}</p>
          </motion.article>
          <motion.article variants={itemVariants} className="glass-panel overflow-hidden rounded-3xl p-6 relative group">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <p className="text-sm font-medium text-slate-400">Average Score</p>
            <p className="mt-2 text-5xl font-black text-white">{progress.averageScore}</p>
          </motion.article>
        </motion.section>
      )}

      <div className="mt-12 grid gap-8 lg:grid-cols-3">
        <motion.section 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ delay: 0.2 }}
          className="lg:col-span-2"
        >
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
            <span className="w-2 h-6 bg-primary-500 rounded-full inline-block"></span>
            Explore Subjects
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {subjects.map((subject) => (
              <Link
                key={subject.id}
                href={`/subjects/${subject.slug}`}
                className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-700/50 bg-slate-800/40 p-6 transition-all hover:bg-slate-800/80 hover:border-primary-500/30 hover:shadow-lg hover:shadow-primary-500/10"
              >
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                  <svg className="w-16 h-16" fill="currentColor" viewBox="0 0 24 24"><path d="M12 14l9-5-9-5-9 5 9 5z" /><path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l9-5-9-5-9 5 9 5zm0 0v6" /></svg>
                </div>
                <div className="relative z-10">
                  <h3 className="text-xl font-bold text-white group-hover:text-primary-300 transition-colors">{subject.title}</h3>
                  <p className="mt-2 text-sm text-slate-300 line-clamp-2">{subject.description || `Explore modules and challenges in ${subject.title}`}</p>
                </div>
                <div className="mt-6 flex items-center text-sm font-medium text-primary-400 relative z-10">
                  Open Subject <span className="ml-1 transition-transform group-hover:translate-x-1">→</span>
                </div>
              </Link>
            ))}
          </div>
        </motion.section>

        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ delay: 0.3 }}
          className="space-y-6"
        >
          <section className="glass-panel relative overflow-hidden rounded-3xl p-6">
            <div className="absolute top-0 right-0 w-32 h-32 bg-accent/20 rounded-bl-full filter blur-xl"></div>
            <h2 className="text-xl font-bold text-white">Current Focus</h2>
            <p className="mt-2 text-sm text-slate-300">{modules[0].summary}</p>
            <Link
              href="/subjects/math/rational-numbers"
              className="mt-6 block w-full rounded-xl bg-white text-slate-900 py-3 text-center font-bold transition-transform hover:scale-[1.02] shadow-xl hover:shadow-white/20"
            >
              Continue Learning
            </Link>
          </section>

          <section className="glass-panel overflow-hidden rounded-3xl p-6 border-t-4 border-t-primary-500">
            <h2 className="text-xl font-bold text-white mb-4">Focus Areas</h2>
            {recommendations.length > 0 ? (
              <div className="space-y-3">
                {recommendations.map((item) => (
                  <article key={item.concept} className="flex items-center justify-between rounded-xl bg-slate-800/50 p-3">
                    <p className="text-sm font-medium text-white">{conceptLabel[item.concept] ?? item.concept}</p>
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-rose-500/20 text-xs font-bold text-rose-300">
                      {item.misses}
                    </span>
                  </article>
                ))}
              </div>
            ) : (
              <div className="rounded-xl border border-dashed border-slate-600 p-4 text-center">
                <p className="text-sm text-slate-400">Complete quizzes to unlock personalized AI recommendations.</p>
              </div>
            )}
            <Link
              href="/insights"
              className="mt-5 block w-full rounded-xl border border-primary-500/30 bg-primary-500/10 py-3 text-center font-semibold text-primary-300 transition-colors hover:bg-primary-500/20"
            >
              View Full Insights
            </Link>
          </section>
        </motion.div>
      </div>
    </main>
  );
}
