import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Wallet, Gift, Headphones, Settings, LogOut } from "lucide-react";
import CustomerLayout from "@/components/layout/customer-layout";

export default function CustomerProfile() {
  const { user } = useAuth();

  const { data: orders } = useQuery({
    queryKey: ["/api/orders"],
    retry: false,
  });

  const { data: notifications } = useQuery({
    queryKey: ["/api/notifications"],
    retry: false,
  });

  const thisMonthOrders = orders?.filter((order: any) => {
    const orderDate = new Date(order.createdAt);
    const now = new Date();
    return orderDate.getMonth() === now.getMonth() && orderDate.getFullYear() === now.getFullYear();
  }) || [];

  const totalSpent = thisMonthOrders.reduce((total: number, order: any) => 
    total + parseFloat(order.totalAmount), 0
  );

  return (
    <CustomerLayout>
      <div className="p-4 space-y-6">
        <h1 className="text-2xl font-bold eco-text mb-6">Profile</h1>

        {/* Profile Card */}
        <Card className="eco-gradient text-white">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <img
                src={user?.profileImageUrl || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face"}
                alt="Profile"
                className="w-16 h-16 rounded-full object-cover border-4 border-white/30"
              />
              <div className="flex-1">
                <h2 className="text-xl font-bold">
                  {user?.firstName} {user?.lastName}
                </h2>
                <p className="opacity-90">{user?.phone || "+91 98765 43210"}</p>
                <p className="opacity-90 text-sm">{user?.email}</p>
              </div>
              <Button variant="ghost" className="text-white/80 hover:text-white">
                <Edit className="w-5 h-5" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Address */}
        <Card className="eco-card">
          <CardContent className="p-6">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-semibold eco-text">Delivery Address</h3>
              <Button variant="ghost" size="sm" className="text-[var(--eco-primary)]">
                Edit
              </Button>
            </div>
            <p className="eco-text-muted">
              {user?.address || "123, Koramangala 5th Block, Bangalore, Karnataka - 560095"}
            </p>
          </CardContent>
        </Card>

        {/* Billing Summary */}
        <Card className="eco-card">
          <CardContent className="p-6">
            <h3 className="font-semibold eco-text mb-4">This Month's Summary</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="eco-text-muted">Total Orders</span>
                <span className="font-semibold eco-text">{thisMonthOrders.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="eco-text-muted">Amount Spent</span>
                <span className="font-semibold eco-text">₹{totalSpent.toFixed(0)}</span>
              </div>
              <div className="flex justify-between">
                <span className="eco-text-muted">Bottles Returned</span>
                <span className="font-semibold eco-text">
                  {Math.floor(thisMonthOrders.length * 0.8)}/{thisMonthOrders.length}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="space-y-4">
          <h3 className="font-semibold eco-text">Quick Actions</h3>
          
          <div className="space-y-3">
            <ProfileActionCard
              icon={<Wallet className="w-5 h-5 text-[var(--eco-primary)]" />}
              title="Wallet Balance"
              subtitle="₹150"
              onClick={() => {}}
            />

            <ProfileActionCard
              icon={<Gift className="w-5 h-5 text-[var(--eco-secondary)]" />}
              title="Referral Program"
              subtitle="Earn rewards"
              onClick={() => {}}
            />

            <ProfileActionCard
              icon={<Headphones className="w-5 h-5 text-[var(--eco-accent)]" />}
              title="Support & Help"
              subtitle="Get assistance"
              onClick={() => {}}
            />

            <ProfileActionCard
              icon={<Settings className="w-5 h-5 text-[var(--eco-text-muted)]" />}
              title="Settings"
              subtitle="App preferences"
              onClick={() => {}}
            />

            <ProfileActionCard
              icon={<LogOut className="w-5 h-5 text-red-500" />}
              title="Logout"
              subtitle="Sign out of app"
              onClick={() => window.location.href = '/api/logout'}
            />
          </div>
        </div>
      </div>
    </CustomerLayout>
  );
}

function ProfileActionCard({ 
  icon, 
  title, 
  subtitle, 
  onClick 
}: { 
  icon: React.ReactNode; 
  title: string; 
  subtitle: string; 
  onClick: () => void; 
}) {
  return (
    <Card className="eco-card cursor-pointer hover:shadow-lg transition-shadow" onClick={onClick}>
      <CardContent className="p-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          {icon}
          <div>
            <span className="eco-text font-medium">{title}</span>
            <p className="text-sm eco-text-muted">{subtitle}</p>
          </div>
        </div>
        <div className="text-[var(--eco-text-muted)]">→</div>
      </CardContent>
    </Card>
  );
}
