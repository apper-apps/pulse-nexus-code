import { useState, useEffect } from 'react';
import { companyService } from '@/services/api/companyService';
import { toast } from 'react-toastify';

export const useCompanies = () => {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCompanies = async () => {
    try {
      setLoading(true);
      setError(null);
const data = await companyService.getAll();
      setCompanies(data);
    } catch (err) {
      setError(err.message);
      toast.error('Failed to load companies');
    } finally {
      setLoading(false);
    }
  };

  const createCompany = async (companyData) => {
    try {
const newCompany = await companyService.create(companyData);
      setCompanies(prev => [...prev, newCompany]);
      toast.success('Company created successfully');
      return newCompany;
    } catch (err) {
      toast.error('Failed to create company');
      throw err;
    }
  };

  const updateCompany = async (id, companyData) => {
    try {
const updatedCompany = await companyService.update(id, companyData);
      if (updatedCompany) {
        setCompanies(prev => prev.map(company => 
          company.Id === updatedCompany.Id ? updatedCompany : company
        ));
        toast.success('Company updated successfully');
        return updatedCompany;
      } else {
        throw new Error('Company not found');
      }
    } catch (err) {
      toast.error('Failed to update company');
      throw err;
    }
  };

  const deleteCompany = async (id) => {
    try {
const success = await companyService.delete(id);
      if (success) {
        setCompanies(prev => prev.filter(company => company.Id !== parseInt(id)));
        toast.success('Company deleted successfully');
        return true;
      } else {
        throw new Error('Company not found');
      }
    } catch (err) {
      toast.error('Failed to delete company');
      throw err;
    }
  };

const getCompanyById = async (id) => {
    return await companyService.getById(id);
  };

  useEffect(() => {
    fetchCompanies();
  }, []);

  return {
    companies,
    loading,
    error,
    createCompany,
    updateCompany,
    deleteCompany,
    getCompanyById,
    refetch: fetchCompanies
  };
};