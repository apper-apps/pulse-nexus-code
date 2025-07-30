import { useState, useEffect } from "react";
import { activityService } from "@/services/api/activityService";

export const useActivities = (contactId = null) => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadActivities = async () => {
    try {
      setLoading(true);
      setError("");
      const data = contactId 
        ? await activityService.getByContactId(contactId)
        : await activityService.getRecent();
      setActivities(data);
    } catch (err) {
      setError(err.message || "Failed to load activities");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadActivities();
  }, [contactId]);

  const createActivity = async (activityData) => {
    const newActivity = await activityService.create(activityData);
    setActivities(prev => [newActivity, ...prev]);
    return newActivity;
  };

  return {
    activities,
    loading,
    error,
    loadActivities,
    createActivity
  };
};