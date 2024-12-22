import type { BuildQueryResult, DBQueryConfig, ExtractTablesWithRelations } from "drizzle-orm";
import type * as schema from "./schema";

type TSchema = ExtractTablesWithRelations<typeof schema>;

export type QueryConfig<TableName extends keyof TSchema> = DBQueryConfig<
	"one" | "many",
	boolean,
	TSchema,
	TSchema[TableName]
>;
export type InferQueryModel<
	TableName extends keyof TSchema,
	// biome-ignore lint:
	QBConfig extends QueryConfig<TableName> = {},
> = BuildQueryResult<TSchema, TSchema[TableName], QBConfig>;
export type SelectSessionRelation = InferQueryModel<
	"session",
	{
		with: {
			user: true;
		};
	}
>;
export type SelectUserRelation = InferQueryModel<
	"user",
	{
		with: {
			session: true;
		};
	}
>;
export type SelectImageRelation = InferQueryModel<
	"image",
	{
		with: {
			session: true;
		};
	}
>;
