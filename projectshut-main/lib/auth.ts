import { getDatabase } from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import crypto from "node:crypto";
import type { AuthUser } from "@/types/auth";

export const SESSION_COOKIE = "projectx_session";

const SESSION_DURATION_MS = 7 * 24 * 60 * 60 * 1000;
const secret =
  process.env.AUTH_SECRET ||
  process.env.MONGODB_URI ||
  "projectx-development-session-secret";

interface SessionPayload extends AuthUser {
  exp: number;
}

function toBase64Url(value: string | Buffer) {
  return Buffer.from(value).toString("base64url");
}

function sign(value: string) {
  return crypto.createHmac("sha256", secret).update(value).digest("base64url");
}

export function hashPassword(password: string) {
  const salt = crypto.randomBytes(16).toString("base64url");
  const hash = crypto.scryptSync(password, salt, 64).toString("base64url");
  return `${salt}:${hash}`;
}

export function verifyPassword(password: string, storedPassword: string) {
  const [salt, storedHash] = storedPassword.split(":");

  if (!salt || !storedHash) {
    return false;
  }

  const hash = crypto.scryptSync(password, salt, 64);
  const stored = Buffer.from(storedHash, "base64url");

  return stored.length === hash.length && crypto.timingSafeEqual(stored, hash);
}

export function createSessionToken(user: AuthUser) {
  const payload = toBase64Url(
    JSON.stringify({
      ...user,
      exp: Date.now() + SESSION_DURATION_MS,
    } satisfies SessionPayload)
  );
  return `${payload}.${sign(payload)}`;
}

export function verifySessionToken(token?: string): SessionPayload | null {
  if (!token) {
    return null;
  }

  const [payload, signature] = token.split(".");

  if (!payload || !signature || sign(payload) !== signature) {
    return null;
  }

  try {
    const session = JSON.parse(
      Buffer.from(payload, "base64url").toString("utf8")
    ) as SessionPayload;

    if (!session.id || !session.email || session.exp < Date.now()) {
      return null;
    }

    return session;
  } catch {
    return null;
  }
}

export function getSessionCookieOptions() {
  return {
    httpOnly: true,
    maxAge: SESSION_DURATION_MS / 1000,
    path: "/",
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
  };
}

export async function getCurrentUser(): Promise<AuthUser | null> {
  const token = cookies().get(SESSION_COOKIE)?.value;
  const session = verifySessionToken(token);

  if (!session || !ObjectId.isValid(session.id)) {
    return null;
  }

  const db = await getDatabase();
  const user = await db.collection("users").findOne({
    _id: new ObjectId(session.id),
  });

  if (!user) {
    return null;
  }

  return {
    id: user._id.toString(),
    name: user.name,
    email: user.email,
  };
}

export async function requireUser(next = "/projects") {
  const user = await getCurrentUser();

  if (!user) {
    redirect(`/login?next=${encodeURIComponent(next)}`);
  }

  return user;
}
