import { requireUser } from "@/lib/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export default async function ProfilePage() {
  const user = await requireUser();
  const supabase = await createSupabaseServerClient();
  let profile: { full_name: string | null; class_level: number | null } | null = null;

  if (supabase) {
    const { data } = await supabase
      .from("profiles")
      .select("full_name, class_level")
      .eq("id", user.id)
      .single();
    profile = data;
  }

  return (
    <main className="mx-auto w-full max-w-4xl px-6 py-10">
      <h1 className="text-3xl font-bold text-white">Profile</h1>
      <div className="mt-6 rounded-2xl border border-white/20 bg-white/10 p-6">
        <p className="text-slate-300">Email</p>
        <p className="text-white">{user.email}</p>
        <p className="mt-4 text-slate-300">Full name</p>
        <p className="text-white">{profile?.full_name ?? user.user_metadata.full_name ?? "Not set"}</p>
        <p className="mt-4 text-slate-300">Class level</p>
        <p className="text-white">{profile?.class_level ?? user.user_metadata.class_level ?? 9}</p>
      </div>
    </main>
  );
}
