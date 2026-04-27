import { getCurrentUser } from "@/lib/auth";
import { getDatabase } from "@/lib/mongodb";
import type { Project } from "@/types/project";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const MAX_NAME_LENGTH = 100;
const MAX_DESCRIPTION_LENGTH = 700;

function cleanText(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function isValidUrl(value: string) {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
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

function serializeProject(project: any): Project {
  return {
    _id: project._id.toString(),
    name: project.name,
    description: project.description,
    videoUrl: project.videoUrl,
    createdAt: project.createdAt?.toISOString?.() ?? project.createdAt,
  };
}

export async function GET() {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { message: "Login is required to view projects." },
        { status: 401 }
      );
    }

    const db = await getDatabase();
    const projects = await db
      .collection("projects")
      .find({})
      .sort({ createdAt: -1 })
      .toArray();

    return NextResponse.json(projects.map(serializeProject));
  } catch (error) {
    return NextResponse.json(
      { message: getMongoErrorMessage(error) },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { message: "Login is required to add projects." },
        { status: 401 }
      );
    }

    const body = await request.json();
    const name = cleanText(body.name);
    const description = cleanText(body.description);
    const videoUrl = cleanText(body.videoUrl);

    if (!name || !description || !videoUrl) {
      return NextResponse.json(
        { message: "Project name, description, and video URL are required." },
        { status: 400 }
      );
    }

    if (name.length > MAX_NAME_LENGTH) {
      return NextResponse.json(
        { message: `Project name must be ${MAX_NAME_LENGTH} characters or less.` },
        { status: 400 }
      );
    }

    if (description.length > MAX_DESCRIPTION_LENGTH) {
      return NextResponse.json(
        {
          message: `Description must be ${MAX_DESCRIPTION_LENGTH} characters or less.`,
        },
        { status: 400 }
      );
    }

    if (!isValidUrl(videoUrl)) {
      return NextResponse.json(
        { message: "Video URL must start with http:// or https://." },
        { status: 400 }
      );
    }

    const db = await getDatabase();
    const now = new Date();
    const result = await db.collection("projects").insertOne({
      name,
      description,
      videoUrl,
      createdBy: user.id,
      createdAt: now,
      updatedAt: now,
    });

    return NextResponse.json(
      serializeProject({
        _id: result.insertedId,
        name,
        description,
        videoUrl,
        createdAt: now,
      }),
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: getMongoErrorMessage(error) },
      { status: 500 }
    );
  }
}
