import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { createClient } from '@/lib/supabase/server';

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const studioId = url.searchParams.get('studioId');
    if (!studioId) return NextResponse.json({ error: 'studioId required' }, { status: 400 });

    const supabase = await createClient();
    const { data } = await supabase.auth.getUser();
    if (!data.user) return NextResponse.json({ error: 'unauthenticated' }, { status: 401 });

    // verify user belongs to studio
    const membership = await prisma.studioMember.findFirst({
      where: { studioId, userId: data.user.id },
    });
    if (!membership) return NextResponse.json({ error: 'forbidden' }, { status: 403 });

    // fetch students (StudioMember role STUDENT)
    const students = await prisma.studioMember.findMany({
      where: { studioId, role: 'STUDENT' },
      include: { user: true },
    });

    const assignments = await prisma.assignment.findMany({
      where: { studioId },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ students, assignments });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { studioId, studentId, title, description, dueDate } = body;

    if (!studioId || !studentId || !title) {
      return NextResponse.json({ error: 'studioId, studentId, and title required' }, { status: 400 });
    }

    const supabase = await createClient();
    const { data } = await supabase.auth.getUser();
    if (!data.user) return NextResponse.json({ error: 'unauthenticated' }, { status: 401 });

    // verify current user is part of the studio and has a teacher/admin role
    const membership = await prisma.studioMember.findFirst({
      where: { studioId, userId: data.user.id },
    });
    if (!membership) return NextResponse.json({ error: 'forbidden' }, { status: 403 });

    if (!['OWNER', 'ADMIN', 'TEACHER'].includes(membership.role)) {
      return NextResponse.json({ error: 'insufficient role' }, { status: 403 });
    }

    const assignment = await prisma.assignment.create({
      data: {
        title,
        description,
        dueDate: dueDate ? new Date(dueDate) : undefined,
        studioId,
        studentId,
      },
    });

    return NextResponse.json({ assignment });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
