import { getConfig } from "@stardust/config";
import db from "@stardust/db";
import * as authSchema from "@stardust/db/schema/auth";
import { hash, verify } from "argon2";
import { type BetterAuthPlugin, betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";
import { admin } from "better-auth/plugins";
const { auth: config } = getConfig();
const conditionalPlugins: BetterAuthPlugin[] = [];
if (typeof process.env.NEXT_RUNTIME !== "undefined") conditionalPlugins.push(nextCookies());
const auth = betterAuth({
	appName: "Stardust",
	secret: config.secret,
	database: drizzleAdapter(db, {
		provider: "pg",
		schema: {
			...authSchema,
			session: authSchema.authSession,
		},
	}),
	plugins: [admin(), ...conditionalPlugins],
	emailAndPassword: {
		enabled: true,
		autoSignIn: false,
		password: {
			hash,
			async verify({ hash, password }) {
				return await verify(hash, password);
			},
		},
	},
	socialProviders: config.oauth?.providers,
});
export type SessionSchema = typeof auth.$Infer.Session;
export default auth;
