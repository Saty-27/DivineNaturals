import {
  users,
  products,
  orders,
  orderItems,
  milkSubscriptions,
  vendors,
  deliveryPartners,
  vendorSupply,
  notifications,
  type User,
  type UpsertUser,
  type Product,
  type InsertProduct,
  type Order,
  type InsertOrder,
  type OrderItem,
  type InsertOrderItem,
  type MilkSubscription,
  type InsertMilkSubscription,
  type Vendor,
  type InsertVendor,
  type DeliveryPartner,
  type InsertDeliveryPartner,
  type VendorSupply,
  type InsertVendorSupply,
  type Notification,
  type InsertNotification,
} from "@shared/schema";
import { db } from "./db";
import { eq, and, desc, asc } from "drizzle-orm";

export interface IStorage {
  // User operations - mandatory for Replit Auth
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  
  // Product operations
  getProducts(): Promise<Product[]>;
  getProductsByCategory(category: string): Promise<Product[]>;
  createProduct(product: InsertProduct): Promise<Product>;
  updateProduct(id: number, product: Partial<InsertProduct>): Promise<Product>;
  
  // Order operations
  getOrdersByUser(userId: string): Promise<Order[]>;
  getOrderById(id: number): Promise<Order | undefined>;
  createOrder(order: InsertOrder): Promise<Order>;
  updateOrderStatus(id: number, status: string): Promise<Order>;
  getOrdersForDelivery(deliveryPartnerId: number): Promise<Order[]>;
  
  // Order items operations
  getOrderItemsByOrder(orderId: number): Promise<OrderItem[]>;
  createOrderItem(orderItem: InsertOrderItem): Promise<OrderItem>;
  
  // Milk subscription operations
  getMilkSubscriptionByUser(userId: string): Promise<MilkSubscription | undefined>;
  createMilkSubscription(subscription: InsertMilkSubscription): Promise<MilkSubscription>;
  updateMilkSubscription(id: number, subscription: Partial<InsertMilkSubscription>): Promise<MilkSubscription>;
  
  // Vendor operations
  getVendors(): Promise<Vendor[]>;
  getVendorByUser(userId: string): Promise<Vendor | undefined>;
  createVendor(vendor: InsertVendor): Promise<Vendor>;
  
  // Delivery partner operations
  getDeliveryPartners(): Promise<DeliveryPartner[]>;
  getDeliveryPartnerByUser(userId: string): Promise<DeliveryPartner | undefined>;
  createDeliveryPartner(partner: InsertDeliveryPartner): Promise<DeliveryPartner>;
  
  // Vendor supply operations
  getVendorSuppliesByVendor(vendorId: number): Promise<VendorSupply[]>;
  createVendorSupply(supply: InsertVendorSupply): Promise<VendorSupply>;
  updateVendorSupply(id: number, supply: Partial<InsertVendorSupply>): Promise<VendorSupply>;
  
  // Notification operations
  getNotificationsByUser(userId: string): Promise<Notification[]>;
  createNotification(notification: InsertNotification): Promise<Notification>;
  markNotificationAsRead(id: number): Promise<Notification>;
}

export class DatabaseStorage implements IStorage {
  // User operations - mandatory for Replit Auth
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  // Product operations
  async getProducts(): Promise<Product[]> {
    return await db.select().from(products).where(eq(products.isActive, true)).orderBy(asc(products.name));
  }

  async getProductsByCategory(category: string): Promise<Product[]> {
    return await db.select().from(products)
      .where(and(eq(products.category, category), eq(products.isActive, true)))
      .orderBy(asc(products.name));
  }

  async createProduct(product: InsertProduct): Promise<Product> {
    const [newProduct] = await db.insert(products).values(product).returning();
    return newProduct;
  }

  async updateProduct(id: number, product: Partial<InsertProduct>): Promise<Product> {
    const [updatedProduct] = await db.update(products)
      .set(product)
      .where(eq(products.id, id))
      .returning();
    return updatedProduct;
  }

  // Order operations
  async getOrdersByUser(userId: string): Promise<Order[]> {
    return await db.select().from(orders)
      .where(eq(orders.userId, userId))
      .orderBy(desc(orders.createdAt));
  }

  async getOrderById(id: number): Promise<Order | undefined> {
    const [order] = await db.select().from(orders).where(eq(orders.id, id));
    return order;
  }

  async createOrder(order: InsertOrder): Promise<Order> {
    const [newOrder] = await db.insert(orders).values(order).returning();
    return newOrder;
  }

  async updateOrderStatus(id: number, status: string): Promise<Order> {
    const [updatedOrder] = await db.update(orders)
      .set({ status })
      .where(eq(orders.id, id))
      .returning();
    return updatedOrder;
  }

  async getOrdersForDelivery(deliveryPartnerId: number): Promise<Order[]> {
    return await db.select().from(orders)
      .where(eq(orders.deliveryPartnerId, deliveryPartnerId))
      .orderBy(asc(orders.deliveryDate));
  }

  // Order items operations
  async getOrderItemsByOrder(orderId: number): Promise<OrderItem[]> {
    return await db.select().from(orderItems).where(eq(orderItems.orderId, orderId));
  }

  async createOrderItem(orderItem: InsertOrderItem): Promise<OrderItem> {
    const [newOrderItem] = await db.insert(orderItems).values(orderItem).returning();
    return newOrderItem;
  }

  // Milk subscription operations
  async getMilkSubscriptionByUser(userId: string): Promise<MilkSubscription | undefined> {
    const [subscription] = await db.select().from(milkSubscriptions)
      .where(and(eq(milkSubscriptions.userId, userId), eq(milkSubscriptions.isActive, true)));
    return subscription;
  }

  async createMilkSubscription(subscription: InsertMilkSubscription): Promise<MilkSubscription> {
    const [newSubscription] = await db.insert(milkSubscriptions).values(subscription).returning();
    return newSubscription;
  }

  async updateMilkSubscription(id: number, subscription: Partial<InsertMilkSubscription>): Promise<MilkSubscription> {
    const [updatedSubscription] = await db.update(milkSubscriptions)
      .set(subscription)
      .where(eq(milkSubscriptions.id, id))
      .returning();
    return updatedSubscription;
  }

  // Vendor operations
  async getVendors(): Promise<Vendor[]> {
    return await db.select().from(vendors).orderBy(asc(vendors.businessName));
  }

  async getVendorByUser(userId: string): Promise<Vendor | undefined> {
    const [vendor] = await db.select().from(vendors).where(eq(vendors.userId, userId));
    return vendor;
  }

  async createVendor(vendor: InsertVendor): Promise<Vendor> {
    const [newVendor] = await db.insert(vendors).values(vendor).returning();
    return newVendor;
  }

  // Delivery partner operations
  async getDeliveryPartners(): Promise<DeliveryPartner[]> {
    return await db.select().from(deliveryPartners);
  }

  async getDeliveryPartnerByUser(userId: string): Promise<DeliveryPartner | undefined> {
    const [partner] = await db.select().from(deliveryPartners).where(eq(deliveryPartners.userId, userId));
    return partner;
  }

  async createDeliveryPartner(partner: InsertDeliveryPartner): Promise<DeliveryPartner> {
    const [newPartner] = await db.insert(deliveryPartners).values(partner).returning();
    return newPartner;
  }

  // Vendor supply operations
  async getVendorSuppliesByVendor(vendorId: number): Promise<VendorSupply[]> {
    return await db.select().from(vendorSupply)
      .where(eq(vendorSupply.vendorId, vendorId))
      .orderBy(desc(vendorSupply.date));
  }

  async createVendorSupply(supply: InsertVendorSupply): Promise<VendorSupply> {
    const [newSupply] = await db.insert(vendorSupply).values(supply).returning();
    return newSupply;
  }

  async updateVendorSupply(id: number, supply: Partial<InsertVendorSupply>): Promise<VendorSupply> {
    const [updatedSupply] = await db.update(vendorSupply)
      .set(supply)
      .where(eq(vendorSupply.id, id))
      .returning();
    return updatedSupply;
  }

  // Notification operations
  async getNotificationsByUser(userId: string): Promise<Notification[]> {
    return await db.select().from(notifications)
      .where(eq(notifications.userId, userId))
      .orderBy(desc(notifications.createdAt));
  }

  async createNotification(notification: InsertNotification): Promise<Notification> {
    const [newNotification] = await db.insert(notifications).values(notification).returning();
    return newNotification;
  }

  async markNotificationAsRead(id: number): Promise<Notification> {
    const [updatedNotification] = await db.update(notifications)
      .set({ isRead: true })
      .where(eq(notifications.id, id))
      .returning();
    return updatedNotification;
  }
}

export const storage = new DatabaseStorage();
