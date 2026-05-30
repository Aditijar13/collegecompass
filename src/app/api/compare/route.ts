import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = z.object({ ids: z.array(z.string()).min(2).max(3) }).safeParse(body);
    if (!parsed.success) return NextResponse.json({ error: "Provide 2-3 college IDs" }, { status: 400 });
    const colleges = await prisma.college.findMany({
      where: { id: { in: parsed.data.ids }, approved: true },
      include: { courses: true, placements: { orderBy: { year: "desc" }, take: 1 }, facilities: true, admissions: { orderBy: { year: "desc" }, take: 1 } },
    });
    const ordered = parsed.data.ids.map(id => colleges.find(c => c.id === id)).filter(Boolean);
    return NextResponse.json({ colleges: ordered });
  } catch { return NextResponse.json({ error: "Internal server error" }, { status: 500 }); }
}
