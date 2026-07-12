import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/app/lib/mongodb";
import { generateAccessCode } from "@/app/lib/accessCode";
import { sendAccessCard } from "@/app/lib/resend";
import {
  ROLES,
  TRACKS,
  GOALS,
  PROJECT_STATUSES,
  type Registration,
  type RegistrationInput,
} from "@/app/types/registration";

function isValidBody(body: unknown): body is RegistrationInput {
  if (!body || typeof body !== "object") return false;
  const b = body as Record<string, unknown>;

  const isNonEmptyString = (v: unknown) => typeof v === "string" && v.trim().length > 0;

  return (
    isNonEmptyString(b.fullName) &&
    isNonEmptyString(b.email) &&
    isNonEmptyString(b.phone) &&
    isNonEmptyString(b.institution) &&
    ROLES.includes(b.role as never) &&
    TRACKS.includes(b.track as never) &&
    GOALS.includes(b.goal as never) &&
    PROJECT_STATUSES.includes(b.projectStatus as never) &&
    isNonEmptyString(b.source)
  );
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  if (!isValidBody(body)) {
    return NextResponse.json({ error: "Missing or invalid fields" }, { status: 400 });
  }

  const input = body;
  const email = input.email.trim().toLowerCase();

  if (!EMAIL_RE.test(email)) {
    return NextResponse.json({ error: "Invalid email address" }, { status: 400 });
  }

  try {
    const db = await getDb();
    const collection = db.collection<Registration>("registrations");

    // If this email already registered, don't create a duplicate —
    // just resend their existing access card.
    const existing = await collection.findOne({ email });

    if (existing) {
      await sendAccessCard(existing as unknown as Registration);
      await collection.updateOne(
        { email },
        { $set: { emailSentAt: new Date() }, $inc: { emailSentCount: 1 } }
      );
      return NextResponse.json({ status: "resent", accessCode: existing.accessCode });
    }

    const registration: Omit<Registration, "_id"> = {
      fullName: input.fullName.trim(),
      email,
      phone: input.phone.trim(),
      institution: input.institution.trim(),
      role: input.role,
      track: input.track,
      goal: input.goal,
      projectStatus: input.projectStatus,
      source: input.source.trim(),
      accessCode: generateAccessCode(),
      createdAt: new Date().toISOString(),
      emailSentAt: null,
      emailSentCount: 0,
      reminderSentAt: null,
      reminderSentCount: 0,
    };

    await collection.insertOne(registration as never);

    try {
      await sendAccessCard(registration as Registration);
      await collection.updateOne(
        { email },
        { $set: { emailSentAt: new Date().toISOString() }, $inc: { emailSentCount: 1 } }
      );
    } catch (emailErr) {
      // Registration is saved even if the email fails — admin can resend later.
      console.error("Failed to send access card email:", emailErr);
    }

    return NextResponse.json({ status: "created", accessCode: registration.accessCode });
  } catch (err) {
    console.error("Registration error:", err);
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }
}