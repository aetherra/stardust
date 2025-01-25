import { getConfig } from "@stardust/config";
import { type PostgresJsDatabase, drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";
const client = postgres(getConfig().databaseUrl);
// biome-ignore lint: shadowing is intentional
declare const globalThis: {
	db: ReturnType<typeof drizzleSingleton>;
} & typeof global;
const drizzleSingleton = () => drizzle(client, { schema });

const db = globalThis.db ?? drizzleSingleton();
export { db as default, client };
export * from "./schema";
export type DrizzleClient = PostgresJsDatabase<typeof schema>;
if (process.env.NODE_ENV !== "production") globalThis.db = db;
