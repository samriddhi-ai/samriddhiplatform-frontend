import { LearningModule, QuizQuestion, Subject } from "./types";

export const appName = "Samriddhi Learn";

export const subjects: Subject[] = [
  {
    id: "sub-math",
    slug: "math",
    title: "Mathematics",
    classLevel: 9,
    isActive: true,
    description: "Concept-first math with visual models and puzzle practice.",
  },
  {
    id: "sub-science",
    slug: "science",
    title: "Science",
    classLevel: 9,
    isActive: true,
    description: "Build scientific thinking with experiments and real-world cases.",
  },
  {
    id: "sub-english",
    slug: "english",
    title: "English",
    classLevel: 9,
    isActive: true,
    description: "Grammar, reading comprehension, and writing confidence.",
  },
];

export const modules: LearningModule[] = [
  {
    id: "mod-rational-numbers",
    subjectSlug: "math",
    slug: "rational-numbers",
    title: "Rational Numbers",
    difficulty: "medium",
    summary: "Learn fractions, equivalent forms, ordering, and operations.",
  },
];

export const rationalQuiz: QuizQuestion[] = [
  {
    id: "q1",
    prompt: "Which of these is equivalent to 3/4?",
    options: ["6/8", "9/10", "2/3", "12/20"],
    answerIndex: 0,
    explanation: "Multiply numerator and denominator by 2: 3/4 = 6/8.",
    concept: "equivalent-fractions",
  },
  {
    id: "q2",
    prompt: "Which number is greater?",
    options: ["-1/2", "-3/8", "Both are equal", "Cannot compare"],
    answerIndex: 1,
    explanation:
      "-3/8 is closer to zero than -1/2, so it is the greater number.",
    concept: "comparing-rationals",
  },
  {
    id: "q3",
    prompt: "What is 2/3 + 1/6?",
    options: ["3/9", "5/6", "1/2", "4/6"],
    answerIndex: 1,
    explanation: "Convert 2/3 to 4/6, then add: 4/6 + 1/6 = 5/6.",
    concept: "fraction-operations",
  },
];
