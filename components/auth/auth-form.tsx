"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

type Mode = "login" | "signup" | "forgot";

type AuthFormProps = {
  mode: Mode;
};

export function AuthForm({ mode }: AuthFormProps) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [classLevel, setClassLevel] = useState(9);
  const [message, setMessage] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const title =
    mode === "login"
      ? "Welcome back"
      : mode === "signup"
        ? "Create your Samriddhi account"
        : "Reset your password";

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setLoading(true);
    setMessage("");
    const supabase = createSupabaseBrowserClient();

    if (!supabase) {
      setMessage("Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to enable auth.");
      setLoading(false);
      return;
    }

    if (mode === "login") {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        setMessage(error.message);
      } else {
        router.push("/dashboard");
        router.refresh();
      }
    }

    if (mode === "signup") {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            class_level: classLevel,
          },
        },
      });

      if (error) {
        setMessage(error.message);
      } else {
        if (data.user) {
          await supabase.from("profiles").upsert({
            id: data.user.id,
            full_name: fullName,
            class_level: classLevel,
          });
        }
        setMessage("Signup successful. You can now login.");
      }
    }

    if (mode === "forgot") {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/login`,
      });
      setMessage(error ? error.message : "Password reset link sent to your email.");
    }

    setLoading(false);
  }

  return (
    <div className="mx-auto w-full max-w-md rounded-2xl border border-white/20 bg-white/10 p-6 shadow-xl backdrop-blur">
      <h1 className="mb-1 text-2xl font-semibold text-white">{title}</h1>
      <p className="mb-6 text-sm text-slate-200">Class 9 learning starts here.</p>

      <form onSubmit={onSubmit} className="space-y-4">
        {mode === "signup" && (
          <>
            <label className="block text-sm text-slate-100">
              Full name
              <input
                required
                value={fullName}
                onChange={(event) => setFullName(event.target.value)}
                className="mt-1 w-full rounded-lg border border-white/20 bg-slate-950/60 px-3 py-2 text-white outline-none ring-cyan-300 focus:ring-2"
              />
            </label>
            <label className="block text-sm text-slate-100">
              Class level
              <input
                required
                type="number"
                min={1}
                max={12}
                value={classLevel}
                onChange={(event) => setClassLevel(Number(event.target.value))}
                className="mt-1 w-full rounded-lg border border-white/20 bg-slate-950/60 px-3 py-2 text-white outline-none ring-cyan-300 focus:ring-2"
              />
            </label>
          </>
        )}

        <label className="block text-sm text-slate-100">
          Email
          <input
            required
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="mt-1 w-full rounded-lg border border-white/20 bg-slate-950/60 px-3 py-2 text-white outline-none ring-cyan-300 focus:ring-2"
          />
        </label>

        {mode !== "forgot" && (
          <label className="block text-sm text-slate-100">
            Password
            <input
              required
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="mt-1 w-full rounded-lg border border-white/20 bg-slate-950/60 px-3 py-2 text-white outline-none ring-cyan-300 focus:ring-2"
            />
          </label>
        )}

        <button
          disabled={loading}
          className="w-full rounded-lg bg-cyan-400 px-4 py-2 font-medium text-slate-950 transition hover:bg-cyan-300 disabled:opacity-60"
        >
          {loading ? "Please wait..." : mode === "login" ? "Login" : mode === "signup" ? "Create account" : "Send reset link"}
        </button>
      </form>

      {message && <p className="mt-4 text-sm text-cyan-100">{message}</p>}

      <div className="mt-4 flex flex-wrap gap-3 text-sm text-slate-200">
        {mode !== "login" && <Link href="/auth/login">Login</Link>}
        {mode !== "signup" && <Link href="/auth/signup">Sign up</Link>}
        {mode !== "forgot" && <Link href="/auth/forgot-password">Forgot password?</Link>}
      </div>
    </div>
  );
}
