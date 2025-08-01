import { toast } from 'react-toastify';

// In-memory tasks storage for features not covered by app_Activity table
let tasks = [
  {
    Id: 1,
    contactId: 1,
    type: "call",
    title: "Follow-up on pricing discussion",
    description: "Call to discuss revised pricing structure",
    dueDate: "2024-01-17T14:00:00Z",
    priority: "high",
    status: "pending"
  },
  {
    Id: 2,
    contactId: 2,
    type: "meeting",
    title: "Product demo presentation",
    description: "Present updated product features and capabilities",
    dueDate: "2024-01-16T10:30:00Z",
    priority: "high",
    status: "pending"
  },
  {
    Id: 3,
    contactId: 3,
    type: "email",
    title: "Send integration timeline",
    description: "Email detailed integration timeline and milestones",
    dueDate: "2024-01-15T09:00:00Z",
    priority: "medium",
    status: "pending"
  },
  {
    Id: 4,
    contactId: 4,
    type: "follow-up",
    title: "Check on contract status",
    description: "Follow up on contract review progress",
    dueDate: "2024-01-18T16:00:00Z",
    priority: "medium",
    status: "pending"
  },
  {
    Id: 5,
    contactId: 5,
    type: "call",
    title: "Technical architecture review",
    description: "Review proposed technical architecture with client team",
    dueDate: "2024-01-14T13:00:00Z",
    priority: "high",
    status: "pending"
  }
];

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const activityService = {
  async getAll() {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "contactId" } },
          { field: { Name: "type" } },
          { field: { Name: "description" } },
          { field: { Name: "date" } },
          { field: { Name: "outcome" } },
          { field: { Name: "nextSteps" } },
          { field: { Name: "Tags" } },
          { field: { Name: "Owner" } }
        ],
        orderBy: [{ fieldName: "date", sorttype: "DESC" }],
        pagingInfo: { limit: 100, offset: 0 }
      };

      const response = await apperClient.fetchRecords('app_Activity', params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching activities:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return [];
    }
  },

  async getTasks() {
    await delay(200);
    return [...tasks].sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
  },

  async getByContactId(contactId) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "contactId" } },
          { field: { Name: "type" } },
          { field: { Name: "description" } },
          { field: { Name: "date" } },
          { field: { Name: "outcome" } },
          { field: { Name: "nextSteps" } },
          { field: { Name: "Tags" } },
          { field: { Name: "Owner" } }
        ],
        where: [{ FieldName: "contactId", Operator: "EqualTo", Values: [parseInt(contactId)] }],
        orderBy: [{ fieldName: "date", sorttype: "DESC" }],
        pagingInfo: { limit: 100, offset: 0 }
      };

      const response = await apperClient.fetchRecords('app_Activity', params);

      if (!response.success) {
        console.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching activities by contact:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return [];
    }
  },

  async create(activityData) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      // Only include Updateable fields
      const params = {
        records: [{
          Name: activityData.Name || `${activityData.type} - ${new Date().toLocaleDateString()}`,
          contactId: parseInt(activityData.contactId),
          type: activityData.type,
          description: activityData.description,
          date: new Date().toISOString(),
          outcome: activityData.outcome,
          nextSteps: activityData.nextSteps,
          Tags: activityData.Tags || activityData.tags
        }]
      };

      const response = await apperClient.createRecord('app_Activity', params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create activities ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          
          failedRecords.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) toast.error(record.message);
          });
        }
        
        return successfulRecords.length > 0 ? successfulRecords[0].data : null;
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error creating activity:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      throw error;
    }
  },

  async createTask(taskData) {
    await delay(300);
    const newTask = {
      ...taskData,
      Id: Math.max(...tasks.map(t => t.Id), 0) + 1,
      contactId: parseInt(taskData.contactId),
      status: "pending",
      createdDate: new Date().toISOString()
    };
    tasks.unshift(newTask);
    return { ...newTask };
  },

  async completeTask(taskId, completionData) {
    await delay(300);
    const taskIndex = tasks.findIndex(t => t.Id === parseInt(taskId));
    if (taskIndex === -1) {
      throw new Error("Task not found");
    }

    const task = tasks[taskIndex];
    
    // Create activity from completed task using database
    const completedActivity = await this.create({
      contactId: task.contactId,
      type: task.type,
      description: task.description,
      outcome: completionData.outcome,
      nextSteps: completionData.nextSteps
    });

    // Create follow-up task if specified
    if (completionData.followUpDate && completionData.followUpType) {
      const followUpTask = {
        Id: Math.max(...tasks.map(t => t.Id), 0) + 1,
        contactId: task.contactId,
        type: completionData.followUpType,
        title: `Follow-up: ${task.title}`,
        description: completionData.nextSteps || "Follow-up task",
        dueDate: completionData.followUpDate,
        priority: task.priority,
        status: "pending",
        createdDate: new Date().toISOString()
      };
      tasks.unshift(followUpTask);
    }

    // Remove completed task
    tasks.splice(taskIndex, 1);

    return { activity: completedActivity, task: null };
  },

  async updateTask(taskId, updateData) {
    await delay(300);
    const taskIndex = tasks.findIndex(t => t.Id === parseInt(taskId));
    if (taskIndex === -1) {
      throw new Error("Task not found");
    }

    tasks[taskIndex] = {
      ...tasks[taskIndex],
      ...updateData,
      contactId: parseInt(updateData.contactId || tasks[taskIndex].contactId),
      updatedDate: new Date().toISOString()
    };

    return { ...tasks[taskIndex] };
  },

  async deleteTask(taskId) {
    await delay(200);
    const taskIndex = tasks.findIndex(t => t.Id === parseInt(taskId));
    if (taskIndex === -1) {
      throw new Error("Task not found");
    }

    tasks.splice(taskIndex, 1);
    return true;
  },

  async getRecent(limit = 10) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "contactId" } },
          { field: { Name: "type" } },
          { field: { Name: "description" } },
          { field: { Name: "date" } },
          { field: { Name: "outcome" } },
          { field: { Name: "nextSteps" } },
          { field: { Name: "Tags" } },
          { field: { Name: "Owner" } }
        ],
        orderBy: [{ fieldName: "date", sorttype: "DESC" }],
        pagingInfo: { limit: limit, offset: 0 }
      };

      const response = await apperClient.fetchRecords('app_Activity', params);

      if (!response.success) {
        console.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching recent activities:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return [];
    }
  },

  async getTasksByContactId(contactId) {
    await delay(250);
    return tasks
      .filter(task => task.contactId === parseInt(contactId))
      .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
  },

  async getOverdueTasks() {
    await delay(200);
    const now = new Date();
    return tasks
      .filter(task => new Date(task.dueDate) < now)
      .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
  },

  async search(query) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      if (!query.trim()) return this.getAll();

      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "contactId" } },
          { field: { Name: "type" } },
          { field: { Name: "description" } },
          { field: { Name: "date" } },
          { field: { Name: "outcome" } },
          { field: { Name: "nextSteps" } },
          { field: { Name: "Tags" } },
          { field: { Name: "Owner" } }
        ],
        whereGroups: [{
          operator: "OR",
          subGroups: [{
            conditions: [
              { fieldName: "description", operator: "Contains", values: [query] },
              { fieldName: "outcome", operator: "Contains", values: [query] },
              { fieldName: "nextSteps", operator: "Contains", values: [query] },
              { fieldName: "type", operator: "Contains", values: [query] }
            ],
            operator: "OR"
          }]
        }],
        orderBy: [{ fieldName: "date", sorttype: "DESC" }],
        pagingInfo: { limit: 100, offset: 0 }
      };

      const response = await apperClient.fetchRecords('app_Activity', params);

      if (!response.success) {
        console.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error searching activities:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return [];
    }
  }
};