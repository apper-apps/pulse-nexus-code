import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import { cn } from '@/utils/cn';
import { useContacts } from '@/hooks/useContacts';
import { useDeals } from '@/hooks/useDeals';

const CompanyDetail = ({ company, onEdit, onDelete }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const { contacts } = useContacts();
  const { deals } = useDeals();
  const [companyContacts, setCompanyContacts] = useState([]);
  const [companyDeals, setCompanyDeals] = useState([]);

useEffect(() => {
    if (company && contacts) {
      // Filter contacts by company (this would ideally be done through a proper relationship)
      const relatedContacts = contacts.filter(contact => 
        contact.company?.toLowerCase().includes(company.name?.toLowerCase() || '') ||
        contact.email?.includes((company.name?.toLowerCase() || '').replace(/\s+/g, ''))
      );
      setCompanyContacts(relatedContacts);
    }
  }, [company, contacts]);

useEffect(() => {
    if (company && deals) {
      // Filter deals by company (this would ideally be done through a proper relationship)
      const relatedDeals = deals.filter(deal => 
        deal.company?.toLowerCase().includes(company.name?.toLowerCase() || '')
      );
      setCompanyDeals(relatedDeals);
    }
  }, [company, deals]);

  if (!company) {
    return (
      <div className="h-full flex items-center justify-center text-slate-400">
        <div className="text-center">
          <ApperIcon name="Building2" size={48} className="mx-auto mb-4 opacity-50" />
          <p>Select a company to view details</p>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: 'Building2' },
    { id: 'contacts', label: 'Contacts', icon: 'Users', count: companyContacts.length },
    { id: 'deals', label: 'Deals', icon: 'DollarSign', count: companyDeals.length },
    { id: 'notes', label: 'Notes', icon: 'FileText' }
  ];

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatNumber = (num) => {
    return new Intl.NumberFormat('en-US').format(num);
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-slate-700">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">{company.name}</h2>
            <div className="flex items-center gap-4 text-slate-400">
              <span className="flex items-center gap-1">
                <ApperIcon name="Building" size={16} />
                {company.industry}
              </span>
              {company.website && (
                <a 
                  href={company.website} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 hover:text-blue-400 transition-colors"
                >
                  <ApperIcon name="Globe" size={16} />
                  Website
                </a>
              )}
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onEdit(company)}
            >
              <ApperIcon name="Edit" size={16} />
              Edit
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onDelete(company.Id)}
              className="text-red-400 border-red-400 hover:bg-red-400 hover:text-white"
            >
              <ApperIcon name="Trash" size={16} />
              Delete
            </Button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-700">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "flex items-center gap-2 px-6 py-4 text-sm font-medium transition-colors border-b-2",
              activeTab === tab.id
                ? "text-blue-400 border-blue-400"
                : "text-slate-400 border-transparent hover:text-slate-300"
            )}
          >
            <ApperIcon name={tab.icon} size={16} />
            {tab.label}
            {tab.count !== undefined && (
              <span className="bg-slate-700 text-slate-300 px-2 py-0.5 rounded-full text-xs">
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {activeTab === 'overview' && (
          <div className="p-6 space-y-6">
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="glass-card p-4 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-400 text-sm">Employees</p>
                    <p className="text-2xl font-bold text-white">
                      {formatNumber(company.employees || 0)}
                    </p>
                  </div>
                  <ApperIcon name="Users" size={24} className="text-blue-400" />
                </div>
              </div>
              <div className="glass-card p-4 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-400 text-sm">Annual Revenue</p>
                    <p className="text-2xl font-bold text-white">
                      {formatCurrency(company.revenue || 0)}
                    </p>
                  </div>
                  <ApperIcon name="TrendingUp" size={24} className="text-green-400" />
                </div>
              </div>
              <div className="glass-card p-4 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-400 text-sm">Founded</p>
                    <p className="text-2xl font-bold text-white">
                      {company.founded ? format(new Date(company.founded), 'yyyy') : 'N/A'}
                    </p>
                  </div>
                  <ApperIcon name="Calendar" size={24} className="text-purple-400" />
                </div>
              </div>
            </div>

            {/* Company Information */}
            <div className="glass-card p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <ApperIcon name="Info" size={20} />
                Company Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {company.email && (
                  <div>
                    <p className="text-slate-400 text-sm mb-1">Email</p>
                    <p className="text-white">{company.email}</p>
                  </div>
                )}
                {company.phone && (
                  <div>
                    <p className="text-slate-400 text-sm mb-1">Phone</p>
                    <p className="text-white">{company.phone}</p>
                  </div>
                )}
                {company.address && (
                  <div className="md:col-span-2">
                    <p className="text-slate-400 text-sm mb-1">Address</p>
                    <p className="text-white">{company.address}</p>
                  </div>
                )}
                {company.description && (
                  <div className="md:col-span-2">
                    <p className="text-slate-400 text-sm mb-1">Description</p>
                    <p className="text-white">{company.description}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'contacts' && (
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-white">Company Contacts</h3>
              <Button size="sm" className="glass-button">
                <ApperIcon name="Plus" size={16} />
                Add Contact
              </Button>
            </div>
            {companyContacts.length > 0 ? (
              <div className="space-y-3">
                {companyContacts.map((contact) => (
                  <div key={contact.Id} className="glass-card p-4 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-white">{contact.name}</p>
                        <p className="text-slate-400 text-sm">{contact.role}</p>
                        <p className="text-slate-400 text-sm">{contact.email}</p>
                      </div>
                      <Button variant="outline" size="sm">
                        View
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <ApperIcon name="Users" size={48} className="mx-auto mb-4 opacity-50 text-slate-400" />
                <p className="text-slate-400">No contacts found for this company</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'deals' && (
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-white">Company Deals</h3>
              <Button size="sm" className="glass-button">
                <ApperIcon name="Plus" size={16} />
                Add Deal
              </Button>
            </div>
            {companyDeals.length > 0 ? (
              <div className="space-y-3">
                {companyDeals.map((deal) => (
                  <div key={deal.Id} className="glass-card p-4 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-white">{deal.title}</p>
                        <p className="text-slate-400 text-sm">{formatCurrency(deal.value)}</p>
                        <p className="text-slate-400 text-sm">Stage: {deal.stage}</p>
                      </div>
                      <Button variant="outline" size="sm">
                        View
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <ApperIcon name="DollarSign" size={48} className="mx-auto mb-4 opacity-50 text-slate-400" />
                <p className="text-slate-400">No deals found for this company</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'notes' && (
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-white">Company Notes</h3>
              <Button size="sm" className="glass-button">
                <ApperIcon name="Plus" size={16} />
                Add Note
              </Button>
            </div>
            <div className="text-center py-12">
              <ApperIcon name="FileText" size={48} className="mx-auto mb-4 opacity-50 text-slate-400" />
              <p className="text-slate-400">No notes available</p>
              <p className="text-slate-500 text-sm mt-2">Add notes to track important information about this company</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CompanyDetail;