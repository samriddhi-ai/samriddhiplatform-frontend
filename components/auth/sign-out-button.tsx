"use client";

import { useRouter } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

export function SignOutButton() {
  const router = useRouter();

  async function signOut() {
    const supabase = createSupabaseBrowserClient();
    if (!supabase) {
      return;
    }
    await supabase.auth.signOut();
    router.push("/auth/login");
    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={signOut}
      className="rounded-full border border-rose-300 px-4 py-1.5 text-rose-100 hover:bg-rose-500/20"
    >
      Logout
    </button>
  );
}
