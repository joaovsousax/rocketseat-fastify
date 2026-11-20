import { nanoid } from "nanoid";
import { Pool } from "pg";

export interface Transcription {
  id: string;
  created_by: string;
  created_at: Date;
  updated_at: Date;
  content: string;
  youtube_url: string;
  youtube_id: string;
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

let tableReady: Promise<void> | null = null;

async function ensureTable() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS transcriptions (
      id TEXT PRIMARY KEY,
      created_by TEXT NOT NULL,
      created_at TIMESTAMPTZ NOT NULL,
      updated_at TIMESTAMPTZ NOT NULL,
      content TEXT NOT NULL,
      youtube_url TEXT NOT NULL,
      youtube_id TEXT NOT NULL
    )
  `);
}

function ensureReady() {
  tableReady ??= ensureTable();
  return tableReady;
}

export async function createTranscription(
  youtubeUrl: string,
  youtubeId: string,
  userId: string,
): Promise<Transcription> {
  await ensureReady();
  const now = new Date();

  const transcription: Transcription = {
    id: nanoid(),
    created_by: userId,
    created_at: now,
    updated_at: now,
    content: "Fake transcription",
    youtube_url: youtubeUrl,
    youtube_id: youtubeId,
  };

  await pool.query(
    `INSERT INTO transcriptions (
      id,
      created_by,
      created_at,
      updated_at,
      content,
      youtube_url,
      youtube_id
    ) VALUES ($1, $2, $3, $4, $5, $6, $7)`,
    [
      transcription.id,
      transcription.created_by,
      transcription.created_at,
      transcription.updated_at,
      transcription.content,
      transcription.youtube_url,
      transcription.youtube_id,
    ],
  );

  return transcription;
}

export async function getTranscriptions(): Promise<Transcription[]> {
  await ensureReady();
  const result = await pool.query<Transcription>(
    "SELECT * FROM transcriptions ORDER BY created_at DESC",
  );

  return result.rows;
}
