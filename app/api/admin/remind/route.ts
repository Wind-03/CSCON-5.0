import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { ObjectId } from "mongodb";
import { authOptions } from "@/app/lib/auth";
import { getDb } from "@/app/lib/mongodb";
import { sendReminder } from "@/app/lib/resend";
import type { Registration } from "@/app/types/registration";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: { id?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  if (!body.id || !ObjectId.isValid(body.id)) {
    return NextResponse.json({ error: "Missing or invalid registration id" }, { status: 400 });
  }

  const db = await getDb();
  const collection = db?.collection("registrations");
  const registration = await collection?.findOne({ _id: new ObjectId(body.id) });

  if (!registration) {
    return NextResponse.json({ error: "Registration not found" }, { status: 404 });
  }

  try {
    await sendReminder(registration as unknown as Registration);
  } catch (err) {
    console.error("Reminder send failed:", err);
    return NextResponse.json({ error: "Failed to send reminder" }, { status: 502 });
  }

  const now = new Date().toISOString();
  await collection?.updateOne(
    { _id: new ObjectId(body.id) },
    { $set: { reminderSentAt: now }, $inc: { reminderSentCount: 1 } }
  );

  return NextResponse.json({ status: "sent", reminderSentAt: now });
}