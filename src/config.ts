import { env } from "process";
import { config as envs } from "dotenv";

envs();

export const config = {
	database: {
		host: env.POSTGRES_HOST,
		port: +env.POSTGRES_PORT || 5432,
		username: env.POSTGRES_USER,
		database: env.POSTGRES_DB,
		password: env.POSTGRES_PASSWORD
	},
};
