import { getConfig } from "@stardust/config";
import db from "@stardust/db";
import * as authSchema from "@stardust/db/schema/auth.js";
import { APIError, type BetterAuthPlugin, betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";
import { admin, createAuthMiddleware } from "better-auth/plugins";
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
		enabled: config.credentials?.enabled || false,
		autoSignIn: false,
	},
	socialProviders: config.oauth?.providers,
	hooks: {
		before: createAuthMiddleware(async (ctx) => {
			if (ctx.path !== "/sign-up/email" || config.credentials?.signups) {
				return;
			}
			throw new APIError("BAD_REQUEST", {
				message: "Signups are disabled",
			});
		}),
	},
	user: {
		deleteUser: {
			enabled: true,
		},
	},
});
export type SessionSchema = typeof auth.$Infer.Session;
export default auth;
