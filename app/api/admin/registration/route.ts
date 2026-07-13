import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/auth";
import { getDb } from "@/app/lib/mongodb";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const db = await getDb();
  const registrations = await db?.collection("registrations")
    .find({})
    .sort({ createdAt: -1 })
    .toArray();

  const serialized = registrations?.map((r) => ({
    ...r,
    _id: r._id.toString(),
  }));

  return NextResponse.json({ registrations: serialized });
}