import { getConfig } from "@stardust/config";
import db from "@stardust/db";
import * as authSchema from "@stardust/db/schema/auth";
import { type BetterAuthPlugin, betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";
import { admin, createAuthMiddleware } from "better-auth/plugins";
import { APIError } from "better-call";
const { auth: config } = getConfig();
const conditionalPlugins: BetterAuthPlugin[] = [];
if (typeof process.env.NEXT_RUNTIME !== "undefined") conditionalPlugins.push(nextCookies());
const auth = betterAuth({
	appName: "Stardust",
	secret: config.secret,
	trustedOrigins: config.trustedOrigins,
	database: drizzleAdapter(db, {
		provider: "pg",
		schema: {
			...authSchema,
			session: authSchema.authSession,
		},
	}),
	plugins: [admin(), ...conditionalPlugins],
	emailAndPassword: {
		enabled: config.credentials?.enabled || false,
		autoSignIn: false,
	},
	socialProviders: config.oauth?.providers,
	hooks: {
		before: createAuthMiddleware(async (ctx) => {
			if (ctx.path.startsWith("/sign-up") && !config.credentials?.signups) {
				throw new APIError("BAD_REQUEST", {
					message: "Signups are disabled",
				});
			}
			return;
		}),
	},
});
export type SessionSchema = typeof auth.$Infer.Session;
export default auth;
