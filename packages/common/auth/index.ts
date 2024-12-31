import { db } from "@stardust/db";
import * as authSchema from "@stardust/db/schema/auth";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
export default betterAuth({
	database: drizzleAdapter(db, {
		provider: "pg",
		schema: {
			...authSchema,
			session: authSchema.authSession,
		},
	}),
	emailAndPassword: {
		enabled: true,
	},
	user: {
		additionalFields: {
			administrator: {
				type: "boolean",
				required: false,
			},
		},
	},
});
