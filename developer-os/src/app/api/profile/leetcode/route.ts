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
      return NextResponse.json({ success: true, leetcodeUsername: null });
    }

    try {
      const profile = await prisma.profile.findUnique({
        where: { userId: session.user.id },
        select: { leetcodeUsername: true },
      });

      return NextResponse.json({
        success: true,
        leetcodeUsername: profile?.leetcodeUsername || null,
      });
    } catch (dbError) {
      console.error("Database error fetching LeetCode username:", dbError);
      // Return success with null username so UI can use localStorage fallback
      return NextResponse.json({ success: true, leetcodeUsername: null });
    }
  } catch (error) {
    console.error("Error fetching LeetCode username:", error);
    return NextResponse.json({ success: true, leetcodeUsername: null });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { leetcodeUsername } = body;

    if (!leetcodeUsername || typeof leetcodeUsername !== "string") {
      return NextResponse.json(
        { error: "LeetCode username is required" },
        { status: 400 }
      );
    }

    // Validate username format
    if (!/^[a-zA-Z0-9_-]{1,30}$/.test(leetcodeUsername)) {
      return NextResponse.json(
        { error: "Invalid LeetCode username format" },
        { status: 400 }
      );
    }

    if (!prisma) {
      // Database not configured - still return success so the UI works
      // The username will be stored in localStorage
      return NextResponse.json({
        success: true,
        leetcodeUsername,
        message: "Username saved (database not configured, using local storage)",
      });
    }

    try {
      // Upsert profile with LeetCode username
      await prisma.profile.upsert({
        where: { userId: session.user.id },
        update: { leetcodeUsername },
        create: {
          userId: session.user.id,
          leetcodeUsername,
        },
      });

      return NextResponse.json({
        success: true,
        leetcodeUsername,
      });
    } catch (dbError) {
      console.error("Database error saving LeetCode username:", dbError);
      // Return success so UI can use localStorage fallback
      return NextResponse.json({
        success: true,
        leetcodeUsername,
        message: "Username saved locally (database unavailable)",
      });
    }
  } catch (error) {
    console.error("Error saving LeetCode username:", error);
    // Return success so UI can use localStorage fallback
    return NextResponse.json({ success: true, leetcodeUsername: null });
  }
}
