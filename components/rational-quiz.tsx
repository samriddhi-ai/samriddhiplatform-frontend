"use client";

import { useState } from "react";
import { apiFetch } from "@/lib/api/client";
import { QuizQuestion } from "@/lib/types";

type RationalQuizProps = {
  questions: QuizQuestion[];
  moduleId: string;
};

export function RationalQuiz({ questions, moduleId }: RationalQuizProps) {
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [score, setScore] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<string>("");

  async function submitQuiz() {
    try {
      const result = await apiFetch<{ ok: boolean; score: number; total: number }>("/attempts", {
        method: "POST",
        body: JSON.stringify({
          moduleId,
          answers,
        }),
      });
      setScore(result.score);
      setFeedback(`You scored ${result.score}/${result.total}`);
    } catch (error) {
      setFeedback(error instanceof Error ? error.message : "Unable to submit quiz.");
    }
  }

  return (
    <section className="rounded-2xl border border-violet-200/30 bg-slate-900/70 p-5">
      <h3 className="text-lg font-semibold text-white">Quick Questionnaire</h3>
      <p className="mb-4 text-sm text-slate-200">
        Check your understanding and store your score in progress.
      </p>
      <div className="space-y-4">
        {questions.map((question) => (
          <div key={question.id} className="rounded-xl border border-white/10 p-3">
            <p className="mb-2 text-slate-100">{question.prompt}</p>
            <div className="grid gap-2">
              {question.options.map((option, optionIndex) => (
                <label key={option} className="text-sm text-slate-200">
                  <input
                    type="radio"
                    name={question.id}
                    checked={answers[question.id] === optionIndex}
                    onChange={() => setAnswers((prev) => ({ ...prev, [question.id]: optionIndex }))}
                    className="mr-2"
                  />
                  {option}
                </label>
              ))}
            </div>
            {score !== null && (
              <p className="mt-2 text-xs text-cyan-100">
                Explanation: {question.explanation}
              </p>
            )}
          </div>
        ))}
      </div>
      <button
        type="button"
        onClick={submitQuiz}
        className="mt-4 rounded-lg bg-violet-300 px-4 py-2 font-medium text-slate-900 hover:bg-violet-200"
      >
        Submit Quiz
      </button>
      {feedback && <p className="mt-3 text-sm text-violet-100">{feedback}</p>}
    </section>
  );
}
