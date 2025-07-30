import { contactService } from './contactService';
import { companyService } from './companyService';
import { dealService } from './dealService';
import { activityService } from './activityService';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const globalSearchService = {
  async searchAll(query) {
    if (!query.trim()) return { contacts: [], companies: [], deals: [], activities: [] };
    
    await delay(300);
    
    try {
      const [contacts, companies, deals, activities] = await Promise.all([
        contactService.search(query),
        companyService.search(query),
        dealService.search(query),
        activityService.search(query)
      ]);

      return {
        contacts: contacts.slice(0, 5), // Limit results for performance
        companies: companies.slice(0, 5),
        deals: deals.slice(0, 5),
        activities: activities.slice(0, 5)
      };
    } catch (error) {
      console.error('Global search error:', error);
      return { contacts: [], companies: [], deals: [], activities: [] };
    }
  },

  highlightText(text, query) {
    if (!query.trim()) return text;
    
    const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    return text.replace(regex, '<mark class="bg-yellow-400/30 text-yellow-300 rounded px-1">$1</mark>');
  }
};