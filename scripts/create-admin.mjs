// Create or reset an admin user for the dashboard.
//
//   npm run create-admin -- you@example.com "your-password"
//
// Requires DATABASE_URL (loaded from .env.local via the npm script's
// --env-file flag). Passwords are hashed with scrypt before storage.

import { randomBytes, scryptSync } from "node:crypto";
import { Pool } from "pg";

function hashPassword(password) {
  const salt = randomBytes(16).toString("hex");
  const derived = scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${derived}`;
}

const [, , emailArg, passwordArg] = process.argv;

if (!emailArg || !passwordArg) {
  console.error('Usage: npm run create-admin -- <email> "<password>"');
  process.exit(1);
}

const email = emailArg.trim().toLowerCase();
const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.error(
    "DATABASE_URL is not set. Run via: npm run create-admin -- <email> <password>"
  );
  process.exit(1);
}

const pool = new Pool({
  connectionString,
  ssl: connectionString.includes("localhost")
    ? false
    : { rejectUnauthorized: false },
});

try {
  await pool.query(
    `CREATE TABLE IF NOT EXISTS admin_users (
       id            BIGSERIAL PRIMARY KEY,
       email         TEXT NOT NULL UNIQUE,
       password_hash TEXT NOT NULL,
       created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
     )`
  );

  await pool.query(
    `INSERT INTO admin_users (email, password_hash)
     VALUES ($1, $2)
     ON CONFLICT (email) DO UPDATE SET password_hash = EXCLUDED.password_hash`,
    [email, hashPassword(passwordArg)]
  );

  console.log(`✓ Admin ready: ${email}`);
} catch (error) {
  console.error("Failed to create admin:", error);
  process.exitCode = 1;
} finally {
  await pool.end();
}
