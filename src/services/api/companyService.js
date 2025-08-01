import { toast } from 'react-toastify';

export const companyService = {
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
          { field: { Name: "industry" } },
          { field: { Name: "website" } },
          { field: { Name: "address" } },
          { field: { Name: "phone" } },
          { field: { Name: "email" } },
          { field: { Name: "employees" } },
          { field: { Name: "revenue" } },
          { field: { Name: "founded" } },
          { field: { Name: "description" } },
          { field: { Name: "Tags" } },
          { field: { Name: "Owner" } }
        ],
        orderBy: [{ fieldName: "CreatedOn", sorttype: "DESC" }],
        pagingInfo: { limit: 100, offset: 0 }
      };

      const response = await apperClient.fetchRecords('company', params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      return response.data || [];
} catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching companies:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return [];
    }
  },

  async getById(id) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "industry" } },
          { field: { Name: "website" } },
          { field: { Name: "address" } },
          { field: { Name: "phone" } },
          { field: { Name: "email" } },
          { field: { Name: "employees" } },
          { field: { Name: "revenue" } },
          { field: { Name: "founded" } },
          { field: { Name: "description" } },
          { field: { Name: "Tags" } },
          { field: { Name: "Owner" } }
        ]
      };

      const response = await apperClient.getRecordById('company', parseInt(id), params);

      if (!response.success) {
        console.error(response.message);
        return null;
      }

return response.data;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error(`Error fetching company with ID ${id}:`, error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return null;
    }
  },

  async create(companyData) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      // Only include Updateable fields
      const params = {
        records: [{
          Name: companyData.Name || companyData.name,
          industry: companyData.industry,
          website: companyData.website,
          address: companyData.address,
          phone: companyData.phone,
          email: companyData.email,
          employees: parseInt(companyData.employees) || 0,
          revenue: parseFloat(companyData.revenue) || 0,
          founded: companyData.founded || new Date().toISOString().split('T')[0],
          description: companyData.description,
          Tags: companyData.Tags || companyData.tags
        }]
      };

      const response = await apperClient.createRecord('company', params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create companies ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          
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
        console.error("Error creating company:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return null;
    }
  },

  async update(id, companyData) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      // Only include Updateable fields
      const params = {
        records: [{
          Id: parseInt(id),
          Name: companyData.Name || companyData.name,
          industry: companyData.industry,
          website: companyData.website,
          address: companyData.address,
          phone: companyData.phone,
          email: companyData.email,
          employees: parseInt(companyData.employees) || 0,
          revenue: parseFloat(companyData.revenue) || 0,
          founded: companyData.founded,
          description: companyData.description,
          Tags: companyData.Tags || companyData.tags
        }]
      };

      const response = await apperClient.updateRecord('company', params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success);
        const failedUpdates = response.results.filter(result => !result.success);
        
        if (failedUpdates.length > 0) {
          console.error(`Failed to update companies ${failedUpdates.length} records:${JSON.stringify(failedUpdates)}`);
          
          failedUpdates.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) toast.error(record.message);
          });
        }
        
        return successfulUpdates.length > 0 ? successfulUpdates[0].data : null;
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error updating company:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      throw error;
    }
  },

  async delete(id) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        RecordIds: [parseInt(id)]
      };

      const response = await apperClient.deleteRecord('company', params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return false;
      }

      if (response.results) {
        const successfulDeletions = response.results.filter(result => result.success);
        const failedDeletions = response.results.filter(result => !result.success);
        
        if (failedDeletions.length > 0) {
          console.error(`Failed to delete companies ${failedDeletions.length} records:${JSON.stringify(failedDeletions)}`);
          
          failedDeletions.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        
        return successfulDeletions.length > 0;
      }
} catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error deleting company:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return false;
    }
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
          { field: { Name: "industry" } },
          { field: { Name: "website" } },
          { field: { Name: "address" } },
          { field: { Name: "phone" } },
          { field: { Name: "email" } },
          { field: { Name: "employees" } },
          { field: { Name: "revenue" } },
          { field: { Name: "founded" } },
          { field: { Name: "description" } },
          { field: { Name: "Tags" } },
          { field: { Name: "Owner" } }
        ],
        whereGroups: [{
          operator: "OR",
          subGroups: [{
            conditions: [
              { fieldName: "Name", operator: "Contains", values: [query] },
              { fieldName: "industry", operator: "Contains", values: [query] },
              { fieldName: "website", operator: "Contains", values: [query] },
              { fieldName: "description", operator: "Contains", values: [query] }
            ],
            operator: "OR"
          }]
        }],
        orderBy: [{ fieldName: "CreatedOn", sorttype: "DESC" }],
        pagingInfo: { limit: 100, offset: 0 }
      };

      const response = await apperClient.fetchRecords('company', params);

      if (!response.success) {
        console.error(response.message);
        return [];
      }

      return response.data || [];
} catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error searching companies:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return [];
    }
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