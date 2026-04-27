import ProjectGallery from "@/components/projects/ProjectGallery";
import { requireUser } from "@/lib/auth";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "View projects",
};

export default async function ViewProjectsPage() {
  await requireUser("/projects/view");
  return <ProjectGallery />;
}
