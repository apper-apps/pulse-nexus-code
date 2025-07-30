import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";

const Empty = ({ 
  title = "No data found", 
  description = "Get started by adding your first item.",
  actionLabel = "Add Item",
  onAction,
  icon = "Inbox"
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="text-center max-w-md">
        <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <ApperIcon name={icon} size={32} className="text-slate-400" />
        </div>
        
        <h2 className="text-xl font-semibold text-white mb-2">
          {title}
        </h2>
        
        <p className="text-slate-400 mb-6">
          {description}
        </p>
        
        {onAction && (
          <Button onClick={onAction} className="w-auto">
            <ApperIcon name="Plus" size={16} />
            {actionLabel}
          </Button>
        )}
      </div>
    </div>
  );
};

export default Empty;