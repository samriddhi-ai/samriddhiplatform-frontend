import { AuthForm } from "@/components/auth/auth-form";

export default function SignupPage() {
  return (
    <main className="mx-auto flex min-h-[80vh] w-full max-w-6xl items-center px-6 py-10">
      <AuthForm mode="signup" />
    </main>
  );
}
