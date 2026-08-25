import { Client } from 'pg';
import { readFileSync } from 'fs';

const envFile = readFileSync(new URL('../.env.local', import.meta.url), 'utf8');
const dbUrlLine = envFile.split('\n').find((l) => l.startsWith('DATABASE_URL='));
const dbUrl = dbUrlLine.slice('DATABASE_URL='.length).trim().replace(/^"|"$/g, '');

const client = new Client({ connectionString: dbUrl, ssl: { rejectUnauthorized: false } });

await client.connect();
await client.query(`
  CREATE TABLE IF NOT EXISTS bookings (
    id SERIAL PRIMARY KEY,
    typ TEXT NOT NULL DEFAULT 'rezervace',
    jmeno TEXT,
    telefon TEXT,
    email TEXT,
    sluzba TEXT,
    datum DATE NOT NULL,
    cas TEXT NOT NULL,
    poznamka TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(datum, cas)
  );
`);
console.log('OK: bookings table ready');
await client.end();
