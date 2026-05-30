import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const querySchema = z.object({
  search: z.string().optional(),
  state: z.string().optional(),
  category: z.string().optional(),
  type: z.string().optional(),
  minFee: z.coerce.number().optional(),
  maxFee: z.coerce.number().optional(),
  minRating: z.coerce.number().optional(),
  minPlacement: z.coerce.number().optional(),
  sortBy: z.enum(["rating", "fee_asc", "fee_desc", "ranking", "name", "placement"]).optional(),
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(50).default(12),
});

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const parsed = querySchema.safeParse(Object.fromEntries(searchParams.entries()));
    if (!parsed.success) return NextResponse.json({ error: "Invalid query" }, { status: 400 });

    const { search, state, category, type, minFee, maxFee, minRating, minPlacement, sortBy, page, limit } = parsed.data;
    const skip = (page - 1) * limit;

    const where: Record<string, unknown> = { approved: true };
    if (search) where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { shortName: { contains: search, mode: "insensitive" } },
      { city: { contains: search, mode: "insensitive" } },
      { state: { contains: search, mode: "insensitive" } },
    ];
    if (state) where.state = { contains: state, mode: "insensitive" };
    if (category) where.category = category.toUpperCase();
    if (type) where.type = type.toUpperCase();
    if (minFee !== undefined || maxFee !== undefined) {
      where.minFee = {};
      if (minFee !== undefined) (where.minFee as Record<string, unknown>).gte = minFee;
      if (maxFee !== undefined) (where.minFee as Record<string, unknown>).lte = maxFee;
    }
    if (minRating !== undefined) where.rating = { gte: minRating };
    if (minPlacement !== undefined) where.placementRate = { gte: minPlacement };

    const orderBy: Record<string, unknown> =
      sortBy === "fee_asc" ? { minFee: "asc" }
      : sortBy === "fee_desc" ? { minFee: "desc" }
      : sortBy === "ranking" ? { nirfRank: "asc" }
      : sortBy === "name" ? { name: "asc" }
      : sortBy === "placement" ? { placementRate: "desc" }
      : { rating: "desc" };

    const [colleges, total] = await Promise.all([
      prisma.college.findMany({
        where, orderBy, skip, take: limit,
        select: {
          id: true, name: true, shortName: true, slug: true, location: true, city: true, state: true,
          type: true, category: true, established: true, totalFee: true, minFee: true, maxFee: true,
          rating: true, totalRatings: true, accreditation: true, nirfRank: true, ranking: true,
          image: true, logo: true, featured: true, placementRate: true, avgPackage: true, maxPackage: true,
        },
      }),
      prisma.college.count({ where }),
    ]);

    return NextResponse.json({ colleges, pagination: { page, limit, total, pages: Math.ceil(total / limit) } });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
