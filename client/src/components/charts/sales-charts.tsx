import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';

const salesData = [
  { month: 'Jan', revenue: 42000, orders: 145, customers: 89 },
  { month: 'Feb', revenue: 48000, orders: 167, customers: 102 },
  { month: 'Mar', revenue: 52000, orders: 189, customers: 118 },
  { month: 'Apr', revenue: 58000, orders: 203, customers: 134 },
  { month: 'May', revenue: 65000, orders: 227, customers: 151 },
  { month: 'Jun', revenue: 71000, orders: 245, customers: 167 },
  { month: 'Jul', revenue: 78000, orders: 268, customers: 189 },
  { month: 'Aug', revenue: 85000, orders: 293, customers: 205 },
];

const productData = [
  { name: 'Toned Milk', value: 45, color: '#3B82F6' },
  { name: 'Full Cream', value: 30, color: '#10B981' },
  { name: 'Skimmed Milk', value: 15, color: '#F59E0B' },
  { name: 'Organic Milk', value: 10, color: '#EF4444' },
];

const deliveryData = [
  { day: 'Mon', onTime: 94, delayed: 6, total: 100 },
  { day: 'Tue', onTime: 97, delayed: 3, total: 100 },
  { day: 'Wed', onTime: 92, delayed: 8, total: 100 },
  { day: 'Thu', onTime: 96, delayed: 4, total: 100 },
  { day: 'Fri', onTime: 98, delayed: 2, total: 100 },
  { day: 'Sat', onTime: 95, delayed: 5, total: 100 },
  { day: 'Sun', onTime: 93, delayed: 7, total: 100 },
];

export function RevenueChart() {
  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-100" data-testid="revenue-chart">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Revenue Trend</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={salesData}>
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
            tickFormatter={(value) => `₹${value/1000}k`}
          />
          <Tooltip 
            contentStyle={{
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              border: 'none',
              borderRadius: '12px',
              boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)'
            }}
            formatter={(value: number) => [`₹${value.toLocaleString()}`, 'Revenue']}
          />
          <Bar 
            dataKey="revenue" 
            fill="#3B82F6"
            radius={[6, 6, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function OrdersChart() {
  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-100" data-testid="orders-chart">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Orders & Customer Growth</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={salesData}>
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
          <Line 
            type="monotone" 
            dataKey="orders" 
            stroke="#10B981" 
            strokeWidth={3}
            dot={{ fill: '#10B981', strokeWidth: 2, r: 4 }}
            name="Orders"
          />
          <Line 
            type="monotone" 
            dataKey="customers" 
            stroke="#F59E0B" 
            strokeWidth={3}
            dot={{ fill: '#F59E0B', strokeWidth: 2, r: 4 }}
            name="New Customers"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export function ProductDistributionChart() {
  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-100" data-testid="product-distribution-chart">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Product Sales Distribution</h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={productData}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={100}
            paddingAngle={5}
            dataKey="value"
          >
            {productData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip 
            contentStyle={{
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              border: 'none',
              borderRadius: '12px',
              boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)'
            }}
            formatter={(value: number) => [`${value}%`, 'Share']}
          />
        </PieChart>
      </ResponsiveContainer>
      <div className="grid grid-cols-2 gap-4 mt-4">
        {productData.map((item, index) => (
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
  );
}

export function DeliveryPerformanceChart() {
  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-100" data-testid="delivery-performance-chart">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Weekly Delivery Performance</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={deliveryData}>
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
            domain={[0, 100]}
            tickFormatter={(value) => `${value}%`}
          />
          <Tooltip 
            contentStyle={{
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              border: 'none',
              borderRadius: '12px',
              boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)'
            }}
            formatter={(value: number, name: string) => [`${value}%`, name === 'onTime' ? 'On Time' : 'Delayed']}
          />
          <Bar 
            dataKey="onTime" 
            stackId="delivery"
            fill="#10B981"
            radius={[0, 0, 0, 0]}
            name="onTime"
          />
          <Bar 
            dataKey="delayed" 
            stackId="delivery"
            fill="#EF4444"
            radius={[4, 4, 0, 0]}
            name="delayed"
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}