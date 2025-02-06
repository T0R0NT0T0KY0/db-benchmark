import { dbClient } from "../db-client.js";
import { StatsData } from "../types.js";

export const upsertJsonPopulateRecordset = async (data: StatsData[], tableName: string) => {
	await dbClient.query(
		`INSERT INTO ${tableName} ("organizationId", "cardId", "date", "barcode", "ordersCount", "ordersAmount",
                          "allOrdersCount", "allOrdersAmount", "saleCount", "saleAmount", "logistic", "commission",
                          "remains")
       SELECT *
       FROM JSON_POPULATE_RECORDSET(NULL::${tableName}, $1)
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
		[JSON.stringify(data)],
	);
};
