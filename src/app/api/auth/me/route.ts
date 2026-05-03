import { NextRequest, NextResponse } from 'next/server';

const SESSION_COOKIE = 'hd_session';

type SessionPayload = {
  email: string;
  name: string;
  username?: string;
  expiresAt: number;
};

const readSession = (request: NextRequest): SessionPayload | null => {
  const token = request.cookies.get(SESSION_COOKIE)?.value;
  if (!token) return null;

  try {
    const parsed = JSON.parse(Buffer.from(token, 'base64url').toString('utf8')) as SessionPayload;
    if (!parsed?.email || !parsed?.name || !parsed?.expiresAt) return null;
    if (Date.now() > Number(parsed.expiresAt)) return null;
    return parsed;
  } catch {
    return null;
  }
};

export async function GET(request: NextRequest) {
  const session = readSession(request);
  if (!session) {
    return NextResponse.json({ ok: false, error: 'Non authentifie.' }, { status: 401 });
  }

  return NextResponse.json({
    ok: true,
    user: {
      email: session.email,
      name: session.name,
      username: session.username,
    },
  });
}
