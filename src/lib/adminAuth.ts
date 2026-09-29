import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";

/** Call at the top of every admin server component and every /api/admin route. */
export async function requireAdmin() {
  const session = await getServerSession(authOptions);
  if (!session?.user || !(session.user as any).isAdmin) {
    redirect("/login");
  }
  return session;
}

/** Same check for API routes, which need a response instead of a redirect. */
export async function requireAdminApi() {
  const session = await getServerSession(authOptions);
  if (!session?.user || !(session.user as any).isAdmin) {
    return { authorized: false as const };
  }
  return { authorized: true as const, session };
}
