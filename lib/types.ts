export type Subject = {
  id: string;
  slug: string;
  title: string;
  classLevel: number;
  isActive: boolean;
  description: string;
};

export type LearningModule = {
  id: string;
  subjectSlug: string;
  slug: string;
  title: string;
  difficulty: "easy" | "medium" | "hard";
  summary: string;
};

export type QuizQuestion = {
  id: string;
  prompt: string;
  options: string[];
  answerIndex: number;
  explanation: string;
  concept: "equivalent-fractions" | "comparing-rationals" | "fraction-operations";
};
