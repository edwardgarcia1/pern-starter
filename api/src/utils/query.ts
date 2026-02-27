import { getPool, getClient } from "../db/client";
import type { PoolClient } from "pg";

interface QueryResult {
	rows: any[];
	rowCount: number;
}

/*
For simple queries (one-liner)
Example usage: const result = await executeQuery("SELECT * FROM users WHERE active = $1", [true]);
*/
export const executeQuery = async (
	query: string,
	inputParameters: any[] = [],
): Promise<QueryResult> => {
	try {
		const pool = getPool();
		const result = await pool.query(query, inputParameters);

		return {
			rows: result.rows,
			rowCount: result.rowCount ?? 0,
		};
	} catch (error) {
		console.error("executeQuery error:", error);
		throw error;
	}
};

/*
For multiple queries (only updates when all changes are successful)
Example usage:
await executeTransaction(async (client) => {
    
    const deductRes = await client.query(
      "UPDATE accounts SET balance = balance - $1 WHERE id = $2", 
      [amount, fromId]
    );

    const addRes = await client.query(
      "UPDATE accounts SET balance = balance + $1 WHERE id = $2", 
      [amount, toId]
    );
    
    return { success: true };
  });
*/
export const executeTransaction = async <T>(
	callback: (client: PoolClient) => Promise<T>,
): Promise<T> => {
	const client = await getClient();

	try {
		await client.query("BEGIN");

		const result = await callback(client);

		await client.query("COMMIT");
		return result;
	} catch (error) {
		await client.query("ROLLBACK");
		console.error("Transaction failed, rolled back:", error);
		throw error;
	} finally {
		client.release();
	}
};
