/**
 * Usage:
 *   node scripts/seed-admin.mjs admin@example.com "yourStrongPassword" "Admin Name"
 *
 * Requires MONGODB_URI (and optionally MONGODB_DB) set in your environment,
 * e.g. run with: node --env-file=.env.local scripts/seed-admin.mjs ...
 */


import { MongoClient } from "mongodb";
import bcrypt from "bcryptjs";

const [, , email, password, name] = process.argv;

if (!email || !password) {
  console.error('Usage: node scripts/seed-admin.mjs <email> <password> ["Name"]');
  process.exit(1);
}

if (!process.env.MONGODB_URI) {
  console.error("Missing MONGODB_URI environment variable.");
  process.exit(1);
}

const client = new MongoClient(process.env.MONGODB_URI);

async function main() {
  await client.connect();
  const db = client.db(process.env.MONGODB_DB || "cscon");
  const passwordHash = await bcrypt.hash(password, 10);

  const result = await db.collection("admins").updateOne(
    { email: email.toLowerCase().trim() },
    {
      $set: {
        email: email.toLowerCase().trim(),
        passwordHash,
        name: name || email,
      },
    },
    { upsert: true }
  );

  console.log(
    result.upsertedCount
      ? `Created admin: ${email}`
      : `Updated password for existing admin: ${email}`
  );

  await client.close();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});