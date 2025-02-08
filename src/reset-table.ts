import { dbClient } from "./db-client.js";

export const resetTable = async (tableName: string) => {
	await dbClient.query(
		`
          DROP TABLE IF EXISTS ${tableName}`,
	);

	await dbClient.query(
		`
          CREATE TABLE ${tableName}
          (
              "organization_id"  bigint            NOT NULL,
              "card_id"          bigint            NOT NULL,
              "date"             date              NOT NULL,
              "barcode"          text              NOT NULL,
              "orders_count"     integer DEFAULT 0 NOT NULL,
              "orders_amount"    float   DEFAULT 0 NOT NULL,
              "all_orders_count"  integer DEFAULT 0 NOT NULL,
              "all_orders_amount" float   DEFAULT 0 NOT NULL,
              "sale_count"       integer DEFAULT 0 NOT NULL,
              "sale_amount"      float   DEFAULT 0 NOT NULL,
              "logistic"         float   DEFAULT 0 NOT NULL,
              "commission"       float   DEFAULT 0 NOT NULL,
              "remains"          integer DEFAULT 0 NOT NULL,
              PRIMARY KEY ("card_id", "date", "barcode")
          )`,
	);
};
