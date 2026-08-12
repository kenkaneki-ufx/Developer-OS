import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { comingSoonCourses } from "@/lib/learning/courses";

// Only coming-soon courses can be voted for
const validCourseIds = new Set(comingSoonCourses.map((c) => c.id));

interface VoteState {
  votes: Record<string, number>;
  myVote: string | null;
  totalVotes: number;
}

async function getVoteState(userId: string): Promise<VoteState | null> {
  if (!prisma) return null;

  const [grouped, myRow] = await Promise.all([
    prisma.courseVote.groupBy({
      by: ["courseId"],
      _count: { courseId: true },
    }),
    prisma.courseVote.findFirst({
      where: { userId },
      select: { courseId: true },
    }),
  ]);

  // Only count votes for currently-valid coming-soon courses (ignore stale rows)
  const votes: Record<string, number> = {};
  let totalVotes = 0;
  for (const g of grouped) {
    if (validCourseIds.has(g.courseId)) {
      votes[g.courseId] = g._count.courseId;
      totalVotes += g._count.courseId;
    }
  }

  return {
    votes,
    myVote: myRow?.courseId ?? null,
    totalVotes,
  };
}

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const state = await getVoteState(session.user.id);
    if (!state) {
      return NextResponse.json({
        success: true,
        votes: {},
        myVote: null,
        totalVotes: 0,
        persisted: false,
      });
    }

    return NextResponse.json({ success: true, ...state, persisted: true });
  } catch (error) {
    console.error("Error fetching course votes:", error);
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

    if (!courseId || !validCourseIds.has(courseId)) {
      return NextResponse.json({ error: "Unknown course" }, { status: 400 });
    }

    if (!prisma) {
      return NextResponse.json(
        { error: "Voting is unavailable right now" },
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

    // One active vote per user: replace any previous vote with the new choice
    const existing = await prisma.courseVote.findFirst({
      where: { userId: session.user.id },
      select: { courseId: true },
    });

    if (!existing || existing.courseId !== courseId) {
      await prisma.$transaction([
        prisma.courseVote.deleteMany({ where: { userId: session.user.id } }),
        prisma.courseVote.create({
          data: { userId: session.user.id, courseId },
        }),
      ]);
    }

    const state = await getVoteState(session.user.id);
    return NextResponse.json({ success: true, ...state, persisted: true });
  } catch (error) {
    console.error("Error casting course vote:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!prisma) {
      return NextResponse.json(
        { error: "Voting is unavailable right now" },
        { status: 503 }
      );
    }

    // Deleting votes for a user with no row is already a no-op, so no upsert needed here
    await prisma.courseVote.deleteMany({ where: { userId: session.user.id } });

    const state = await getVoteState(session.user.id);
    return NextResponse.json({ success: true, ...state, persisted: true });
  } catch (error) {
    console.error("Error removing course vote:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
