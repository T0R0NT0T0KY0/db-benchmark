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

			return `(${valuesIndexes.join(",")})`
		}).join(",");
		const values = chunk.flatMap((row) => [row.organizationId, row.cardId, row.date, row.barcode, row.ordersCount, row.ordersAmount, row.allOrdersCount, row.allOrdersAmount, row.saleCount, row.saleAmount, row.logistic, row.commission, row.remains]);

		await dbClient.query(
			`INSERT INTO ${tableName} ("organizationId", "cardId", "date", "barcode", "ordersCount", "ordersAmount",
                             "allOrdersCount", "allOrdersAmount", "saleCount", "saleAmount", "logistic", "commission",
                             "remains")
         VALUES
         ${valuesText}
          ON CONFLICT ("cardId", "date", "barcode")
         DO UPDATE
         SET "ordersCount" = EXCLUDED."ordersCount",
                  "ordersAmount"    = EXCLUDED."ordersAmount",
                  "allOrdersCount"  = EXCLUDED."allOrdersCount",
                  "allOrdersAmount" = EXCLUDED."allOrdersAmount",
                  "saleCount"       = EXCLUDED."saleCount",
                  "saleAmount"      = EXCLUDED."saleAmount",
                  "logistic"        = EXCLUDED."logistic",
                  "commission"      = EXCLUDED."commission",
                  "remains"         = EXCLUDED."remains"`,
			values
		);
	}

	await Promise.all(tasks);
};
