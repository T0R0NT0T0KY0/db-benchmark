import { dbClient } from "../db-client.js";
import { StatsData } from "../types.js";

export const upsertBatch = async (data: StatsData[], tableName: string) => {
	const tasks:Promise<unknown>[] = [];
	const chunkSize = 32000 / 13;
	for (let i = 0; i < data.length; i += chunkSize) {
		const chunk = data.slice(i, i+chunkSize);
		const valuesText = chunk.map((row, index) => {
			const offset = (index * 13) + 1;
			const valuesIndexes = [];
			for (let valueIndex = offset; valueIndex < offset + 13; valueIndex++) {
				valuesIndexes.push(`$${valueIndex}`);
			}

			return `${valuesIndexes.join(",")}`
		}).join("),(");
		const values = chunk.flatMap((row) => [row.organizationId, row.cardId, row.date, row.barcode, row.ordersCount, row.ordersAmount, row.allOrdersCount, row.allOrdersAmount, row.saleCount, row.saleAmount, row.logistic, row.commission, row.remains]);

		await dbClient.query(
			`INSERT INTO ${tableName} ("organization_id", "card_id", "date", "barcode", "orders_count", "orders_amount",
                                    "all_orders_count", "all_orders_amount", "sale_count", "sale_amount", "logistic",
                                    "commission", "remains")
          VALUES (${valuesText})
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
                  "remains"           = EXCLUDED."remains"`,
			values
		);
	}

	await Promise.all(tasks);
};
