import { useState, useEffect } from "react";
import { activityService } from "@/services/api/activityService";

export const useActivities = (contactId = null) => {
  const [activities, setActivities] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadActivities = async () => {
    try {
      setLoading(true);
      setError("");
      
      const [activitiesData, tasksData] = await Promise.all([
        contactId 
          ? activityService.getByContactId(contactId)
          : activityService.getRecent(),
        contactId
          ? activityService.getTasksByContactId(contactId)
          : activityService.getTasks()
      ]);
      
      setActivities(activitiesData);
      setTasks(tasksData);
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
    try {
      const newActivity = await activityService.create(activityData);
      setActivities(prev => [newActivity, ...prev]);
      return newActivity;
    } catch (err) {
      throw new Error(err.message || "Failed to create activity");
    }
  };

  const createTask = async (taskData) => {
    try {
      const newTask = await activityService.createTask(taskData);
      setTasks(prev => [newTask, ...prev]);
      return newTask;
    } catch (err) {
      throw new Error(err.message || "Failed to create task");
    }
  };

  const completeTask = async (taskId, completionData) => {
    try {
      const result = await activityService.completeTask(taskId, completionData);
      
      // Remove completed task from tasks list
      setTasks(prev => prev.filter(task => task.Id !== taskId));
      
      // Add new activity to activities list
      if (result.activity) {
        setActivities(prev => [result.activity, ...prev]);
      }
      
      // If a follow-up task was created, reload tasks to include it
      if (completionData.followUpDate) {
        const updatedTasks = await activityService.getTasks();
        setTasks(updatedTasks);
      }
      
      return result;
    } catch (err) {
      throw new Error(err.message || "Failed to complete task");
    }
  };

  const updateTask = async (taskId, updateData) => {
    try {
      const updatedTask = await activityService.updateTask(taskId, updateData);
      setTasks(prev => 
        prev.map(task => task.Id === taskId ? updatedTask : task)
      );
      return updatedTask;
    } catch (err) {
      throw new Error(err.message || "Failed to update task");
    }
  };

  const deleteTask = async (taskId) => {
    try {
      await activityService.deleteTask(taskId);
      setTasks(prev => prev.filter(task => task.Id !== taskId));
      return true;
    } catch (err) {
      throw new Error(err.message || "Failed to delete task");
    }
  };

  return {
    activities,
    tasks,
    loading,
    error,
    loadActivities,
    createActivity,
    createTask,
    completeTask,
    updateTask,
    deleteTask
  };
};