import { NextRequest, NextResponse } from 'next/server';

const SESSION_COOKIE = 'hd_session';
const SESSION_TTL_SECONDS = 60 * 60 * 8;

type AdUser = {
  email?: string;
  firstName?: string;
  lastName?: string;
  username?: string;
  isActive?: boolean;
};

const isValidEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

const normalizeEmail = (value: string) => value.trim().toLowerCase();

const formatDisplayName = (user: AdUser, fallbackEmail: string) => {
  const first = String(user.firstName || '').trim();
  const last = String(user.lastName || '').trim();
  const full = `${first} ${last}`.trim();
  return full || String(user.username || '').trim() || fallbackEmail;
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const email = normalizeEmail(String(body?.email || ''));

    if (!isValidEmail(email)) {
      return NextResponse.json({ ok: false, error: 'Adresse email invalide.' }, { status: 400 });
    }

    const enforcedDomain = String(process.env.COMPANY_EMAIL_DOMAIN || '').trim().toLowerCase();
    if (enforcedDomain && !email.endsWith(`@${enforcedDomain}`)) {
      return NextResponse.json(
        { ok: false, error: `Veuillez utiliser votre email d'entreprise (@${enforcedDomain}).` },
        { status: 403 },
      );
    }

    const masterMonitorUrl = String(process.env.MASTERMONITOR_URL || 'http://localhost:3000').replace(/\/$/, '');
    const adResponse = await fetch(`${masterMonitorUrl}/api/ad/users`, { cache: 'no-store' });

    if (!adResponse.ok) {
      return NextResponse.json(
        { ok: false, error: 'Verification AD indisponible. Reessayez dans un instant.' },
        { status: 502 },
      );
    }

    const adData = await adResponse.json();
    const users: AdUser[] = Array.isArray(adData?.users) ? adData.users : [];

    const matched = users.find((u) => normalizeEmail(String(u.email || '')) === email);
    if (!matched || matched.isActive === false) {
      return NextResponse.json(
        { ok: false, error: 'Email non reconnu dans Active Directory.' },
        { status: 403 },
      );
    }

    const now = Date.now();
    const payload = {
      email,
      name: formatDisplayName(matched, email),
      username: String(matched.username || '').trim() || undefined,
      expiresAt: now + SESSION_TTL_SECONDS * 1000,
    };

    const token = Buffer.from(JSON.stringify(payload), 'utf8').toString('base64url');

    const response = NextResponse.json({ ok: true, user: { email: payload.email, name: payload.name } });
    response.cookies.set(SESSION_COOKIE, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: SESSION_TTL_SECONDS,
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('Erreur login HelpDesk:', error);
    return NextResponse.json({ ok: false, error: 'Erreur serveur.' }, { status: 500 });
  }
}
