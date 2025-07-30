import { format } from "date-fns";
import ApperIcon from "@/components/ApperIcon";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import { useMetrics } from "@/hooks/useMetrics";
import { useActivities } from "@/hooks/useActivities";

const Dashboard = () => {
  const { metrics, loading: metricsLoading, error: metricsError, loadMetrics } = useMetrics();
  const { activities, loading: activitiesLoading, error: activitiesError, loadActivities } = useActivities();

  if (metricsLoading || activitiesLoading) return <Loading />;
  if (metricsError || activitiesError) {
    return (
      <Error 
        message={metricsError || activitiesError} 
        onRetry={() => {
          loadMetrics();
          loadActivities();
        }} 
      />
    );
  }

  const formatMetricValue = (value, label) => {
    if (label.includes("Value")) {
      return `$${value.toLocaleString()}`;
    }
    return value.toLocaleString();
  };

  const getTrendIcon = (trend) => {
    return trend === "up" ? "TrendingUp" : "TrendingDown";
  };

  const getTrendColor = (trend) => {
    return trend === "up" ? "text-emerald-400" : "text-red-400";
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
            Dashboard
          </h1>
          <p className="text-slate-400 mt-1">
            Welcome back! Here's what's happening with your CRM.
          </p>
        </div>
        <div className="text-sm text-slate-400">
          {format(new Date(), "EEEE, MMMM do, yyyy")}
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric, index) => (
          <div key={index} className="glass-card rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                <ApperIcon 
                  name={
                    metric.label.includes("Contacts") ? "Users" :
                    metric.label.includes("Deals") ? "DollarSign" :
                    metric.label.includes("Value") ? "TrendingUp" :
                    "Activity"
                  } 
                  size={20} 
                  className="text-white" 
                />
              </div>
              <div className={`flex items-center gap-1 text-sm ${getTrendColor(metric.trend)}`}>
                <ApperIcon name={getTrendIcon(metric.trend)} size={14} />
                <span>{Math.abs(metric.change)}%</span>
              </div>
            </div>
            
            <div className="space-y-1">
              <h3 className="text-2xl font-bold text-white">
                {formatMetricValue(metric.value, metric.label)}
              </h3>
              <p className="text-slate-400 text-sm">{metric.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="glass-card rounded-xl">
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
              <ApperIcon name="Activity" size={16} className="text-white" />
            </div>
            <h2 className="text-xl font-semibold text-white">Recent Activity</h2>
          </div>
          <span className="text-sm text-slate-400">Last 10 activities</span>
        </div>
        
        <div className="p-6">
          {activities.length > 0 ? (
            <div className="space-y-4">
              {activities.map((activity) => (
                <div key={activity.Id} className="flex items-start gap-4 p-4 rounded-lg hover:bg-white/5 transition-colors">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                    <ApperIcon 
                      name={
                        activity.type === "email" ? "Mail" :
                        activity.type === "call" ? "Phone" :
                        activity.type === "meeting" ? "Calendar" :
                        "MessageSquare"
                      } 
                      size={14} 
                      className="text-white" 
                    />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-indigo-500/20 text-indigo-300 capitalize">
                        {activity.type}
                      </span>
                      <span className="text-xs text-slate-400">
                        {format(new Date(activity.date), "MMM dd, h:mm a")}
                      </span>
                    </div>
                    <p className="text-slate-300 text-sm">{activity.description}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <ApperIcon name="Activity" size={48} className="text-slate-600 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-slate-400 mb-2">No Recent Activity</h3>
              <p className="text-slate-500">Your recent activities will appear here.</p>
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-card rounded-xl p-6 hover:bg-white/10 transition-colors cursor-pointer group">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <ApperIcon name="UserPlus" size={24} className="text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-white group-hover:text-blue-300 transition-colors">Add Contact</h3>
              <p className="text-slate-400 text-sm">Create a new contact record</p>
            </div>
          </div>
        </div>

        <div className="glass-card rounded-xl p-6 hover:bg-white/10 transition-colors cursor-pointer group">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <ApperIcon name="Plus" size={24} className="text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-white group-hover:text-green-300 transition-colors">New Deal</h3>
              <p className="text-slate-400 text-sm">Start tracking a new deal</p>
            </div>
          </div>
        </div>

        <div className="glass-card rounded-xl p-6 hover:bg-white/10 transition-colors cursor-pointer group">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <ApperIcon name="Calendar" size={24} className="text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-white group-hover:text-purple-300 transition-colors">Schedule Activity</h3>
              <p className="text-slate-400 text-sm">Plan your next interaction</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;