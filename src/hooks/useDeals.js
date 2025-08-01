import { useState, useEffect } from 'react';
import { dealService } from '@/services/api/dealService';

export const useDeals = () => {
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDeals = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await dealService.getAll();
      setDeals(data);
    } catch (err) {
      setError(err.message || 'Failed to fetch deals');
    } finally {
      setLoading(false);
    }
  };

  const createDeal = async (dealData) => {
    try {
      const newDeal = await dealService.create(dealData);
      setDeals(prev => [...prev, newDeal]);
      return newDeal;
    } catch (err) {
      throw new Error(err.message || 'Failed to create deal');
    }
  };

  const updateDeal = async (id, dealData) => {
    try {
      const updated = await dealService.update(id, dealData);
setDeals(prev => prev.map(d => d.Id === parseInt(id) ? updated : d));
      return updated;
    } catch (err) {
      throw new Error(err.message || 'Failed to update deal');
    }
  };

  const deleteDeal = async (id) => {
    try {
      await dealService.delete(id);
setDeals(prev => prev.filter(d => d.Id !== parseInt(id)));
    } catch (err) {
      throw new Error(err.message || 'Failed to delete deal');
    }
  };

  useEffect(() => {
    fetchDeals();
  }, []);

  return {
    deals,
    loading,
    error,
    refetch: fetchDeals,
    createDeal,
    updateDeal,
    deleteDeal
  };
};