"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { FiArrowLeft, FiPlus } from "react-icons/fi";

type SaveState = "idle" | "saving" | "saved" | "error";

const emptyForm = {
  name: "",
  description: "",
  videoUrl: "",
};

export default function AddProject() {
  const [form, setForm] = useState(emptyForm);
  const [saveState, setSaveState] = useState<SaveState>("idle");
  const [message, setMessage] = useState("");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaveState("saving");
    setMessage("");

    try {
      const response = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to save project.");
      }

      setForm(emptyForm);
      setSaveState("saved");
      setMessage("Project added. You can view it on the projects view page.");
    } catch (error) {
      setSaveState("error");
      setMessage(
        error instanceof Error ? error.message : "Unable to save project."
      );
    }
  };

  return (
    <main className="mx-auto my-8 w-11/12 max-w-4xl sm:my-10">
      <Link
        href="/projects"
        className="mb-6 inline-flex items-center gap-2 rounded-md border border-gray-300 px-3 py-2 text-sm font-semibold text-gray-900 transition hover:border-primary dark:border-gray-700 dark:text-white">
        <FiArrowLeft aria-hidden="true" />
        Project module
      </Link>

      <section>
        <p className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-primary">
          Add project
        </p>
        <h1 className="text-3xl font-bold text-gray-950 dark:text-white sm:text-4xl">
          Save a new project flow.
        </h1>
        <p className="mt-3 max-w-2xl text-base leading-7 text-gray-700 dark:text-gray-300">
          Add the project name, a short description, and a video URL. The entry
          will be stored in MongoDB.
        </p>
      </section>

      <form
        onSubmit={handleSubmit}
        className="mt-8 rounded-md border border-gray-200 bg-gray-50 p-4 shadow-sm dark:border-gray-800 dark:bg-white/[0.03] sm:p-5">
        <div className="grid gap-4">
          <label className="grid gap-2 text-sm font-medium text-gray-900 dark:text-white">
            Project name
            <input
              value={form.name}
              onChange={(event) =>
                setForm((current) => ({ ...current, name: event.target.value }))
              }
              maxLength={100}
              required
              placeholder="Attendance Tracker"
              className="rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-950 outline-none transition focus:border-primary dark:border-gray-700 dark:bg-secondary dark:text-white"
            />
          </label>

          <label className="grid gap-2 text-sm font-medium text-gray-900 dark:text-white">
            Description
            <textarea
              value={form.description}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  description: event.target.value,
                }))
              }
              maxLength={700}
              required
              rows={6}
              placeholder="Explain what the project does and what users see in the flow."
              className="resize-none rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-950 outline-none transition focus:border-primary dark:border-gray-700 dark:bg-secondary dark:text-white"
            />
          </label>

          <label className="grid gap-2 text-sm font-medium text-gray-900 dark:text-white">
            Video URL
            <input
              value={form.videoUrl}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  videoUrl: event.target.value,
                }))
              }
              required
              type="url"
              placeholder="https://www.youtube.com/watch?v=..."
              className="rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-950 outline-none transition focus:border-primary dark:border-gray-700 dark:bg-secondary dark:text-white"
            />
          </label>
        </div>

        <div className="mt-5 flex flex-wrap items-center gap-3">
          <button
            type="submit"
            disabled={saveState === "saving"}
            className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-primary px-4 py-2.5 font-semibold text-white transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto">
            <FiPlus aria-hidden="true" />
            {saveState === "saving" ? "Adding..." : "Add project"}
          </button>
          <Link
            href="/projects/view"
            className="inline-flex w-full items-center justify-center rounded-md border border-gray-300 px-4 py-2.5 font-semibold text-gray-900 transition hover:border-primary dark:border-gray-700 dark:text-white sm:w-auto">
            View projects
          </Link>
        </div>

        {message && (
          <p
            className={`mt-3 text-sm ${
              saveState === "error"
                ? "text-red-600 dark:text-red-300"
                : "text-emerald-700 dark:text-emerald-300"
            }`}>
            {message}
          </p>
        )}
      </form>
    </main>
  );
}
