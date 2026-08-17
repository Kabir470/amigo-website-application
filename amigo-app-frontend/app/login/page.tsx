"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Brand } from "@/components/Logo";
import { Button, Field, inputClass } from "@/components/ui";
import { useAuth } from "@/lib/auth/AuthContext";
import { ThemeToggle } from "@/components/ThemeToggle";

function LoginForm() {
  const router = useRouter();
  const { signIn, signUp, session, loading: authLoading } = useAuth();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!authLoading && session) {
      router.replace("/dashboard");
    }
  }, [session, authLoading, router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccessMsg("");
    setLoading(true);

    try {
      if (isSignUp) {
        const { error } = await signUp(email, password);
        if (error) {
          setError(error);
          setLoading(false);
        } else {
          setSuccessMsg("Account created! Redirecting to dashboard...");
        }
      } else {
        const { error } = await signIn(email, password);
        if (error) {
          setError(error);
          setLoading(false);
        } else {
          router.replace("/dashboard");
        }
      }
    } catch {
      setError("An unexpected error occurred. Please try again.");
      setLoading(false);
    }
  }

  return (
    <div className="w-full max-w-md">
      <Link href="/" className="mb-10 inline-block">
        <Brand />
      </Link>

      <h1 className="font-display text-2xl font-semibold text-ink dark:text-slate-100">
        {isSignUp ? "Create Account" : "Staff sign in"}
      </h1>
      <p className="mt-1.5 text-sm text-slate-650 dark:text-slate-400">
        {isSignUp
          ? "Sign up for the Amigo admin panel."
          : "Manage patients, schedules, and Amigo's deliveries."}
      </p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-5">
        <Field label="Work email">
          <input
            type="email"
            className={inputClass}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="staff@amigo.care"
            autoComplete="username"
            required
          />
        </Field>
        <Field label="Password">
          <input
            type="password"
            className={inputClass}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            autoComplete="current-password"
            required
          />
        </Field>

        {error && (
          <p className="rounded-lg bg-coral-400/10 dark:bg-rose-950/60 px-3.5 py-2.5 text-sm text-coral-500 dark:text-rose-300">
            {error}
          </p>
        )}

        {successMsg && (
          <p className="rounded-lg bg-teal-400/10 dark:bg-teal-950/60 px-3.5 py-2.5 text-sm text-teal-600 dark:text-teal-300">
            {successMsg}
          </p>
        )}

        <Button type="submit" disabled={loading || authLoading} className="w-full">
          {loading ? (isSignUp ? "Creating account…" : "Signing in…") : (isSignUp ? "Create Account" : "Sign in")}
        </Button>
      </form>

      <div className="mt-6 text-center text-sm text-slate-650 dark:text-slate-400">
        {isSignUp ? (
          <>
            Already have an account?{" "}
            <button
              onClick={() => { setIsSignUp(false); setError(null); setSuccessMsg(""); }}
              className="font-medium text-teal-600 dark:text-teal-400 hover:underline"
            >
              Sign in
            </button>
          </>
        ) : (
          <>
            Don't have an account?{" "}
            <button
              onClick={() => { setIsSignUp(true); setError(null); setSuccessMsg(""); }}
              className="font-medium text-teal-600 dark:text-teal-400 hover:underline"
            >
              Sign up
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <main className="relative flex min-h-screen items-center justify-center bg-mist dark:bg-[#0B1317] px-6 py-12 transition-colors">
      <div className="absolute top-6 right-6">
        <ThemeToggle />
      </div>
      <Suspense>
        <LoginForm />
      </Suspense>
    </main>
  );
}
