import { getCurrentUser } from "@/lib/auth";
import { getDatabase } from "@/lib/mongodb";
import type { Project } from "@/types/project";
import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

function serializeProject(project: any): Project {
  return {
    _id: project._id.toString(),
    name: project.name,
    description: project.description,
    videoUrl: project.videoUrl,
    createdAt: project.createdAt?.toISOString?.() ?? project.createdAt,
  };
}

function getMongoErrorMessage(error: unknown) {
  const uri = process.env.MONGODB_URI || "";
  const rawMessage = error instanceof Error ? error.message : "";

  if (!uri) {
    return "Add MONGODB_URI to .env.local, then restart the dev server.";
  }

  if (uri.includes("<db_password>")) {
    return "Replace <db_password> in .env.local with your real MongoDB database user password, then restart the dev server.";
  }

  if (rawMessage.toLowerCase().includes("authentication failed")) {
    return "MongoDB authentication failed. Check the username and password in .env.local.";
  }

  if (
    rawMessage.includes("ENOTFOUND") ||
    rawMessage.toLowerCase().includes("querysrv")
  ) {
    return "MongoDB host could not be reached. Check the cluster URL in MONGODB_URI.";
  }

  return "Unable to connect to MongoDB. Check your Atlas Network Access IP and connection string.";
}

export async function GET(
  _request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { message: "Login is required to view projects." },
        { status: 401 }
      );
    }

    if (!ObjectId.isValid(params.id)) {
      return NextResponse.json(
        { message: "Project not found." },
        { status: 404 }
      );
    }

    const db = await getDatabase();
    const project = await db
      .collection("projects")
      .findOne({ _id: new ObjectId(params.id) });

    if (!project) {
      return NextResponse.json(
        { message: "Project not found." },
        { status: 404 }
      );
    }

    return NextResponse.json(serializeProject(project));
  } catch (error) {
    return NextResponse.json(
      { message: getMongoErrorMessage(error) },
      { status: 500 }
    );
  }
}
