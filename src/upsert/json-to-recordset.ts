import { dbClient } from "../db-client.js";
import { StatsData } from "../types.js";

export const upsertJsonToRecordset = async (data: StatsData[], tableName: string) => {
	await dbClient.query(
		`INSERT INTO ${tableName} ("organizationId", "cardId", "date", "barcode", "ordersCount", "ordersAmount",
                                 "allOrdersCount", "allOrdersAmount", "saleCount", "saleAmount", "logistic",
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
            FROM JSON_TO_RECORDSET($1) AS x(
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
