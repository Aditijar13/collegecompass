import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { SessionProvider } from "@/components/shared/SessionProvider";
import { HeroSection } from "@/components/home/HeroSection";
import { CategoryGrid } from "@/components/home/CategoryGrid";
import { FeaturedColleges } from "@/components/home/FeaturedColleges";
import { StatsSection } from "@/components/home/StatsSection";
import { HomeLoggedIn } from "@/components/home/HomeLoggedIn";

export default async function HomePage() {
  const session = await auth();

  if (session?.user?.id) {
    const [savedCount, recentSaved, user] = await Promise.all([
      prisma.savedCollege.count({ where: { userId: session.user.id } }),
      prisma.savedCollege.findMany({
        where: { userId: session.user.id },
        take: 4,
        orderBy: { createdAt: "desc" },
        include: { college: { select: { id: true, name: true, slug: true, city: true, state: true, rating: true, category: true, minFee: true, image: true, nirfRank: true } } },
      }),
      prisma.user.findUnique({
        where: { id: session.user.id },
        select: { name: true },
      }),
    ]);

    return (
      <SessionProvider>
        <HomeLoggedIn
          userName={user?.name ?? session.user.name ?? "Explorer"}
          savedCount={savedCount}
          recentSaved={JSON.parse(JSON.stringify(recentSaved.map(s => s.college)))}
        />
      </SessionProvider>
    );
  }

  return (
    <SessionProvider>
      <HeroSection />
      <StatsSection />
      <CategoryGrid />
      <FeaturedColleges />
    </SessionProvider>
  );
}
