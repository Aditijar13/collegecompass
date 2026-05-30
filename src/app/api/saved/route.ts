import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { z } from "zod";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const saved = await prisma.savedCollege.findMany({
    where: { userId: session.user.id },
    include: { college: true },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json({ saved: saved.map(s => s.college) });
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await req.json();
  const parsed = z.object({ collegeId: z.string().min(1) }).safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid input" }, { status: 400 });

  // Verify college exists
const college = await prisma.college.findUnique({
  where: { id: parsed.data.collegeId },
  select: { id: true }
});
if (!college) return NextResponse.json({ error: "College not found" }, { status: 404 });

// ADD THIS
console.log("Session User ID:", session.user.id);

const user = await prisma.user.findUnique({
  where: {
    id: session.user.id,
  },
});

console.log("User Found:", user);

try {
  const saved = await prisma.savedCollege.create({
    data: {
      userId: session.user.id,
      collegeId: parsed.data.collegeId,
    },
  });
    return NextResponse.json({ message: "Saved", id: saved.id }, { status: 201 });
  } catch (err: unknown) {
    // Unique constraint violation — already saved, treat as success
    if (
  typeof err === "object" &&
  err !== null &&
  "code" in err &&
  (err as { code: string }).code === "P2002"
) {
      return NextResponse.json({ message: "Already saved" }, { status: 200 });
    }
    console.error("Save error:", err);
    return NextResponse.json({ error: "Failed to save" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const collegeId = new URL(req.url).searchParams.get("collegeId");
  if (!collegeId) return NextResponse.json({ error: "collegeId required" }, { status: 400 });
  await prisma.savedCollege.deleteMany({ where: { userId: session.user.id, collegeId } });
  return NextResponse.json({ message: "Removed" });
}
