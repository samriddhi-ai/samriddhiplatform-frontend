import { NextResponse } from "next/server";
import { modules, subjects } from "@/lib/data";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function POST() {
  const supabase = await createSupabaseServerClient();
  if (!supabase) {
    return NextResponse.json(
      { error: "Missing Supabase env variables." },
      { status: 400 },
    );
  }

  const { error: subjectError } = await supabase.from("subjects").upsert(
    subjects.map((subject) => ({
      id: subject.id,
      slug: subject.slug,
      title: subject.title,
      class_level: subject.classLevel,
      is_active: subject.isActive,
    })),
  );

  if (subjectError) {
    return NextResponse.json({ error: subjectError.message }, { status: 500 });
  }

  const mathSubject = subjects.find((subject) => subject.slug === "math");
  const { error: moduleError } = await supabase.from("learning_modules").upsert(
    modules.map((module) => ({
      id: module.id,
      subject_id: mathSubject?.id ?? "sub-math",
      slug: module.slug,
      title: module.title,
      difficulty: module.difficulty,
      content_json: { summary: module.summary },
    })),
  );

  if (moduleError) {
    return NextResponse.json({ error: moduleError.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
