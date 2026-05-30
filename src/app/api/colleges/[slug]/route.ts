import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params;
    const college = await prisma.college.findUnique({
      where: { slug, approved: true },
      include: { courses: true, placements: { orderBy: { year: "desc" } }, reviews: { orderBy: { createdAt: "desc" }, take: 15, include: { user: { select: { name: true, image: true } } } }, facilities: true, admissions: { orderBy: { year: "desc" } } },
    });
    if (!college) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ college });
  } catch { return NextResponse.json({ error: "Internal server error" }, { status: 500 }); }
}
