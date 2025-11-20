import {
  pgTable,
  text,
  varchar,
  timestamp,
  jsonb,
  index,
  serial,
  integer,
  decimal,
  boolean,
  date
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

// Session storage table - mandatory for Replit Auth
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table - mandatory for Replit Auth
export const users = pgTable("users", {
  id: varchar("id").primaryKey().notNull(),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  phone: varchar("phone"),
  address: text("address"),
  role: varchar("role").notNull().default("customer"), // customer, admin, vendor, delivery, marketing_staff
  isActive: boolean("is_active").default(true),
  walletBalance: decimal("wallet_balance", { precision: 10, scale: 2 }).default("0"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Enhanced products with vendor-specific availability
export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  name: varchar("name").notNull(),
  sku: varchar("sku").unique(),
  description: text("description"),
  category: varchar("category").notNull(), // MILK, DAIRY
  type: varchar("type").notNull(), // MILK, DAIRY
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  unit: varchar("unit").notNull(), // L, kg, g, piece
  stock: integer("stock").default(0),
  expiryDate: date("expiry_date"),
  imageUrl: varchar("image_url"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

// Enhanced vendors with hierarchy and KPI fields
export const vendors = pgTable("vendors", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").references(() => users.id),
  businessName: varchar("business_name").notNull(),
  licenseNumber: varchar("license_number"),
  locationName: varchar("location_name").notNull(), // Borivali, Santa Cruz, Andheri etc.
  vendorType: varchar("vendor_type").notNull().default("SUB_VENDOR"), // HEAD_VENDOR, VENDOR, SUB_VENDOR
  headVendorId: integer("head_vendor_id"), // self-reference, will add constraint later
  parentVendorId: integer("parent_vendor_id"), // self-reference, will add constraint later
  dailyCapacity: integer("daily_capacity"), // in liters
  currentQuota: integer("current_quota").default(0),
  requirementToday: integer("requirement_today").default(0),
  requirementTomorrowForecast: integer("requirement_tomorrow_forecast").default(0),
  circulatedLiters: integer("circulated_liters").default(0),
  revenueToday: decimal("revenue_today", { precision: 10, scale: 2 }).default("0"),
  revenueTotal: decimal("revenue_total", { precision: 10, scale: 2 }).default("0"),
  paymentsPending: decimal("payments_pending", { precision: 10, scale: 2 }).default("0"),
  weeklyEarnings: decimal("weekly_earnings", { precision: 10, scale: 2 }).default("0"),
  monthlyEarnings: decimal("monthly_earnings", { precision: 10, scale: 2 }).default("0"),
  zone: varchar("zone"),
  isVerified: boolean("is_verified").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const deliveryPartners = pgTable("delivery_partners", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").references(() => users.id),
  vehicleType: varchar("vehicle_type"),
  licenseNumber: varchar("license_number"),
  zone: varchar("zone"),
  isAvailable: boolean("is_available").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

// Driver entity for vendor staff
export const drivers = pgTable("drivers", {
  id: serial("id").primaryKey(),
  name: varchar("name").notNull(),
  age: integer("age").notNull(),
  phone: varchar("phone").notNull(),
  aadharUrl: varchar("aadhar_url"), // optional KYC document
  panUrl: varchar("pan_url"), // optional KYC document
  vendorId: integer("vendor_id").references(() => vendors.id).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Admin hierarchy with role-based permissions and location scoping
export const admins = pgTable("admins", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").references(() => users.id).notNull(),
  name: varchar("name").notNull(),
  phone: varchar("phone").notNull(),
  role: varchar("role").notNull(), // SUPER, HEAD, SUB
  locationScope: jsonb("location_scope"), // array of location strings
  permissions: jsonb("permissions").notNull(), // permission flags object
  createdByUserId: varchar("created_by_user_id").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
});

// Delegation logs for order reassignment audit trail
export const delegationLogs = pgTable("delegation_logs", {
  id: serial("id").primaryKey(),
  fromVendorId: integer("from_vendor_id").references(() => vendors.id).notNull(),
  toVendorId: integer("to_vendor_id").references(() => vendors.id).notNull(),
  orderIds: jsonb("order_ids").notNull(), // array of order IDs
  delegatedByAdminId: integer("delegated_by_admin_id").references(() => admins.id).notNull(),
  reason: text("reason").notNull(),
  timestamp: timestamp("timestamp").defaultNow(),
});

// Enhanced orders with delegation support
export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").references(() => users.id),
  vendorId: integer("vendor_id").references(() => vendors.id),
  deliveryPartnerId: integer("delivery_partner_id").references(() => deliveryPartners.id),
  totalAmount: decimal("total_amount", { precision: 10, scale: 2 }).notNull(),
  liters: integer("liters").default(0), // total milk liters in order
  status: varchar("status").notNull().default("PLACED"), // PLACED, PREPARING, OUT, DELIVERED, FAILED
  deliverySlot: varchar("delivery_slot"), // morning, evening etc.
  deliveryDate: date("delivery_date").notNull(),
  deliveryTime: varchar("delivery_time"),
  deliveryAddress: text("delivery_address").notNull(),
  paymentStatus: varchar("payment_status").default("pending"), // pending, paid, failed
  delegationLogId: integer("delegation_log_id").references(() => delegationLogs.id),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const orderItems = pgTable("order_items", {
  id: serial("id").primaryKey(),
  orderId: integer("order_id").references(() => orders.id),
  productId: integer("product_id").references(() => products.id),
  quantity: integer("quantity").notNull(),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  totalPrice: decimal("total_price", { precision: 10, scale: 2 }).notNull(),
});

// Enhanced milk subscriptions - preserving existing structure and adding new fields
export const milkSubscriptions = pgTable("milk_subscriptions", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").references(() => users.id),
  quantity: integer("quantity").notNull(), // keeping existing column
  frequency: varchar("frequency").notNull(), // daily, alternate, weekly
  deliveryTime: varchar("delivery_time").notNull(),
  startDate: date("start_date").notNull(),
  endDate: date("end_date"),
  isActive: boolean("is_active").default(true),
  isPaused: boolean("is_paused").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  // New enhanced fields
  vendorId: integer("vendor_id").references(() => vendors.id),
  slot: varchar("slot"), // morning, evening
  pauseRange: jsonb("pause_range"), // {from: date, to: date}
  pricePerL: decimal("price_per_l", { precision: 10, scale: 2 }),
  status: varchar("status").default("ACTIVE"), // ACTIVE, PAUSED, CANCELLED
});

export const vendorSupply = pgTable("vendor_supply", {
  id: serial("id").primaryKey(),
  vendorId: integer("vendor_id").references(() => vendors.id),
  date: date("date").notNull(),
  requiredQuantity: integer("required_quantity"), // assigned by admin
  confirmedQuantity: integer("confirmed_quantity"), // confirmed by vendor
  actualQuantity: integer("actual_quantity"), // delivered quantity
  notes: text("notes"),
  status: varchar("status").default("pending"), // pending, confirmed, delivered
  createdAt: timestamp("created_at").defaultNow(),
});

// Inward logs for vendor submissions to admin
export const inwardLogs = pgTable("inward_logs", {
  id: serial("id").primaryKey(),
  vendorId: integer("vendor_id").references(() => vendors.id).notNull(),
  litersArrived: integer("liters_arrived").notNull(),
  litersDelivered: integer("liters_delivered").notNull(),
  litersPending: integer("liters_pending").notNull(),
  driverInfo: jsonb("driver_info").notNull(), // {name, age, phone, aadharUrl?, panUrl?}
  reportedByUserId: varchar("reported_by_user_id").references(() => users.id).notNull(),
  sentToAdmin: boolean("sent_to_admin").default(false),
  status: varchar("status").default("PENDING"), // PENDING, APPROVED, REJECTED
  adminComments: text("admin_comments"),
  approvedByUserId: varchar("approved_by_user_id").references(() => users.id),
  approvedAt: timestamp("approved_at"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Daily vendor performance tracking for detailed analytics
export const dailyVendorPerformance = pgTable("daily_vendor_performance", {
  id: serial("id").primaryKey(),
  vendorId: integer("vendor_id").references(() => vendors.id).notNull(),
  date: date("date").notNull(),
  requirementSet: integer("requirement_set").default(0), // what was originally required
  milkCirculated: integer("milk_circulated").default(0), // what was actually received/procured
  milkDelivered: integer("milk_delivered").default(0), // what was delivered to customers
  milkPending: integer("milk_pending").default(0), // what's pending delivery
  totalEarnings: decimal("total_earnings", { precision: 10, scale: 2 }).default("0"),
  deliveryCompletionRate: decimal("delivery_completion_rate", { precision: 5, scale: 2 }).default("0"), // percentage
  paymentReceived: decimal("payment_received", { precision: 10, scale: 2 }).default("0"),
  paymentDue: decimal("payment_due", { precision: 10, scale: 2 }).default("0"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Enhanced delivery partner assignment and tracking
export const vendorDeliveryAssignments = pgTable("vendor_delivery_assignments", {
  id: serial("id").primaryKey(),
  vendorId: integer("vendor_id").references(() => vendors.id).notNull(),
  deliveryPartnerId: integer("delivery_partner_id").references(() => drivers.id).notNull(),
  assignmentDate: date("assignment_date").notNull(),
  deliveryStatus: varchar("delivery_status").default("PENDING"), // PENDING, IN_PROGRESS, COMPLETED, FAILED
  route: text("route"), // delivery route information
  assignedLiters: integer("assigned_liters").default(0),
  deliveredLiters: integer("delivered_liters").default(0),
  completedAt: timestamp("completed_at"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Vendor requirements and forecasting
export const vendorRequirements = pgTable("vendor_requirements", {
  id: serial("id").primaryKey(),
  vendorId: integer("vendor_id").references(() => vendors.id).notNull(),
  date: date("date").notNull(),
  requiredLiters: integer("required_liters").notNull(),
  forecastType: varchar("forecast_type").notNull().default("MANUAL"), // MANUAL, AI, HISTORICAL
  actualDemand: integer("actual_demand").default(0), // actual demand that day
  demandFulfilled: integer("demand_fulfilled").default(0), // how much was actually fulfilled
  shortfall: integer("shortfall").default(0), // difference between demand and fulfillment
  fulfillmentRate: decimal("fulfillment_rate", { precision: 5, scale: 2 }).default("0"), // percentage
  submittedByUserId: varchar("submitted_by_user_id").references(() => users.id).notNull(),
  isSubmitted: boolean("is_submitted").default(false),
  submittedAt: timestamp("submitted_at"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Marketing staff for offline order tracking
export const marketingStaff = pgTable("marketing_staff", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").references(() => users.id).notNull(),
  name: varchar("name").notNull(),
  role: varchar("role").default("MARKETING_EXEC"),
  assignedLocations: jsonb("assigned_locations").notNull(), // array of location strings
  createdByAdminId: integer("created_by_admin_id").references(() => admins.id).notNull(),
  offlineOrdersCaptured: jsonb("offline_orders_captured").default('[]'), // array of order IDs
  createdAt: timestamp("created_at").defaultNow(),
});

// Enhanced alerts/notifications system
export const alerts = pgTable("alerts", {
  id: serial("id").primaryKey(),
  type: varchar("type").notNull(), // DELAY, INWARD, COMPLAINT, LOW_STOCK
  scope: varchar("scope"), // location name or vendor ID
  severity: varchar("severity").notNull(), // INFO, WARNING, CRITICAL
  title: varchar("title").notNull(),
  message: text("message").notNull(),
  resolved: boolean("resolved").default(false),
  assignedToUserId: varchar("assigned_to_user_id").references(() => users.id),
  resolvedByUserId: varchar("resolved_by_user_id").references(() => users.id),
  resolvedAt: timestamp("resolved_at"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const notifications = pgTable("notifications", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").references(() => users.id),
  title: varchar("title").notNull(),
  message: text("message").notNull(),
  type: varchar("type").notNull(), // order, delivery, payment, general, alert
  isRead: boolean("is_read").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

// Shopping cart for customer orders
export const cart = pgTable("cart", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").references(() => users.id).notNull().unique(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const cartItems = pgTable("cart_items", {
  id: serial("id").primaryKey(),
  cartId: integer("cart_id").references(() => cart.id, { onDelete: 'cascade' }).notNull(),
  productId: integer("product_id").references(() => products.id).notNull(),
  quantity: integer("quantity").notNull().default(1),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  addedAt: timestamp("added_at").defaultNow(),
}, (table) => ({
  uniqueCartProduct: index("unique_cart_product").on(table.cartId, table.productId),
}));

// Customer addresses
export const addresses = pgTable("addresses", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").references(() => users.id).notNull(),
  type: varchar("type").notNull(), // home, work, other
  name: varchar("name").notNull(),
  phone: varchar("phone").notNull(),
  addressLine1: text("address_line1").notNull(),
  addressLine2: text("address_line2"),
  landmark: text("landmark"),
  city: varchar("city").notNull(),
  state: varchar("state").notNull(),
  pincode: varchar("pincode").notNull(),
  instructions: text("instructions"),
  isDefault: boolean("is_default").default(false),
  latitude: decimal("latitude", { precision: 10, scale: 7 }),
  longitude: decimal("longitude", { precision: 10, scale: 7 }),
  createdAt: timestamp("created_at").defaultNow(),
});

// Wallet transactions
export const walletTransactions = pgTable("wallet_transactions", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").references(() => users.id).notNull(),
  type: varchar("type").notNull(), // credit, debit
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  description: text("description").notNull(),
  balanceAfter: decimal("balance_after", { precision: 10, scale: 2 }).notNull(),
  referenceId: varchar("reference_id"),
  category: varchar("category"), // order, refund, cashback, topup, withdrawal
  createdAt: timestamp("created_at").defaultNow(),
});

// Offers and promotions
export const offers = pgTable("offers", {
  id: serial("id").primaryKey(),
  title: varchar("title").notNull(),
  description: text("description").notNull(),
  type: varchar("type").notNull(), // discount, cashback, bundle, seasonal
  discountType: varchar("discount_type"), // percentage, fixed
  discountValue: decimal("discount_value", { precision: 10, scale: 2 }),
  minOrderValue: decimal("min_order_value", { precision: 10, scale: 2 }),
  maxDiscount: decimal("max_discount", { precision: 10, scale: 2 }),
  validFrom: date("valid_from").notNull(),
  validTo: date("valid_to").notNull(),
  usageLimit: integer("usage_limit"),
  usageCount: integer("usage_count").default(0),
  isActive: boolean("is_active").default(true),
  imageUrl: varchar("image_url"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Coupons for customer discounts
export const coupons = pgTable("coupons", {
  id: serial("id").primaryKey(),
  code: varchar("code").unique().notNull(),
  title: varchar("title").notNull(),
  description: text("description"),
  discountType: varchar("discount_type").notNull(), // percentage, fixed
  discountValue: decimal("discount_value", { precision: 10, scale: 2 }).notNull(),
  minOrderValue: decimal("min_order_value", { precision: 10, scale: 2 }),
  maxDiscount: decimal("max_discount", { precision: 10, scale: 2 }),
  validFrom: date("valid_from").notNull(),
  validTo: date("valid_to").notNull(),
  usageLimit: integer("usage_limit"),
  usagePerUser: integer("usage_per_user").default(1),
  usageCount: integer("usage_count").default(0),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

// Customer reward points and loyalty
export const rewardPoints = pgTable("reward_points", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").references(() => users.id).notNull(),
  points: integer("points").default(0),
  tier: varchar("tier").default("silver"), // silver, gold, platinum
  lifetimePoints: integer("lifetime_points").default(0),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Referrals
export const referrals = pgTable("referrals", {
  id: serial("id").primaryKey(),
  referrerId: varchar("referrer_id").references(() => users.id).notNull(),
  referredUserId: varchar("referred_user_id").references(() => users.id),
  referralCode: varchar("referral_code").unique().notNull(),
  status: varchar("status").default("pending"), // pending, completed, rewarded
  referrerReward: decimal("referrer_reward", { precision: 10, scale: 2 }),
  referredReward: decimal("referred_reward", { precision: 10, scale: 2 }),
  createdAt: timestamp("created_at").defaultNow(),
  completedAt: timestamp("completed_at"),
});

// Customer support tickets
export const supportTickets = pgTable("support_tickets", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").references(() => users.id).notNull(),
  category: varchar("category").notNull(), // delivery, payment, quality, technical, other
  subject: varchar("subject").notNull(),
  description: text("description").notNull(),
  status: varchar("status").default("open"), // open, in_progress, resolved, closed
  priority: varchar("priority").default("medium"), // low, medium, high
  orderId: integer("order_id").references(() => orders.id),
  assignedToUserId: varchar("assigned_to_user_id").references(() => users.id),
  resolution: text("resolution"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  resolvedAt: timestamp("resolved_at"),
});

// Ticket messages for conversation
export const ticketMessages = pgTable("ticket_messages", {
  id: serial("id").primaryKey(),
  ticketId: integer("ticket_id").references(() => supportTickets.id, { onDelete: 'cascade' }).notNull(),
  userId: varchar("user_id").references(() => users.id).notNull(),
  message: text("message").notNull(),
  isStaff: boolean("is_staff").default(false),
  attachments: jsonb("attachments"),
  createdAt: timestamp("created_at").defaultNow(),
});

// FAQ entries
export const faqs = pgTable("faqs", {
  id: serial("id").primaryKey(),
  category: varchar("category").notNull(), // delivery, products, subscription, payment
  question: text("question").notNull(),
  answer: text("answer").notNull(),
  order: integer("order").default(0),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

// Order ratings and reviews
export const orderRatings = pgTable("order_ratings", {
  id: serial("id").primaryKey(),
  orderId: integer("order_id").references(() => orders.id).notNull(),
  userId: varchar("user_id").references(() => users.id).notNull(),
  productRating: integer("product_rating"), // 1-5
  deliveryRating: integer("delivery_rating"), // 1-5
  overallRating: integer("overall_rating").notNull(), // 1-5
  review: text("review"),
  images: jsonb("images"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Product-vendor relationship for vendor-specific availability
export const productVendors = pgTable("product_vendors", {
  id: serial("id").primaryKey(),
  productId: integer("product_id").references(() => products.id).notNull(),
  vendorId: integer("vendor_id").references(() => vendors.id).notNull(),
  stock: integer("stock").default(0),
  priceOverride: decimal("price_override", { precision: 10, scale: 2 }), // vendor-specific pricing
  isAvailable: boolean("is_available").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

// Enhanced Relations
export const usersRelations = relations(users, ({ many, one }) => ({
  orders: many(orders),
  milkSubscriptions: many(milkSubscriptions),
  vendor: one(vendors, {
    fields: [users.id],
    references: [vendors.userId],
  }),
  deliveryPartner: one(deliveryPartners, {
    fields: [users.id],
    references: [deliveryPartners.userId],
  }),
  admin: one(admins, {
    fields: [users.id],
    references: [admins.userId],
  }),
  marketingStaff: one(marketingStaff, {
    fields: [users.id],
    references: [marketingStaff.userId],
  }),
  notifications: many(notifications),
  inwardLogsReported: many(inwardLogs, {
    relationName: "inwardLogReporter",
  }),
  inwardLogsApproved: many(inwardLogs, {
    relationName: "inwardLogApprover",
  }),
}));

export const vendorsRelations = relations(vendors, ({ one, many }) => ({
  user: one(users, {
    fields: [vendors.userId],
    references: [users.id],
  }),
  headVendor: one(vendors, {
    fields: [vendors.headVendorId],
    references: [vendors.id],
    relationName: "headVendorRelation",
  }),
  parentVendor: one(vendors, {
    fields: [vendors.parentVendorId],
    references: [vendors.id],
    relationName: "parentVendorRelation",
  }),
  subVendors: many(vendors, {
    relationName: "headVendorRelation",
  }),
  childVendors: many(vendors, {
    relationName: "parentVendorRelation",
  }),
  orders: many(orders),
  supplies: many(vendorSupply),
  drivers: many(drivers),
  inwardLogs: many(inwardLogs),
  milkSubscriptions: many(milkSubscriptions),
  productVendors: many(productVendors),
  delegationsFrom: many(delegationLogs, {
    relationName: "delegationFrom",
  }),
  delegationsTo: many(delegationLogs, {
    relationName: "delegationTo",
  }),
  dailyPerformance: many(dailyVendorPerformance),
  deliveryAssignments: many(vendorDeliveryAssignments),
  requirements: many(vendorRequirements),
}));

export const ordersRelations = relations(orders, ({ one, many }) => ({
  user: one(users, {
    fields: [orders.userId],
    references: [users.id],
  }),
  vendor: one(vendors, {
    fields: [orders.vendorId],
    references: [vendors.id],
  }),
  deliveryPartner: one(deliveryPartners, {
    fields: [orders.deliveryPartnerId],
    references: [deliveryPartners.id],
  }),
  delegationLog: one(delegationLogs, {
    fields: [orders.delegationLogId],
    references: [delegationLogs.id],
  }),
  orderItems: many(orderItems),
}));

export const orderItemsRelations = relations(orderItems, ({ one }) => ({
  order: one(orders, {
    fields: [orderItems.orderId],
    references: [orders.id],
  }),
  product: one(products, {
    fields: [orderItems.productId],
    references: [products.id],
  }),
}));

export const deliveryPartnersRelations = relations(deliveryPartners, ({ one, many }) => ({
  user: one(users, {
    fields: [deliveryPartners.userId],
    references: [users.id],
  }),
  orders: many(orders),
}));

export const productsRelations = relations(products, ({ many }) => ({
  orderItems: many(orderItems),
  productVendors: many(productVendors),
}));

export const milkSubscriptionsRelations = relations(milkSubscriptions, ({ one }) => ({
  user: one(users, {
    fields: [milkSubscriptions.userId],
    references: [users.id],
  }),
  vendor: one(vendors, {
    fields: [milkSubscriptions.vendorId],
    references: [vendors.id],
  }),
}));

export const vendorSupplyRelations = relations(vendorSupply, ({ one }) => ({
  vendor: one(vendors, {
    fields: [vendorSupply.vendorId],
    references: [vendors.id],
  }),
}));

export const notificationsRelations = relations(notifications, ({ one }) => ({
  user: one(users, {
    fields: [notifications.userId],
    references: [users.id],
  }),
}));

// New entity relations
export const driversRelations = relations(drivers, ({ one }) => ({
  vendor: one(vendors, {
    fields: [drivers.vendorId],
    references: [vendors.id],
  }),
}));

export const inwardLogsRelations = relations(inwardLogs, ({ one }) => ({
  vendor: one(vendors, {
    fields: [inwardLogs.vendorId],
    references: [vendors.id],
  }),
  reportedBy: one(users, {
    fields: [inwardLogs.reportedByUserId],
    references: [users.id],
    relationName: "inwardLogReporter",
  }),
  approvedBy: one(users, {
    fields: [inwardLogs.approvedByUserId],
    references: [users.id],
    relationName: "inwardLogApprover",
  }),
}));

export const adminsRelations = relations(admins, ({ one, many }) => ({
  user: one(users, {
    fields: [admins.userId],
    references: [users.id],
  }),
  createdBy: one(users, {
    fields: [admins.createdByUserId],
    references: [users.id],
  }),
  delegations: many(delegationLogs),
  createdStaff: many(marketingStaff),
}));

export const delegationLogsRelations = relations(delegationLogs, ({ one, many }) => ({
  fromVendor: one(vendors, {
    fields: [delegationLogs.fromVendorId],
    references: [vendors.id],
    relationName: "delegationFrom",
  }),
  toVendor: one(vendors, {
    fields: [delegationLogs.toVendorId],
    references: [vendors.id],
    relationName: "delegationTo",
  }),
  delegatedBy: one(admins, {
    fields: [delegationLogs.delegatedByAdminId],
    references: [admins.id],
  }),
  orders: many(orders),
}));

export const marketingStaffRelations = relations(marketingStaff, ({ one }) => ({
  user: one(users, {
    fields: [marketingStaff.userId],
    references: [users.id],
  }),
  createdBy: one(admins, {
    fields: [marketingStaff.createdByAdminId],
    references: [admins.id],
  }),
}));

export const alertsRelations = relations(alerts, ({ one }) => ({
  assignedTo: one(users, {
    fields: [alerts.assignedToUserId],
    references: [users.id],
  }),
  resolvedBy: one(users, {
    fields: [alerts.resolvedByUserId],
    references: [users.id],
  }),
}));

export const productVendorsRelations = relations(productVendors, ({ one }) => ({
  product: one(products, {
    fields: [productVendors.productId],
    references: [products.id],
  }),
  vendor: one(vendors, {
    fields: [productVendors.vendorId],
    references: [vendors.id],
  }),
}));

// New relations for enhanced vendor tables
export const dailyVendorPerformanceRelations = relations(dailyVendorPerformance, ({ one }) => ({
  vendor: one(vendors, {
    fields: [dailyVendorPerformance.vendorId],
    references: [vendors.id],
  }),
}));

export const vendorDeliveryAssignmentsRelations = relations(vendorDeliveryAssignments, ({ one }) => ({
  vendor: one(vendors, {
    fields: [vendorDeliveryAssignments.vendorId],
    references: [vendors.id],
  }),
  deliveryPartner: one(drivers, {
    fields: [vendorDeliveryAssignments.deliveryPartnerId],
    references: [drivers.id],
  }),
}));

export const vendorRequirementsRelations = relations(vendorRequirements, ({ one }) => ({
  vendor: one(vendors, {
    fields: [vendorRequirements.vendorId],
    references: [vendors.id],
  }),
  submittedBy: one(users, {
    fields: [vendorRequirements.submittedByUserId],
    references: [users.id],
  }),
}));

// Relations for new customer feature tables
export const cartRelations = relations(cart, ({ one, many }) => ({
  user: one(users, {
    fields: [cart.userId],
    references: [users.id],
  }),
  items: many(cartItems),
}));

export const cartItemsRelations = relations(cartItems, ({ one }) => ({
  cart: one(cart, {
    fields: [cartItems.cartId],
    references: [cart.id],
  }),
  product: one(products, {
    fields: [cartItems.productId],
    references: [products.id],
  }),
}));

export const addressesRelations = relations(addresses, ({ one }) => ({
  user: one(users, {
    fields: [addresses.userId],
    references: [users.id],
  }),
}));

export const walletTransactionsRelations = relations(walletTransactions, ({ one }) => ({
  user: one(users, {
    fields: [walletTransactions.userId],
    references: [users.id],
  }),
}));

export const rewardPointsRelations = relations(rewardPoints, ({ one }) => ({
  user: one(users, {
    fields: [rewardPoints.userId],
    references: [users.id],
  }),
}));

export const referralsRelations = relations(referrals, ({ one }) => ({
  referrer: one(users, {
    fields: [referrals.referrerId],
    references: [users.id],
    relationName: "referrer",
  }),
  referredUser: one(users, {
    fields: [referrals.referredUserId],
    references: [users.id],
    relationName: "referred",
  }),
}));

export const supportTicketsRelations = relations(supportTickets, ({ one, many }) => ({
  user: one(users, {
    fields: [supportTickets.userId],
    references: [users.id],
  }),
  order: one(orders, {
    fields: [supportTickets.orderId],
    references: [orders.id],
  }),
  assignedToUser: one(users, {
    fields: [supportTickets.assignedToUserId],
    references: [users.id],
    relationName: "assignedTickets",
  }),
  messages: many(ticketMessages),
}));

export const ticketMessagesRelations = relations(ticketMessages, ({ one }) => ({
  ticket: one(supportTickets, {
    fields: [ticketMessages.ticketId],
    references: [supportTickets.id],
  }),
  user: one(users, {
    fields: [ticketMessages.userId],
    references: [users.id],
  }),
}));

export const orderRatingsRelations = relations(orderRatings, ({ one }) => ({
  order: one(orders, {
    fields: [orderRatings.orderId],
    references: [orders.id],
  }),
  user: one(users, {
    fields: [orderRatings.userId],
    references: [users.id],
  }),
}));

// Relations for tables without foreign keys (standalone data)
export const offersRelations = relations(offers, () => ({}));
export const couponsRelations = relations(coupons, () => ({}));
export const faqsRelations = relations(faqs, () => ({}));

// Insert schemas for all entities
export const insertUserSchema = createInsertSchema(users);
export const insertProductSchema = createInsertSchema(products).omit({ id: true, createdAt: true });
export const insertOrderSchema = createInsertSchema(orders).omit({ id: true, createdAt: true });
export const insertOrderItemSchema = createInsertSchema(orderItems).omit({ id: true });
export const insertMilkSubscriptionSchema = createInsertSchema(milkSubscriptions).omit({ id: true, createdAt: true });
export const insertVendorSchema = createInsertSchema(vendors).omit({ id: true, createdAt: true });
export const insertDeliveryPartnerSchema = createInsertSchema(deliveryPartners).omit({ id: true, createdAt: true });
export const insertVendorSupplySchema = createInsertSchema(vendorSupply).omit({ id: true, createdAt: true });
export const insertNotificationSchema = createInsertSchema(notifications).omit({ id: true, createdAt: true });
export const insertDriverSchema = createInsertSchema(drivers).omit({ id: true, createdAt: true });
export const insertInwardLogSchema = createInsertSchema(inwardLogs).omit({ id: true, createdAt: true });
export const insertAdminSchema = createInsertSchema(admins).omit({ id: true, createdAt: true });
export const insertDelegationLogSchema = createInsertSchema(delegationLogs).omit({ id: true, timestamp: true });
export const insertMarketingStaffSchema = createInsertSchema(marketingStaff).omit({ id: true, createdAt: true });
export const insertAlertSchema = createInsertSchema(alerts).omit({ id: true, createdAt: true });
export const insertProductVendorSchema = createInsertSchema(productVendors).omit({ id: true, createdAt: true });
export const insertDailyVendorPerformanceSchema = createInsertSchema(dailyVendorPerformance).omit({ id: true, createdAt: true });
export const insertVendorDeliveryAssignmentSchema = createInsertSchema(vendorDeliveryAssignments).omit({ id: true, createdAt: true });
export const insertVendorRequirementSchema = createInsertSchema(vendorRequirements).omit({ id: true, createdAt: true });
export const insertCartSchema = createInsertSchema(cart).omit({ id: true, createdAt: true, updatedAt: true });
export const insertCartItemSchema = createInsertSchema(cartItems).omit({ id: true, addedAt: true });
export const insertAddressSchema = createInsertSchema(addresses).omit({ id: true, createdAt: true });
export const insertWalletTransactionSchema = createInsertSchema(walletTransactions).omit({ id: true, createdAt: true });
export const insertOfferSchema = createInsertSchema(offers).omit({ id: true, createdAt: true });
export const insertCouponSchema = createInsertSchema(coupons).omit({ id: true, createdAt: true });
export const insertRewardPointsSchema = createInsertSchema(rewardPoints).omit({ id: true, updatedAt: true });
export const insertReferralSchema = createInsertSchema(referrals).omit({ id: true, createdAt: true });
export const insertSupportTicketSchema = createInsertSchema(supportTickets).omit({ id: true, createdAt: true, updatedAt: true });
export const insertTicketMessageSchema = createInsertSchema(ticketMessages).omit({ id: true, createdAt: true });
export const insertFaqSchema = createInsertSchema(faqs).omit({ id: true, createdAt: true });
export const insertOrderRatingSchema = createInsertSchema(orderRatings).omit({ id: true, createdAt: true });

// Comprehensive types for all entities
export type UpsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type Product = typeof products.$inferSelect;
export type InsertProduct = z.infer<typeof insertProductSchema>;
export type Order = typeof orders.$inferSelect;
export type InsertOrder = z.infer<typeof insertOrderSchema>;
export type OrderItem = typeof orderItems.$inferSelect;
export type InsertOrderItem = z.infer<typeof insertOrderItemSchema>;
export type MilkSubscription = typeof milkSubscriptions.$inferSelect;
export type InsertMilkSubscription = z.infer<typeof insertMilkSubscriptionSchema>;
export type Vendor = typeof vendors.$inferSelect;
export type InsertVendor = z.infer<typeof insertVendorSchema>;
export type DeliveryPartner = typeof deliveryPartners.$inferSelect;
export type InsertDeliveryPartner = z.infer<typeof insertDeliveryPartnerSchema>;
export type VendorSupply = typeof vendorSupply.$inferSelect;
export type InsertVendorSupply = z.infer<typeof insertVendorSupplySchema>;
export type Notification = typeof notifications.$inferSelect;
export type InsertNotification = z.infer<typeof insertNotificationSchema>;
export type Driver = typeof drivers.$inferSelect;
export type InsertDriver = z.infer<typeof insertDriverSchema>;
export type InwardLog = typeof inwardLogs.$inferSelect;
export type InsertInwardLog = z.infer<typeof insertInwardLogSchema>;
export type Admin = typeof admins.$inferSelect;
export type InsertAdmin = z.infer<typeof insertAdminSchema>;
export type DelegationLog = typeof delegationLogs.$inferSelect;
export type InsertDelegationLog = z.infer<typeof insertDelegationLogSchema>;
export type MarketingStaff = typeof marketingStaff.$inferSelect;
export type InsertMarketingStaff = z.infer<typeof insertMarketingStaffSchema>;
export type Alert = typeof alerts.$inferSelect;
export type InsertAlert = z.infer<typeof insertAlertSchema>;
export type ProductVendor = typeof productVendors.$inferSelect;
export type InsertProductVendor = z.infer<typeof insertProductVendorSchema>;
export type DailyVendorPerformance = typeof dailyVendorPerformance.$inferSelect;
export type InsertDailyVendorPerformance = z.infer<typeof insertDailyVendorPerformanceSchema>;
export type VendorDeliveryAssignment = typeof vendorDeliveryAssignments.$inferSelect;
export type InsertVendorDeliveryAssignment = z.infer<typeof insertVendorDeliveryAssignmentSchema>;
export type VendorRequirement = typeof vendorRequirements.$inferSelect;
export type InsertVendorRequirement = z.infer<typeof insertVendorRequirementSchema>;
export type Cart = typeof cart.$inferSelect;
export type InsertCart = z.infer<typeof insertCartSchema>;
export type CartItem = typeof cartItems.$inferSelect;
export type InsertCartItem = z.infer<typeof insertCartItemSchema>;
export type Address = typeof addresses.$inferSelect;
export type InsertAddress = z.infer<typeof insertAddressSchema>;
export type WalletTransaction = typeof walletTransactions.$inferSelect;
export type InsertWalletTransaction = z.infer<typeof insertWalletTransactionSchema>;
export type Offer = typeof offers.$inferSelect;
export type InsertOffer = z.infer<typeof insertOfferSchema>;
export type Coupon = typeof coupons.$inferSelect;
export type InsertCoupon = z.infer<typeof insertCouponSchema>;
export type RewardPoints = typeof rewardPoints.$inferSelect;
export type InsertRewardPoints = z.infer<typeof insertRewardPointsSchema>;
export type Referral = typeof referrals.$inferSelect;
export type InsertReferral = z.infer<typeof insertReferralSchema>;
export type SupportTicket = typeof supportTickets.$inferSelect;
export type InsertSupportTicket = z.infer<typeof insertSupportTicketSchema>;
export type TicketMessage = typeof ticketMessages.$inferSelect;
export type InsertTicketMessage = z.infer<typeof insertTicketMessageSchema>;
export type Faq = typeof faqs.$inferSelect;
export type InsertFaq = z.infer<typeof insertFaqSchema>;
export type OrderRating = typeof orderRatings.$inferSelect;
export type InsertOrderRating = z.infer<typeof insertOrderRatingSchema>;

// Utility types for role-based permissions
export type AdminRole = 'SUPER' | 'HEAD' | 'SUB';
export type UserRole = 'customer' | 'admin' | 'vendor' | 'delivery' | 'marketing_staff';
export type VendorType = 'HEAD_VENDOR' | 'VENDOR' | 'SUB_VENDOR';
export type OrderStatus = 'PLACED' | 'PREPARING' | 'OUT' | 'DELIVERED' | 'FAILED';
export type SubscriptionFrequency = 'DAILY' | 'ALT' | 'WEEKLY';
export type InwardLogStatus = 'PENDING' | 'APPROVED' | 'REJECTED';
export type AlertType = 'DELAY' | 'INWARD' | 'COMPLAINT' | 'LOW_STOCK';
export type AlertSeverity = 'INFO' | 'WARNING' | 'CRITICAL';
export type DeliveryStatus = 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'FAILED';
export type ForecastType = 'MANUAL' | 'AI' | 'HISTORICAL';