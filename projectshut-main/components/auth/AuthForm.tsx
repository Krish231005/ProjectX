"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, Suspense, useState } from "react";
import { FiLogIn, FiUserPlus } from "react-icons/fi";

type AuthMode = "login" | "signup";

interface AuthFormProps {
  mode: AuthMode;
}

function AuthFormContent({ mode }: AuthFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") || "/projects";
  const isSignup = mode === "signup";
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const response = await fetch(`/api/auth/${mode}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...(isSignup ? { name } : {}),
          email,
          password,
        }),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Authentication failed.");
      }

      router.push(next);
      router.refresh();
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Authentication failed."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="mx-auto flex min-h-[70vh] w-11/12 max-w-md items-center py-10">
      <form
        onSubmit={handleSubmit}
        className="w-full rounded-md border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-white/[0.03] sm:p-6">
        <p className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-primary">
          Project access
        </p>
        <h1 className="text-3xl font-bold text-gray-950 dark:text-white">
          {isSignup ? "Create your account" : "Login to continue"}
        </h1>
        <p className="mt-3 text-sm leading-6 text-gray-600 dark:text-gray-400">
          {isSignup
            ? "Sign up to add and view saved projects."
            : "Login to access the projects module."}
        </p>

        <div className="mt-6 grid gap-4">
          {isSignup && (
            <label className="grid gap-2 text-sm font-medium text-gray-900 dark:text-white">
              Name
              <input
                value={name}
                onChange={(event) => setName(event.target.value)}
                required
                maxLength={80}
                placeholder="Krish"
                className="rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-950 outline-none transition focus:border-primary dark:border-gray-700 dark:bg-secondary dark:text-white"
              />
            </label>
          )}

          <label className="grid gap-2 text-sm font-medium text-gray-900 dark:text-white">
            Email
            <input
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
              type="email"
              placeholder="you@example.com"
              className="rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-950 outline-none transition focus:border-primary dark:border-gray-700 dark:bg-secondary dark:text-white"
            />
          </label>

          <label className="grid gap-2 text-sm font-medium text-gray-900 dark:text-white">
            Password
            <input
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
              minLength={6}
              type="password"
              placeholder="Minimum 6 characters"
              className="rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-950 outline-none transition focus:border-primary dark:border-gray-700 dark:bg-secondary dark:text-white"
            />
          </label>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-md bg-primary px-4 py-2.5 font-semibold text-white transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-60">
          {isSignup ? <FiUserPlus aria-hidden="true" /> : <FiLogIn aria-hidden="true" />}
          {loading ? "Please wait..." : isSignup ? "Sign up" : "Login"}
        </button>

        {message && (
          <p className="mt-3 text-sm text-red-600 dark:text-red-300">
            {message}
          </p>
        )}

        <p className="mt-5 text-center text-sm text-gray-600 dark:text-gray-400">
          {isSignup ? "Already have an account?" : "Need an account?"}{" "}
          <Link
            href={`${isSignup ? "/login" : "/signup"}?next=${encodeURIComponent(
              next
            )}`}
            className="font-semibold text-primary">
            {isSignup ? "Login" : "Sign up"}
          </Link>
        </p>
      </form>
    </main>
  );
}

export default function AuthForm(props: AuthFormProps) {
  return (
    <Suspense>
      <AuthFormContent {...props} />
    </Suspense>
  );
}
