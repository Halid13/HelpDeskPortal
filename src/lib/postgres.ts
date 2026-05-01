import { Pool } from 'pg';

type QueryValue = string | number | boolean | Date | null;

declare global {
  var __hdPgPool: Pool | undefined;
}

const getPool = () => {
  if (!global.__hdPgPool) {
    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) {
      throw new Error('DATABASE_URL non définie. Configurez PostgreSQL dans .env.local');
    }
    const sslEnabled = process.env.PGSSL === 'true' || process.env.PGSSLMODE === 'require';
    global.__hdPgPool = new Pool({
      connectionString,
      max: 5,
      idleTimeoutMillis: 30_000,
      connectionTimeoutMillis: 5_000,
      ssl: sslEnabled ? { rejectUnauthorized: false } : undefined,
    });
  }
  return global.__hdPgPool;
};

export const dbQuery = async <T extends Record<string, unknown> = Record<string, unknown>>(
  text: string,
  params: QueryValue[] = [],
) => {
  const pool = getPool();
  return pool.query<T>(text, params);
};
