import { writeFile } from "node:fs/promises";
import { Bench, Task, FnOptions } from "tinybench";
import { dbClient } from "./db-client.js";
import { generateStatsData } from "./generate-stats-data.js";
import { resetTable } from "./reset-table.js";
import { StatsData } from "./types.js";
import { upsertBatch } from "./upsert/batch-values.js";
import { upsertCopy } from "./upsert/copy.js";
import { upsertJsonArrayElements } from "./upsert/json-array-elements.js";
import { upsertJsonPopulateRecordset } from "./upsert/json-populate-recordset.js";
import { upsertJsonbArrayElements } from "./upsert/jsonb-array-elements.js";
import { upsertJsonbPopulateRecordset } from "./upsert/jsonb-populate-recordset.js";
import { upsertSingleRow } from "./upsert/single-row.js";
import tablemark from "tablemark"


// @ts-ignore
BigInt.prototype.toJSON = function () {
	return String(this);
};


const runBenchmark = async () => {
	await dbClient.connect();
	let data: StatsData[];
	let index = 0;
	let tableName: string;

	const bench = new Bench({ time: 60000, iterations: 10 });

	const fnOpts: FnOptions = {
		async beforeAll(this: Task) {
			index = 0;
			console.log(`\n\n${this.name}`);
			tableName = this.name.replace(/\s/g, "_").toLowerCase();
			await resetTable(tableName);
		},
		beforeEach() {
			console.log(`iteration: ${++index}`);

			if (index > 1) {
				// add duplicates from previous insert
				data = [...data.slice(0, 10_000), ...generateStatsData(20_000)];
			} else {
				data = generateStatsData(30000);
			}
		}
	};

	bench
		.add(
			"Single Row Insert",
			async () => {
				await upsertSingleRow(data, tableName);
			},
			fnOpts
		)
		.add(
			"Batch Insert",
			async () => {
				await upsertBatch(data, tableName);
			},
			fnOpts
		)
		.add(
			"JSON Populate Recordset",
			async () => {
				await upsertJsonPopulateRecordset(data, tableName);
			},
			fnOpts
		)
		.add(
			"JSONB Populate Recordset",
			async () => {
				await upsertJsonbPopulateRecordset(data, tableName);
			},
			fnOpts
		)
		.add(
			"JSON Array Elements",
			async () => {
				await upsertJsonArrayElements(data, tableName);
			},
			fnOpts
		)
		.add(
			"JSONB Array Elements",
			async () => {
				await upsertJsonbArrayElements(data, tableName);
			},
			fnOpts
		)
		.add(
			"Copy",
			async () => {
				await upsertCopy(data, tableName);
			},
			fnOpts
		);

	await bench.run();

	const table = bench.table().filter(Boolean) as Record<string, string | number>[];
	console.table(table);

	const tableMd = tablemark(table, {
		columns: Object.keys(table[0] as object).map((name) => ({ name, align: 'center' })),
	});

	const markdown = `# Benchmark 30_000 Elements \n\n${tableMd}`;

	await writeFile(`${process.cwd()}/benchmark.md`, markdown);

};

runBenchmark();

