import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q")?.trim() ?? "";
  const limit = parseInt(searchParams.get("limit") ?? "8");
  if (!q) return NextResponse.json({ results: [] });

  try {
    const results = await prisma.college.findMany({
      where: {
        approved: true,
        OR: [
          { name: { contains: q, mode: "insensitive" } },
          { shortName: { contains: q, mode: "insensitive" } },
          { city: { contains: q, mode: "insensitive" } },
          { state: { contains: q, mode: "insensitive" } },
        ],
      },
      select: { id: true, name: true, slug: true, city: true, state: true, category: true, nirfRank: true },
      orderBy: [{ featured: "desc" }, { rating: "desc" }],
      take: limit,
    });
    return NextResponse.json({ results });
  } catch {
    return NextResponse.json({ results: [] });
  }
}
