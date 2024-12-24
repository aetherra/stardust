import { relations } from 'drizzle-orm'
import { bigint, boolean, pgTable, text } from 'drizzle-orm/pg-core'

export const user = pgTable('User', {
  email: text('email').notNull().unique(),
  password: text('password'),
  name: text('name'),
  isAdmin: boolean('isAdmin').default(false).notNull(),
  id: text('id').primaryKey().notNull().unique()
})
export type SelectUser = typeof user.$inferSelect
export const userRelations = relations(user, ({ many }) => ({
  session: many(session)
}))
export const image = pgTable('Image', {
  dockerImage: text('dockerImage').primaryKey().notNull(),
  friendlyName: text('friendlyName').notNull(),
  category: text('category').array(),
  icon: text('icon').notNull()
})
export type SelectImage = typeof image.$inferSelect
export const imageRelations = relations(image, ({ many }) => ({
  session: many(session)
}))
export const session = pgTable('Session', {
  id: text('id').primaryKey().notNull(),
  dockerImage: text('dockerImage').notNull(),
  createdAt: bigint('createdAt', { mode: 'number' }).notNull(),
  expiresAt: bigint('expiresAt', { mode: 'number' }).notNull(),
  userId: text('userId')
    .notNull()
    .references(() => user.id)
})
export type SelectSession = typeof session.$inferSelect
export const sessionRelations = relations(session, ({ one }) => ({
  user: one(user, {
    fields: [session.userId],
    references: [user.id]
  }),
  image: one(image, {
    fields: [session.dockerImage],
    references: [image.dockerImage]
  })
}))
