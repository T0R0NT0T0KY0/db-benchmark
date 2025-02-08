import { dbClient } from "../db-client.js";
import { StatsData } from "../types.js";

export const upsertJsonArrayElements = async (data: StatsData[], tableName: string) => {
	await dbClient.query(
		`INSERT INTO ${tableName} ("organization_id", "card_id", "date", "barcode", "orders_count", "orders_amount",
                                 "all_orders_count", "all_orders_amount", "sale_count", "sale_amount", "logistic",
                                 "commission", "remains")
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
