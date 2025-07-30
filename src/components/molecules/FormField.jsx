import Label from "@/components/atoms/Label";
import Input from "@/components/atoms/Input";
import Textarea from "@/components/atoms/Textarea";

const FormField = ({ 
  label, 
  type = "text", 
  error, 
  className = "", 
  options = [],
  ...props 
}) => {
  const renderInput = () => {
    if (type === "select") {
      return (
        <select 
          className="glass-input w-full px-3 py-2 text-sm text-white placeholder-slate-400 rounded-lg focus:outline-none"
          {...props}
        >
          <option value="">Select {label.toLowerCase()}</option>
          {options.map((option, index) => (
            <option key={index} value={option} className="bg-slate-800 text-white">
              {option}
            </option>
          ))}
        </select>
      );
    }
    
    const InputComponent = type === "textarea" ? Textarea : Input;
    return <InputComponent type={type} {...props} />;
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