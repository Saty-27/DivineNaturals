import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { 
  Truck, 
  MapPin, 
  Package, 
  CheckCircle, 
  Camera,
  Phone,
  LogOut,
  Navigation,
  Clock,
  DollarSign,
  Star,
  TrendingUp,
  User,
  AlertTriangle,
  Bell,
  FileText,
  Calendar,
  Timer,
  Fuel,
  Shield,
  CreditCard,
  BarChart3,
  Route,
  MessageSquare,
  Home,
  Activity
} from "lucide-react";
import logoImage from "@assets/WhatsApp Image 2025-08-07 at 16.06.46_1755865958874.jpg";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function DeliveryDashboard() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("overview");

  const { data: deliveryProfile } = useQuery({
    queryKey: ["/api/delivery/profile"],
    retry: false,
  });

  const { data: assignedOrders } = useQuery({
    queryKey: ["/api/delivery/orders"],
    retry: false,
  });

  const updateOrderStatusMutation = useMutation({
    mutationFn: async ({ orderId, status }: { orderId: number; status: string }) => {
      return apiRequest("PATCH", `/api/orders/${orderId}/status`, { status });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/delivery/orders"] });
      toast({
        title: "Success",
        description: "Order status updated successfully!",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update order status",
        variant: "destructive",
      });
    },
  });

  // Mock data for comprehensive dashboard
  const todayOrders = Array.isArray(assignedOrders) ? assignedOrders.filter((order: any) => {
    const today = new Date().toISOString().split('T')[0];
    return order.deliveryDate === today;
  }) : [];

  const completedOrders = todayOrders.filter((order: any) => order.status === "delivered");
  const pendingOrders = todayOrders.filter((order: any) => 
    ["confirmed", "preparing", "out_for_delivery"].includes(order.status)
  );

  const totalEarnings = completedOrders.reduce((sum: number, order: any) => 
    sum + (parseFloat(order.totalAmount) * 0.1), 0
  );

  // Mock data for comprehensive features
  const milkQuantityData = {
    totalAssigned: 850,
    delivered: 720,
    returned: 30,
    pending: 100
  };

  const performanceData = {
    averageDeliveryTime: 28,
    onTimePercentage: 94,
    missedDeliveries: 2,
    totalDeliveries: 34
  };

  const paymentData = {
    cashCollected: 2850,
    digitalPayments: 1950,
    pendingSettlement: 450
  };

  const feedbackData = {
    averageRating: 4.8,
    totalRatings: 28,
    complaints: 1,
    compliments: 12
  };

  const shiftData = {
    shiftStart: "06:00 AM",
    shiftEnd: "11:00 AM", 
    workingHours: 4.5,
    breaksTaken: 2
  };

  const vehicleData = {
    vehicleId: "SCT-001",
    vehicleType: "Electric Scooter",
    milkCanCount: 15,
    deliveredCans: 12
  };

  const notifications = [
    { type: "alert", message: "Low stock alert - Only 5 cans remaining", time: "10 mins ago" },
    { type: "new", message: "New delivery assigned: Order #ORD-045", time: "15 mins ago" },
    { type: "info", message: "Special instruction: Customer prefers early delivery", time: "30 mins ago" }
  ];

  const handleMarkDelivered = (orderId: number) => {
    updateOrderStatusMutation.mutate({ orderId, status: "delivered" });
  };

  const handleMarkOutForDelivery = (orderId: number) => {
    updateOrderStatusMutation.mutate({ orderId, status: "out_for_delivery" });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <div className="container mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6 lg:py-8">
        {/* Enhanced Header */}
        <div className="bg-white rounded-3xl p-6 shadow-2xl border border-green-100 mb-8 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-green-50/50 to-blue-50/50 opacity-60"></div>
          <div className="relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center space-x-4 min-w-0 flex-1">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white rounded-3xl flex items-center justify-center shadow-2xl relative overflow-hidden flex-shrink-0 p-3">
                <img 
                  src={logoImage} 
                  alt="Divine Naturals Tree Logo" 
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="min-w-0 flex-1">
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[hsl(var(--eco-secondary))] mb-1 truncate">
                  Divine Naturals
                </h1>
                <p className="text-base sm:text-lg text-[hsl(var(--eco-text-muted))] font-semibold">
                  Welcome, {(user as any)?.firstName || "Amit"} • Delivery Partner Dashboard
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4 flex-shrink-0">
              <div className="hidden sm:flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm text-[hsl(var(--eco-text-muted))] font-semibold">Online</span>
              </div>
              <Button
                variant="outline"
                onClick={() => window.location.href = '/api/logout'}
                className="text-red-500 border-red-200 hover:bg-red-50 flex-shrink-0"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-3xl shadow-2xl border border-green-100 p-6 lg:p-8">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <div className="bg-gray-50/80 rounded-2xl p-2">
              <TabsList className="grid w-full bg-transparent border-0 rounded-xl p-0 gap-2">
                <div className="grid grid-cols-3 lg:grid-cols-6 gap-2 w-full">
                  <TabsTrigger value="overview" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500 data-[state=active]:to-emerald-600 data-[state=active]:text-white data-[state=active]:shadow-lg hover:bg-white transition-all duration-300 rounded-xl font-bold text-xs sm:text-sm px-3 py-3 flex items-center justify-center min-h-[3rem] border-0">
                    <div className="flex flex-col sm:flex-row items-center justify-center space-y-1 sm:space-y-0 sm:space-x-2">
                      <Home className="w-4 h-4 flex-shrink-0" />
                      <span className="text-xs sm:text-sm font-bold truncate">Overview</span>
                    </div>
                  </TabsTrigger>
                  
                  <TabsTrigger value="route" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-cyan-600 data-[state=active]:text-white data-[state=active]:shadow-lg hover:bg-white transition-all duration-300 rounded-xl font-bold text-xs sm:text-sm px-3 py-3 flex items-center justify-center min-h-[3rem] border-0">
                    <div className="flex flex-col sm:flex-row items-center justify-center space-y-1 sm:space-y-0 sm:space-x-2">
                      <Route className="w-4 h-4 flex-shrink-0" />
                      <span className="text-xs sm:text-sm font-bold truncate">Routes</span>
                    </div>
                  </TabsTrigger>
                  
                  <TabsTrigger value="history" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-600 data-[state=active]:text-white data-[state=active]:shadow-lg hover:bg-white transition-all duration-300 rounded-xl font-bold text-xs sm:text-sm px-3 py-3 flex items-center justify-center min-h-[3rem] border-0">
                    <div className="flex flex-col sm:flex-row items-center justify-center space-y-1 sm:space-y-0 sm:space-x-2">
                      <BarChart3 className="w-4 h-4 flex-shrink-0" />
                      <span className="text-xs sm:text-sm font-bold truncate">History</span>
                    </div>
                  </TabsTrigger>
                  
                  <TabsTrigger value="payments" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-amber-500 data-[state=active]:to-orange-600 data-[state=active]:text-white data-[state=active]:shadow-lg hover:bg-white transition-all duration-300 rounded-xl font-bold text-xs sm:text-sm px-3 py-3 flex items-center justify-center min-h-[3rem] border-0">
                    <div className="flex flex-col sm:flex-row items-center justify-center space-y-1 sm:space-y-0 sm:space-x-2">
                      <CreditCard className="w-4 h-4 flex-shrink-0" />
                      <span className="text-xs sm:text-sm font-bold truncate">Payments</span>
                    </div>
                  </TabsTrigger>
                  
                  <TabsTrigger value="alerts" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-500 data-[state=active]:to-pink-600 data-[state=active]:text-white data-[state=active]:shadow-lg hover:bg-white transition-all duration-300 rounded-xl font-bold text-xs sm:text-sm px-3 py-3 flex items-center justify-center min-h-[3rem] border-0">
                    <div className="flex flex-col sm:flex-row items-center justify-center space-y-1 sm:space-y-0 sm:space-x-2">
                      <Bell className="w-4 h-4 flex-shrink-0" />
                      <span className="text-xs sm:text-sm font-bold truncate">Alerts</span>
                    </div>
                  </TabsTrigger>
                  
                  <TabsTrigger value="profile" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-500 data-[state=active]:to-purple-600 data-[state=active]:text-white data-[state=active]:shadow-lg hover:bg-white transition-all duration-300 rounded-xl font-bold text-xs sm:text-sm px-3 py-3 flex items-center justify-center min-h-[3rem] border-0">
                    <div className="flex flex-col sm:flex-row items-center justify-center space-y-1 sm:space-y-0 sm:space-x-2">
                      <User className="w-4 h-4 flex-shrink-0" />
                      <span className="text-xs sm:text-sm font-bold truncate">Profile</span>
                    </div>
                  </TabsTrigger>
                </div>
              </TabsList>
            </div>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Milk Quantity Tracking */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 lg:gap-6">
              <Card className="bg-gradient-to-br from-white to-blue-50 border border-blue-200 shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-blue-400/20 to-transparent rounded-full -translate-y-10 translate-x-10"></div>
                <CardHeader className="pb-3 sm:pb-4">
                  <CardTitle className="text-[hsl(var(--eco-secondary))] flex items-center text-base sm:text-lg font-black relative z-10">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-lg flex items-center justify-center mr-3 shadow-lg">
                      <Package className="w-4 h-4 text-white" />
                    </div>
                    <span className="truncate">Total Assigned</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="relative z-10">
                  <div className="text-center">
                    <div className="text-3xl sm:text-4xl font-black text-blue-600 mb-2">
                      {milkQuantityData.totalAssigned}L
                    </div>
                    <div className="text-[hsl(var(--eco-text-muted))] font-semibold text-sm sm:text-base">
                      Today's quota
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-white to-green-50 border border-green-200 shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-green-400/20 to-transparent rounded-full -translate-y-10 translate-x-10"></div>
                <CardHeader className="pb-3 sm:pb-4">
                  <CardTitle className="text-[hsl(var(--eco-secondary))] flex items-center text-base sm:text-lg font-black relative z-10">
                    <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center mr-3 shadow-lg">
                      <CheckCircle className="w-4 h-4 text-white" />
                    </div>
                    <span className="truncate">Delivered</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="relative z-10">
                  <div className="text-center">
                    <div className="text-3xl sm:text-4xl font-black text-green-600 mb-2">
                      {milkQuantityData.delivered}L
                    </div>
                    <div className="text-[hsl(var(--eco-text-muted))] font-semibold text-sm sm:text-base">
                      Successfully delivered
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-white to-amber-50 border border-amber-200 shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-amber-400/20 to-transparent rounded-full -translate-y-10 translate-x-10"></div>
                <CardHeader className="pb-3 sm:pb-4">
                  <CardTitle className="text-[hsl(var(--eco-secondary))] flex items-center text-base sm:text-lg font-black relative z-10">
                    <div className="w-8 h-8 bg-gradient-to-br from-amber-500 to-orange-600 rounded-lg flex items-center justify-center mr-3 shadow-lg">
                      <DollarSign className="w-4 h-4 text-white" />
                    </div>
                    <span className="truncate">Earnings</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="relative z-10">
                  <div className="text-center">
                    <div className="text-3xl sm:text-4xl font-black text-amber-600 mb-2">
                      ₹{totalEarnings.toFixed(0)}
                    </div>
                    <div className="text-[hsl(var(--eco-text-muted))] font-semibold text-sm sm:text-base">
                      Today's commission
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-white to-red-50 border border-red-200 shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-red-400/20 to-transparent rounded-full -translate-y-10 translate-x-10"></div>
                <CardHeader className="pb-3 sm:pb-4">
                  <CardTitle className="text-[hsl(var(--eco-secondary))] flex items-center text-base sm:text-lg font-black relative z-10">
                    <div className="w-8 h-8 bg-gradient-to-br from-red-500 to-pink-600 rounded-lg flex items-center justify-center mr-3 shadow-lg">
                      <AlertTriangle className="w-4 h-4 text-white" />
                    </div>
                    <span className="truncate">Returned</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="relative z-10">
                  <div className="text-center">
                    <div className="text-3xl sm:text-4xl font-black text-red-600 mb-2">
                      {milkQuantityData.returned}L
                    </div>
                    <div className="text-[hsl(var(--eco-text-muted))] font-semibold text-sm sm:text-base">
                      Spoilage/cancellation
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Performance & Efficiency + Shift Info */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              <Card className="bg-white shadow-xl border border-purple-100">
                <CardHeader>
                  <CardTitle className="text-[hsl(var(--eco-secondary))] flex items-center text-xl font-black">
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center mr-3 shadow-lg">
                      <TrendingUp className="w-5 h-5 text-white" />
                    </div>
                    Performance & Efficiency
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-purple-50 rounded-xl">
                      <p className="text-2xl font-black text-purple-600">{performanceData.averageDeliveryTime} min</p>
                      <p className="text-sm text-[hsl(var(--eco-text-muted))] font-semibold">Avg Delivery Time</p>
                    </div>
                    <div className="text-center p-4 bg-green-50 rounded-xl">
                      <p className="text-2xl font-black text-green-600">{performanceData.onTimePercentage}%</p>
                      <p className="text-sm text-[hsl(var(--eco-text-muted))] font-semibold">On-Time Rate</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="font-semibold">Completion Progress</span>
                      <span className="text-sm text-[hsl(var(--eco-text-muted))]">
                        {Math.round((milkQuantityData.delivered / milkQuantityData.totalAssigned) * 100)}%
                      </span>
                    </div>
                    <Progress 
                      value={(milkQuantityData.delivered / milkQuantityData.totalAssigned) * 100} 
                      className="h-3" 
                    />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white shadow-xl border border-blue-100">
                <CardHeader>
                  <CardTitle className="text-[hsl(var(--eco-secondary))] flex items-center text-xl font-black">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl flex items-center justify-center mr-3 shadow-lg">
                      <Clock className="w-5 h-5 text-white" />
                    </div>
                    Shift & Work Hours
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-blue-50 rounded-xl">
                      <p className="text-lg font-black text-blue-600">{shiftData.shiftStart} - {shiftData.shiftEnd}</p>
                      <p className="text-sm text-[hsl(var(--eco-text-muted))] font-semibold">Today's Shift</p>
                    </div>
                    <div className="text-center p-4 bg-indigo-50 rounded-xl">
                      <p className="text-2xl font-black text-indigo-600">{shiftData.workingHours}h</p>
                      <p className="text-sm text-[hsl(var(--eco-text-muted))] font-semibold">Hours Worked</p>
                    </div>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="font-semibold">Break Time Used</span>
                    <span className="text-sm bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full">
                      {shiftData.breaksTaken} breaks taken
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Today's Deliveries */}
            <Card className="bg-white shadow-xl border border-green-100">
              <CardHeader>
                <CardTitle className="text-[hsl(var(--eco-secondary))] flex items-center text-xl font-black">
                  <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center mr-3 shadow-lg">
                    <Truck className="w-5 h-5 text-white" />
                  </div>
                  Today's Assigned Deliveries
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {pendingOrders.length > 0 ? (
                    pendingOrders.map((order: any) => (
                      <DeliveryOrderCard
                        key={order.id}
                        order={order}
                        onMarkOutForDelivery={handleMarkOutForDelivery}
                        onMarkDelivered={handleMarkDelivered}
                        isPending={updateOrderStatusMutation.isPending}
                      />
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
                      <p className="text-xl font-bold text-[hsl(var(--eco-secondary))] mb-2">All Deliveries Completed!</p>
                      <p className="text-[hsl(var(--eco-text-muted))] font-semibold">Great job! You've completed all today's deliveries.</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Route & Map Tab */}
          <TabsContent value="route" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {/* Map Placeholder */}
              <Card className="lg:col-span-1 xl:col-span-2 bg-white shadow-xl border border-blue-100">
                <CardHeader>
                  <CardTitle className="text-[hsl(var(--eco-secondary))] flex items-center text-xl font-black">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl flex items-center justify-center mr-3 shadow-lg">
                      <Route className="w-5 h-5 text-white" />
                    </div>
                    Optimized Delivery Route
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-gradient-to-br from-blue-50 to-green-50 rounded-xl p-8 text-center">
                    <MapPin className="w-16 h-16 text-blue-500 mx-auto mb-4" />
                    <p className="text-xl font-bold text-[hsl(var(--eco-secondary))] mb-2">Interactive Route Map</p>
                    <p className="text-[hsl(var(--eco-text-muted))] font-semibold mb-6">
                      Google Maps integration with optimized delivery path
                    </p>
                    <Button className="bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white font-bold px-6 py-2 rounded-xl shadow-lg">
                      <Navigation className="w-4 h-4 mr-2" />
                      Open Navigation
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Route Stops */}
              <Card className="bg-white shadow-xl border border-green-100">
                <CardHeader>
                  <CardTitle className="text-[hsl(var(--eco-secondary))] flex items-center text-lg font-black">
                    <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center mr-2 shadow-lg">
                      <MapPin className="w-4 h-4 text-white" />
                    </div>
                    Delivery Stops
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {todayOrders.slice(0, 5).map((order: any, index: number) => (
                      <div key={order.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                        <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                          {index + 1}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-sm truncate">
                            {order.deliveryAddress?.split(',')[0] || "Address"}
                          </p>
                          <p className="text-xs text-[hsl(var(--eco-text-muted))]">
                            ETA: {Math.floor(Math.random() * 20 + 10)} mins
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Vehicle Info */}
            <Card className="bg-white shadow-xl border border-amber-100">
              <CardHeader>
                <CardTitle className="text-[hsl(var(--eco-secondary))] flex items-center text-xl font-black">
                  <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center mr-3 shadow-lg">
                    <Fuel className="w-5 h-5 text-white" />
                  </div>
                  Vehicle & Resource Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-amber-50 rounded-xl">
                    <p className="text-lg font-black text-amber-600">{vehicleData.vehicleId}</p>
                    <p className="text-sm text-[hsl(var(--eco-text-muted))] font-semibold">Vehicle ID</p>
                  </div>
                  <div className="text-center p-4 bg-orange-50 rounded-xl">
                    <p className="text-sm font-black text-orange-600">{vehicleData.vehicleType}</p>
                    <p className="text-sm text-[hsl(var(--eco-text-muted))] font-semibold">Type</p>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-xl">
                    <p className="text-lg font-black text-green-600">{vehicleData.milkCanCount}</p>
                    <p className="text-sm text-[hsl(var(--eco-text-muted))] font-semibold">Total Cans</p>
                  </div>
                  <div className="text-center p-4 bg-blue-50 rounded-xl">
                    <p className="text-lg font-black text-blue-600">{vehicleData.deliveredCans}</p>
                    <p className="text-sm text-[hsl(var(--eco-text-muted))] font-semibold">Delivered</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Delivery History Tab */}
          <TabsContent value="history" className="space-y-6">
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              <Card className="bg-white shadow-xl border border-purple-100">
                <CardHeader>
                  <CardTitle className="text-[hsl(var(--eco-secondary))] flex items-center text-xl font-black">
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center mr-3 shadow-lg">
                      <Calendar className="w-5 h-5 text-white" />
                    </div>
                    Weekly Summary
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-3 gap-4">
                      <div className="text-center p-4 bg-purple-50 rounded-xl">
                        <p className="text-2xl font-black text-purple-600">238</p>
                        <p className="text-sm text-[hsl(var(--eco-text-muted))] font-semibold">Deliveries</p>
                      </div>
                      <div className="text-center p-4 bg-green-50 rounded-xl">
                        <p className="text-2xl font-black text-green-600">5,950L</p>
                        <p className="text-sm text-[hsl(var(--eco-text-muted))] font-semibold">Total Liters</p>
                      </div>
                      <div className="text-center p-4 bg-amber-50 rounded-xl">
                        <p className="text-2xl font-black text-amber-600">₹19,850</p>
                        <p className="text-sm text-[hsl(var(--eco-text-muted))] font-semibold">Earnings</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white shadow-xl border border-blue-100">
                <CardHeader>
                  <CardTitle className="text-[hsl(var(--eco-secondary))] flex items-center text-xl font-black">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl flex items-center justify-center mr-3 shadow-lg">
                      <Star className="w-5 h-5 text-white" />
                    </div>
                    Customer Feedback
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-center p-4 bg-yellow-50 rounded-xl">
                      <div className="flex items-center justify-center space-x-1 mb-2">
                        {[1,2,3,4,5].map((star) => (
                          <Star 
                            key={star} 
                            className={`w-5 h-5 ${star <= Math.floor(feedbackData.averageRating) ? 'text-yellow-500 fill-current' : 'text-gray-300'}`}
                          />
                        ))}
                      </div>
                      <p className="text-2xl font-black text-yellow-600">{feedbackData.averageRating}/5.0</p>
                      <p className="text-sm text-[hsl(var(--eco-text-muted))] font-semibold">
                        Average Rating ({feedbackData.totalRatings} reviews)
                      </p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-3 bg-green-50 rounded-lg">
                        <p className="text-xl font-black text-green-600">{feedbackData.compliments}</p>
                        <p className="text-sm text-[hsl(var(--eco-text-muted))] font-semibold">Compliments</p>
                      </div>
                      <div className="text-center p-3 bg-red-50 rounded-lg">
                        <p className="text-xl font-black text-red-600">{feedbackData.complaints}</p>
                        <p className="text-sm text-[hsl(var(--eco-text-muted))] font-semibold">Complaints</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Monthly Comparison Chart */}
            <Card className="bg-white shadow-xl border border-indigo-100">
              <CardHeader>
                <CardTitle className="text-[hsl(var(--eco-secondary))] flex items-center text-xl font-black">
                  <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center mr-3 shadow-lg">
                    <BarChart3 className="w-5 h-5 text-white" />
                  </div>
                  Monthly Performance Trends
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-8 text-center">
                  <BarChart3 className="w-16 h-16 text-indigo-500 mx-auto mb-4" />
                  <p className="text-xl font-bold text-[hsl(var(--eco-secondary))] mb-2">Performance Analytics</p>
                  <p className="text-[hsl(var(--eco-text-muted))] font-semibold mb-4">
                    Detailed charts and trends analysis coming soon
                  </p>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="bg-white p-3 rounded-lg">
                      <p className="text-lg font-black text-indigo-600">+15%</p>
                      <p className="text-xs text-[hsl(var(--eco-text-muted))]">vs Last Month</p>
                    </div>
                    <div className="bg-white p-3 rounded-lg">
                      <p className="text-lg font-black text-green-600">96%</p>
                      <p className="text-xs text-[hsl(var(--eco-text-muted))]">Efficiency</p>
                    </div>
                    <div className="bg-white p-3 rounded-lg">
                      <p className="text-lg font-black text-purple-600">4.9★</p>
                      <p className="text-xs text-[hsl(var(--eco-text-muted))]">Rating</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Payments Tab */}
          <TabsContent value="payments" className="space-y-6">
            <div className="w-full overflow-hidden">
              <div className="flex flex-col sm:flex-row gap-4 justify-between items-stretch">
                <Card className="flex-1 bg-gradient-to-br from-white to-green-50 border border-green-200 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] relative overflow-hidden min-w-0">
                  <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-green-400/20 to-transparent rounded-full -translate-y-8 translate-x-8"></div>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-[hsl(var(--eco-secondary))] flex items-center text-base font-black relative z-10">
                      <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center mr-3 shadow-lg">
                        <DollarSign className="w-4 h-4 text-white" />
                      </div>
                      <span className="truncate">Cash Collected</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="relative z-10">
                    <div className="text-center">
                      <div className="text-2xl font-black text-green-600 mb-2">
                        ₹{paymentData.cashCollected}
                      </div>
                      <div className="text-[hsl(var(--eco-text-muted))] font-semibold text-xs">
                        COD Orders
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="flex-1 bg-gradient-to-br from-white to-blue-50 border border-blue-200 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] relative overflow-hidden min-w-0">
                  <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-blue-400/20 to-transparent rounded-full -translate-y-8 translate-x-8"></div>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-[hsl(var(--eco-secondary))] flex items-center text-base font-black relative z-10">
                      <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-lg flex items-center justify-center mr-3 shadow-lg">
                        <CreditCard className="w-4 h-4 text-white" />
                      </div>
                      <span className="truncate">Digital Payments</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="relative z-10">
                    <div className="text-center">
                      <div className="text-2xl font-black text-blue-600 mb-2">
                        ₹{paymentData.digitalPayments}
                      </div>
                      <div className="text-[hsl(var(--eco-text-muted))] font-semibold text-xs">
                        UPI/Card/Online
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="flex-1 bg-gradient-to-br from-white to-amber-50 border border-amber-200 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] relative overflow-hidden min-w-0">
                  <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-amber-400/20 to-transparent rounded-full -translate-y-8 translate-x-8"></div>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-[hsl(var(--eco-secondary))] flex items-center text-base font-black relative z-10">
                      <div className="w-8 h-8 bg-gradient-to-br from-amber-500 to-orange-600 rounded-lg flex items-center justify-center mr-3 shadow-lg">
                        <Clock className="w-4 h-4 text-white" />
                      </div>
                      <span className="truncate">Pending Settlement</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="relative z-10">
                    <div className="text-center">
                      <div className="text-2xl font-black text-amber-600 mb-2">
                        ₹{paymentData.pendingSettlement}
                      </div>
                      <div className="text-[hsl(var(--eco-text-muted))] font-semibold text-xs">
                        Awaiting processing
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Payment History */}
            <Card className="bg-white shadow-xl border border-purple-100">
              <CardHeader>
                <CardTitle className="text-[hsl(var(--eco-secondary))] flex items-center text-xl font-black">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center mr-3 shadow-lg">
                    <Activity className="w-5 h-5 text-white" />
                  </div>
                  Recent Payment Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { time: "2 hours ago", amount: "₹450", type: "Cash Collection", status: "completed" },
                    { time: "4 hours ago", amount: "₹320", type: "Digital Payment", status: "completed" },
                    { time: "6 hours ago", amount: "₹280", type: "Cash Collection", status: "pending" },
                    { time: "Yesterday", amount: "₹1,250", type: "Daily Settlement", status: "completed" }
                  ].map((payment, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className={`w-3 h-3 rounded-full ${payment.status === 'completed' ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
                        <div>
                          <p className="font-semibold text-sm">{payment.type}</p>
                          <p className="text-xs text-[hsl(var(--eco-text-muted))]">{payment.time}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-green-600">{payment.amount}</p>
                        <p className={`text-xs ${payment.status === 'completed' ? 'text-green-600' : 'text-yellow-600'}`}>
                          {payment.status}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Alerts Tab */}
          <TabsContent value="alerts" className="space-y-6">
            <Card className="bg-white shadow-xl border border-red-100">
              <CardHeader>
                <CardTitle className="text-[hsl(var(--eco-secondary))] flex items-center text-xl font-black">
                  <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-pink-600 rounded-xl flex items-center justify-center mr-3 shadow-lg">
                    <Bell className="w-5 h-5 text-white" />
                  </div>
                  Alerts & Notifications
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {notifications.map((notification, index) => (
                    <div key={index} className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg">
                      <div className={`w-3 h-3 rounded-full mt-1 ${
                        notification.type === 'alert' ? 'bg-red-500' : 
                        notification.type === 'new' ? 'bg-blue-500' : 'bg-yellow-500'
                      }`}></div>
                      <div className="flex-1">
                        <p className="font-semibold text-sm">{notification.message}</p>
                        <p className="text-xs text-[hsl(var(--eco-text-muted))] mt-1">{notification.time}</p>
                      </div>
                      <Button size="sm" variant="ghost">
                        <CheckCircle className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-6">
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              {/* Personal Information */}
              <Card className="bg-white shadow-xl border border-indigo-100">
                <CardHeader>
                  <CardTitle className="text-[hsl(var(--eco-secondary))] flex items-center text-xl font-black">
                    <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center mr-3 shadow-lg">
                      <User className="w-5 h-5 text-white" />
                    </div>
                    Personal Information
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-center">
                      <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                        <User className="w-10 h-10 text-white" />
                      </div>
                      <h3 className="text-xl font-black text-[hsl(var(--eco-secondary))]">
                        {(user as any)?.firstName || "Amit"} Sharma
                      </h3>
                      <p className="text-[hsl(var(--eco-text-muted))] font-semibold">Employee ID: DEL-001</p>
                    </div>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="font-semibold">Mobile:</span>
                        <span>+91 9876543210</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-semibold">Email:</span>
                        <span>amit.sharma@example.com</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-semibold">Joined:</span>
                        <span>Jan 15, 2024</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* KYC Documents */}
              <Card className="bg-white shadow-xl border border-green-100">
                <CardHeader>
                  <CardTitle className="text-[hsl(var(--eco-secondary))] flex items-center text-xl font-black">
                    <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center mr-3 shadow-lg">
                      <Shield className="w-5 h-5 text-white" />
                    </div>
                    KYC Documents
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { name: "Aadhaar Card", status: "verified", icon: "🆔" },
                      { name: "PAN Card", status: "verified", icon: "💳" },
                      { name: "Driving License", status: "pending", icon: "🚗" },
                      { name: "Bank Details", status: "verified", icon: "🏦" }
                    ].map((doc, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <span className="text-2xl">{doc.icon}</span>
                          <span className="font-semibold">{doc.name}</span>
                        </div>
                        <Badge className={
                          doc.status === 'verified' ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'
                        }>
                          {doc.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                  <div className="mt-6">
                    <Button className="w-full bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white font-bold py-2 rounded-xl shadow-lg">
                      <FileText className="w-4 h-4 mr-2" />
                      Upload Documents
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}

function DeliveryOrderCard({ 
  order, 
  onMarkOutForDelivery, 
  onMarkDelivered, 
  isPending 
}: { 
  order: any; 
  onMarkOutForDelivery: (id: number) => void; 
  onMarkDelivered: (id: number) => void;
  isPending: boolean;
}) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed": return "bg-blue-100 text-blue-600";
      case "preparing": return "bg-orange-100 text-orange-600";
      case "out_for_delivery": return "bg-green-100 text-green-600";
      default: return "bg-gray-100 text-gray-600";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "confirmed": return "Ready for Pickup";
      case "preparing": return "Being Prepared";
      case "out_for_delivery": return "Out for Delivery";
      default: return status;
    }
  };

  return (
    <div className="border border-green-200 rounded-xl p-6 bg-gradient-to-r from-green-50/50 to-blue-50/50 space-y-4 hover:shadow-lg transition-all duration-300">
      <div className="flex justify-between items-start">
        <div className="space-y-2">
          <h3 className="font-black text-lg text-[hsl(var(--eco-secondary))]">Order #{order.id}</h3>
          <p className="text-sm text-[hsl(var(--eco-text-muted))] flex items-center space-x-2 font-semibold">
            <MapPin className="w-4 h-4 text-green-600" />
            <span>{order.deliveryAddress?.split(',')[0] || "Koramangala, Bangalore"}</span>
          </p>
          <p className="text-sm text-[hsl(var(--eco-text-muted))] flex items-center space-x-2 font-semibold">
            <Clock className="w-4 h-4 text-blue-600" />
            <span>Delivery: {order.deliveryTime || "Morning (6-9 AM)"}</span>
          </p>
        </div>
        <div className="text-right">
          <p className="text-xl font-black text-green-600 mb-2">
            ₹{parseFloat(order.totalAmount).toFixed(0)}
          </p>
          <Badge className={getStatusColor(order.status)}>
            {getStatusText(order.status)}
          </Badge>
        </div>
      </div>

      <div className="flex space-x-3">
        <Button
          variant="outline"
          size="sm"
          className="flex-1 border-blue-200 hover:bg-blue-50 text-blue-600"
          onClick={() => window.open(`tel:${order.phone || "+919876543210"}`)}
        >
          <Phone className="w-4 h-4 mr-2" />
          Call Customer
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          className="flex-1 border-green-200 hover:bg-green-50 text-green-600"
          onClick={() => window.open(`https://maps.google.com/?q=${encodeURIComponent(order.deliveryAddress || "Koramangala, Bangalore")}`)}
        >
          <Navigation className="w-4 h-4 mr-2" />
          Navigate
        </Button>
      </div>

      <div className="flex space-x-3">
        {order.status === "confirmed" || order.status === "preparing" ? (
          <Button
            onClick={() => onMarkOutForDelivery(order.id)}
            disabled={isPending}
            className="flex-1 bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white font-bold shadow-lg"
          >
            <Truck className="w-4 h-4 mr-2" />
            Start Delivery
          </Button>
        ) : (
          <Button
            onClick={() => onMarkDelivered(order.id)}
            disabled={isPending}
            className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold shadow-lg"
          >
            <CheckCircle className="w-4 h-4 mr-2" />
            Mark Delivered
          </Button>
        )}
        
        <Button
          variant="outline"
          size="sm"
          className="px-4 border-gray-200 hover:bg-gray-50"
        >
          <Camera className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}