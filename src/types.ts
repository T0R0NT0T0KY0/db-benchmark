export type StatsData = {
	cardId: bigint;
	organizationId: bigint;
	date: Date;
	barcode: string;
	ordersCount: number;
	ordersAmount: number;
	allOrdersCount: number;
	allOrdersAmount: number;
	saleCount: number;
	saleAmount: number;
	remains: number;
	logistic: number;
	commission: number;
}
