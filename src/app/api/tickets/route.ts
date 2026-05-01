import { NextRequest, NextResponse } from 'next/server';
import { dbQuery } from '@/lib/postgres';
import { randomUUID } from 'crypto';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, title, description, priority, category } = body;

    // Validation des champs obligatoires
    if (!name?.trim() || !email?.trim() || !title?.trim() || !description?.trim()) {
      return NextResponse.json(
        { error: 'Les champs nom, email, titre et description sont obligatoires.' },
        { status: 400 }
      );
    }

    // Validation basique de l'email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      return NextResponse.json(
        { error: 'Adresse email invalide.' },
        { status: 400 }
      );
    }

    const validPriorities = ['low', 'medium', 'high', 'critical'];
    const validCategories = ['hardware', 'software', 'network', 'user', 'other'];

    const ticketPriority = validPriorities.includes(priority) ? priority : 'medium';
    const ticketCategory = validCategories.includes(category) ? category : 'other';

    const id = randomUUID();
    const createdBy = `${name.trim()} <${email.trim()}>`;

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
