"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export default function Home() {
  return (
    <main className="relative mx-auto flex min-h-[90vh] w-full max-w-7xl flex-col items-center justify-center gap-12 px-6 py-20 text-center">
      {/* Background Blobs for Ambient Light */}
      <div className="blob-shape bg-primary-600 top-20 left-10 h-72 w-72 animate-blob" />
      <div className="blob-shape bg-accent top-40 right-20 h-96 w-96 animate-blob [animation-delay:2s]" />
      <div className="blob-shape bg-cyan-400 bottom-10 left-1/3 h-80 w-80 animate-blob [animation-delay:4s]" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="z-10 flex flex-col items-center gap-6"
      >
        <span className="w-fit rounded-full border border-primary-400/30 bg-primary-900/40 px-4 py-1.5 text-sm font-medium tracking-wide text-primary-200 shadow-lg backdrop-blur-md">
          Class 9 Personalized Learning Platform
        </span>
        
        <h1 className="max-w-4xl text-5xl font-extrabold tracking-tight text-white sm:text-7xl">
          Learn with <span className="text-gradient">Creativity</span>, <br />
          Clarity & Confidence.
        </h1>
        
        <p className="max-w-2xl text-lg leading-relaxed text-slate-300">
          Interactive lessons, animation-powered concepts, and gamified quizzes to 
          improve outcomes in Mathematics, Science, English, and beyond.
        </p>

        <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/auth/signup"
            className="group relative flex h-14 items-center justify-center gap-2 overflow-hidden rounded-xl bg-gradient-to-r from-primary-600 to-accent px-8 font-semibold text-white shadow-lg shadow-primary-500/30 transition-all hover:scale-105 hover:shadow-primary-500/50"
          >
            <span>Start Learning</span>
            <svg className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
          </Link>
          <Link
            href="/dashboard"
            className="flex h-14 items-center justify-center rounded-xl border border-slate-700 bg-slate-800/50 px-8 font-semibold text-white backdrop-blur-sm transition-all hover:bg-slate-700/50"
          >
            Open Dashboard
          </Link>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.3 }}
        className="z-10 mt-16 grid w-full max-w-5xl grid-cols-1 gap-6 sm:grid-cols-3"
      >
        {features.map((feature, idx) => (
          <div key={idx} className="glass-panel flex flex-col items-center rounded-2xl p-8 text-center transition-transform hover:-translate-y-2">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-800/80 shadow-inner">
              {feature.icon}
            </div>
            <h3 className="mb-2 text-xl font-bold text-white">{feature.title}</h3>
            <p className="text-sm text-slate-300">{feature.description}</p>
          </div>
        ))}
      </motion.div>
    </main>
  );
}

const features = [
  {
    title: "Interactive Math",
    description: "Visualize equations and concepts with drag-and-drop mechanics.",
    icon: <span className="text-2xl text-primary-400">∑</span>
  },
  {
    title: "Science Simulations",
    description: "Learn physics and biology through immersive mini-labs.",
    icon: <span className="text-2xl text-primary-400">⚛</span>
  },
  {
    title: "Real-time Insights",
    description: "Track your progress tailored exactly to Class 9 curriculum.",
    icon: <span className="text-2xl text-primary-400">📈</span>
  }
];
