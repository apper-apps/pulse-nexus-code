import Label from "@/components/atoms/Label";
import Input from "@/components/atoms/Input";
import Textarea from "@/components/atoms/Textarea";

const FormField = ({ 
  label, 
  type = "text", 
  error, 
  className = "", 
  ...props 
}) => {
  const InputComponent = type === "textarea" ? Textarea : Input;
  
  return (
    <div className={`space-y-2 ${className}`}>
      <Label>{label}</Label>
      <InputComponent type={type} {...props} />
      {error && (
        <p className="text-sm text-red-400">{error}</p>
      )}
    </div>
  );
};

export default FormField;