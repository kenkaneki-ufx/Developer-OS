import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!prisma) {
      return NextResponse.json({
        success: true,
        profile: {
          name: session.user.name || null,
          email: session.user.email || null,
          image: session.user.image || null,
        },
      });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { name: true, email: true, image: true },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, profile: user });
  } catch (error) {
    console.error("Error fetching profile:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { name, email, image } = await request.json();

    if (!prisma) {
      return NextResponse.json({
        success: true,
        profile: { name, email, image },
      });
    }

    const updatedUser = await prisma.user.upsert({
      where: { id: session.user.id },
      update: {
        ...(name !== undefined && { name: name?.trim() || null }),
        ...(email !== undefined && { email: email?.trim() || null }),
        ...(image !== undefined && { image: image?.trim() || null }),
      },
      create: {
        id: session.user.id,
        name: name?.trim() || null,
        email: email?.trim() || null,
        image: image?.trim() || null,
      },
      select: { name: true, email: true, image: true },
    });

    return NextResponse.json({ success: true, profile: updatedUser });
  } catch (error) {
    console.error("Error saving profile:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
