import Link from "next/link";
import { appName } from "@/lib/data";
import { getCurrentUser } from "@/lib/auth";
import { SignOutButton } from "./auth/sign-out-button";

export async function TopNav() {
  const user = await getCurrentUser();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-slate-950/60 backdrop-blur-xl transition-all duration-300">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-6">
        <Link href="/" className="group flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary-400 to-accent text-white shadow-lg shadow-primary-500/20 transition-transform group-hover:scale-105">
            <span className="font-bold">S</span>
          </div>
          <span className="text-lg font-bold tracking-tight text-white transition-colors group-hover:text-primary-200">
            {appName}
          </span>
        </Link>
        <nav className="flex items-center gap-6 text-sm font-medium text-slate-300">
          {[
            { name: "Dashboard", href: "/dashboard" },
            { name: "Rational Numbers", href: "/subjects/math/rational-numbers" },
            { name: "Profile", href: "/profile" },
            { name: "Insights", href: "/insights" },
          ].map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="relative py-1 transition-colors hover:text-white after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-full after:origin-bottom-right after:scale-x-0 after:bg-primary-400 after:transition-transform after:duration-300 hover:after:origin-bottom-left hover:after:scale-x-100"
            >
              {item.name}
            </Link>
          ))}
          <div className="ml-2 h-5 w-px bg-slate-700"></div>
          {user ? (
            <SignOutButton />
          ) : (
            <Link
              href="/auth/login"
              className="rounded-full border border-primary-500/50 bg-primary-500/10 px-5 py-2 text-primary-200 transition-all hover:bg-primary-500/20 hover:shadow-[0_0_15px_rgba(59,130,246,0.3)]"
            >
              Login / Signup
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
