# HelpDesk Portal

Portail web de soumission de tickets d'assistance informatique, développé avec Next.js et PostgreSQL.

## Stack

- **Next.js 14** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **PostgreSQL** (via `pg`)

## Fonctionnalités

- Formulaire de soumission de ticket (nom, email, titre, description)
- Catégories : Matériel, Logiciel, Réseau, Compte/Accès, Autre
- Niveaux de priorité : Faible, Moyen, Élevé, Critique
- Validation des champs côté serveur
- Stockage des tickets en base PostgreSQL
- Page de confirmation après soumission

## Installation

```bash
npm install
```

## Configuration

Créer un fichier `.env.local` à la racine :

```env
DATABASE_URL=postgresql://user:password@localhost:5432/helpdesk
# Optionnel : activer SSL
# PGSSL=true
```

### Schéma de la base de données

```sql
CREATE TABLE tickets (
  id          UUID PRIMARY KEY,
  title       TEXT NOT NULL,
  description TEXT NOT NULL,
  priority    TEXT NOT NULL,
  status      TEXT NOT NULL DEFAULT 'open',
  category    TEXT NOT NULL,
  created_by  TEXT NOT NULL,
  comments    JSONB NOT NULL DEFAULT '[]',
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

## Lancement

```bash
# Développement (port 3001)
npm run dev

# Production
npm run build
npm start
```

## API

| Méthode | Endpoint       | Description              |
|---------|----------------|--------------------------|
| POST    | /api/tickets   | Créer un nouveau ticket  |
