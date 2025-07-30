import { useEffect } from "react";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import { cn } from "@/utils/cn";

const Modal = ({ isOpen, onClose, title, children, className = "" }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className={cn(
        "relative glass-card rounded-xl p-6 w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto",
        className
      )}>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-white">{title}</h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-8 w-8 p-0 hover:bg-white/10"
          >
            <ApperIcon name="X" size={16} />
          </Button>
        </div>
        {children}
      </div>
    </div>
  );
};

export default Modal;