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
              "organizationId"  bigint            NOT NULL,
              "cardId"          bigint            NOT NULL,
              "date"            date              NOT NULL,
              "barcode"         text              NOT NULL,
              "ordersCount"     integer DEFAULT 0 NOT NULL,
              "ordersAmount"    float   DEFAULT 0 NOT NULL,
              "allOrdersCount"  integer DEFAULT 0 NOT NULL,
              "allOrdersAmount" float   DEFAULT 0 NOT NULL,
              "saleCount"       integer DEFAULT 0 NOT NULL,
              "saleAmount"      float   DEFAULT 0 NOT NULL,
              "logistic"        float   DEFAULT 0 NOT NULL,
              "commission"      float   DEFAULT 0 NOT NULL,
              "remains"         integer DEFAULT 0 NOT NULL,
              PRIMARY KEY ("cardId", "date", "barcode")
          )`,
	);
};
