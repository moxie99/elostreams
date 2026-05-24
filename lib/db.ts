import { Pool } from "pg";

const connectionString = process.env.DATABASE_URL;

// Local databases generally don't use TLS; managed providers (Railway, etc.) do.
const isLocal =
  !connectionString ||
  connectionString.includes("localhost") ||
  connectionString.includes("127.0.0.1");

// Reuse a single pool across hot-reloads in development to avoid exhausting
// connections. In production a fresh module scope is fine.
const globalForPg = globalThis as unknown as { pgPool?: Pool };

export const pool =
  globalForPg.pgPool ??
  new Pool({
    connectionString,
    ssl: isLocal ? false : { rejectUnauthorized: false },
    max: 5,
  });

if (process.env.NODE_ENV !== "production") {
  globalForPg.pgPool = pool;
}

let ensurePromise: Promise<void> | null = null;

/**
 * Lazily creates the `waitlist` table the first time it's needed (once per
 * process). Safe to call on every request — the work only runs once.
 */
export function ensureWaitlistTable(): Promise<void> {
  if (!ensurePromise) {
    ensurePromise = pool
      .query(
        `CREATE TABLE IF NOT EXISTS waitlist (
           id          BIGSERIAL PRIMARY KEY,
           email       TEXT NOT NULL UNIQUE,
           created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
         )`
      )
      .then(() => undefined)
      .catch((error) => {
        // Allow a later request to retry if this attempt failed.
        ensurePromise = null;
        throw error;
      });
  }
  return ensurePromise;
}

// ---------------------------------------------------------------------------
// Admin users
// ---------------------------------------------------------------------------

export type AdminUser = {
  id: string;
  email: string;
  password_hash: string;
};

let ensureAdminPromise: Promise<void> | null = null;

/** Lazily creates the `admin_users` table (once per process). */
export function ensureAdminUsersTable(): Promise<void> {
  if (!ensureAdminPromise) {
    ensureAdminPromise = pool
      .query(
        `CREATE TABLE IF NOT EXISTS admin_users (
           id            BIGSERIAL PRIMARY KEY,
           email         TEXT NOT NULL UNIQUE,
           password_hash TEXT NOT NULL,
           created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
         )`
      )
      .then(() => undefined)
      .catch((error) => {
        ensureAdminPromise = null;
        throw error;
      });
  }
  return ensureAdminPromise;
}

/** Looks up an admin by (lowercased) email. Returns null if not found. */
export async function getAdminByEmail(
  email: string
): Promise<AdminUser | null> {
  await ensureAdminUsersTable();
  const { rows } = await pool.query(
    `SELECT id, email, password_hash FROM admin_users WHERE email = $1 LIMIT 1`,
    [email]
  );
  if (rows.length === 0) return null;
  const row = rows[0];
  return {
    id: String(row.id),
    email: row.email as string,
    password_hash: row.password_hash as string,
  };
}

// ---------------------------------------------------------------------------
// Waitlist reads (for the admin dashboard)
// ---------------------------------------------------------------------------

export type WaitlistEntry = {
  email: string;
  created_at: string; // ISO 8601
};

/** Returns every waitlist signup, newest first, with ISO timestamps. */
export async function getWaitlistEntries(): Promise<WaitlistEntry[]> {
  await ensureWaitlistTable();
  const { rows } = await pool.query(
    `SELECT email, created_at FROM waitlist ORDER BY created_at DESC`
  );
  return rows.map((row) => ({
    email: row.email as string,
    created_at:
      row.created_at instanceof Date
        ? row.created_at.toISOString()
        : String(row.created_at),
  }));
}
