import { dbClient } from "../db-client.js";
import { StatsData } from "../types.js";

export const upsertSingleRow = async (data: StatsData[], tableName: string) => {
	await Promise.all(
		data.map((row) => dbClient.query(
			`INSERT INTO ${tableName} ("organizationId", "cardId", "date", "barcode", "ordersCount", "ordersAmount",
                             "allOrdersCount", "allOrdersAmount", "saleCount", "saleAmount", "logistic", "commission", "remains")
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
          ON CONFLICT ("cardId", "date", "barcode")
              DO UPDATE
              SET "ordersCount"     = EXCLUDED."ordersCount",
                  "ordersAmount"    = EXCLUDED."ordersAmount",
                  "allOrdersCount"  = EXCLUDED."allOrdersCount",
                  "allOrdersAmount" = EXCLUDED."allOrdersAmount",
                  "saleCount"       = EXCLUDED."saleCount",
                  "saleAmount"      = EXCLUDED."saleAmount",
                  "logistic"        = EXCLUDED."logistic",
                  "commission"      = EXCLUDED."commission",
                  "remains"         = EXCLUDED."remains";`,
			[row.organizationId, row.cardId, row.date, row.barcode, row.ordersCount, row.ordersAmount, row.allOrdersCount, row.allOrdersAmount, row.saleCount, row.saleAmount, row.logistic, row.commission, row.remains],
		)),
	);
};
