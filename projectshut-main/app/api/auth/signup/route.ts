import {
  createSessionToken,
  getSessionCookieOptions,
  hashPassword,
  SESSION_COOKIE,
} from "@/lib/auth";
import { getDatabase } from "@/lib/mongodb";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

function cleanText(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const name = cleanText(body.name);
    const email = cleanText(body.email).toLowerCase();
    const password = cleanText(body.password);

    if (!name || !email || !password) {
      return NextResponse.json(
        { message: "Name, email, and password are required." },
        { status: 400 }
      );
    }

    if (!isValidEmail(email)) {
      return NextResponse.json(
        { message: "Enter a valid email address." },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { message: "Password must be at least 6 characters." },
        { status: 400 }
      );
    }

    const db = await getDatabase();
    const users = db.collection("users");
    const existingUser = await users.findOne({ email });

    if (existingUser) {
      return NextResponse.json(
        { message: "An account with this email already exists." },
        { status: 409 }
      );
    }

    const now = new Date();
    const result = await users.insertOne({
      name,
      email,
      password: hashPassword(password),
      createdAt: now,
      updatedAt: now,
    });

    const response = NextResponse.json({
      user: {
        id: result.insertedId.toString(),
        name,
        email,
      },
    });

    response.cookies.set(
      SESSION_COOKIE,
      createSessionToken({
        id: result.insertedId.toString(),
        name,
        email,
      }),
      getSessionCookieOptions()
    );

    return response;
  } catch {
    return NextResponse.json(
      { message: "Unable to create account. Check MongoDB connection." },
      { status: 500 }
    );
  }
}
