import React from 'react';
import { Clock, User, Package, Truck, AlertTriangle } from 'lucide-react';

interface RecentActivityProps {
  orders: any[];
}

const getActivityIcon = (type: string) => {
  switch (type) {
    case 'order':
      return <Package className="w-4 h-4 text-blue-600" />;
    case 'delivery':
      return <Truck className="w-4 h-4 text-green-600" />;
    case 'customer':
      return <User className="w-4 h-4 text-purple-600" />;
    case 'alert':
      return <AlertTriangle className="w-4 h-4 text-orange-600" />;
    default:
      return <Clock className="w-4 h-4 text-gray-600" />;
  }
};

const getTimeAgo = (timestamp: string) => {
  const now = new Date();
  const time = new Date(timestamp);
  const diffInMinutes = Math.floor((now.getTime() - time.getTime()) / (1000 * 60));
  
  if (diffInMinutes < 1) return 'Just now';
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
  if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
  return `${Math.floor(diffInMinutes / 1440)}d ago`;
};

export function RecentActivityWidget({ orders }: RecentActivityProps) {
  // Mock recent activities
  const recentActivities = [
    {
      id: '1',
      type: 'order',
      title: 'New order received',
      description: 'Order #ORD-2025-001 from Rajesh Kumar',
      timestamp: '2025-08-22T08:30:00Z',
      priority: 'normal'
    },
    {
      id: '2',
      type: 'delivery',
      title: 'Delivery completed',
      description: 'Zone A morning route finished',
      timestamp: '2025-08-22T08:15:00Z',
      priority: 'normal'
    },
    {
      id: '3',
      type: 'alert',
      title: 'Stock alert',
      description: 'Toned milk running low in Zone B',
      timestamp: '2025-08-22T08:00:00Z',
      priority: 'high'
    },
    {
      id: '4',
      type: 'customer',
      title: 'New customer registered',
      description: 'Priya Sharma joined premium plan',
      timestamp: '2025-08-22T07:45:00Z',
      priority: 'normal'
    },
    {
      id: '5',
      type: 'order',
      title: 'Order cancelled',
      description: 'Order #ORD-2025-002 cancelled by customer',
      timestamp: '2025-08-22T07:30:00Z',
      priority: 'normal'
    },
    {
      id: '6',
      type: 'delivery',
      title: 'Delivery assigned',
      description: 'Suresh Patel assigned to Zone C',
      timestamp: '2025-08-22T07:15:00Z',
      priority: 'normal'
    }
  ];

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-100" data-testid="recent-activity">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
      
      <div className="space-y-4 max-h-80 overflow-y-auto">
        {recentActivities.map((activity, index) => (
          <div
            key={activity.id}
            className="flex items-start space-x-3 p-3 rounded-xl hover:bg-gray-50/80 transition-colors"
            data-testid={`activity-${activity.id}`}
          >
            <div className="flex-shrink-0 mt-0.5">
              {getActivityIcon(activity.type)}
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-medium text-gray-900 truncate">
                  {activity.title}
                </h4>
                {activity.priority === 'high' && (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                    High
                  </span>
                )}
              </div>
              <p className="text-xs text-gray-600 mt-1 truncate">
                {activity.description}
              </p>
              <div className="flex items-center mt-2 text-xs text-gray-500">
                <Clock className="w-3 h-3 mr-1" />
                {getTimeAgo(activity.timestamp)}
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-4 pt-4 border-t border-gray-100">
        <button className="w-full text-sm text-blue-600 hover:text-blue-700 font-medium" data-testid="view-all-activity">
          View all activity
        </button>
      </div>
    </div>
  );
}