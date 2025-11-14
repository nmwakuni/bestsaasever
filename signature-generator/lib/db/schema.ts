import { pgTable, text, serial, timestamp, boolean, integer, jsonb } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// Users table (Better Auth will handle this)
export const users = pgTable("users", {
  id: text("id").primaryKey(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").default(false),
  name: text("name"),
  image: text("image"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Sessions table (Better Auth)
export const sessions = pgTable("sessions", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Accounts table (Better Auth - for OAuth)
export const accounts = pgTable("accounts", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  expiresAt: timestamp("expires_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Subscriptions table
export const subscriptions = pgTable("subscriptions", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  tier: text("tier").notNull().default("free"), // free, pro, business
  status: text("status").notNull().default("active"), // active, cancelled, expired
  pesapalTransactionId: text("pesapal_transaction_id"),
  pesapalOrderId: text("pesapal_order_id"),
  amount: integer("amount"), // in cents
  currency: text("currency").default("KES"),
  startDate: timestamp("start_date").defaultNow(),
  endDate: timestamp("end_date"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Signatures table
export const signatures = pgTable("signatures", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  name: text("name").notNull(), // e.g., "Work Signature", "Personal"
  fullName: text("full_name").notNull(),
  jobTitle: text("job_title"),
  company: text("company"),
  email: text("email"),
  phone: text("phone"),
  website: text("website"),
  address: text("address"),
  linkedin: text("linkedin"),
  twitter: text("twitter"),
  instagram: text("instagram"),
  facebook: text("facebook"),
  github: text("github"),
  template: text("template").notNull().default("modern"),
  customColors: jsonb("custom_colors"), // { primary: "#000", secondary: "#fff", etc }
  logoUrl: text("logo_url"),
  profilePhotoUrl: text("profile_photo_url"),
  qrCodeData: text("qr_code_data"), // URL or vCard data for QR code
  includeQrCode: boolean("include_qr_code").default(false),
  customHtml: text("custom_html"), // For advanced users
  isDefault: boolean("is_default").default(false),
  clicks: integer("clicks").default(0), // Track total clicks
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Click analytics table
export const clickAnalytics = pgTable("click_analytics", {
  id: serial("id").primaryKey(),
  signatureId: integer("signature_id").notNull().references(() => signatures.id, { onDelete: "cascade" }),
  linkType: text("link_type").notNull(), // email, phone, website, linkedin, twitter, etc
  linkUrl: text("link_url"),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  country: text("country"),
  city: text("city"),
  referrer: text("referrer"),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
});

// Payment transactions table
export const transactions = pgTable("transactions", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  subscriptionId: integer("subscription_id").references(() => subscriptions.id),
  pesapalTransactionId: text("pesapal_transaction_id").unique(),
  pesapalOrderId: text("pesapal_order_id"),
  amount: integer("amount").notNull(),
  currency: text("currency").notNull().default("KES"),
  status: text("status").notNull().default("pending"), // pending, completed, failed, cancelled
  paymentMethod: text("payment_method"), // mpesa, card, airtel_money, etc
  description: text("description"),
  metadata: jsonb("metadata"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  signatures: many(signatures),
  subscriptions: many(subscriptions),
  sessions: many(sessions),
  accounts: many(accounts),
  transactions: many(transactions),
}));

export const signaturesRelations = relations(signatures, ({ one, many }) => ({
  user: one(users, {
    fields: [signatures.userId],
    references: [users.id],
  }),
  analytics: many(clickAnalytics),
}));

export const subscriptionsRelations = relations(subscriptions, ({ one, many }) => ({
  user: one(users, {
    fields: [subscriptions.userId],
    references: [users.id],
  }),
  transactions: many(transactions),
}));

export const clickAnalyticsRelations = relations(clickAnalytics, ({ one }) => ({
  signature: one(signatures, {
    fields: [clickAnalytics.signatureId],
    references: [signatures.id],
  }),
}));

export const transactionsRelations = relations(transactions, ({ one }) => ({
  user: one(users, {
    fields: [transactions.userId],
    references: [users.id],
  }),
  subscription: one(subscriptions, {
    fields: [transactions.subscriptionId],
    references: [subscriptions.id],
  }),
}));
