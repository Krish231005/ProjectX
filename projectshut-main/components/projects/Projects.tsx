"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FiEye, FiLogOut, FiPlus } from "react-icons/fi";
import { Motion } from "@/components/framer-motion";
import type { AuthUser } from "@/types/auth";

interface ProjectsProps {
  user?: AuthUser;
}

export default function Projects({ user }: ProjectsProps) {
  const router = useRouter();
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = async () => {
    setLoggingOut(true);
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  };

  return (
    <main className="mx-auto my-8 w-11/12 max-w-6xl sm:my-10">
      <Motion.section
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.25 }}
        className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
        <div>
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-primary">
            Project module
          </p>
          <h1 className="text-3xl font-bold text-gray-950 dark:text-white sm:text-4xl">
            Welcome, {user?.name || "there"}.
          </h1>
          <p className="mt-3 max-w-2xl text-base leading-7 text-gray-700 dark:text-gray-300">
            Choose where you want to go. Adding projects and viewing projects
            now live on separate pages.
          </p>
        </div>

        <button
          type="button"
          onClick={handleLogout}
          disabled={loggingOut}
          className="inline-flex items-center justify-center gap-2 rounded-md border border-gray-300 px-3 py-2 text-sm font-semibold text-gray-900 transition hover:border-primary disabled:opacity-60 dark:border-gray-700 dark:text-white">
          <FiLogOut aria-hidden="true" />
          {loggingOut ? "Logging out..." : "Logout"}
        </button>
      </Motion.section>

      <section className="grid gap-5 md:grid-cols-2">
        <Link
          href="/projects/add"
          className="group rounded-md border border-gray-200 bg-white p-5 shadow-sm transition hover:border-primary dark:border-gray-800 dark:bg-white/[0.03]">
          <div className="mb-5 inline-flex h-11 w-11 items-center justify-center rounded-md bg-primary text-white">
            <FiPlus aria-hidden="true" />
          </div>
          <h2 className="text-2xl font-bold text-gray-950 dark:text-white">
            Add projects
          </h2>
          <p className="mt-3 text-sm leading-6 text-gray-700 dark:text-gray-300">
            Add a project name, description, and project flow video URL.
          </p>
          <span className="mt-5 inline-flex text-sm font-semibold text-primary">
            Open add module
          </span>
        </Link>

        <Link
          href="/projects/view"
          className="group rounded-md border border-gray-200 bg-white p-5 shadow-sm transition hover:border-primary dark:border-gray-800 dark:bg-white/[0.03]">
          <div className="mb-5 inline-flex h-11 w-11 items-center justify-center rounded-md bg-primary text-white">
            <FiEye aria-hidden="true" />
          </div>
          <h2 className="text-2xl font-bold text-gray-950 dark:text-white">
            View projects
          </h2>
          <p className="mt-3 text-sm leading-6 text-gray-700 dark:text-gray-300">
            Browse all saved projects and watch their flow videos.
          </p>
          <span className="mt-5 inline-flex text-sm font-semibold text-primary">
            Open view module
          </span>
        </Link>
      </section>
    </main>
  );
}
