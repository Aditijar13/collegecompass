import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { SessionProvider } from "@/components/shared/SessionProvider";
import { ProfileClient } from "@/components/shared/ProfileClient";

export const metadata = { title: "Profile" };

export default async function ProfilePage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/auth/login");
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true, name: true, email: true, phone: true, mobile: true,
      bio: true, linkedin: true, github: true, skills: true,
      collegeName: true, graduationYear: true, role: true, createdAt: true,
    },
  });
  if (!user) redirect("/auth/login");
  return (
    <SessionProvider>
      <ProfileClient initialUser={JSON.parse(JSON.stringify(user))} />
    </SessionProvider>
  );
}
