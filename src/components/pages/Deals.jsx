import React, { useState } from "react";
import { toast } from "react-toastify";
import { useDeals } from "@/hooks/useDeals";
import { useContacts } from "@/hooks/useContacts";
import { format } from "date-fns";
import ApperIcon from "@/components/ApperIcon";
import Modal from "@/components/molecules/Modal";
import FormField from "@/components/molecules/FormField";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import ComingSoon from "@/components/pages/ComingSoon";
import Button from "@/components/atoms/Button";

const STAGES = [
  { key: 'Lead', name: 'Lead', color: 'bg-slate-500' },
  { key: 'Qualified', name: 'Qualified', color: 'bg-blue-500' },
  { key: 'Proposal', name: 'Proposal', color: 'bg-yellow-500' },
  { key: 'Negotiation', name: 'Negotiation', color: 'bg-orange-500' },
  { key: 'Closed Won', name: 'Closed Won', color: 'bg-green-500' },
  { key: 'Closed Lost', name: 'Closed Lost', color: 'bg-red-500' }
];

const DealCard = ({ deal, onEdit, onDelete }) => {
  const handleDragStart = (e) => {
    e.dataTransfer.setData('text/plain', deal.Id.toString());
    e.dataTransfer.effectAllowed = 'move';
  };

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      className="kanban-card p-4 mb-3 rounded-lg cursor-move"
    >
      <div className="flex justify-between items-start mb-2">
        <h4 className="font-medium text-white text-sm leading-tight">{deal.name}</h4>
        <div className="flex gap-1 ml-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEdit(deal)}
            className="h-6 w-6 p-0 opacity-60 hover:opacity-100"
          >
            <ApperIcon name="Edit2" size={12} />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(deal.Id)}
            className="h-6 w-6 p-0 opacity-60 hover:opacity-100 hover:text-red-400"
          >
            <ApperIcon name="Trash2" size={12} />
          </Button>
        </div>
      </div>
      
      <p className="text-slate-300 text-xs mb-2">{deal.company}</p>
      
      <div className="flex justify-between items-center text-xs">
        <span className="text-green-400 font-medium">
          ${deal.value.toLocaleString()}
        </span>
        <span className="text-slate-400">
          {format(new Date(deal.expectedCloseDate), 'MMM dd')}
        </span>
      </div>
    </div>
  );
};

const KanbanColumn = ({ stage, deals, onDrop, onEdit, onDelete }) => {
  const [dragOver, setDragOver] = useState(false);
  
  const totalValue = deals.reduce((sum, deal) => sum + deal.value, 0);

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const dealId = parseInt(e.dataTransfer.getData('text/plain'));
    onDrop(dealId, stage.key);
  };

  return (
    <div className="kanban-column flex-1 min-w-0">
      <div className="glass-card rounded-lg p-4 h-full">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${stage.color}`}></div>
            <h3 className="font-semibold text-white">{stage.name}</h3>
            <span className="text-xs text-slate-400 bg-slate-700 px-2 py-1 rounded-full">
              {deals.length}
            </span>
          </div>
          <div className="text-xs text-slate-300">
            ${totalValue.toLocaleString()}
          </div>
        </div>
        
        <div
          className={`kanban-drop-zone min-h-96 ${dragOver ? 'drag-over' : ''}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          {deals.map(deal => (
            <DealCard
              key={deal.Id}
              deal={deal}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
          
          {deals.length === 0 && (
            <div className="text-center text-slate-500 text-sm py-8">
              No deals in this stage
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const DealForm = ({ deal, onSave, onClose, companies }) => {
  const [formData, setFormData] = useState({
    name: deal?.name || '',
    company: deal?.company || '',
    value: deal?.value || '',
    stage: deal?.stage || 'Lead',
    expectedCloseDate: deal?.expectedCloseDate || ''
  });
  const [errors, setErrors] = useState({});

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Deal name is required';
    if (!formData.company.trim()) newErrors.company = 'Company is required';
    if (!formData.value || formData.value <= 0) newErrors.value = 'Valid deal value is required';
    if (!formData.expectedCloseDate) newErrors.expectedCloseDate = 'Expected close date is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSave({
        ...formData,
        value: parseFloat(formData.value)
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <FormField
        label="Deal Name"
        value={formData.name}
        onChange={(e) => handleChange('name', e.target.value)}
        placeholder="Enter deal name"
        error={errors.name}
      />
      
<FormField
        label="Company"
        type="select"
        value={formData.company}
        onChange={(e) => handleChange('company', e.target.value)}
        error={errors.company}
        options={companies?.map(company => ({
          value: company.Id || company.name,
          label: company.name || 'Unknown Company'
        })) || []}
      />
      
      <FormField
        label="Deal Value ($)"
        type="number"
        value={formData.value}
        onChange={(e) => handleChange('value', e.target.value)}
        placeholder="0"
        error={errors.value}
      />
      
      <FormField
        label="Stage"
        type="select"
        value={formData.stage}
        onChange={(e) => handleChange('stage', e.target.value)}
        error={errors.stage}
        options={STAGES.map(s => s.name)}
      />
      
      <FormField
        label="Expected Close Date"
        type="date"
        value={formData.expectedCloseDate}
        onChange={(e) => handleChange('expectedCloseDate', e.target.value)}
        error={errors.expectedCloseDate}
      />
      
      <div className="flex gap-3 pt-4">
        <Button type="submit" className="flex-1">
          {deal ? 'Update Deal' : 'Create Deal'}
        </Button>
        <Button type="button" variant="secondary" onClick={onClose}>
          Cancel
        </Button>
      </div>
    </form>
  );
};

const Deals = () => {
  const { deals, loading, error, createDeal, updateDeal, deleteDeal } = useDeals();
  const { contacts } = useContacts();
  const [showForm, setShowForm] = useState(false);
  const [editingDeal, setEditingDeal] = useState(null);

  const companies = [...new Set(contacts.map(c => c.company))].sort();

  const getDealsByStage = (stage) => {
    return deals.filter(deal => deal.stage === stage);
  };

  const handleAddDeal = () => {
    setEditingDeal(null);
    setShowForm(true);
  };

  const handleEditDeal = (deal) => {
    setEditingDeal(deal);
    setShowForm(true);
  };

  const handleSaveDeal = async (dealData) => {
    try {
      if (editingDeal) {
        await updateDeal(editingDeal.Id, dealData);
        toast.success('Deal updated successfully');
      } else {
        await createDeal(dealData);
        toast.success('Deal created successfully');
      }
      setShowForm(false);
      setEditingDeal(null);
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleDeleteDeal = async (dealId) => {
    if (window.confirm('Are you sure you want to delete this deal?')) {
      try {
        await deleteDeal(dealId);
        toast.success('Deal deleted successfully');
      } catch (err) {
        toast.error(err.message);
      }
    }
  };

  const handleDrop = async (dealId, newStage) => {
    const deal = deals.find(d => d.Id === dealId);
    if (deal && deal.stage !== newStage) {
      try {
        await updateDeal(dealId, { stage: newStage });
        toast.success(`Deal moved to ${newStage}`);
      } catch (err) {
        toast.error(err.message);
      }
    }
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingDeal(null);
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} />;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white">Deal Pipeline</h1>
          <p className="text-slate-400 mt-1">Manage your sales pipeline</p>
        </div>
        <Button onClick={handleAddDeal} className="flex items-center gap-2">
          <ApperIcon name="Plus" size={16} />
          Add Deal
        </Button>
      </div>

      <div className="kanban-board flex gap-4 overflow-x-auto pb-4">
        {STAGES.map(stage => (
          <KanbanColumn
            key={stage.key}
            stage={stage}
            deals={getDealsByStage(stage.key)}
            onDrop={handleDrop}
            onEdit={handleEditDeal}
            onDelete={handleDeleteDeal}
          />
        ))}
      </div>

      <Modal
        isOpen={showForm}
        onClose={handleCloseForm}
        title={editingDeal ? 'Edit Deal' : 'Add New Deal'}
        className="max-w-lg"
      >
        <DealForm
          deal={editingDeal}
          onSave={handleSaveDeal}
          onClose={handleCloseForm}
          companies={companies}
        />
      </Modal>
    </div>
  );
};

export default Deals;