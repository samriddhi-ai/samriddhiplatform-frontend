import Link from "next/link";
import { notFound } from "next/navigation";
import { modules, subjects } from "@/lib/data";
import { requireUser } from "@/lib/auth";

type SubjectPageProps = {
  params: Promise<{ subjectSlug: string }>;
};

export default async function SubjectPage({ params }: SubjectPageProps) {
  await requireUser();
  const { subjectSlug } = await params;
  const subject = subjects.find((item) => item.slug === subjectSlug);

  if (!subject) {
    notFound();
  }

  const subjectModules = modules.filter((item) => item.subjectSlug === subjectSlug);

  return (
    <main className="mx-auto w-full max-w-6xl px-6 py-10">
      <h1 className="text-3xl font-bold text-white">{subject.title}</h1>
      <p className="mt-2 text-slate-200">{subject.description}</p>
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {subjectModules.length > 0 ? (
          subjectModules.map((module) => (
            <Link
              key={module.id}
              href={`/subjects/${subjectSlug}/${module.slug}`}
              className="rounded-2xl border border-white/20 bg-white/10 p-5 hover:border-cyan-200/40"
            >
              <p className="text-sm text-cyan-100">{module.difficulty}</p>
              <h2 className="mt-1 text-xl font-semibold text-white">{module.title}</h2>
              <p className="mt-2 text-sm text-slate-200">{module.summary}</p>
            </Link>
          ))
        ) : (
          <p className="text-slate-300">Modules for this subject are coming soon.</p>
        )}
      </div>
    </main>
  );
}
