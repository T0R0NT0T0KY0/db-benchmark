import postgres from 'pg';
import { config } from "./config.js";

export const dbClient = new postgres.Client({
	user: config.database.username,
	host: config.database.host,
	database: config.database.database,
	password: config.database.password,
	port: config.database.port,
});
