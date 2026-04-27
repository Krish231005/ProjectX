"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { FiArrowLeft, FiExternalLink, FiPlus, FiRefreshCw, FiVideo } from "react-icons/fi";
import type { Project } from "@/types/project";
import ProjectVideo from "@/components/projects/ProjectVideo";

export default function ProjectGallery() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const loadProjects = async () => {
    setLoading(true);
    setMessage("");

    try {
      const response = await fetch("/api/projects", { cache: "no-store" });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to load projects.");
      }

      setProjects(data);
    } catch (error) {
      setProjects([]);
      setMessage(
        error instanceof Error ? error.message : "Unable to load projects."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProjects();
  }, []);

  return (
    <main className="mx-auto my-8 w-11/12 max-w-6xl sm:my-10">
      <Link
        href="/projects"
        className="mb-6 inline-flex items-center gap-2 rounded-md border border-gray-300 px-3 py-2 text-sm font-semibold text-gray-900 transition hover:border-primary dark:border-gray-700 dark:text-white">
        <FiArrowLeft aria-hidden="true" />
        Project module
      </Link>

      <section className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-primary">
            View projects
          </p>
          <h1 className="text-3xl font-bold text-gray-950 dark:text-white sm:text-4xl">
            Project gallery
          </h1>
          <p className="mt-3 max-w-2xl text-base leading-7 text-gray-700 dark:text-gray-300">
            Browse every project saved in MongoDB.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <Link
            href="/projects/add"
            className="inline-flex items-center justify-center gap-2 rounded-md bg-primary px-3 py-2 text-sm font-semibold text-white transition hover:brightness-105">
            <FiPlus aria-hidden="true" />
            Add project
          </Link>
          <button
            type="button"
            onClick={loadProjects}
            className="inline-flex items-center justify-center gap-2 rounded-md border border-gray-300 px-3 py-2 text-sm font-semibold text-gray-900 transition hover:border-primary dark:border-gray-700 dark:text-white">
            <FiRefreshCw aria-hidden="true" />
            Refresh
          </button>
        </div>
      </section>

      {loading ? (
        <div className="rounded-md border border-dashed border-gray-300 p-8 text-center text-gray-700 dark:border-gray-700 dark:text-gray-300">
          Loading projects...
        </div>
      ) : message ? (
        <div className="rounded-md border border-dashed border-red-300 p-8 text-center text-red-700 dark:border-red-800 dark:text-red-300">
          {message}
        </div>
      ) : projects.length === 0 ? (
        <div className="rounded-md border border-dashed border-gray-300 p-8 text-center dark:border-gray-700">
          <FiVideo
            aria-hidden="true"
            className="mx-auto mb-3 text-3xl text-primary"
          />
          <p className="font-semibold text-gray-950 dark:text-white">
            No projects added yet.
          </p>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            Add the first project from the add project page.
          </p>
        </div>
      ) : (
        <div className="grid gap-5 lg:grid-cols-2">
          {projects.map((project) => (
            <article
              key={project._id}
              className="grid gap-4 rounded-md border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-white/[0.03]">
              <ProjectVideo project={project} />

              <div>
                <h2 className="text-xl font-bold text-gray-950 dark:text-white">
                  {project.name}
                </h2>
                <p className="mt-2 text-sm leading-6 text-gray-700 dark:text-gray-300">
                  {project.description}
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                {project._id && (
                  <Link
                    href={`/projects/${project._id}`}
                    className="inline-flex items-center gap-2 rounded-md border border-gray-300 px-3 py-2 text-sm font-semibold text-gray-900 transition hover:border-primary dark:border-gray-700 dark:text-white">
                    View details
                    <FiExternalLink aria-hidden="true" />
                  </Link>
                )}
                <Link
                  href={project.videoUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-md border border-gray-300 px-3 py-2 text-sm font-semibold text-gray-900 transition hover:border-primary dark:border-gray-700 dark:text-white">
                  Open video
                  <FiExternalLink aria-hidden="true" />
                </Link>
              </div>
            </article>
          ))}
        </div>
      )}
    </main>
  );
}
