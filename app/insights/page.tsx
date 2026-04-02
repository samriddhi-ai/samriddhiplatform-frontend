import { requireUser } from "@/lib/auth";
import { InsightsClient } from "@/components/insights-client";

export default async function InsightsPage() {
  const user = await requireUser();
  const displayName = user.user_metadata.full_name ?? user.email ?? "Student";
  return <InsightsClient displayName={displayName} />;
}
