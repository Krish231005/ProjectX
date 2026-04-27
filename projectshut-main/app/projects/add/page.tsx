import AddProject from "@/components/projects/AddProject";
import { requireUser } from "@/lib/auth";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Add project",
};

export default async function AddProjectPage() {
  await requireUser("/projects/add");
  return <AddProject />;
}
