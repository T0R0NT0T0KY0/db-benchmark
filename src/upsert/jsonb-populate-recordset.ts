import { dbClient } from "../db-client.js";
import { StatsData } from "../types.js";

export const upsertJsonbPopulateRecordset = async (data: StatsData[], tableName: string) => {
	const mappedData = data.map((row) => ({
		organization_id: row.organizationId,
		card_id: row.cardId,
		date: row.date,
		barcode: row.barcode,
		orders_count: row.ordersCount,
		orders_amount: row.ordersAmount,
		all_orders_count: row.allOrdersCount,
		all_orders_amount: row.allOrdersAmount,
		sale_count: row.saleCount,
		sale_amount: row.saleAmount,
		logistic: row.logistic,
		commission: row.commission,
		remains: row.remains,
	}))

	await dbClient.query(
		`INSERT INTO ${tableName} ("organization_id", "card_id", "date", "barcode", "orders_count", "orders_amount",
                                 "all_orders_count", "all_orders_amount", "sale_count", "sale_amount", "logistic",
                                 "commission", "remains")
       SELECT *
       FROM JSONB_POPULATE_RECORDSET(NULL::${tableName}, $1)
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
		[JSON.stringify(mappedData)],
	);
};
