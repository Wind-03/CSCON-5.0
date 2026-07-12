import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/app/lib/auth";
import RegistrationsTable from "./RegistrationTable";

export default async function AdminDashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/admin/login");
  }

  return (
    <div style={{ minHeight: "100vh", background: "#050505", padding: "40px 24px" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 32, flexWrap: "wrap", gap: 16 }}>
          <div>
            <div style={{ fontSize: 12, color: "var(--green)", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 6 }}>
              CSCON 5.0 Admin
            </div>
            <h1 style={{ fontSize: "1.8rem", fontWeight: 900, color: "#fff", margin: 0 }}>Registrations</h1>
          </div>
          <div style={{ fontSize: 13, color: "rgba(255,255,255,0.5)" }}>
            Signed in as {session.user?.email}
          </div>
        </div>

        <RegistrationsTable />
      </div>
    </div>
  );
}