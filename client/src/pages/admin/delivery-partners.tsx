import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Truck, MapPin, Clock, Star, Plus, Search, Filter, Eye, MoreHorizontal, Phone, Mail, Navigation, Package, Timer } from "lucide-react";
import AdminLayout from "@/components/layout/admin-layout";
import { DataTable } from "@/components/ui/data-table";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';

const deliveryPartnersData = [
  { id: "DEL-001", name: "Ramesh Kumar", status: "Active", routes: 12, completed: 45, pending: 3, rating: 4.8, efficiency: 98, phone: "+91 98765 43210", email: "ramesh@delivery.com", vehicle: "Bike", area: "Koramangala", joinedDate: "2023-01-15", totalDeliveries: 1245 },
  { id: "DEL-002", name: "Sunil Patil", status: "Active", routes: 8, completed: 32, pending: 1, rating: 4.6, efficiency: 95, phone: "+91 98765 43211", email: "sunil@delivery.com", vehicle: "Scooter", area: "Indiranagar", joinedDate: "2023-02-20", totalDeliveries: 987 },
  { id: "DEL-003", name: "Vijay Singh", status: "Inactive", routes: 0, completed: 0, pending: 0, rating: 4.2, efficiency: 0, phone: "+91 98765 43212", email: "vijay@delivery.com", vehicle: "Bike", area: "Whitefield", joinedDate: "2023-03-10", totalDeliveries: 1556 },
  { id: "DEL-004", name: "Anil Sharma", status: "Active", routes: 15, completed: 58, pending: 5, rating: 4.9, efficiency: 92, phone: "+91 98765 43213", email: "anil@delivery.com", vehicle: "Bike", area: "Jayanagar", joinedDate: "2023-01-05", totalDeliveries: 2123 },
  { id: "DEL-005", name: "Mohan Reddy", status: "Active", routes: 10, completed: 38, pending: 2, rating: 4.7, efficiency: 96, phone: "+91 98765 43214", email: "mohan@delivery.com", vehicle: "Scooter", area: "Electronic City", joinedDate: "2023-04-12", totalDeliveries: 892 },
  { id: "DEL-006", name: "Kiran Kumar", status: "Active", routes: 6, completed: 22, pending: 1, rating: 4.5, efficiency: 89, phone: "+91 98765 43215", email: "kiran@delivery.com", vehicle: "Bike", area: "BTM Layout", joinedDate: "2023-05-18", totalDeliveries: 745 },
];

const performanceData = [
  { day: 'Mon', completed: 45, pending: 5, onTime: 42, delayed: 3 },
  { day: 'Tue', completed: 52, pending: 3, onTime: 49, delayed: 3 },
  { day: 'Wed', completed: 38, pending: 7, onTime: 35, delayed: 3 },
  { day: 'Thu', completed: 61, pending: 4, onTime: 58, delayed: 3 },
  { day: 'Fri', completed: 49, pending: 6, onTime: 44, delayed: 5 },
  { day: 'Sat', completed: 67, pending: 2, onTime: 63, delayed: 4 },
  { day: 'Sun', completed: 34, pending: 3, onTime: 32, delayed: 2 },
];

const deliveryStatusData = [
  { name: 'Completed', value: 85, color: '#10B981' },
  { name: 'In Transit', value: 12, color: '#3B82F6' },
  { name: 'Delayed', value: 3, color: '#EF4444' },
];

const partnersColumns = [
  {
    accessorKey: 'id',
    header: 'Partner ID',
    cell: ({ row }: any) => (
      <div className="font-mono text-sm text-blue-600">
        {row.getValue('id')}
      </div>
    ),
  },
  {
    accessorKey: 'name',
    header: 'Partner Details',
    cell: ({ row }: any) => (
      <div className="flex flex-col">
        <div className="font-medium text-gray-900">{row.getValue('name')}</div>
        <div className="text-xs text-gray-500 flex items-center mt-1">
          <MapPin className="w-3 h-3 mr-1" />
          {row.original.area}
        </div>
        <div className="text-xs text-gray-500 flex items-center">
          <Package className="w-3 h-3 mr-1" />
          {row.original.vehicle}
        </div>
      </div>
    ),
  },
  {
    accessorKey: 'contact',
    header: 'Contact',
    cell: ({ row }: any) => (
      <div className="flex flex-col space-y-1">
        <div className="flex items-center text-xs text-gray-600">
          <Phone className="w-3 h-3 mr-1" />
          {row.original.phone}
        </div>
        <div className="flex items-center text-xs text-gray-600">
          <Mail className="w-3 h-3 mr-1" />
          {row.original.email}
        </div>
      </div>
    ),
  },
  {
    accessorKey: 'routes',
    header: 'Active Routes',
    cell: ({ row }: any) => (
      <div className="text-sm font-semibold text-blue-600">
        {row.getValue('routes')} routes
      </div>
    ),
  },
  {
    accessorKey: 'completed',
    header: 'Today\'s Progress',
    cell: ({ row }: any) => (
      <div className="flex flex-col">
        <div className="text-sm font-medium text-green-600">
          {row.getValue('completed')} completed
        </div>
        <div className="text-xs text-orange-600">
          {row.original.pending} pending
        </div>
      </div>
    ),
  },
  {
    accessorKey: 'efficiency',
    header: 'Efficiency',
    cell: ({ row }: any) => {
      const efficiency = row.getValue('efficiency') as number;
      const color = efficiency >= 95 ? 'text-green-600' : efficiency >= 85 ? 'text-yellow-600' : 'text-red-600';
      return <div className={`text-sm font-medium ${color}`}>{efficiency}%</div>;
    },
  },
  {
    accessorKey: 'rating',
    header: 'Rating',
    cell: ({ row }: any) => (
      <div className="flex items-center text-sm">
        <Star className="w-4 h-4 text-yellow-500 mr-1 fill-current" />
        {row.getValue('rating')}
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
          className={`${status === 'Active' ? 'bg-green-100 text-green-800 border-green-200' : 'bg-red-100 text-red-800 border-red-200'} border`}
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
          data-testid={`track-partner-${row.original.id}`}
        >
          <Navigation className="h-4 w-4 text-blue-600" />
        </Button>
        <Button 
          variant="ghost" 
          size="sm"
          className="h-8 w-8 p-0 hover:bg-gray-50"
          data-testid={`partner-menu-${row.original.id}`}
        >
          <MoreHorizontal className="h-4 w-4 text-gray-600" />
        </Button>
      </div>
    ),
  },
];

export default function DeliveryPartnersPage() {
  const stats = [
    { title: "Total Partners", value: "45", icon: Truck, color: "text-blue-600", bgColor: "bg-blue-50" },
    { title: "Active Today", value: "38", icon: MapPin, color: "text-green-600", bgColor: "bg-green-50" },
    { title: "Deliveries Today", value: "234", icon: Clock, color: "text-orange-600", bgColor: "bg-orange-50" },
    { title: "Avg Rating", value: "4.7", icon: Star, color: "text-purple-600", bgColor: "bg-purple-50" },
  ];

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Delivery Partners</h1>
            <p className="text-gray-600 mt-1">Manage delivery network and route assignments</p>
          </div>
          <div className="flex space-x-3">
            <Button variant="outline" className="text-blue-600 border-blue-200 hover:bg-blue-50" data-testid="live-tracking">
              <Navigation className="w-4 h-4 mr-2" />
              Live Tracking
            </Button>
            <Button className="eco-button" data-testid="add-partner">
              <Plus className="w-4 h-4 mr-2" />
              Add Partner
            </Button>
          </div>
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

        {/* Performance Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Weekly Performance */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-100" data-testid="weekly-performance-chart">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Weekly Delivery Performance</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis 
                  dataKey="day" 
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
                <Bar dataKey="completed" fill="#10B981" name="Completed" radius={[4, 4, 0, 0]} />
                <Bar dataKey="delayed" fill="#EF4444" name="Delayed" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Delivery Status Distribution */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-100" data-testid="delivery-status-chart">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Current Delivery Status</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={deliveryStatusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {deliveryStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value: number) => [`${value}%`, 'Share']}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="grid grid-cols-3 gap-4 mt-4">
              {deliveryStatusData.map((item, index) => (
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

        {/* Partners Data Table */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Delivery Partners Directory</h3>
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
            columns={partnersColumns}
            data={deliveryPartnersData}
            searchPlaceholder="Search delivery partners..."
          />
        </div>

        {/* Real-time Alerts */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="eco-card hover:shadow-lg transition-shadow" data-testid="delayed-deliveries">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 rounded-xl bg-red-50">
                  <Timer className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Delayed Deliveries</h3>
                  <p className="text-gray-600 text-sm">7 deliveries running late today</p>
                  <Button variant="outline" size="sm" className="mt-2 text-red-600 border-red-200">
                    View Details
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="eco-card hover:shadow-lg transition-shadow" data-testid="top-performer-partner">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 rounded-xl bg-yellow-50">
                  <Star className="w-6 h-6 text-yellow-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Top Performer</h3>
                  <p className="text-gray-600 text-sm">Anil Sharma - 4.9★ rating</p>
                  <Button variant="outline" size="sm" className="mt-2 text-yellow-600 border-yellow-200">
                    Reward Partner
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="eco-card hover:shadow-lg transition-shadow" data-testid="route-assignments">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 rounded-xl bg-blue-50">
                  <Navigation className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Route Assignments</h3>
                  <p className="text-gray-600 text-sm">5 new routes ready to assign</p>
                  <Button variant="outline" size="sm" className="mt-2 text-blue-600 border-blue-200">
                    Assign Routes
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