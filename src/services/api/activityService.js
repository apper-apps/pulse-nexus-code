import activitiesData from "@/services/mockData/activities.json";

let activities = [...activitiesData];

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const activityService = {
  async getAll() {
    await delay(200);
    return [...activities];
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
      date: new Date().toISOString()
    };
    activities.push(newActivity);
    return { ...newActivity };
  },

  async getRecent(limit = 10) {
    await delay(200);
    return activities
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, limit);
  }
};