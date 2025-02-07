import copyFrom from "pg-copy-streams";
import { Readable } from "stream";
import { dbClient } from "../db-client.js";
import { StatsData } from "../types.js";

export const upsertCopy = async (data: StatsData[], tableName: string) => {
	const tempTableName = `temp_${tableName}`;
	await dbClient.query('BEGIN');

	await dbClient.query(`
      CREATE TEMP TABLE ${tempTableName} (
              "organizationId"  bigint            NOT NULL,
              "cardId"          bigint            NOT NULL,
              "date"            date              NOT NULL,
              "barcode"         text              NOT NULL,
              "ordersCount"     integer DEFAULT 0 NOT NULL,
              "ordersAmount"    float   DEFAULT 0 NOT NULL,
              "allOrdersCount"  integer DEFAULT 0 NOT NULL,
              "allOrdersAmount" float   DEFAULT 0 NOT NULL,
              "saleCount"       integer DEFAULT 0 NOT NULL,
              "saleAmount"      float   DEFAULT 0 NOT NULL,
              "logistic"        float   DEFAULT 0 NOT NULL,
              "commission"      float   DEFAULT 0 NOT NULL,
              "remains"         integer DEFAULT 0 NOT NULL,
              PRIMARY KEY ("cardId", "date", "barcode")
          ) ON COMMIT DROP;
    `);

	// Шаг 2: Копируем данные во временную таблицу
	const copyStream = dbClient.query(copyFrom.from(`COPY ${tempTableName} ("organizationId", "cardId", "date", "barcode", 
   "ordersCount", "ordersAmount", "allOrdersCount", "allOrdersAmount", "saleCount", "saleAmount", "logistic", "commission", "remains")
   FROM STDIN WITH (FORMAT csv)`));

	const values = data.map((row) => [row.organizationId, row.cardId, row.date.toISOString(), row.barcode,
      row.ordersCount, row.ordersAmount, row.allOrdersCount, row.allOrdersAmount, row.saleCount, row.saleAmount,
      row.logistic, row.commission, row.remains].join(",") + "\n");

	const readableStream = new Readable({
		read() {
			values.forEach(row => this.push(row));
			this.push(null); // Сигнал окончания данных
		},
	});

	readableStream.pipe(copyStream);

	await new Promise((resolve, reject) => {
		copyStream.on("finish", resolve);
		copyStream.on("error", reject);
	});

   await dbClient.query(`
      INSERT INTO ${tableName} ("organizationId", "cardId", "date", "barcode", "ordersCount", "ordersAmount",
                                "allOrdersCount", "allOrdersAmount", "saleCount", "saleAmount", "logistic", "commission", "remains")
      SELECT "organizationId", "cardId", "date", "barcode", "ordersCount", "ordersAmount",
             "allOrdersCount", "allOrdersAmount", "saleCount", "saleAmount", "logistic", "commission", "remains"
      FROM ${tempTableName}
      ON CONFLICT ("cardId", "date", "barcode") DO UPDATE
      SET
         "ordersCount"     = EXCLUDED."ordersCount",
         "ordersAmount"    = EXCLUDED."ordersAmount",
         "allOrdersCount"  = EXCLUDED."allOrdersCount",
         "allOrdersAmount" = EXCLUDED."allOrdersAmount",
         "saleCount"       = EXCLUDED."saleCount",
         "saleAmount"      = EXCLUDED."saleAmount",
         "logistic"        = EXCLUDED."logistic",
         "commission"      = EXCLUDED."commission",
         "remains"         = EXCLUDED."remains";
    `);

	// Завершаем транзакцию
	await dbClient.query('COMMIT');
};
