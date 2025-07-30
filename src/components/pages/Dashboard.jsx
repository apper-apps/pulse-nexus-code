import { useState } from "react";
import { format } from "date-fns";
import ApperIcon from "@/components/ApperIcon";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import { useMetrics } from "@/hooks/useMetrics";
import { useActivities } from "@/hooks/useActivities";
import { useDeals } from "@/hooks/useDeals";
import { useContacts } from "@/hooks/useContacts";
import Chart from "react-apexcharts";
const Dashboard = () => {
  const { metrics, loading: metricsLoading, error: metricsError, loadMetrics } = useMetrics();
  const { activities, loading: activitiesLoading, error: activitiesError, loadActivities } = useActivities();
  const [selectedStage, setSelectedStage] = useState(null);
  const { deals, loading: dealsLoading } = useDeals();
  const { contacts, loading: contactsLoading } = useContacts();

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


  // Pipeline data for funnel chart
  const pipelineData = deals.reduce((acc, deal) => {
    acc[deal.stage] = (acc[deal.stage] || 0) + 1;
    return acc;
  }, {});

  const funnelOptions = {
    chart: {
      type: 'donut',
      background: 'transparent',
      events: {
        dataPointSelection: (event, chartContext, config) => {
          const stages = ['Lead', 'Qualified', 'Proposal', 'Negotiation', 'Closed Won'];
          setSelectedStage(stages[config.dataPointIndex]);
        }
      }
    },
    theme: {
      mode: 'dark'
    },
    colors: ['#6366F1', '#8B5CF6', '#EC4899', '#F59E0B', '#10B981'],
    labels: ['Lead', 'Qualified', 'Proposal', 'Negotiation', 'Closed Won'],
    legend: {
      labels: {
        colors: '#94A3B8'
      }
    },
    plotOptions: {
      pie: {
        donut: {
          size: '60%'
        }
      }
    },
    dataLabels: {
      enabled: true,
      style: {
        colors: ['#F8FAFC']
      }
    }
  };

  const funnelSeries = [
    pipelineData.Lead || 0,
    pipelineData.Qualified || 0,
    pipelineData.Proposal || 0,
    pipelineData.Negotiation || 0,
    pipelineData['Closed Won'] || 0
  ];

  // Monthly sales trend data
  const monthlyData = deals.reduce((acc, deal) => {
    if (deal.stage === 'Closed Won') {
      const month = new Date(deal.createdAt).toLocaleString('default', { month: 'short' });
      acc[month] = (acc[month] || 0) + deal.value;
    }
    return acc;
  }, {});

  const trendOptions = {
    chart: {
      type: 'area',
      background: 'transparent',
      toolbar: {
        show: false
      }
    },
    theme: {
      mode: 'dark'
    },
    colors: ['#6366F1'],
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.4,
        opacityTo: 0.1,
        stops: [0, 100]
      }
    },
    stroke: {
      curve: 'smooth',
      width: 3
    },
    xaxis: {
      categories: Object.keys(monthlyData),
      labels: {
        style: {
          colors: '#94A3B8'
        }
      }
    },
    yaxis: {
      labels: {
        style: {
          colors: '#94A3B8'
        },
        formatter: (value) => `$${(value / 1000).toFixed(0)}k`
      }
    },
    grid: {
      borderColor: '#334155'
    },
    dataLabels: {
      enabled: false
    }
  };

  const trendSeries = [{
    name: 'Revenue',
    data: Object.values(monthlyData)
  }];

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
        <div className="flex items-center gap-4">
          {selectedStage && (
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300">
              <span className="text-sm">Filtered: {selectedStage}</span>
              <button 
                onClick={() => setSelectedStage(null)}
                className="hover:text-white transition-colors"
              >
                <ApperIcon name="X" size={14} />
              </button>
            </div>
          )}
          <div className="text-sm text-slate-400">
            {format(new Date(), "EEEE, MMMM do, yyyy")}
          </div>
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
                    metric.label.includes("Pipeline") ? "TrendingUp" :
                    metric.label.includes("Revenue") ? "Banknote" :
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

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pipeline Funnel Chart */}
        <div className="glass-card rounded-xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center">
              <ApperIcon name="BarChart" size={16} className="text-white" />
            </div>
            <h2 className="text-xl font-semibold text-white">Sales Pipeline</h2>
          </div>
          
          {dealsLoading ? (
            <div className="flex items-center justify-center h-64">
              <Loading />
            </div>
          ) : (
            <div className="h-64">
              <Chart
                options={funnelOptions}
                series={funnelSeries}
                type="donut"
                height="100%"
              />
            </div>
          )}
          
          <p className="text-slate-400 text-sm mt-4 text-center">
            Click segments to filter dashboard data
          </p>
        </div>

        {/* Monthly Sales Trend */}
        <div className="glass-card rounded-xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
              <ApperIcon name="TrendingUp" size={16} className="text-white" />
            </div>
            <h2 className="text-xl font-semibold text-white">Revenue Trend</h2>
          </div>
          
          {dealsLoading ? (
            <div className="flex items-center justify-center h-64">
              <Loading />
            </div>
          ) : (
            <div className="h-64">
              <Chart
                options={trendOptions}
                series={trendSeries}
                type="area"
                height="100%"
              />
            </div>
          )}
        </div>
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
              {activities.slice(0, 10).map((activity) => {
                const contact = contacts.find(c => c.Id === activity.contactId);
                return (
                  <div key={activity.Id} className="flex items-start gap-4 p-4 rounded-lg hover:bg-white/5 transition-colors cursor-pointer">
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
                        {contact && (
                          <span className="text-xs text-slate-500">
                            • {contact.name}
                          </span>
                        )}
                      </div>
                      <p className="text-slate-300 text-sm">{activity.description}</p>
                    </div>
                  </div>
                );
              })}
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
              <h3 className="font-semibold text-white group-hover:text-green-300 transition-colors">Create Deal</h3>
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
              <h3 className="font-semibold text-white group-hover:text-purple-300 transition-colors">Log Activity</h3>
              <p className="text-slate-400 text-sm">Record your latest interaction</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;