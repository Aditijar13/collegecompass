import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { SessionProvider } from "@/components/shared/SessionProvider";
import { SavedCollegesClient } from "@/components/shared/SavedCollegesClient";

export default async function SavedPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/auth/login");
  const saved = await prisma.savedCollege.findMany({
    where: { userId: session.user.id },
    include: { college: true },
    orderBy: { createdAt: "desc" },
  });
  return (
    <SessionProvider>
      <SavedCollegesClient initialSaved={JSON.parse(JSON.stringify(saved.map(s => s.college)))} />
    </SessionProvider>
  );
}
