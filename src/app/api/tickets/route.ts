import { NextRequest, NextResponse } from 'next/server';
import { dbQuery } from '@/lib/postgres';
import { randomUUID } from 'crypto';

const SESSION_COOKIE = 'hd_session';

type SessionPayload = {
  email: string;
  name: string;
  expiresAt: number;
};

const readSession = (request: NextRequest): SessionPayload | null => {
  const token = request.cookies.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  try {
    const payload = JSON.parse(Buffer.from(token, 'base64url').toString('utf8')) as SessionPayload;
    if (!payload?.email || !payload?.name || !payload?.expiresAt) return null;
    if (Date.now() > Number(payload.expiresAt)) return null;
    return payload;
  } catch {
    return null;
  }
};

export async function POST(request: NextRequest) {
  try {
    const session = readSession(request);
    if (!session) {
      return NextResponse.json({ error: 'Session invalide. Veuillez vous reconnecter.' }, { status: 401 });
    }

    const body = await request.json();
    const { title, description, priority, category } = body;

    // Validation des champs obligatoires
    if (!title?.trim() || !description?.trim()) {
      return NextResponse.json(
        { error: 'Les champs titre et description sont obligatoires.' },
        { status: 400 }
      );
    }

    const validPriorities = ['low', 'medium', 'high', 'critical'];
    const validCategories = ['hardware', 'software', 'network', 'user', 'other'];

    const ticketPriority = validPriorities.includes(priority) ? priority : 'medium';
    const ticketCategory = validCategories.includes(category) ? category : 'other';

    const id = randomUUID();
    const createdBy = `${session.name.trim()} <${session.email.trim()}>`;

    await dbQuery(
      `INSERT INTO tickets (id, title, description, priority, status, category, created_by, comments, created_at, updated_at)
       VALUES ($1, $2, $3, $4, 'open', $5, $6, '[]'::jsonb, NOW(), NOW())`,
      [id, title.trim(), description.trim(), ticketPriority, ticketCategory, createdBy]
    );

    return NextResponse.json({ success: true, ticketId: id }, { status: 201 });
  } catch (error) {
    console.error('Erreur création ticket:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur. Veuillez réessayer.' },
      { status: 500 }
    );
  }
}
