"use client";

import { createSupabaseBrowserClient } from "@/lib/supabase/client";

function getApiBaseUrl() {
  return process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:4000";
}

export async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const supabase = createSupabaseBrowserClient();
  const token =
    supabase
      ? (await supabase.auth.getSession()).data.session?.access_token ?? ""
      : "";

  const response = await fetch(`${getApiBaseUrl()}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(init?.headers ?? {}),
    },
  });

  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(body.error ?? `Request failed: ${response.status}`);
  }

  return (await response.json()) as T;
}
