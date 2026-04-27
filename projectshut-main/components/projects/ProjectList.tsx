"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { FiArrowLeft, FiExternalLink } from "react-icons/fi";
import type { Project } from "@/types/project";
import ProjectVideo from "@/components/projects/ProjectVideo";

export default function ProjectList() {
  const params = useParams<{ id: string }>();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const loadProject = async () => {
      setLoading(true);
      setMessage("");

      try {
        const response = await fetch(`/api/projects/${params.id}`, {
          cache: "no-store",
        });
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Unable to load project.");
        }

        setProject(data);
      } catch (error) {
        setProject(null);
        setMessage(
          error instanceof Error
            ? error.message
            : "Unable to load project. Check MongoDB setup."
        );
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      loadProject();
    }
  }, [params.id]);

  return (
    <main className="mx-auto my-8 w-11/12 max-w-5xl sm:my-10">
      <Link
        href="/projects"
        className="mb-6 inline-flex items-center gap-2 rounded-md border border-gray-300 px-3 py-2 text-sm font-semibold text-gray-900 transition hover:border-primary dark:border-gray-700 dark:text-white">
        <FiArrowLeft aria-hidden="true" />
        Back to projects
      </Link>

      {loading ? (
        <div className="rounded-md border border-dashed border-gray-300 p-8 text-center text-gray-700 dark:border-gray-700 dark:text-gray-300">
          Loading project...
        </div>
      ) : message ? (
        <div className="rounded-md border border-dashed border-red-300 p-8 text-center text-red-700 dark:border-red-800 dark:text-red-300">
          {message}
        </div>
      ) : project ? (
        <article className="grid gap-6">
          <div>
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-primary">
              Project flow
            </p>
            <h1 className="text-3xl font-bold text-gray-950 dark:text-white sm:text-4xl">
              {project.name}
            </h1>
            <p className="mt-4 text-base leading-7 text-gray-700 dark:text-gray-300">
              {project.description}
            </p>
          </div>

          <ProjectVideo project={project} />

          <Link
            href={project.videoUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex w-fit items-center gap-2 rounded-md border border-gray-300 px-3 py-2 text-sm font-semibold text-gray-900 transition hover:border-primary dark:border-gray-700 dark:text-white">
            Open original video
            <FiExternalLink aria-hidden="true" />
          </Link>
        </article>
      ) : null}
    </main>
  );
}
