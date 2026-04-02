import { AnimatedFractionLine } from "@/components/animated-fraction-line";
import { RationalOrderingGame } from "@/components/rational-ordering-game";
import { RationalQuiz } from "@/components/rational-quiz";
import { TimedFractionChallenge } from "@/components/timed-fraction-challenge";
import { modules, rationalQuiz } from "@/lib/data";
import { requireUser } from "@/lib/auth";

export default async function RationalNumbersPage() {
  await requireUser();
  const learningModule = modules[0];

  return (
    <main className="mx-auto w-full max-w-6xl px-6 py-10">
      <h1 className="text-3xl font-bold text-white">Class 9: Rational Numbers</h1>
      <p className="mt-2 max-w-3xl text-slate-200">
        Understand, visualize, and practice rational numbers through concept cards,
        animation, creative puzzle, and a quick scored quiz.
      </p>

      <section className="mt-6 grid gap-4 sm:grid-cols-3">
        <article className="rounded-2xl border border-white/20 bg-white/10 p-4">
          <h2 className="text-lg font-semibold text-white">Concept Card</h2>
          <p className="mt-2 text-sm text-slate-200">
            Rational numbers are numbers in the form p/q, where q is not zero.
          </p>
        </article>
        <article className="rounded-2xl border border-white/20 bg-white/10 p-4">
          <h2 className="text-lg font-semibold text-white">Equivalent Fractions</h2>
          <p className="mt-2 text-sm text-slate-200">
            1/2 = 2/4 = 3/6. Multiply or divide both numerator and denominator by
            the same non-zero number.
          </p>
        </article>
        <article className="rounded-2xl border border-white/20 bg-white/10 p-4">
          <h2 className="text-lg font-semibold text-white">Operations Tip</h2>
          <p className="mt-2 text-sm text-slate-200">
            Use common denominator for addition/subtraction. Multiply numerators and
            denominators directly for multiplication.
          </p>
        </article>
      </section>

      <div className="mt-8">
        <AnimatedFractionLine />
      </div>

      <div className="mt-8 grid gap-4 lg:grid-cols-2">
        <RationalOrderingGame />
        <TimedFractionChallenge />
      </div>

      <div className="mt-8">
        <RationalQuiz questions={rationalQuiz} moduleId={learningModule.id} />
      </div>
    </main>
  );
}
