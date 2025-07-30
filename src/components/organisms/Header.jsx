import { useState } from "react";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import SearchBar from "@/components/molecules/SearchBar";

const Header = ({ onMenuClick }) => {
  const [searchValue, setSearchValue] = useState("");

  return (
    <header className="glass-card border-b border-white/10 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={onMenuClick}
            className="lg:hidden h-10 w-10 p-0"
          >
            <ApperIcon name="Menu" size={20} />
          </Button>
          <div className="hidden sm:block w-80">
            <SearchBar
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              placeholder="Search contacts, deals, companies..."
            />
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" className="h-10 w-10 p-0 relative">
            <ApperIcon name="Bell" size={20} />
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-xs rounded-full flex items-center justify-center">
              3
            </span>
          </Button>
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
            <ApperIcon name="User" size={16} className="text-white" />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;