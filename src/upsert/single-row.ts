import { dbClient } from "../db-client.js";
import { StatsData } from "../types.js";

export const upsertSingleRow = async (data: StatsData[], tableName: string) => {
	await Promise.all(
		data.map((row) => dbClient.query(
			`INSERT INTO ${tableName} ("organization_id", "card_id", "date", "barcode", "orders_count", "orders_amount",
                                    "all_orders_count", "all_orders_amount", "sale_count", "sale_amount", "logistic",
                                    "commission", "remains")
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
          ON CONFLICT ("card_id", "date", "barcode")
              DO UPDATE
              SET "orders_count"      = EXCLUDED."orders_count",
                  "orders_amount"     = EXCLUDED."orders_amount",
                  "all_orders_count"  = EXCLUDED."all_orders_count",
                  "all_orders_amount" = EXCLUDED."all_orders_amount",
                  "sale_count"        = EXCLUDED."sale_count",
                  "sale_amount"       = EXCLUDED."sale_amount",
                  "logistic"          = EXCLUDED."logistic",
                  "commission"        = EXCLUDED."commission",
                  "remains"           = EXCLUDED."remains";`,
			[row.organizationId, row.cardId, row.date, row.barcode, row.ordersCount, row.ordersAmount, row.allOrdersCount, row.allOrdersAmount, row.saleCount, row.saleAmount, row.logistic, row.commission, row.remains],
		)),
	);
};
