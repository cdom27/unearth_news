import pool from "../../db/client";
import { Source } from "./types/source";

// Find an existing source record by domain
export const findSourceByDomain = async (
  domain: string
): Promise<Source | null> => {
  try {
    const result = await pool.query(
      "SELECT * FROM sources WHERE domain = $1 LIMIT 1",
      [domain]
    );
    const row = result.rows[0];

    if (!row) return null;

    return {
      id: row.id,
      name: row.name,
      domain: row.domain,
      createdAt: row.created_at,
    };
  } catch (error) {
    console.error(`Error occurred while finding source:`, error);
    throw new Error(`Error occurred while finding source`);
  }
};

// Insert a newly created source and return it, else fallback to select query
export const saveAndReturnSource = async (
  name: string,
  domain: string
): Promise<Source> => {
  const insertResult = await pool.query(
    "INSERT INTO sources (name, domain) VALUES ($1, $2) ON CONFLICT (domain, name) DO NOTHING RETURNING *",
    [name, domain]
  );

  const insertRows = insertResult.rows;

  if (insertRows.length > 0) {
    return {
      id: insertRows[0].id,
      name: insertRows[0].name,
      domain: insertRows[0].domain,
      createdAt: insertRows[0].created_at,
    };
  }

  // insert failed due to constraints, find existing record by domain
  const selectResult = await findSourceByDomain(domain);
  if (!selectResult) {
    throw new Error(
      `Source not found after conflict insert: ${name} - ${domain}`
    );
  }

  return selectResult;
};
