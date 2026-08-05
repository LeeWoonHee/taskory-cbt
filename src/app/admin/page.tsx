import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { AdminDashboard } from "@/components/admin-dashboard";
import { getAdminOverview } from "@/services/admin-service";
import { getAdminUser } from "@/services/auth-service";

export default async function AdminPage() {
  const requestHeaders = await headers();
  const user = await getAdminUser(new Request("http://taskory.local/admin", { headers: { cookie: requestHeaders.get("cookie") ?? "" } }));
  if (!user) redirect("/login");
  const overview = await getAdminOverview();
  return <AdminDashboard initialData={overview} adminName={user.name} />;
}
