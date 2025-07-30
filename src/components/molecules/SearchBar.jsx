import ApperIcon from "@/components/ApperIcon";
import Input from "@/components/atoms/Input";

const SearchBar = ({ value, onChange, placeholder = "Search...", onClick, readOnly = false }) => {
  return (
    <div 
      className={`relative ${readOnly ? 'cursor-pointer' : ''}`}
      onClick={readOnly ? onClick : undefined}
    >
      <ApperIcon 
        name="Search" 
        size={18} 
        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" 
      />
      <Input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onClick={!readOnly ? undefined : onClick}
        readOnly={readOnly}
        className={`pl-10 ${readOnly ? 'cursor-pointer bg-slate-800/50 hover:bg-slate-800/70 transition-colors' : ''}`}
      />
      {readOnly && (
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center gap-1 text-xs text-slate-500">
          <kbd className="px-1.5 py-0.5 bg-slate-700 rounded text-xs font-mono">⌘K</kbd>
        </div>
      )}
    </div>
  );
};

export default SearchBar;