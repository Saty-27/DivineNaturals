import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { 
  mockUser,
  mockOrders,
  mockProducts,
  mockMilkSubscription,
  mockNotifications,
  mockVendors,
  mockDeliveryPartners,
  mockCustomers,
  mockComplaints
} from "./mockData";
import { 
  insertProductSchema, 
  insertOrderSchema, 
  insertOrderItemSchema,
  insertMilkSubscriptionSchema,
  insertVendorSchema,
  insertDeliveryPartnerSchema,
  insertVendorSupplySchema,
  insertNotificationSchema 
} from "@shared/schema";
import cartRoutes from "./routes/cart.routes";
import addressRoutes from "./routes/address.routes";
import supportRoutes from "./routes/support.routes";
import offersRoutes from "./routes/offers.routes";

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Domain-specific routes  
  app.use('/api/cart', cartRoutes);
  app.use('/api/addresses', addressRoutes);
  app.use('/api/support', supportRoutes);
  app.use('/api/offers', offersRoutes);

  // Auth routes
  app.get('/api/auth/user', async (req: any, res) => {
    try {
      if (!req.isAuthenticated() || !req.user?.claims?.sub) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Mock API routes for development
  app.get('/api/orders', async (req, res) => {
    res.json(mockOrders);
  });

  app.get('/api/products', async (req, res) => {
    res.json(mockProducts);
  });

  app.get('/api/milk-subscription', async (req, res) => {
    res.json(mockMilkSubscription);
  });

  app.get('/api/notifications', async (req, res) => {
    res.json(mockNotifications);
  });

  app.get('/api/vendors', async (req, res) => {
    res.json(mockVendors);
  });

  app.get('/api/delivery-partners', async (req, res) => {
    res.json(mockDeliveryPartners);
  });

  app.get('/api/customers', async (req, res) => {
    res.json(mockCustomers);
  });

  app.get('/api/complaints', async (req, res) => {
    res.json(mockComplaints);
  });

  // Enhanced Vendor API endpoints according to prompt specification
  app.get('/api/vendor/me/dashboard', async (req, res) => {
    // Enhanced vendor dashboard with role-based data
    const userAgent = req.get('User-Agent') || '';
    const referer = req.get('Referer') || '';
    
    // Determine vendor type from URL or query params
    let vendorType = 'SUB_VENDOR';
    if (referer.includes('/head-vendor')) vendorType = 'HEAD_VENDOR';
    else if (referer.includes('/vendor') && !referer.includes('/sub-vendor')) vendorType = 'VENDOR';
    
    // Base vendor data
    const baseData: any = {
      id: 1,
      businessName: "Divine Naturals Farm",
      locationName: "Santa Cruz",
      vendorType: vendorType,
      requirementToday: 500,
      circulatedLiters: 425,
      paymentsPending: 12500,
      revenueToday: 21250,
      revenueTotal: 485000,
      weeklyEarnings: 148750,
      monthlyEarnings: 635000,
      requirementTomorrow: 520
    };
    
    // Add hierarchy-specific data
    if (vendorType === 'HEAD_VENDOR') {
      baseData.areaStats = {
        totalVendors: 12,
        totalSubVendors: 28,
        areaRequirement: 8500,
        areaCirculated: 7890,
        areaRevenue: 394500,
        fulfillmentRate: 92.8
      };
    } else if (vendorType === 'VENDOR') {
      baseData.subVendorStats = {
        subVendorCount: 4,
        subVendorRequirement: 1200,
        subVendorCirculated: 1150,
        subVendorRevenue: 57500
      };
    }
    
    res.json(baseData);
  });

  app.get('/api/vendor/inward', async (req, res) => {
    // Mock inward logs for vendor submissions
    const mockInwardLogs = [
      {
        id: 1,
        vendorId: 1,
        litersArrived: 500,
        litersDelivered: 480,
        litersPending: 20,
        driverInfo: { name: "Ramesh Kumar", age: 32, phone: "+91-9876543210" },
        status: "APPROVED",
        sentToAdmin: true,
        createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 2,
        vendorId: 1,
        litersArrived: 450,
        litersDelivered: 445,
        litersPending: 5,
        driverInfo: { name: "Suresh Patel", age: 28, phone: "+91-9765432109" },
        status: "PENDING",
        sentToAdmin: true,
        createdAt: new Date().toISOString()
      }
    ];
    res.json(mockInwardLogs);
  });

  app.get('/api/vendor/drivers', async (req, res) => {
    // Mock drivers list for vendor
    const mockDrivers = [
      {
        id: 1,
        name: "Ramesh Kumar",
        age: 32,
        phone: "+91-9876543210",
        aadharUrl: "https://example.com/aadhar1.jpg",
        panUrl: "https://example.com/pan1.jpg",
        vendorId: 1,
        createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 2,
        name: "Suresh Patel",
        age: 28,
        phone: "+91-9765432109",
        aadharUrl: "https://example.com/aadhar2.jpg",
        vendorId: 1,
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
      }
    ];
    res.json(mockDrivers);
  });

  // Vendor inward entry submission
  app.post('/api/vendor/inward', async (req, res) => {
    const inwardData = req.body;
    // In real implementation, this would save to database
    res.json({ 
      success: true, 
      message: "Inward entry submitted successfully",
      id: Date.now()
    });
  });

  // Driver management
  app.post('/api/vendor/driver', async (req, res) => {
    const driverData = req.body;
    // In real implementation, this would save to database
    res.json({ 
      success: true, 
      message: "Driver added successfully",
      id: Date.now()
    });
  });

  // Enhanced Vendor Hierarchy API Routes
  
  // Get sub-vendors for Vendor/Head Vendor
  app.get('/api/vendor/sub-vendors', async (req, res) => {
    const mockSubVendors = [
      {
        id: 1,
        businessName: "Santa Cruz Sub-Vendor 1",
        locationName: "Santa Cruz East",
        vendorType: "SUB_VENDOR",
        requirementToday: 200,
        circulatedLiters: 185,
        revenueToday: 9250,
        fulfillmentRate: 92.5,
        status: "ACTIVE"
      },
      {
        id: 2,
        businessName: "Santa Cruz Sub-Vendor 2", 
        locationName: "Santa Cruz West",
        vendorType: "SUB_VENDOR",
        requirementToday: 150,
        circulatedLiters: 140,
        revenueToday: 7000,
        fulfillmentRate: 93.3,
        status: "ACTIVE"
      },
      {
        id: 3,
        businessName: "Santa Cruz Sub-Vendor 3",
        locationName: "Santa Cruz North",
        vendorType: "SUB_VENDOR", 
        requirementToday: 180,
        circulatedLiters: 175,
        revenueToday: 8750,
        fulfillmentRate: 97.2,
        status: "ACTIVE"
      },
      {
        id: 4,
        businessName: "Santa Cruz Sub-Vendor 4",
        locationName: "Santa Cruz South",
        vendorType: "SUB_VENDOR",
        requirementToday: 120,
        circulatedLiters: 115,
        revenueToday: 5750,
        fulfillmentRate: 95.8,
        status: "ACTIVE"
      }
    ];
    res.json(mockSubVendors);
  });

  // Get daily performance data
  app.get('/api/vendor/daily-performance', async (req, res) => {
    const { period } = req.query; // week, month
    const mockDailyData = [
      {
        date: "2025-08-21",
        requirementSet: 500,
        milkCirculated: 475,
        milkDelivered: 465,
        milkPending: 10,
        totalEarnings: 23250,
        fulfillmentRate: 95.0,
        paymentReceived: 20000,
        paymentDue: 3250
      },
      {
        date: "2025-08-20", 
        requirementSet: 480,
        milkCirculated: 465,
        milkDelivered: 460,
        milkPending: 5,
        totalEarnings: 23000,
        fulfillmentRate: 96.8,
        paymentReceived: 22000,
        paymentDue: 1000
      },
      {
        date: "2025-08-19",
        requirementSet: 520,
        milkCirculated: 495,
        milkDelivered: 490,
        milkPending: 5,
        totalEarnings: 24500,
        fulfillmentRate: 94.2,
        paymentReceived: 24500,
        paymentDue: 0
      }
    ];
    res.json(mockDailyData);
  });

  // Get vendor requirements and forecasting
  app.get('/api/vendor/requirements', async (req, res) => {
    const mockRequirements = [
      {
        id: 1,
        date: "2025-08-22",
        requiredLiters: 520,
        forecastType: "AI",
        actualDemand: 0,
        demandFulfilled: 0,
        shortfall: 0,
        fulfillmentRate: 0,
        isSubmitted: false
      },
      {
        id: 2,
        date: "2025-08-21", 
        requiredLiters: 500,
        forecastType: "MANUAL",
        actualDemand: 500,
        demandFulfilled: 475,
        shortfall: 25,
        fulfillmentRate: 95.0,
        isSubmitted: true
      }
    ];
    res.json(mockRequirements);
  });

  // Submit daily requirement
  app.post('/api/vendor/requirements', async (req, res) => {
    const requirementData = req.body;
    res.json({
      success: true,
      message: "Daily requirement submitted successfully",
      id: Date.now()
    });
  });

  // Get delivery assignments
  app.get('/api/vendor/delivery-assignments', async (req, res) => {
    const mockAssignments = [
      {
        id: 1,
        deliveryPartner: {
          id: 1,
          name: "Ramesh Kumar",
          phone: "+91-9876543210"
        },
        assignmentDate: "2025-08-21",
        deliveryStatus: "COMPLETED",
        assignedLiters: 200,
        deliveredLiters: 195,
        completedAt: "2025-08-21T18:30:00Z",
        route: "Santa Cruz East Route"
      },
      {
        id: 2, 
        deliveryPartner: {
          id: 2,
          name: "Suresh Patel", 
          phone: "+91-9765432109"
        },
        assignmentDate: "2025-08-21",
        deliveryStatus: "IN_PROGRESS",
        assignedLiters: 150,
        deliveredLiters: 0,
        route: "Santa Cruz West Route"
      }
    ];
    res.json(mockAssignments);
  });

  // Create delivery assignment
  app.post('/api/vendor/delivery-assignments', async (req, res) => {
    const assignmentData = req.body;
    res.json({
      success: true,
      message: "Delivery assignment created successfully",
      id: Date.now()
    });
  });

  // Get area-wide analytics for Head Vendor
  app.get('/api/vendor/area-analytics', async (req, res) => {
    const mockAreaAnalytics = {
      totalAreaRequirement: 8500,
      totalAreaCirculated: 7890,
      totalAreaRevenue: 394500,
      overallFulfillmentRate: 92.8,
      vendorBreakdown: [
        {
          vendorId: 1,
          vendorName: "Santa Cruz Main Vendor",
          requirement: 2000,
          circulated: 1850,
          revenue: 92500,
          fulfillmentRate: 92.5,
          subVendorCount: 4
        },
        {
          vendorId: 2,
          vendorName: "Borivali Main Vendor", 
          requirement: 1800,
          circulated: 1720,
          revenue: 86000,
          fulfillmentRate: 95.6,
          subVendorCount: 3
        }
      ],
      alerts: [
        {
          type: "LOW_FULFILLMENT",
          vendorId: 3,
          vendorName: "Andheri Main Vendor",
          message: "Fulfillment rate below 90% for 3 consecutive days",
          severity: "WARNING"
        }
      ]
    };
    res.json(mockAreaAnalytics);
  });

  // Get financial analytics
  app.get('/api/vendor/financial-analytics', async (req, res) => {
    const { period } = req.query; // daily, weekly, monthly
    const mockFinancials = {
      current: {
        earnings: 21250,
        payments: 18000,
        pending: 3250,
        profitMargin: 15.3
      },
      historical: [
        { period: "Week 1", earnings: 148750, payments: 135000, pending: 13750 },
        { period: "Week 2", earnings: 152300, payments: 145000, pending: 7300 },
        { period: "Week 3", earnings: 145600, payments: 142000, pending: 3600 },
        { period: "Week 4", earnings: 156200, payments: 150000, pending: 6200 }
      ],
      subVendorPayments: [
        { subVendorId: 1, name: "Sub-Vendor 1", amountDue: 2500, lastPayment: "2025-08-15" },
        { subVendorId: 2, name: "Sub-Vendor 2", amountDue: 750, lastPayment: "2025-08-18" }
      ]
    };
    res.json(mockFinancials);
  });

  // Product routes
  app.get('/api/products', async (req, res) => {
    try {
      const { category } = req.query;
      const products = category 
        ? await storage.getProductsByCategory(category as string)
        : await storage.getProducts();
      res.json(products);
    } catch (error) {
      console.error("Error fetching products:", error);
      res.status(500).json({ message: "Failed to fetch products" });
    }
  });

  app.post('/api/products', isAuthenticated, async (req: any, res) => {
    try {
      const productData = insertProductSchema.parse(req.body);
      const product = await storage.createProduct(productData);
      res.json(product);
    } catch (error) {
      console.error("Error creating product:", error);
      res.status(500).json({ message: "Failed to create product" });
    }
  });

  // Order routes
  app.get('/api/orders', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const orders = await storage.getOrdersByUser(userId);
      res.json(orders);
    } catch (error) {
      console.error("Error fetching orders:", error);
      res.status(500).json({ message: "Failed to fetch orders" });
    }
  });

  app.get('/api/orders/:id', isAuthenticated, async (req, res) => {
    try {
      const orderId = parseInt(req.params.id);
      const order = await storage.getOrderById(orderId);
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }
      const orderItems = await storage.getOrderItemsByOrder(orderId);
      res.json({ ...order, items: orderItems });
    } catch (error) {
      console.error("Error fetching order:", error);
      res.status(500).json({ message: "Failed to fetch order" });
    }
  });

  app.post('/api/orders', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const orderData = insertOrderSchema.parse({ ...req.body, userId });
      const order = await storage.createOrder(orderData);
      
      // Create order items if provided
      if (req.body.items && Array.isArray(req.body.items)) {
        for (const item of req.body.items) {
          const orderItemData = insertOrderItemSchema.parse({ ...item, orderId: order.id });
          await storage.createOrderItem(orderItemData);
        }
      }
      
      res.json(order);
    } catch (error) {
      console.error("Error creating order:", error);
      res.status(500).json({ message: "Failed to create order" });
    }
  });

  app.patch('/api/orders/:id/status', isAuthenticated, async (req, res) => {
    try {
      const orderId = parseInt(req.params.id);
      const { status } = req.body;
      const order = await storage.updateOrderStatus(orderId, status);
      res.json(order);
    } catch (error) {
      console.error("Error updating order status:", error);
      res.status(500).json({ message: "Failed to update order status" });
    }
  });

  // Milk subscription routes
  app.get('/api/milk-subscription', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const subscription = await storage.getMilkSubscriptionByUser(userId);
      res.json(subscription);
    } catch (error) {
      console.error("Error fetching milk subscription:", error);
      res.status(500).json({ message: "Failed to fetch milk subscription" });
    }
  });

  app.post('/api/milk-subscription', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const subscriptionData = insertMilkSubscriptionSchema.parse({ ...req.body, userId });
      const subscription = await storage.createMilkSubscription(subscriptionData);
      res.json(subscription);
    } catch (error) {
      console.error("Error creating milk subscription:", error);
      res.status(500).json({ message: "Failed to create milk subscription" });
    }
  });

  app.patch('/api/milk-subscription/:id', isAuthenticated, async (req, res) => {
    try {
      const subscriptionId = parseInt(req.params.id);
      const updateData = req.body;
      const subscription = await storage.updateMilkSubscription(subscriptionId, updateData);
      res.json(subscription);
    } catch (error) {
      console.error("Error updating milk subscription:", error);
      res.status(500).json({ message: "Failed to update milk subscription" });
    }
  });

  // Vendor routes
  app.get('/api/vendors', isAuthenticated, async (req, res) => {
    try {
      const vendors = await storage.getVendors();
      res.json(vendors);
    } catch (error) {
      console.error("Error fetching vendors:", error);
      res.status(500).json({ message: "Failed to fetch vendors" });
    }
  });

  app.get('/api/vendor/profile', async (req: any, res) => {
    // Mock vendor profile for development
    const vendorProfile = {
      id: "VEN-001",
      name: "Fresh Dairy Co.",
      owner: "Rajesh Kumar",
      phone: "+91 98765 43210",
      email: "rajesh@freshdairy.co.in",
      address: "123 Dairy Farm Road, Andheri West, Mumbai - 400058",
      capacity: "2000L/day",
      rating: 4.8,
      established: "2018",
      license: "DL-2018-MH-001",
      bankAccount: "HDFC Bank - ****5678"
    };
    res.json(vendorProfile);
  });

  app.post('/api/vendor/register', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const vendorData = insertVendorSchema.parse({ ...req.body, userId });
      const vendor = await storage.createVendor(vendorData);
      res.json(vendor);
    } catch (error) {
      console.error("Error registering vendor:", error);
      res.status(500).json({ message: "Failed to register vendor" });
    }
  });

  // Vendor supply routes
  app.get('/api/vendor/supplies', async (req: any, res) => {
    // Mock vendor supplies for development
    const supplies = [
      {
        id: "SUP-001",
        date: "2024-01-25",
        requestedQuantity: "500L",
        confirmedQuantity: "480L",
        status: "confirmed",
        deliveryTime: "5:30 AM",
        zone: "Andheri West"
      },
      {
        id: "SUP-002", 
        date: "2024-01-26",
        requestedQuantity: "750L",
        confirmedQuantity: null,
        status: "pending",
        deliveryTime: "5:30 AM", 
        zone: "Santacruz East"
      }
    ];
    res.json(supplies);
  });

  app.post('/api/vendor/supplies', async (req: any, res) => {
    // Mock response for development
    const { supplyId, confirmedQuantity, remarks } = req.body;
    res.json({ 
      success: true, 
      message: "Supply confirmation submitted successfully",
      data: { supplyId, confirmedQuantity, remarks }
    });
  });

  app.patch('/api/vendor/supplies/:id', isAuthenticated, async (req, res) => {
    try {
      const supplyId = parseInt(req.params.id);
      const updateData = req.body;
      const supply = await storage.updateVendorSupply(supplyId, updateData);
      res.json(supply);
    } catch (error) {
      console.error("Error updating vendor supply:", error);
      res.status(500).json({ message: "Failed to update vendor supply" });
    }
  });

  // Delivery partner routes
  app.get('/api/delivery/profile', async (req: any, res) => {
    // Mock delivery profile for development
    const deliveryProfile = {
      id: "DEL-001",
      name: "Amit Sharma", 
      phone: "+91 87654 32109",
      email: "amit.delivery@krishnachaitanya.com",
      vehicleNumber: "MH-01-AB-1234",
      vehicleType: "Electric Scooter",
      zone: "Andheri-Santacruz",
      rating: 4.9,
      totalDeliveries: 1250,
      onTimeRate: "98%"
    };
    res.json(deliveryProfile);
  });

  app.post('/api/delivery/register', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const partnerData = insertDeliveryPartnerSchema.parse({ ...req.body, userId });
      const partner = await storage.createDeliveryPartner(partnerData);
      res.json(partner);
    } catch (error) {
      console.error("Error registering delivery partner:", error);
      res.status(500).json({ message: "Failed to register delivery partner" });
    }
  });

  app.get('/api/delivery/orders', async (req: any, res) => {
    // Mock delivery orders for development
    const assignedOrders = [
      {
        id: "ORD-001",
        customerName: "Priya Patel",
        address: "Flat 304, Sunrise Apartments, Andheri West",
        phone: "+91 98765 43210",
        items: [{ name: "Fresh Milk", quantity: "2L" }],
        amount: "₹120",
        status: "pending",
        deliveryTime: "6:00 AM - 7:00 AM",
        priority: "high"
      },
      {
        id: "ORD-002", 
        customerName: "Rahul Mehta",
        address: "B-201, Green Valley, Santacruz East",
        phone: "+91 87654 32109", 
        items: [{ name: "Fresh Milk", quantity: "1L" }, { name: "Curd", quantity: "500g" }],
        amount: "₹140",
        status: "in-transit",
        deliveryTime: "6:30 AM - 7:30 AM",
        priority: "medium"
      }
    ];
    res.json(assignedOrders);
  });

  // Add order status update route for delivery partners
  app.patch('/api/orders/:id/status', async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    res.json({
      success: true,
      message: "Order status updated successfully", 
      data: { orderId: id, status }
    });
  });

  // Notification routes
  app.get('/api/notifications', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const notifications = await storage.getNotificationsByUser(userId);
      res.json(notifications);
    } catch (error) {
      console.error("Error fetching notifications:", error);
      res.status(500).json({ message: "Failed to fetch notifications" });
    }
  });

  app.post('/api/notifications', isAuthenticated, async (req: any, res) => {
    try {
      const notificationData = insertNotificationSchema.parse(req.body);
      const notification = await storage.createNotification(notificationData);
      res.json(notification);
    } catch (error) {
      console.error("Error creating notification:", error);
      res.status(500).json({ message: "Failed to create notification" });
    }
  });

  app.patch('/api/notifications/:id/read', isAuthenticated, async (req, res) => {
    try {
      const notificationId = parseInt(req.params.id);
      const notification = await storage.markNotificationAsRead(notificationId);
      res.json(notification);
    } catch (error) {
      console.error("Error marking notification as read:", error);
      res.status(500).json({ message: "Failed to mark notification as read" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
