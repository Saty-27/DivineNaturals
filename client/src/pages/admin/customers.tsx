import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Users, UserPlus, CreditCard, Heart, Plus, Search, Filter, Eye, MoreHorizontal, MapPin, Clock, Star, Phone, Mail, Calendar } from "lucide-react";
import AdminLayout from "@/components/layout/admin-layout";
import { DataTable } from "@/components/ui/data-table";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, Area, AreaChart } from 'recharts';

const customerData = [
  { id: "CUST-001", name: "Rajesh Kumar", email: "rajesh@gmail.com", phone: "+91 98765 43210", subscription: "Daily", payment: "Paid", loyalty: 850, status: "Active", joinedDate: "2023-01-15", lastOrder: "2025-08-22", totalOrders: 145, totalSpent: 12500 },
  { id: "CUST-002", name: "Priya Sharma", email: "priya@gmail.com", phone: "+91 98765 43211", subscription: "Weekly", payment: "Pending", loyalty: 1200, status: "Active", joinedDate: "2023-02-20", lastOrder: "2025-08-21", totalOrders: 89, totalSpent: 8900 },
  { id: "CUST-003", name: "Amit Patel", email: "amit@gmail.com", phone: "+91 98765 43212", subscription: "Monthly", payment: "Paid", loyalty: 450, status: "Inactive", joinedDate: "2023-03-10", lastOrder: "2025-08-10", totalOrders: 234, totalSpent: 18700 },
  { id: "CUST-004", name: "Sunita Devi", email: "sunita@gmail.com", phone: "+91 98765 43213", subscription: "Daily", payment: "Paid", loyalty: 1500, status: "Active", joinedDate: "2023-01-05", lastOrder: "2025-08-22", totalOrders: 298, totalSpent: 24500 },
  { id: "CUST-005", name: "Vikram Singh", email: "vikram@gmail.com", phone: "+91 98765 43214", subscription: "Weekly", payment: "Paid", loyalty: 680, status: "Active", joinedDate: "2023-04-12", lastOrder: "2025-08-22", totalOrders: 67, totalSpent: 5800 },
  { id: "CUST-006", name: "Anjali Reddy", email: "anjali@gmail.com", phone: "+91 98765 43215", subscription: "Daily", payment: "Pending", loyalty: 920, status: "Active", joinedDate: "2023-05-18", lastOrder: "2025-08-21", totalOrders: 123, totalSpent: 11200 },
];

const customerGrowthData = [
  { month: 'Jan', newCustomers: 42, totalCustomers: 1850 },
  { month: 'Feb', newCustomers: 58, totalCustomers: 1908 },
  { month: 'Mar', newCustomers: 67, totalCustomers: 1975 },
  { month: 'Apr', newCustomers: 89, totalCustomers: 2064 },
  { month: 'May', newCustomers: 95, totalCustomers: 2159 },
  { month: 'Jun', newCustomers: 78, totalCustomers: 2237 },
  { month: 'Jul', newCustomers: 105, totalCustomers: 2342 },
  { month: 'Aug', newCustomers: 92, totalCustomers: 2434 },
];

const subscriptionData = [
  { name: 'Daily', value: 65, color: '#3B82F6' },
  { name: 'Weekly', value: 25, color: '#10B981' },
  { name: 'Monthly', value: 10, color: '#F59E0B' },
];

const customerColumns = [
  {
    accessorKey: 'id',
    header: 'Customer ID',
    cell: ({ row }: any) => (
      <div className="font-mono text-sm text-blue-600">
        {row.getValue('id')}
      </div>
    ),
  },
  {
    accessorKey: 'name',
    header: 'Customer Details',
    cell: ({ row }: any) => (
      <div className="flex flex-col">
        <div className="font-medium text-gray-900">{row.getValue('name')}</div>
        <div className="text-xs text-gray-500 flex items-center mt-1">
          <Mail className="w-3 h-3 mr-1" />
          {row.original.email}
        </div>
        <div className="text-xs text-gray-500 flex items-center">
          <Phone className="w-3 h-3 mr-1" />
          {row.original.phone}
        </div>
      </div>
    ),
  },
  {
    accessorKey: 'subscription',
    header: 'Subscription',
    cell: ({ row }: any) => {
      const subscription = row.getValue('subscription') as string;
      const colors = {
        'Daily': 'bg-blue-100 text-blue-800 border-blue-200',
        'Weekly': 'bg-green-100 text-green-800 border-green-200',
        'Monthly': 'bg-orange-100 text-orange-800 border-orange-200',
      };
      return (
        <Badge className={`${colors[subscription as keyof typeof colors]} border`}>
          {subscription}
        </Badge>
      );
    },
  },
  {
    accessorKey: 'totalSpent',
    header: 'Total Spent',
    cell: ({ row }: any) => (
      <div className="text-sm font-semibold text-green-600">
        ₹{row.getValue('totalSpent')?.toLocaleString() || '0'}
      </div>
    ),
  },
  {
    accessorKey: 'totalOrders',
    header: 'Orders',
    cell: ({ row }: any) => (
      <div className="text-sm font-medium text-gray-700">
        {row.getValue('totalOrders')} orders
      </div>
    ),
  },
  {
    accessorKey: 'loyalty',
    header: 'Loyalty Points',
    cell: ({ row }: any) => (
      <div className="flex items-center text-sm">
        <Heart className="w-4 h-4 text-red-500 mr-1" />
        {row.getValue('loyalty')}
      </div>
    ),
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }: any) => {
      const status = row.getValue('status') as string;
      return (
        <Badge 
          className={`${status === 'Active' ? 'bg-green-100 text-green-800 border-green-200' : 'bg-gray-100 text-gray-800 border-gray-200'} border`}
          data-testid={`status-${status}`}
        >
          {status}
        </Badge>
      );
    },
  },
  {
    id: 'actions',
    header: 'Actions',
    cell: ({ row }: any) => (
      <div className="flex items-center space-x-2">
        <Button 
          variant="ghost" 
          size="sm"
          className="h-8 w-8 p-0 hover:bg-blue-50"
          data-testid={`view-customer-${row.original.id}`}
        >
          <Eye className="h-4 w-4 text-blue-600" />
        </Button>
        <Button 
          variant="ghost" 
          size="sm"
          className="h-8 w-8 p-0 hover:bg-gray-50"
          data-testid={`customer-menu-${row.original.id}`}
        >
          <MoreHorizontal className="h-4 w-4 text-gray-600" />
        </Button>
      </div>
    ),
  },
];

export default function CustomersPage() {
  const stats = [
    { title: "Total Customers", value: "2,847", icon: Users, color: "text-blue-600", bgColor: "bg-blue-50" },
    { title: "Active Customers", value: "2,156", icon: UserPlus, color: "text-green-600", bgColor: "bg-green-50" },
    { title: "Pending Payments", value: "₹45,200", icon: CreditCard, color: "text-orange-600", bgColor: "bg-orange-50" },
    { title: "Loyalty Points", value: "125K", icon: Heart, color: "text-purple-600", bgColor: "bg-purple-50" },
  ];

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Customers Management</h1>
            <p className="text-gray-600 mt-1">Manage customer relationships and engagement</p>
          </div>
          <Button className="eco-button" data-testid="add-customer">
            <Plus className="w-4 h-4 mr-2" />
            Add New Customer
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <Card key={index} className="eco-card stats-card" data-testid={`stat-${stat.title.toLowerCase().replace(/\s+/g, '-')}`}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm font-medium">{stat.title}</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                  </div>
                  <div className={`p-3 rounded-xl ${stat.bgColor}`}>
                    <stat.icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Customer Growth Chart */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-100" data-testid="customer-growth-chart">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Customer Growth Trend</h3>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={customerGrowthData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis 
                  dataKey="month" 
                  axisLine={false}
                  tickLine={false}
                  style={{ fontSize: '12px', fill: '#6B7280' }}
                />
                <YAxis 
                  axisLine={false}
                  tickLine={false}
                  style={{ fontSize: '12px', fill: '#6B7280' }}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    border: 'none',
                    borderRadius: '12px',
                    boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)'
                  }}
                />
                <Area 
                  type="monotone" 
                  dataKey="totalCustomers" 
                  stroke="#3B82F6" 
                  fill="#3B82F6" 
                  fillOpacity={0.1}
                  strokeWidth={3}
                  name="Total Customers"
                />
                <Area 
                  type="monotone" 
                  dataKey="newCustomers" 
                  stroke="#10B981" 
                  fill="#10B981" 
                  fillOpacity={0.2}
                  strokeWidth={3}
                  name="New Customers"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Subscription Distribution Chart */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-100" data-testid="subscription-distribution-chart">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Subscription Plans Distribution</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={subscriptionData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {subscriptionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value: number) => [`${value}%`, 'Share']}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="grid grid-cols-3 gap-4 mt-4">
              {subscriptionData.map((item, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: item.color }}
                  ></div>
                  <span className="text-sm text-gray-600">{item.name}</span>
                  <span className="text-sm font-medium text-gray-900">{item.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Customer Data Table */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Customer Directory</h3>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" className="text-blue-600 border-blue-200 hover:bg-blue-50">
                <Filter className="w-4 h-4 mr-2" />
                Filter
              </Button>
              <Button variant="outline" size="sm" className="text-blue-600 border-blue-200 hover:bg-blue-50">
                Export
              </Button>
            </div>
          </div>
          
          <DataTable
            columns={customerColumns}
            data={customerData}
            searchPlaceholder="Search customers..."
          />
        </div>

        {/* Customer Insights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="eco-card hover:shadow-lg transition-shadow" data-testid="high-value-customers">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 rounded-xl bg-purple-50">
                  <Star className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">High-Value Customers</h3>
                  <p className="text-gray-600 text-sm">124 customers spending &gt;₹500/month</p>
                  <Button variant="outline" size="sm" className="mt-2 text-purple-600 border-purple-200">
                    View VIP List
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="eco-card hover:shadow-lg transition-shadow" data-testid="payment-reminders">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 rounded-xl bg-orange-50">
                  <Clock className="w-6 h-6 text-orange-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Payment Reminders</h3>
                  <p className="text-gray-600 text-sm">45 customers with pending payments</p>
                  <Button variant="outline" size="sm" className="mt-2 text-orange-600 border-orange-200">
                    Send Reminders
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="eco-card hover:shadow-lg transition-shadow" data-testid="loyalty-program">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 rounded-xl bg-red-50">
                  <Heart className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Loyalty Program</h3>
                  <p className="text-gray-600 text-sm">125K points distributed this month</p>
                  <Button variant="outline" size="sm" className="mt-2 text-red-600 border-red-200">
                    Manage Program
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}