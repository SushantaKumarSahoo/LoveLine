import { pgTable, text, serial, boolean, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const phoneChecks = pgTable("phone_checks", {
  id: serial("id").primaryKey(),
  phoneNumber: text("phone_number").notNull(),
  countryCode: text("country_code").notNull(),
  countryIso2: text("country_iso2").notNull(),
  carrier: text("carrier"),
  lineType: text("line_type"),
  isAvailable: boolean("is_available"),
  rawResponse: json("raw_response"),
  createdAt: text("created_at").notNull()
});

export const insertPhoneCheckSchema = createInsertSchema(phoneChecks).pick({
  phoneNumber: true,
  countryCode: true,
  countryIso2: true,
  carrier: true,
  lineType: true,
  isAvailable: true,
  rawResponse: true
});

export type InsertPhoneCheck = z.infer<typeof insertPhoneCheckSchema>;
export type PhoneCheck = typeof phoneChecks.$inferSelect;
