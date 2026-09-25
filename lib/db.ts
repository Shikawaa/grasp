import { Pool, PoolClient, QueryResult, QueryResultRow } from "@neondatabase/serverless";

// Use pooled database connection string by default for serverless efficiency,
// or fallback to unpooled if pooled is unavailable.
const connectionString =
  process.env.APP_DATABASE_URL ||
  process.env.DATABASE_URL ||
  process.env.DATABASE_URL_UNPOOLED;

if (!connectionString) {
  console.warn("⚠️ DATABASE_URL is not set in environment variables.");
}

// Global connection pool cached across serverless warm invocations
const pool = new Pool({
  connectionString,
});

/**
 * Execute a query with optional user context for PostgreSQL Row-Level Security (RLS).
 * When `userId` is supplied, the query is executed within a transaction where
 * `SET LOCAL app.user_id = $userId` is scoped to that single transaction, ensuring
 * that RLS policies strictly protect user data even across pooled connections.
 */
export async function query<R extends QueryResultRow = any>(
  text: string,
  params?: any[],
  userId?: string
): Promise<QueryResult<R>> {
  if (!userId) {
    // Unauthenticated or public query (e.g. get_public_share_content)
    return pool.query<R>(text, params);
  }

  // Authenticated query: execute inside a transaction with user session setting
  const client: PoolClient = await pool.connect();
  try {
    await client.query("BEGIN;");
    await client.query("SELECT set_config('app.user_id', $1, true);", [userId]);
    const result = await client.query<R>(text, params);
    await client.query("COMMIT;");
    return result;
  } catch (error) {
    await client.query("ROLLBACK;");
    throw error;
  } finally {
    client.release();
  }
}

/**
 * Run multiple operations inside an atomic transaction with RLS user context.
 */
export async function withTransaction<T>(
  userId: string | undefined,
  callback: (client: PoolClient) => Promise<T>
): Promise<T> {
  const client: PoolClient = await pool.connect();
  try {
    await client.query("BEGIN;");
    if (userId) {
      await client.query("SELECT set_config('app.user_id', $1, true);", [userId]);
    }
    const result = await callback(client);
    await client.query("COMMIT;");
    return result;
  } catch (error) {
    await client.query("ROLLBACK;");
    throw error;
  } finally {
    client.release();
  }
}

export { pool };
