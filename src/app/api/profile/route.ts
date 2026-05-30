import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { z } from "zod";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true, name: true, email: true, phone: true, mobile: true,
      bio: true, linkedin: true, github: true, skills: true,
      collegeName: true, graduationYear: true, role: true, createdAt: true,
    },
  });
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });
  return NextResponse.json({ user });
}

const updateSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(80).optional(),
  mobile: z.string().max(15).optional().or(z.literal("")),
  bio: z.string().max(500, "Bio must be under 500 characters").optional().or(z.literal("")),
  linkedin: z.string().url("Invalid LinkedIn URL").optional().or(z.literal("")),
  github: z.string().url("Invalid GitHub URL").optional().or(z.literal("")),
  skills: z.array(z.string().max(40)).max(20).optional(),
  collegeName: z.string().max(120).optional().or(z.literal("")),
  graduationYear: z.number().int().min(1990).max(2040).nullable().optional(),
});

export async function PATCH(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await req.json();
  const parsed = updateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.errors[0]?.message ?? "Invalid data" }, { status: 400 });
  }
  const data = parsed.data;
  const updated = await prisma.user.update({
    where: { id: session.user.id },
    data: {
      ...(data.name !== undefined && { name: data.name }),
      ...(data.mobile !== undefined && { mobile: data.mobile || null }),
      ...(data.bio !== undefined && { bio: data.bio || null }),
      ...(data.linkedin !== undefined && { linkedin: data.linkedin || null }),
      ...(data.github !== undefined && { github: data.github || null }),
      ...(data.skills !== undefined && { skills: data.skills }),
      ...(data.collegeName !== undefined && { collegeName: data.collegeName || null }),
      ...(data.graduationYear !== undefined && { graduationYear: data.graduationYear }),
    },
    select: {
      id: true, name: true, email: true, phone: true, mobile: true,
      bio: true, linkedin: true, github: true, skills: true,
      collegeName: true, graduationYear: true, role: true, createdAt: true,
    },
  });
  return NextResponse.json({ user: updated });
}
