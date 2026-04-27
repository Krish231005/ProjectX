import ProjectList from "@/components/projects/ProjectList";
import { requireUser } from "@/lib/auth";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Project details",
};

export default async function Page() {
  await requireUser("/projects");
  return <ProjectList />;
}
