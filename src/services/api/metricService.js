import metricsData from "@/services/mockData/metrics.json";

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const metricService = {
  async getAll() {
    await delay(300);
    return [...metricsData];
  },

  async getDashboardMetrics() {
    await delay(250);
    return [...metricsData];
  }
};