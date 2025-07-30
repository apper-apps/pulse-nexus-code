import { NavLink } from "react-router-dom";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const Sidebar = ({ isOpen, onClose }) => {
  const navItems = [
    { name: "Dashboard", path: "/", icon: "BarChart3" },
    { name: "Contacts", path: "/contacts", icon: "Users" },
    { name: "Deals", path: "/deals", icon: "DollarSign" },
    { name: "Companies", path: "/companies", icon: "Building2" },
    { name: "Activities", path: "/activities", icon: "Calendar" },
  ];

  const NavItem = ({ item }) => (
    <NavLink
      to={item.path}
      onClick={onClose}
      className={({ isActive }) =>
        cn(
          "flex items-center gap-3 px-4 py-3 rounded-lg transition-all group",
          isActive
            ? "bg-gradient-to-r from-indigo-500/20 to-purple-500/20 text-white border border-indigo-500/30"
            : "text-slate-300 hover:text-white hover:bg-white/10"
        )
      }
    >
      <ApperIcon name={item.icon} size={20} />
      <span className="font-medium">{item.name}</span>
    </NavLink>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 lg:z-40">
        <div className="flex flex-col flex-1 glass-card border-r border-white/10">
          <div className="flex items-center gap-3 px-6 py-6 border-b border-white/10">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
              <ApperIcon name="Zap" size={18} className="text-white" />
            </div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
              Nexus CRM
            </h1>
          </div>
          <nav className="flex-1 px-4 py-6 space-y-2">
            {navItems.map((item) => (
              <NavItem key={item.path} item={item} />
            ))}
          </nav>
        </div>
      </div>

      {/* Mobile Sidebar Overlay */}
      <div className={cn(
        "fixed inset-0 z-50 lg:hidden transition-opacity duration-300",
        isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
      )}>
        <div 
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          onClick={onClose}
        />
        <div className={cn(
          "absolute left-0 top-0 h-full w-80 glass-card border-r border-white/10 transition-transform duration-300",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}>
          <div className="flex items-center justify-between px-6 py-6 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                <ApperIcon name="Zap" size={18} className="text-white" />
              </div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                Nexus CRM
              </h1>
            </div>
          </div>
          <nav className="px-4 py-6 space-y-2">
            {navItems.map((item) => (
              <NavItem key={item.path} item={item} />
            ))}
          </nav>
        </div>
      </div>
    </>
  );
};

export default Sidebar;