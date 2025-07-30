import activitiesData from "@/services/mockData/activities.json";

let activities = [...activitiesData];
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
    await delay(200);
    return [...activities];
  },

  async getTasks() {
    await delay(200);
    return [...tasks].sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
  },

  async getByContactId(contactId) {
    await delay(250);
    return activities
      .filter(activity => activity.contactId === parseInt(contactId))
      .sort((a, b) => new Date(b.date) - new Date(a.date));
  },

  async create(activityData) {
    await delay(300);
    const newActivity = {
      ...activityData,
      Id: Math.max(...activities.map(a => a.Id), 0) + 1,
      contactId: parseInt(activityData.contactId),
      date: new Date().toISOString()
    };
    activities.unshift(newActivity);
    return { ...newActivity };
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
    
    // Create activity from completed task
    const completedActivity = {
      Id: Math.max(...activities.map(a => a.Id), 0) + 1,
      contactId: task.contactId,
      type: task.type,
      description: task.description,
      outcome: completionData.outcome,
      nextSteps: completionData.nextSteps,
      date: new Date().toISOString()
    };
    
    activities.unshift(completedActivity);

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
    await delay(200);
    return activities
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, limit);
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
return tasks
      .filter(task => new Date(task.dueDate) < now)
      .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
  },

  async search(query) {
    await delay(200);
    if (!query.trim()) return [...activities];
    
    const searchTerm = query.toLowerCase();
    return activities.filter(activity => 
      activity.description?.toLowerCase().includes(searchTerm) ||
      activity.outcome?.toLowerCase().includes(searchTerm) ||
      activity.nextSteps?.toLowerCase().includes(searchTerm) ||
      activity.type.toLowerCase().includes(searchTerm)
    );
  }
};