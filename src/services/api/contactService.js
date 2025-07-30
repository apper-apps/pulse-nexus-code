import contactsData from "@/services/mockData/contacts.json";

let contacts = [...contactsData];

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const contactService = {
  async getAll() {
    await delay(300);
    return [...contacts];
  },

  async getById(id) {
    await delay(200);
    const contact = contacts.find(c => c.Id === parseInt(id));
    return contact ? { ...contact } : null;
  },

  async create(contactData) {
    await delay(400);
    const newContact = {
      ...contactData,
      Id: Math.max(...contacts.map(c => c.Id), 0) + 1,
      createdAt: new Date().toISOString(),
      lastContactDate: null
    };
    contacts.push(newContact);
    return { ...newContact };
  },

  async update(id, contactData) {
    await delay(350);
    const index = contacts.findIndex(c => c.Id === parseInt(id));
    if (index !== -1) {
      contacts[index] = { ...contacts[index], ...contactData };
      return { ...contacts[index] };
    }
    throw new Error("Contact not found");
  },

  async delete(id) {
    await delay(250);
    const index = contacts.findIndex(c => c.Id === parseInt(id));
    if (index !== -1) {
      const deleted = contacts.splice(index, 1)[0];
      return { ...deleted };
    }
    throw new Error("Contact not found");
  },

  async search(query) {
    await delay(200);
    if (!query.trim()) return [...contacts];
    
    const searchTerm = query.toLowerCase();
    return contacts.filter(contact => 
      contact.name.toLowerCase().includes(searchTerm) ||
      contact.email.toLowerCase().includes(searchTerm) ||
      contact.company.toLowerCase().includes(searchTerm) ||
      contact.phone.includes(searchTerm)
    );
  }
};