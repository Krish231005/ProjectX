"use client";

import Link from "next/link";
import { FiExternalLink } from "react-icons/fi";
import type { Project } from "@/types/project";

interface ProjectCardProps {
  project: Project;
}

export default function ProjectCard({ project }: ProjectCardProps) {
  return (
    <article className="rounded-md border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-white/[0.03]">
      <h3 className="text-xl font-bold text-gray-950 dark:text-white">
        {project.name}
      </h3>
      <p className="mt-2 text-sm leading-6 text-gray-700 dark:text-gray-300">
        {project.description}
      </p>
      <Link
        href={project.videoUrl}
        target="_blank"
        rel="noreferrer"
        className="mt-4 inline-flex items-center gap-2 rounded-md border border-gray-300 px-3 py-2 text-sm font-semibold text-gray-900 transition hover:border-primary dark:border-gray-700 dark:text-white">
        Open video
        <FiExternalLink aria-hidden="true" />
      </Link>
    </article>
  );
}
