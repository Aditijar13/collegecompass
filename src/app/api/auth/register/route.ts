import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { z } from "zod";

const schema = z.object({ name: z.string().min(2).max(50), email: z.string().email(), password: z.string().min(6).max(100) });

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    const { name, email, password } = parsed.data;
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) return NextResponse.json({ error: "Email already registered" }, { status: 409 });
    const hashedPassword = await bcrypt.hash(password, 12);
    const user = await prisma.user.create({ data: { name, email, password: hashedPassword }, select: { id: true, name: true, email: true } });
    return NextResponse.json({ user }, { status: 201 });
  } catch { return NextResponse.json({ error: "Internal server error" }, { status: 500 }); }
}
