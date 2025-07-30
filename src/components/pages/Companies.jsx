import React, { useState } from "react";
import CompanyForm from "@/components/organisms/CompanyForm";
import CompanyDetail from "@/components/organisms/CompanyDetail";
import { useCompanies } from "@/hooks/useCompanies";
import { companyService } from "@/services/api/companyService";
import ApperIcon from "@/components/ApperIcon";
import Modal from "@/components/molecules/Modal";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import Contacts from "@/components/pages/Contacts";
import Input from "@/components/atoms/Input";
import Button from "@/components/atoms/Button";
import { cn } from "@/utils/cn";

const Companies = () => {
  const { companies, loading, error, createCompany, updateCompany, deleteCompany } = useCompanies();
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingCompany, setEditingCompany] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState('name');
  const [sortDirection, setSortDirection] = useState('asc');
  const [formLoading, setFormLoading] = useState(false);

  // Filter and sort companies
  const filteredCompanies = companies.filter(company =>
    company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    company.industry.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedCompanies = [...filteredCompanies].sort((a, b) => {
    let aVal = a[sortField];
    let bVal = b[sortField];
    
    if (typeof aVal === 'string') {
      aVal = aVal.toLowerCase();
      bVal = bVal.toLowerCase();
    }
    
    if (sortDirection === 'asc') {
      return aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
    } else {
      return aVal > bVal ? -1 : aVal < bVal ? 1 : 0;
    }
  });

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleCreateCompany = async (companyData) => {
    setFormLoading(true);
    try {
      const newCompany = await createCompany(companyData);
      setShowAddModal(false);
      setSelectedCompany(newCompany);
    } catch (error) {
      console.error('Failed to create company:', error);
    } finally {
      setFormLoading(false);
    }
  };

  const handleUpdateCompany = async (companyData) => {
    if (!editingCompany) return;
    
    setFormLoading(true);
    try {
      const updatedCompany = await updateCompany(editingCompany.Id, companyData);
      setEditingCompany(null);
      setSelectedCompany(updatedCompany);
    } catch (error) {
      console.error('Failed to update company:', error);
    } finally {
      setFormLoading(false);
    }
  };

  const handleDeleteCompany = async (companyId) => {
    if (window.confirm('Are you sure you want to delete this company?')) {
      try {
        await deleteCompany(companyId);
        if (selectedCompany?.Id === companyId) {
          setSelectedCompany(null);
        }
      } catch (error) {
        console.error('Failed to delete company:', error);
      }
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const SortableHeader = ({ field, children }) => (
    <button
      onClick={() => handleSort(field)}
      className="flex items-center gap-1 text-left hover:text-white transition-colors"
    >
      {children}
      <ApperIcon
        name={sortField === field ? (sortDirection === 'asc' ? 'ChevronUp' : 'ChevronDown') : 'ChevronsUpDown'}
        size={14}
        className={cn(
          "transition-colors",
          sortField === field ? "text-blue-400" : "text-slate-500"
        )}
      />
    </button>
  );

  if (loading) return <Loading />;
  if (error) return <Error message={error} />;

  return (
    <div className="h-full flex">
      {/* Company List - 40% */}
      <div className="w-2/5 border-r border-slate-700 flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-slate-700">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-white">Companies</h1>
            <Button
              onClick={() => setShowAddModal(true)}
              className="glass-button"
            >
              <ApperIcon name="Plus" size={16} />
              Add Company
            </Button>
          </div>
          
          {/* Search */}
          <div className="relative">
            <ApperIcon name="Search" size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
            <Input
              placeholder="Search companies..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Company Table */}
        <div className="flex-1 overflow-y-auto">
          {sortedCompanies.length === 0 ? (
            <Empty
              icon="Building2"
              title="No companies found"
              description={searchTerm ? "Try adjusting your search terms" : "Get started by adding your first company"}
              action={!searchTerm && (
                <Button onClick={() => setShowAddModal(true)} className="glass-button">
                  <ApperIcon name="Plus" size={16} />
                  Add Company
                </Button>
              )}
            />
          ) : (
            <div className="p-6">
              <div className="space-y-2">
                {/* Table Header */}
                <div className="grid grid-cols-12 gap-4 pb-3 border-b border-slate-700 text-sm font-medium text-slate-400">
                  <div className="col-span-4">
                    <SortableHeader field="name">Company</SortableHeader>
                  </div>
                  <div className="col-span-3">
                    <SortableHeader field="industry">Industry</SortableHeader>
                  </div>
                  <div className="col-span-2 text-center">Contacts</div>
                  <div className="col-span-3 text-right">Deal Value</div>
                </div>

                {/* Company Rows */}
                {sortedCompanies.map((company) => {
                  const contactCount = companyService.getContactCount(company.Id);
                  const dealValue = companyService.getTotalDealValue(company.Id);
                  
                  return (
                    <div
                      key={company.Id}
                      onClick={() => setSelectedCompany(company)}
                      className={cn(
                        "grid grid-cols-12 gap-4 p-3 rounded-lg cursor-pointer transition-all",
                        "hover:bg-slate-800/50",
                        selectedCompany?.Id === company.Id
                          ? "bg-blue-500/10 border border-blue-500/20"
                          : "glass-card"
                      )}
                    >
                      <div className="col-span-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                            <ApperIcon name="Building2" size={16} className="text-white" />
                          </div>
                          <div className="min-w-0">
                            <p className="font-medium text-white truncate">{company.name}</p>
                            {company.website && (
                              <p className="text-xs text-slate-400 truncate">{company.website}</p>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="col-span-3">
                        <p className="text-slate-300 truncate">{company.industry}</p>
                      </div>
                      <div className="col-span-2 text-center">
                        <span className="text-slate-300">{contactCount}</span>
                      </div>
                      <div className="col-span-3 text-right">
                        <span className="text-green-400 font-medium">{formatCurrency(dealValue)}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Company Detail - 60% */}
      <div className="flex-1 bg-slate-900/50">
        <CompanyDetail
          company={selectedCompany}
          onEdit={setEditingCompany}
          onDelete={handleDeleteCompany}
        />
      </div>

      {/* Add Company Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Add New Company"
      >
        <CompanyForm
          onSubmit={handleCreateCompany}
          onCancel={() => setShowAddModal(false)}
          loading={formLoading}
        />
      </Modal>

      {/* Edit Company Modal */}
      <Modal
        isOpen={!!editingCompany}
        onClose={() => setEditingCompany(null)}
        title="Edit Company"
      >
        <CompanyForm
          company={editingCompany}
          onSubmit={handleUpdateCompany}
          onCancel={() => setEditingCompany(null)}
          loading={formLoading}
        />
      </Modal>
    </div>
  );
};

export default Companies;