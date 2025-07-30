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
      const data = await metricService.getDashboardMetrics();
      setMetrics(data);
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