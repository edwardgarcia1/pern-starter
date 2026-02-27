import type { Pool as PgPoolType, PoolClient } from "pg";
import pkg from "pg";

const { Pool: PgPool } = pkg;

import {
	database,
	password,
	server,
	user,
	db_port,
} from "../utils/constants.js";

let poolInstance: PgPoolType | null = null;

export const getPool = (): PgPoolType => {
	if (!poolInstance) {
		poolInstance = new PgPool({
			host: server,
			user,
			password,
			database,
			port: db_port ? parseInt(db_port) : 5432,
			max: 20,
			idleTimeoutMillis: 30000,
		});

		poolInstance.on("error", (err) => {
			console.error("Unexpected PostgreSQL pool error:", err);
		});
	}
	return poolInstance;
};

export const getClient = async (): Promise<PoolClient> => {
	const pool = getPool();
	const client = await pool.connect();
	return client;
};
