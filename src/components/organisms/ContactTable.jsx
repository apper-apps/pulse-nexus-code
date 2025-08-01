import { useState } from "react";
import { format } from "date-fns";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import { cn } from "@/utils/cn";

const ContactTable = ({ contacts, onEditContact, onDeleteContact, onViewContact }) => {
  const [sortField, setSortField] = useState("name");
  const [sortDirection, setSortDirection] = useState("asc");

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const sortedContacts = [...contacts].sort((a, b) => {
    const aValue = a[sortField] || "";
    const bValue = b[sortField] || "";
    
    if (sortDirection === "asc") {
      return aValue.toString().localeCompare(bValue.toString());
    } else {
      return bValue.toString().localeCompare(aValue.toString());
    }
  });

  const SortableHeader = ({ field, children }) => (
    <th 
      className="px-6 py-4 text-left text-sm font-semibold text-slate-200 cursor-pointer hover:text-white transition-colors group"
      onClick={() => handleSort(field)}
    >
      <div className="flex items-center gap-2">
        {children}
        <div className="flex flex-col">
          <ApperIcon 
            name="ChevronUp" 
            size={12} 
            className={cn(
              "transition-colors",
              sortField === field && sortDirection === "asc" 
                ? "text-indigo-400" 
                : "text-slate-500 group-hover:text-slate-400"
            )}
          />
          <ApperIcon 
            name="ChevronDown" 
            size={12} 
            className={cn(
              "transition-colors -mt-1",
              sortField === field && sortDirection === "desc" 
                ? "text-indigo-400" 
                : "text-slate-500 group-hover:text-slate-400"
            )}
          />
        </div>
      </div>
    </th>
  );

  return (
    <div className="glass-card rounded-xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="border-b border-white/10">
            <tr>
              <SortableHeader field="name">Name</SortableHeader>
              <SortableHeader field="company">Company</SortableHeader>
              <SortableHeader field="email">Email</SortableHeader>
              <SortableHeader field="phone">Phone</SortableHeader>
              <SortableHeader field="lastContactDate">Last Contact</SortableHeader>
              <th className="px-6 py-4 text-left text-sm font-semibold text-slate-200">Actions</th>
            </tr>
          </thead>
          <tbody>
            {sortedContacts.map((contact) => (
              <tr 
                key={contact.Id}
                className="border-b border-white/5 hover:bg-white/5 transition-colors cursor-pointer group"
                onClick={() => onViewContact(contact)}
              >
                <td className="px-6 py-4">
<div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-sm font-medium">
                      {contact.Name?.charAt(0)?.toUpperCase() || 'N'}
                    </div>
                    <div>
                      <div className="font-medium text-white">{contact.name}</div>
                      {contact.tags?.length > 0 && (
                        <div className="flex gap-1 mt-1">
                          {contact.tags.slice(0, 2).map((tag, index) => (
                            <span 
                              key={index}
                              className="px-2 py-0.5 text-xs bg-indigo-500/20 text-indigo-300 rounded-full"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-slate-300">{contact.company}</td>
                <td className="px-6 py-4 text-slate-300">{contact.email}</td>
                <td className="px-6 py-4 text-slate-300">{contact.phone}</td>
                <td className="px-6 py-4 text-slate-300">
                  {contact.lastContactDate 
                    ? format(new Date(contact.lastContactDate), "MMM dd, yyyy")
                    : "Never"
                  }
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        onEditContact(contact);
                      }}
                      className="h-8 w-8 p-0 hover:bg-indigo-500/20 hover:text-indigo-300"
                    >
                      <ApperIcon name="Edit2" size={14} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteContact(contact.Id);
                      }}
                      className="h-8 w-8 p-0 hover:bg-red-500/20 hover:text-red-300"
                    >
                      <ApperIcon name="Trash2" size={14} />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ContactTable;