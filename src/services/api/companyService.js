import mockCompanies from '../mockData/companies.json';

let companies = [...mockCompanies];
let nextId = Math.max(...companies.map(c => c.Id)) + 1;

export const companyService = {
  getAll: () => {
    return [...companies];
  },

  getById: (id) => {
    const numericId = parseInt(id);
    if (isNaN(numericId)) {
      return null;
    }
    return companies.find(company => company.Id === numericId) || null;
  },

  create: (companyData) => {
    const newCompany = {
      ...companyData,
      Id: nextId++,
      founded: companyData.founded || new Date().toISOString().split('T')[0],
      employees: companyData.employees || 0,
      revenue: companyData.revenue || 0
    };
    companies.push(newCompany);
    return newCompany;
  },

  update: (id, companyData) => {
    const numericId = parseInt(id);
    if (isNaN(numericId)) {
      return null;
    }
    
    const index = companies.findIndex(company => company.Id === numericId);
    if (index === -1) {
      return null;
    }
    
    companies[index] = { ...companies[index], ...companyData, Id: numericId };
    return companies[index];
  },

  delete: (id) => {
    const numericId = parseInt(id);
    if (isNaN(numericId)) {
      return false;
    }
    
    const index = companies.findIndex(company => company.Id === numericId);
    if (index === -1) {
      return false;
    }
    
    companies.splice(index, 1);
    return true;
  },
async search(query) {
    const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
    await delay(200);
    if (!query.trim()) return [...companies];
    
    const searchTerm = query.toLowerCase();
    return companies.filter(company => 
      company.name.toLowerCase().includes(searchTerm) ||
      company.industry.toLowerCase().includes(searchTerm) ||
      company.website?.toLowerCase().includes(searchTerm) ||
      company.description?.toLowerCase().includes(searchTerm)
    );
  },

  getContactCount: (companyId) => {
    // This would typically come from contactService
    // For now, return a mock count based on company ID
    return Math.floor(Math.random() * 20) + 1;
  },

  getTotalDealValue: (companyId) => {
    // This would typically come from dealService
    // For now, return a mock value based on company ID
    return Math.floor(Math.random() * 1000000) + 50000;
  }
};