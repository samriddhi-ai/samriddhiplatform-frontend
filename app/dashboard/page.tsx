import { requireUser } from "@/lib/auth";
import { DashboardClient } from "@/components/dashboard-client";

export default async function DashboardPage() {
  const user = await requireUser();
  const displayName = user.user_metadata.full_name ?? user.email ?? "Student";
  return <DashboardClient displayName={displayName} />;
}
