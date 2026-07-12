import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { getDb } from "@/app/lib/mongodb";

/**
 * One-time admin seeding endpoint, meant to be hit manually (browser or curl)
 * right after deploying — a workaround for local networks that block outbound
 * MongoDB connections (port 27017 / TLS handshake issues).
 *
 * Protected by SEED_SECRET so this can't be used by anyone who doesn't have
 * that env var. Consider deleting this route (or rotating SEED_SECRET) once
 * you've created the admins you need.
 */
export async function POST(req: NextRequest) {
  const { email, password, name, secret } = await req.json();

  if (!process.env.SEED_SECRET || secret !== process.env.SEED_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!email || !password) {
    return NextResponse.json({ error: "email and password are required" }, { status: 400 });
  }

  const db = await getDb();
  const passwordHash = await bcrypt.hash(password, 10);

  const result = await db.collection("admins").updateOne(
    { email: String(email).toLowerCase().trim() },
    {
      $set: {
        email: String(email).toLowerCase().trim(),
        passwordHash,
        name: name || email,
      },
    },
    { upsert: true }
  );

  return NextResponse.json({
    status: result.upsertedCount ? "created" : "updated",
    email: String(email).toLowerCase().trim(),
  });
}