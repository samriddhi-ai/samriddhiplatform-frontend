import { rationalQuiz } from "./data";

type AttemptRecord = {
  answers_json: Record<string, number> | null;
};

const conceptLabel: Record<string, string> = {
  "equivalent-fractions": "Equivalent Fractions",
  "comparing-rationals": "Comparing Rational Numbers",
  "fraction-operations": "Fraction Operations",
};

export function getWeakConceptRecommendations(attempts: AttemptRecord[]) {
  const missesByConcept: Record<string, number> = {};

  for (const attempt of attempts) {
    const answers = attempt.answers_json ?? {};
    for (const question of rationalQuiz) {
      const selected = answers[question.id];
      if (typeof selected === "number" && selected !== question.answerIndex) {
        missesByConcept[question.concept] = (missesByConcept[question.concept] ?? 0) + 1;
      }
    }
  }

  return Object.entries(missesByConcept)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([concept, misses]) => ({
      concept,
      label: conceptLabel[concept] ?? concept,
      misses,
      nextStep:
        concept === "equivalent-fractions"
          ? "Practice converting fractions by multiplying and dividing numerator/denominator equally."
          : concept === "comparing-rationals"
            ? "Use number-line placement and decimal conversion drills for comparing negatives and positives."
            : "Revise common denominator method and mixed operation examples.",
    }));
}
