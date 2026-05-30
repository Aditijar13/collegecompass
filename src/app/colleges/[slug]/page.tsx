import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { CollegeDetailClient } from "@/components/college/CollegeDetailClient";
import { SessionProvider } from "@/components/shared/SessionProvider";
import type { Metadata } from "next";

interface Props { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const c = await prisma.college.findUnique({ where: { slug }, select: { name: true, description: true } });
  if (!c) return { title: "Not Found" };
  return { title: c.name, description: c.description.slice(0, 160) };
}

export default async function CollegeDetailPage({ params }: Props) {
  const { slug } = await params;
  const college = await prisma.college.findUnique({
    where: { slug, approved: true },
    include: {
      courses: true,
      placements: { orderBy: { year: "desc" } },
      reviews: { orderBy: { createdAt: "desc" }, take: 15, include: { user: { select: { name: true, image: true } } } },
      facilities: true,
      admissions: { orderBy: { year: "desc" } },
    },
  });
  if (!college) notFound();

  // Related colleges same category
  const related = await prisma.college.findMany({
    where: { category: college.category, approved: true, id: { not: college.id } },
    orderBy: { rating: "desc" },
    take: 3,
    select: { id: true, name: true, slug: true, city: true, state: true, minFee: true, maxFee: true, totalFee: true, rating: true, totalRatings: true, image: true, category: true, type: true, featured: true, nirfRank: true, accreditation: true, established: true, description: true, placementRate: true, avgPackage: true, maxPackage: true },
  });

  return (
    <SessionProvider>
      <CollegeDetailClient college={JSON.parse(JSON.stringify(college))} related={JSON.parse(JSON.stringify(related))} />
    </SessionProvider>
  );
}
