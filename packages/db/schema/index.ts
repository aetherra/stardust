import { relations } from "drizzle-orm";
import { pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { user } from "./auth";

export type SelectUser = typeof user.$inferSelect;
export const userRelations = relations(user, ({ many }) => ({
	session: many(session),
}));
export const workspace = pgTable("workspace", {
	dockerImage: text("dockerImage").primaryKey().notNull(),
	friendlyName: text("friendlyName").notNull(),
	category: text("category").array(),
	icon: text("icon").notNull(),
});
export type SelectWorkspace = typeof workspace.$inferSelect;
export const workspaceRelations = relations(workspace, ({ many }) => ({
	session: many(session),
}));
export const session = pgTable("session", {
	id: text("id").primaryKey().notNull(),
	dockerImage: text("dockerImage").notNull(),
	node: text("node").notNull(),
	createdAt: timestamp("createdAt").notNull(),
	expiresAt: timestamp("expiresAt").notNull(),
	userId: text("userId")
		.notNull()
		.references(() => user.id),
});
export type SelectSession = typeof session.$inferSelect;
export const sessionRelations = relations(session, ({ one }) => ({
	user: one(user, {
		fields: [session.userId],
		references: [user.id],
	}),
	workspace: one(workspace, {
		fields: [session.dockerImage],
		references: [workspace.dockerImage],
	}),
}));
export * from "./auth";
