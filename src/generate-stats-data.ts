import { faker } from "@faker-js/faker";
import { StatsData } from "./types.js";

export const generateStatsData = (count: number) => {
	const data: StatsData[] = [];

	for (let i = 0; i < count; i++) {
		data.push({
			cardId: faker.number.bigInt({ min: 1 }),
			organizationId: faker.number.bigInt({ min: 1 }),
			date: faker.date.past(),
			barcode: faker.string.numeric({ length: 13 }),
			ordersCount: faker.number.int({ min: 0, max: 2147483646 }),
			ordersAmount: faker.number.float({ min: 0, max: 2147483646 }),
			allOrdersCount: faker.number.int({ min: 0, max: 2147483646 }),
			allOrdersAmount: faker.number.float({ min: 0, max: 2147483646 }),
			saleCount: faker.number.int({ min: 0, max: 2147483646 }),
			saleAmount: faker.number.float({ min: 0, max: 2147483646 }),
			remains: faker.number.int({ min: 0, max: 2147483646 }),
			logistic: faker.number.float({ min: 0, max: 2147483646 }),
			commission: faker.number.float({ min: 0, max: 2147483646 }),
		});
	}

	return data;
};
