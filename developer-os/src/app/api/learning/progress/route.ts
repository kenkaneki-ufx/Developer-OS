import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { availableCourses } from "@/lib/learning/courses";

// Progress only applies to published (available) courses
const validCourseIds = new Set(availableCourses.map((c) => c.id));
const validStatuses = new Set(["in_progress", "completed", "not_started"]);

interface ProgressState {
  progress: Record<string, string>;
  completedCount: number;
}

async function getProgressState(userId: string): Promise<ProgressState | null> {
  if (!prisma) return null;

  const rows = await prisma.courseProgress.findMany({
    where: { userId },
    select: { courseId: true, status: true },
  });

  const progress: Record<string, string> = {};
  let completedCount = 0;
  for (const row of rows) {
    progress[row.courseId] = row.status;
    if (row.status === "completed") completedCount++;
  }

  return { progress, completedCount };
}

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const state = await getProgressState(session.user.id);
    if (!state) {
      return NextResponse.json({
        success: true,
        progress: {},
        completedCount: 0,
        persisted: false,
      });
    }

    return NextResponse.json({ success: true, ...state, persisted: true });
  } catch (error) {
    console.error("Error fetching course progress:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const courseId = typeof body?.courseId === "string" ? body.courseId : null;
    const status = typeof body?.status === "string" ? body.status : null;

    if (!courseId || !validCourseIds.has(courseId)) {
      return NextResponse.json({ error: "Unknown course" }, { status: 400 });
    }
    if (!status || !validStatuses.has(status)) {
      return NextResponse.json(
        { error: "Invalid status" },
        { status: 400 }
      );
    }

    if (!prisma) {
      return NextResponse.json(
        { error: "Progress tracking is unavailable right now" },
        { status: 503 }
      );
    }

    // Ensure the user row exists (demo users live only in the JWT until first write)
    await prisma.user.upsert({
      where: { id: session.user.id },
      update: {},
      create: {
        id: session.user.id,
        name: session.user.name ?? null,
        email: session.user.email ?? null,
        image: session.user.image ?? null,
      },
    });

    if (status === "not_started") {
      await prisma.courseProgress.deleteMany({
        where: { userId: session.user.id, courseId },
      });
    } else {
      await prisma.courseProgress.upsert({
        where: {
          userId_courseId: {
            userId: session.user.id,
            courseId,
          },
        },
        update: {
          status,
          ...(status === "completed" ? { completedAt: new Date() } : { completedAt: null }),
          lastReadAt: new Date(),
        },
        create: {
          userId: session.user.id,
          courseId,
          status,
          ...(status === "completed" ? { completedAt: new Date() } : {}),
        },
      });
    }

    const state = await getProgressState(session.user.id);
    return NextResponse.json({ success: true, ...state, persisted: true });
  } catch (error) {
    console.error("Error saving course progress:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
