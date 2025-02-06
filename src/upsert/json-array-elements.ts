import { dbClient } from "../db-client.js";
import { StatsData } from "../types.js";

export const upsertJsonArrayElements = async (data: StatsData[], tableName: string) => {
	await dbClient.query(
		`INSERT INTO ${tableName} ("organizationId", "cardId", "date", "barcode", "ordersCount", "ordersAmount",
                                 "allOrdersCount", "allOrdersAmount", "saleCount", "saleAmount", "logistic", "commission", "remains")
           (SELECT (data ->> 'organizationId')::BIGINT AS "organizationId",
                   (data ->> 'cardId')::BIGINT         AS "cardId",
                   (data ->> 'date')::DATE             AS "date",
                   (data ->> 'barcode')::TEXT          AS "barcode",
                   (data ->> 'ordersCount')::INT       AS "ordersCount",
                   (data ->> 'ordersAmount')::float    AS "ordersAmount",
                   (data ->> 'allOrdersCount')::INT    AS "allOrdersCount",
                   (data ->> 'allOrdersAmount')::float AS "allOrdersAmount",
                   (data ->> 'saleCount')::INT         AS "saleCount",
                   (data ->> 'saleAmount')::float      AS "saleAmount",
                   (data ->> 'logistic')::float        AS "logistic",
                   (data ->> 'commission')::float      AS "commission",
                   (data ->> 'remains')::INT           AS "remains"
            FROM JSON_ARRAY_ELEMENTS($1::JSON) data)
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
