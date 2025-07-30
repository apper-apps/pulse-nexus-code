import React from "react";
import Textarea from "@/components/atoms/Textarea";
import Input from "@/components/atoms/Input";
import Label from "@/components/atoms/Label";

const FormField = ({ 
  label, 
  type = "text", 
  error, 
  className = "", 
  options = [],
  ...props 
}) => {
const renderInput = () => {
    switch (type) {
      case 'select':
        return (
          <select
            className="w-full glass-input rounded-lg px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            {...props}
          >
            <option value="">Select {label}</option>
            {options?.map((option, index) => {
              // Handle both string and object options
              const optionValue = typeof option === 'object' 
                ? (option.value || option.id || option.name || '') 
                : option;
              const optionLabel = typeof option === 'object' 
                ? (option.label || option.name || option.value || 'Unknown') 
                : option;
              
              return (
                <option key={index} value={optionValue}>
                  {optionLabel}
                </option>
              );
            }) || []}
          </select>
        );
      case 'textarea':
        return (
          <Textarea
            {...props}
          />
        );
      default:
        return (
          <Input
            type={type}
            {...props}
          />
        );
    }
  };

  return (
    <div className={`space-y-2 ${className}`}>
      <Label>{label}</Label>
      {renderInput()}
      {error && (
        <p className="text-sm text-red-400">{error}</p>
      )}
    </div>
  );
};

export default FormField;