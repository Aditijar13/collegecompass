import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { z } from "zod";

const schema = z.object({ collegeId: z.string(), rating: z.number().min(1).max(5), title: z.string().min(5).max(100), content: z.string().min(20).max(2000), infrastructure: z.number().min(1).max(5), faculty: z.number().min(1).max(5), placements: z.number().min(1).max(5), campus: z.number().min(1).max(5), valueForMoney: z.number().min(1).max(5) });

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const parsed = schema.safeParse(await req.json());
    if (!parsed.success) return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    const review = await prisma.review.create({ data: { ...parsed.data, userId: session.user.id }, include: { user: { select: { name: true, image: true } } } });
    const allReviews = await prisma.review.findMany({ where: { collegeId: parsed.data.collegeId }, select: { rating: true } });
    const avg = allReviews.reduce((a, r) => a + r.rating, 0) / allReviews.length;
    await prisma.college.update({ where: { id: parsed.data.collegeId }, data: { rating: Math.round(avg * 10) / 10, totalRatings: allReviews.length } });
    return NextResponse.json({ review }, { status: 201 });
  } catch { return NextResponse.json({ error: "Internal server error" }, { status: 500 }); }
}
