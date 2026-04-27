import {
  createSessionToken,
  getSessionCookieOptions,
  SESSION_COOKIE,
  verifyPassword,
} from "@/lib/auth";
import { getDatabase } from "@/lib/mongodb";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

function cleanText(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const email = cleanText(body.email).toLowerCase();
    const password = cleanText(body.password);

    if (!email || !password) {
      return NextResponse.json(
        { message: "Email and password are required." },
        { status: 400 }
      );
    }

    const db = await getDatabase();
    const user = await db.collection("users").findOne({ email });

    if (!user || !verifyPassword(password, user.password)) {
      return NextResponse.json(
        { message: "Invalid email or password." },
        { status: 401 }
      );
    }

    const response = NextResponse.json({
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
      },
    });

    response.cookies.set(
      SESSION_COOKIE,
      createSessionToken({
        id: user._id.toString(),
        name: user.name,
        email: user.email,
      }),
      getSessionCookieOptions()
    );

    return response;
  } catch {
    return NextResponse.json(
      { message: "Unable to login. Check MongoDB connection." },
      { status: 500 }
    );
  }
}
