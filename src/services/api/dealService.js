import mockDeals from '@/services/mockData/deals.json';

let deals = [...mockDeals];
let nextId = Math.max(...deals.map(d => d.Id)) + 1;

const dealService = {
  getAll: () => {
    return Promise.resolve([...deals]);
  },

  getById: (id) => {
    const dealId = parseInt(id);
    if (isNaN(dealId)) {
      return Promise.reject(new Error('Invalid deal ID'));
    }
    
    const deal = deals.find(d => d.Id === dealId);
    if (!deal) {
      return Promise.reject(new Error('Deal not found'));
    }
    
    return Promise.resolve({ ...deal });
  },

  create: (dealData) => {
    const newDeal = {
      ...dealData,
      Id: nextId++,
      createdAt: new Date().toISOString()
    };
    
    deals.push(newDeal);
    return Promise.resolve({ ...newDeal });
  },

  update: (id, dealData) => {
    const dealId = parseInt(id);
    if (isNaN(dealId)) {
      return Promise.reject(new Error('Invalid deal ID'));
    }
    
    const index = deals.findIndex(d => d.Id === dealId);
    if (index === -1) {
      return Promise.reject(new Error('Deal not found'));
    }
    
    deals[index] = { ...deals[index], ...dealData };
    return Promise.resolve({ ...deals[index] });
  },

  delete: (id) => {
    const dealId = parseInt(id);
    if (isNaN(dealId)) {
      return Promise.reject(new Error('Invalid deal ID'));
    }
    
    const index = deals.findIndex(d => d.Id === dealId);
    if (index === -1) {
      return Promise.reject(new Error('Deal not found'));
    }
    
    const deleted = deals.splice(index, 1)[0];
    return Promise.resolve({ ...deleted });
  },
search: (query) => {
    if (!query.trim()) return Promise.resolve([...deals]);
    
    const searchTerm = query.toLowerCase();
    const filteredDeals = deals.filter(deal => 
      deal.name.toLowerCase().includes(searchTerm) ||
      deal.company.toLowerCase().includes(searchTerm) ||
      deal.stage.toLowerCase().includes(searchTerm)
    );
    
    return Promise.resolve(filteredDeals.map(d => ({ ...d })));
  },

  getByStage: (stage) => {
    return Promise.resolve(deals.filter(d => d.stage === stage).map(d => ({ ...d })));
  }
};

export { dealService };