import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { getConfig } from "../config";
import * as schema from "./schema";
const client = postgres(getConfig().databaseUrl);
// biome-ignore lint: shadowing is intentional
declare const globalThis: {
	db: ReturnType<typeof drizzleSingleton>;
} & typeof global;
const drizzleSingleton = () => drizzle(client, { schema });

const db = globalThis.db ?? drizzleSingleton();
export { db, client };
if (process.env.NODE_ENV !== "production") globalThis.db = db;
export * from "./schema";
