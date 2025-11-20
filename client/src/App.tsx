import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
// import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/useAuth";
import NotFound from "@/pages/not-found";
import Landing from "@/pages/landing";
import CustomerHome from "@/pages/customer/home";
import CustomerMilk from "@/pages/customer/milk";
import CustomerShop from "@/pages/customer/shop";
import CustomerOrders from "@/pages/customer/orders";
import CustomerProfile from "@/pages/customer/profile";
import CustomerSubscription from "@/pages/customer/subscription";
import CustomerCart from "@/pages/customer/cart";
import CustomerWallet from "@/pages/customer/wallet";
import CustomerOffers from "@/pages/customer/offers";
import CustomerAddresses from "@/pages/customer/addresses";
import CustomerSupport from "@/pages/customer/support";
import CustomerNotifications from "@/pages/customer/notifications";
import CustomerWellness from "@/pages/customer/wellness";
import CustomerFestivals from "@/pages/customer/festivals";
import CustomerSettings from "@/pages/customer/settings";
import AdminDashboard from "@/pages/admin/dashboard";
import VendorsPage from "@/pages/admin/vendors";
import SubVendorsPage from "@/pages/admin/subvendors";
import DeliveryPartnersPage from "@/pages/admin/delivery-partners";
import CustomersPage from "@/pages/admin/customers";
import CirculationPage from "@/pages/admin/circulation";
import FinancePage from "@/pages/admin/finance";
import RequirementsPage from "@/pages/admin/requirements";
import ComplaintsPage from "@/pages/admin/complaints";
import ReportsPage from "@/pages/admin/reports";
import SettingsPage from "@/pages/admin/settings";
import VendorDashboard from "@/pages/vendor/dashboard";
import SubVendorDashboard from "@/pages/vendor/sub-vendor-dashboard";
import MainVendorDashboard from "@/pages/vendor/vendor-dashboard";
import DeliveryDashboard from "@/pages/delivery/dashboard";
import PhoneEntry from "@/pages/auth/phone-entry";
import OTPVerification from "@/pages/auth/otp-verification";
import AddressSetup from "@/pages/auth/address-setup";

function Router() {
  const { user, isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[hsl(var(--eco-cream))]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[hsl(var(--eco-primary))]"></div>
      </div>
    );
  }

  return (
    <Switch>
      {/* Landing page for unauthenticated users */}
      {!isAuthenticated && <Route path="/" component={Landing} />}
      
      {/* Authenticated users go to home */}
      {isAuthenticated && <Route path="/" component={CustomerHome} />}

      {/* Customer routes - always available for development */}
      <Route path="/home" component={CustomerHome} />
      <Route path="/milk" component={CustomerMilk} />
      <Route path="/shop" component={CustomerShop} />
      <Route path="/orders" component={CustomerOrders} />
      <Route path="/profile" component={CustomerProfile} />
      
      {/* New Customer Feature Routes */}
      <Route path="/subscription" component={CustomerSubscription} />
      <Route path="/cart" component={CustomerCart} />
      <Route path="/wallet" component={CustomerWallet} />
      <Route path="/offers" component={CustomerOffers} />
      <Route path="/addresses" component={CustomerAddresses} />
      <Route path="/support" component={CustomerSupport} />
      <Route path="/notifications" component={CustomerNotifications} />
      <Route path="/wellness" component={CustomerWellness} />
      <Route path="/festivals" component={CustomerFestivals} />
      <Route path="/settings" component={CustomerSettings} />

      {/* Admin routes */}
      <Route path="/admin" component={AdminDashboard} />
      <Route path="/admin/vendors" component={VendorsPage} />
      <Route path="/admin/subvendors" component={SubVendorsPage} />
      <Route path="/admin/delivery" component={DeliveryPartnersPage} />
      <Route path="/admin/customers" component={CustomersPage} />
      <Route path="/admin/circulation" component={CirculationPage} />
      <Route path="/admin/finance" component={FinancePage} />
      <Route path="/admin/requirements" component={RequirementsPage} />
      <Route path="/admin/complaints" component={ComplaintsPage} />
      <Route path="/admin/reports" component={ReportsPage} />
      <Route path="/admin/inventory" component={AdminDashboard} />
      <Route path="/admin/invoices" component={AdminDashboard} />
      <Route path="/admin/employees" component={AdminDashboard} />
      <Route path="/admin/roles" component={AdminDashboard} />
      <Route path="/admin/settings" component={SettingsPage} />
      <Route path="/admin/banking" component={AdminDashboard} />
      <Route path="/admin/audit" component={AdminDashboard} />
      <Route path="/admin/marketing" component={AdminDashboard} />
      <Route path="/admin/loyalty" component={AdminDashboard} />
      <Route path="/admin/monitoring" component={AdminDashboard} />
      
      {/* Vendor hierarchy routes */}
      <Route path="/vendor" component={VendorDashboard} />
      <Route path="/Sub-Vendor" component={SubVendorDashboard} />
      <Route path="/main-vendor" component={MainVendorDashboard} />
      
      {/* Delivery partner routes */}
      <Route path="/delivery" component={DeliveryDashboard} />
      
      {/* Landing page for non-authenticated users */}
      <Route path="/landing" component={Landing} />
      
      {/* Fallback to 404 */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Toaster />
      <Router />
    </QueryClientProvider>
  );
}

export default App;
