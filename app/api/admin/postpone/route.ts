// app/api/admin/send-postponement/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { ObjectId } from "mongodb";
import { authOptions } from "@/app/lib/auth";
import { getDb } from "@/app/lib/mongodb";
import type { Registration } from "@/app/types/registration";
import { sendPostponementBatchWithRetry, sendBatchReminders } from "@/app/lib/resend";

export async function POST(request: NextRequest) {
  try {
    // 1. Check authentication
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 2. Get database connection
    const db = await getDb();
    if (!db) {
      return NextResponse.json(
        { error: "Database connection failed" },
        { status: 500 }
      );
    }

    const collection = db?.collection<Registration>("registrations");

    // 3. Fetch all confirmed registrations
    const registrations = await collection
      .find({})
      .toArray();

    if (!registrations || registrations.length === 0) {
      return NextResponse.json({
        message: "No registered attendees found",
        count: 0,
      }, { status: 404 });
    }

    console.log(`📧 Sending postponement emails to ${registrations.length} attendees`);

    // 4. Send batch emails
    const results = await sendBatchReminders(registrations);

    const updatePromises = registrations.map((reg: Registration) =>
      collection.updateOne(
        { _id: reg._id },
        { 
          $set: { 
            postponementNotifiedAt: new Date().toISOString(),
            postponementNotified: true,
          },
          $inc: { postponementNotificationCount: 1 }
        }
      )
    );

    // Run updates in background (don't await to avoid slowing response)
    Promise.allSettled(updatePromises).catch((error) => {
      console.error("Failed to update registration notification status:", error);
    });

    // 6. Return response
    return NextResponse.json({
      message: "Postponement emails sent",
      total: registrations.length,
      success: results.success,
      failed: results.failed,
      errors: results.errors.length > 0 ? results.errors : undefined,
      timestamp: new Date().toISOString(),
    }, { status: 200 });

  } catch (error) {
    console.error("Failed to send postponement emails:", error);
    return NextResponse.json(
      { 
        error: "Failed to send emails",
        details: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}