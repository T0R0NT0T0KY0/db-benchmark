import { dbClient } from "../db-client.js";
import { StatsData } from "../types.js";

export const upsertJsonToRecordset = async (data: StatsData[], tableName: string) => {
	await dbClient.query(
		`INSERT INTO ${tableName} ("organization_id", "card_id", "date", "barcode", "orders_count", "orders_amount",
                                 "all_orders_count", "all_orders_amount", "sale_count", "sale_amount", "logistic",
                                 "commission", "remains")
           (SELECT "organizationId"  AS "organizationId",
                   "cardId"          AS "cardId",
                   "date"            AS "date",
                   "barcode"         AS "barcode",
                   "ordersCount"     AS "ordersCount",
                   "ordersAmount"    AS "ordersAmount",
                   "allOrdersCount"  AS "allOrdersCount",
                   "allOrdersAmount" AS "allOrdersAmount",
                   "saleCount"       AS "saleCount",
                   "saleAmount"      AS "saleAmount",
                   "logistic"        AS "logistic",
                   "commission"      AS "commission",
                   "remains"         AS "remains"
            FROM JSON_TO_RECORDSET($1::JSON) AS x(
                                            "organizationId" bigint,
                                            "cardId" bigint,
                                            date date,
                                            barcode text,
                                            "ordersCount" integer,
                                            "ordersAmount" double precision,
                                            "allOrdersCount" integer,
                                            "allOrdersAmount" double precision,
                                            "saleCount" integer,
                                            "saleAmount" double precision,
                                            logistic double precision,
                                            commission double precision,
                                            remains integer
                ))
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
		[JSON.stringify(data)],
	);
};
