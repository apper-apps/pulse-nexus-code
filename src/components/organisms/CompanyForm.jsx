import { useState } from 'react';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import Label from '@/components/atoms/Label';
import Textarea from '@/components/atoms/Textarea';
import { cn } from '@/utils/cn';

const CompanyForm = ({ company, onSubmit, onCancel, loading = false }) => {
  const [formData, setFormData] = useState({
    name: company?.name || '',
    industry: company?.industry || '',
    website: company?.website || '',
    address: company?.address || '',
    phone: company?.phone || '',
    email: company?.email || '',
    employees: company?.employees || '',
    revenue: company?.revenue || '',
    description: company?.description || ''
  });

  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Company name is required';
    }
    
    if (!formData.industry.trim()) {
      newErrors.industry = 'Industry is required';
    }
    
    if (formData.website && !formData.website.match(/^https?:\/\/.+/)) {
      newErrors.website = 'Please enter a valid URL';
    }
    
    if (formData.email && !formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      newErrors.email = 'Please enter a valid email address';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const submitData = {
      ...formData,
      employees: formData.employees ? parseInt(formData.employees) : 0,
      revenue: formData.revenue ? parseFloat(formData.revenue) : 0
    };

    onSubmit(submitData);
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Label htmlFor="name">Company Name *</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => handleChange('name', e.target.value)}
            placeholder="Enter company name"
            className={cn(errors.name && "border-red-500")}
          />
          {errors.name && <p className="text-red-400 text-sm mt-1">{errors.name}</p>}
        </div>

        <div>
          <Label htmlFor="industry">Industry *</Label>
          <Input
            id="industry"
            value={formData.industry}
            onChange={(e) => handleChange('industry', e.target.value)}
            placeholder="e.g., Technology, Healthcare"
            className={cn(errors.industry && "border-red-500")}
          />
          {errors.industry && <p className="text-red-400 text-sm mt-1">{errors.industry}</p>}
        </div>

        <div>
          <Label htmlFor="website">Website</Label>
          <Input
            id="website"
            type="url"
            value={formData.website}
            onChange={(e) => handleChange('website', e.target.value)}
            placeholder="https://company.com"
            className={cn(errors.website && "border-red-500")}
          />
          {errors.website && <p className="text-red-400 text-sm mt-1">{errors.website}</p>}
        </div>

        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => handleChange('email', e.target.value)}
            placeholder="contact@company.com"
            className={cn(errors.email && "border-red-500")}
          />
          {errors.email && <p className="text-red-400 text-sm mt-1">{errors.email}</p>}
        </div>

        <div>
          <Label htmlFor="phone">Phone</Label>
          <Input
            id="phone"
            type="tel"
            value={formData.phone}
            onChange={(e) => handleChange('phone', e.target.value)}
            placeholder="+1 (555) 123-4567"
          />
        </div>

        <div>
          <Label htmlFor="employees">Number of Employees</Label>
          <Input
            id="employees"
            type="number"
            min="0"
            value={formData.employees}
            onChange={(e) => handleChange('employees', e.target.value)}
            placeholder="0"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="address">Address</Label>
        <Input
          id="address"
          value={formData.address}
          onChange={(e) => handleChange('address', e.target.value)}
          placeholder="123 Business St, City, State 12345"
        />
      </div>

      <div>
        <Label htmlFor="revenue">Annual Revenue ($)</Label>
        <Input
          id="revenue"
          type="number"
          min="0"
          step="1000"
          value={formData.revenue}
          onChange={(e) => handleChange('revenue', e.target.value)}
          placeholder="0"
        />
      </div>

      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => handleChange('description', e.target.value)}
          placeholder="Brief description of the company..."
          rows={3}
        />
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t border-slate-700">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={loading}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={loading}
          className="glass-button"
        >
          {loading ? 'Saving...' : company ? 'Update Company' : 'Create Company'}
        </Button>
      </div>
    </form>
  );
};

export default CompanyForm;