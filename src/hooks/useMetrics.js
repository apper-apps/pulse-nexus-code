import { useEffect, useState } from "react";
import { contactService } from "@/services/api/contactService";
import { metricService } from "@/services/api/metricService";
import { dealService } from "@/services/api/dealService";
import { activityService } from "@/services/api/activityService";

export const useMetrics = () => {
const [metrics, setMetrics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

const loadMetrics = async () => {
    try {
      setLoading(true);
      setError("");
      
      // Get live data from all services
const liveMetrics = await metricService.getDashboardMetrics();
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