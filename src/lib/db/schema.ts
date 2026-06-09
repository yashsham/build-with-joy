import { sql } from "drizzle-orm";
import { text, integer, real, sqliteTable, uniqueIndex } from "drizzle-orm/sqlite-core";

// USERS
export const users = sqliteTable("users", {
  id:        text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  name:      text("name").notNull(),
  email:     text("email").notNull().unique(),
  phone:     text("phone").notNull().unique(),
  password:  text("password"),
  avatar:    text("avatar"),
  role:      text("role", { enum: ["customer", "professional", "admin"] }).default("customer"),
  createdAt: integer("created_at", { mode: "timestamp" }).default(sql`(unixepoch())`),
}, t => ({
  emailIdx: uniqueIndex("email_idx").on(t.email),
  phoneIdx: uniqueIndex("phone_idx").on(t.phone)
}));

// SERVICE CATEGORIES (Female Salon, Spa, Hair, Bridal, Male, etc.)
export const categories = sqliteTable("categories", {
  id:          text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  name:        text("name").notNull(),
  slug:        text("slug").notNull().unique(),
  image:       text("image"),
  description: text("description"),
  gender:      text("gender", { enum: ["female", "male", "unisex"] }).default("unisex"),
  sortOrder:   integer("sort_order").default(0),
  isActive:    integer("is_active", { mode: "boolean" }).default(true),
});

// SERVICES
export const services = sqliteTable("services", {
  id:            text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  name:          text("name").notNull(),
  slug:          text("slug").notNull().unique(),
  description:   text("description"),
  duration:      integer("duration").notNull(),    // minutes
  price:         real("price").notNull(),
  discountPrice: real("discount_price"),
  image:         text("image"),
  categoryId:    text("category_id").references(() => categories.id),
  gender:        text("gender", { enum: ["female", "male", "unisex"] }).default("female"),
  isActive:      integer("is_active", { mode: "boolean" }).default(true),
  isFeatured:    integer("is_featured", { mode: "boolean" }).default(false),
  sortOrder:     integer("sort_order").default(0),
  createdAt:     integer("created_at", { mode: "timestamp" }).default(sql`(unixepoch())`),
});

// PROFESSIONALS
export const professionals = sqliteTable("professionals", {
  id:           text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  userId:       text("user_id").references(() => users.id).notNull(),
  bio:          text("bio"),
  experience:   integer("experience").default(0),
  rating:       real("rating").default(0),
  totalReviews: integer("total_reviews").default(0),
  isVerified:   integer("is_verified", { mode: "boolean" }).default(false),
  isActive:     integer("is_active", { mode: "boolean" }).default(true),
  cities:       text("cities"),  // JSON: ["dehradun","delhi"]
  services:     text("services"), // JSON: service IDs they offer
  createdAt:    integer("created_at", { mode: "timestamp" }).default(sql`(unixepoch())`),
});

// ADDRESSES
export const addresses = sqliteTable("addresses", {
  id:        text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  userId:    text("user_id").references(() => users.id).notNull(),
  label:     text("label").default("Home"),
  line1:     text("line1").notNull(),
  line2:     text("line2"),
  city:      text("city").notNull(),
  pincode:   text("pincode").notNull(),
  lat:       real("lat"),
  lng:       real("lng"),
  isDefault: integer("is_default", { mode: "boolean" }).default(false),
});

// BOOKINGS
export const bookings = sqliteTable("bookings", {
  id:             text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  bookingNumber:  text("booking_number").notNull().unique(), // HRM-2025-XXXXX
  userId:         text("user_id").references(() => users.id).notNull(),
  professionalId: text("professional_id").references(() => professionals.id),
  addressId:      text("address_id").references(() => addresses.id).notNull(),
  scheduledAt:    integer("scheduled_at", { mode: "timestamp" }).notNull(),
  status:         text("status", {
                    enum: ["pending", "confirmed", "assigned", "in_progress", "completed", "cancelled"]
                  }).default("pending"),
  totalAmount:    real("total_amount").notNull(),
  discountAmount: real("discount_amount").default(0),
  paymentStatus:  text("payment_status", {
                    enum: ["pending", "paid", "cash_on_service", "refunded", "failed"]
                  }).default("pending"),
  paymentId:      text("payment_id"),        // Razorpay payment ID
  razorpayOrderId:text("razorpay_order_id"), // Razorpay order ID
  promoCode:      text("promo_code"),
  notes:          text("notes"),
  createdAt:      integer("created_at", { mode: "timestamp" }).default(sql`(unixepoch())`),
});

// BOOKING ITEMS (services in a booking)
export const bookingItems = sqliteTable("booking_items", {
  id:        text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  bookingId: text("booking_id").references(() => bookings.id).notNull(),
  serviceId: text("service_id").references(() => services.id).notNull(),
  quantity:  integer("quantity").default(1),
  price:     real("price").notNull(),  // snapshot of price at booking time
  name:      text("name").notNull(),   // snapshot of service name
});

// REVIEWS
export const reviews = sqliteTable("reviews", {
  id:             text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  bookingId:      text("booking_id").references(() => bookings.id).notNull().unique(),
  userId:         text("user_id").references(() => users.id).notNull(),
  professionalId: text("professional_id"),
  rating:         integer("rating").notNull(),   // 1-5
  comment:        text("comment"),
  isApproved:     integer("is_approved", { mode: "boolean" }).default(true),
  createdAt:      integer("created_at", { mode: "timestamp" }).default(sql`(unixepoch())`),
});

// CITIES
export const cities = sqliteTable("cities", {
  id:        text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  name:      text("name").notNull(),
  slug:      text("slug").notNull().unique(),
  state:     text("state"),
  isActive:  integer("is_active", { mode: "boolean" }).default(true),
  metaTitle: text("meta_title"),
  metaDesc:  text("meta_desc"),
});

// PROMO CODES
export const promoCodes = sqliteTable("promo_codes", {
  id:             text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  code:           text("code").notNull().unique(),
  discountType:   text("discount_type", { enum: ["percentage", "fixed"] }).notNull(),
  discountValue:  real("discount_value").notNull(),
  minOrderValue:  real("min_order_value").default(0),
  maxUses:        integer("max_uses"),
  usedCount:      integer("used_count").default(0),
  expiresAt:      integer("expires_at", { mode: "timestamp" }),
  isActive:       integer("is_active", { mode: "boolean" }).default(true),
});

// OTP
export const otps = sqliteTable("otps", {
  id:        text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  phone:     text("phone").notNull(),
  otp:       text("otp").notNull(),
  expiresAt: integer("expires_at", { mode: "timestamp" }).notNull(),
  verified:  integer("verified", { mode: "boolean" }).default(false),
  attempts:  integer("attempts").default(0),
});

// BLOGS
export const blogs = sqliteTable("blogs", {
  id:          text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  title:       text("title").notNull(),
  slug:        text("slug").notNull().unique(),
  content:     text("content").notNull(),   // Markdown
  excerpt:     text("excerpt"),
  image:       text("image"),
  authorId:    text("author_id"),
  publishedAt: integer("published_at", { mode: "timestamp" }),
  createdAt:   integer("created_at", { mode: "timestamp" }).default(sql`(unixepoch())`),
});

// NOTIFY ME (city expansion waitlist)
export const cityWaitlist = sqliteTable("city_waitlist", {
  id:        text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  email:     text("email").notNull(),
  city:      text("city"),
  createdAt: integer("created_at", { mode: "timestamp" }).default(sql`(unixepoch())`),
});
