import {
  boolean,
  index,
  integer,
  json,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { userRoleEnum, wholesaleStatusEnum } from "./enums.js";
import { wholesaleGroups } from "./wholesale-groups.js";

export const users = pgTable(
  "users",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    fullName: varchar("full_name", { length: 255 }).notNull(),
    email: varchar("email", { length: 255 }).unique(),
    mobile: varchar("mobile", { length: 20 }).notNull().unique(),
    passwordHash: text("password_hash"),
    isVerified: boolean("is_verified").default(false).notNull(),
    otpCode: varchar("otp_code", { length: 10 }),
    otpExpiresAt: timestamp("otp_expires_at", { withTimezone: true }),
    otpAttempts: integer("otp_attempts").default(0).notNull(),
    role: userRoleEnum("role").notNull().default("retail"),
    wholesaleStatus: wholesaleStatusEnum("wholesale_status").notNull().default("none"),
    wholesaleGroupId: uuid("wholesale_group_id").references(() => wholesaleGroups.id, {
      onDelete: "set null",
    }),
    rayanCoins: integer("rayan_coins").default(0).notNull(),
    pwaBonusClaimed: boolean("pwa_bonus_claimed").default(false).notNull(),
    /** JSONB array of saved delivery addresses */
    addresses:
      json("addresses").$type<
        Array<{
          id: string;
          title: string;
          recipientName: string;
          phone: string;
          province: string;
          city: string;
          postalCode: string;
          fullAddress: string;
          isDefault: boolean;
        }>
      >(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index("users_role_idx").on(table.role),
    index("users_wholesale_group_idx").on(table.wholesaleGroupId),
  ],
);
