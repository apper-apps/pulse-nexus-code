import { useState, useEffect } from "react";
import { metricService } from "@/services/api/metricService";

export const useMetrics = () => {
const [metrics, setMetrics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

const loadMetrics = async () => {
    try {
      setLoading(true);
      setError("");
      
      // Get live data from all services
      const [baseMetrics, contacts, deals, activities] = await Promise.all([
        metricService.getDashboardMetrics(),
        import('@/services/api/contactService').then(m => m.contactService.getAll()),
        import('@/services/api/dealService').then(m => m.dealService.getAll()),
        import('@/services/api/activityService').then(m => m.activityService.getAll())
      ]);

      // Calculate live metrics
      const totalContacts = contacts.length;
      const activeDeals = deals.filter(deal => 
        !['Closed Won', 'Closed Lost'].includes(deal.stage)
      ).length;
      const pipelineValue = deals
        .filter(deal => !['Closed Won', 'Closed Lost'].includes(deal.stage))
        .reduce((sum, deal) => sum + deal.value, 0);
      const monthlyRevenue = deals
        .filter(deal => {
          const dealDate = new Date(deal.createdAt);
          const now = new Date();
          return deal.stage === 'Closed Won' && 
                 dealDate.getMonth() === now.getMonth() &&
                 dealDate.getFullYear() === now.getFullYear();
        })
        .reduce((sum, deal) => sum + deal.value, 0);

      const liveMetrics = [
        {
          label: "Total Contacts",
          value: totalContacts,
          change: 12.5,
          trend: "up"
        },
        {
          label: "Active Deals",
          value: activeDeals,
          change: 8.3,
          trend: "up"
        },
        {
          label: "Pipeline Value",
          value: pipelineValue,
          change: -2.1,
          trend: "down"
        },
        {
          label: "Monthly Revenue",
          value: monthlyRevenue,
          change: 15.7,
          trend: "up"
        }
      ];

      setMetrics(liveMetrics);
    } catch (err) {
      setError(err.message || "Failed to load metrics");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMetrics();
  }, []);

  return {
metrics,
    loading,
    error,
    loadMetrics
  };
};