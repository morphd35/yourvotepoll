import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
export const trafficDaily = sqliteTable('traffic_daily', {
 day: text('day').primaryKey(),
 visitors: integer('visitors').notNull().default(0),
});
