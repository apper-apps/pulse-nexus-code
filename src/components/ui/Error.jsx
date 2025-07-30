import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";

const Error = ({ message, onRetry }) => {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="glass-card rounded-xl p-8 text-center max-w-md">
        <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
          <ApperIcon name="AlertCircle" size={32} className="text-red-400" />
        </div>
        
        <h2 className="text-xl font-semibold text-white mb-2">
          Something went wrong
        </h2>
        
        <p className="text-slate-400 mb-6">
          {message || "We encountered an error while loading your data. Please try again."}
        </p>
        
        {onRetry && (
          <Button onClick={onRetry} className="w-full">
            <ApperIcon name="RefreshCw" size={16} />
            Try Again
          </Button>
        )}
      </div>
    </div>
  );
};

export default Error;