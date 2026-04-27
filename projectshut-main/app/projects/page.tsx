import Projects from "@/components/projects/Projects";
import { Metadata } from "next";
import { requireUser } from "@/lib/auth";

export const metadata: Metadata = {
  title: 'Projects',
}

export default async function Page() {
  const user = await requireUser("/projects");
  return <Projects user={user} />;
}
