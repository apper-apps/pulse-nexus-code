import { useState } from "react";
import { format } from "date-fns";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import { cn } from "@/utils/cn";

const ContactDetail = ({ contact, activities, onEdit, onDelete, onClose }) => {
  const [activeTab, setActiveTab] = useState("info");

  const tabs = [
    { id: "info", label: "Contact Info", icon: "User" },
    { id: "activity", label: "Activity", icon: "Clock" },
    { id: "notes", label: "Notes", icon: "FileText" }
  ];

  const InfoSection = ({ title, children, icon }) => (
    <div className="glass-card rounded-lg p-4">
      <div className="flex items-center gap-2 mb-3">
        <ApperIcon name={icon} size={16} className="text-indigo-400" />
        <h3 className="font-semibold text-white">{title}</h3>
      </div>
      {children}
    </div>
  );

  const InfoItem = ({ label, value, icon }) => (
    <div className="flex items-center gap-3 py-2">
      <ApperIcon name={icon} size={16} className="text-slate-400" />
      <div>
        <div className="text-xs text-slate-400 uppercase tracking-wide">{label}</div>
        <div className="text-slate-200">{value || "Not provided"}</div>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 lg:relative lg:inset-auto">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm lg:hidden" onClick={onClose} />
      
      <div className="absolute right-0 top-0 h-full w-full max-w-2xl glass-card lg:rounded-xl lg:relative lg:max-w-none">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-lg font-semibold">
              {contact.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h2 className="text-xl font-semibold text-white">{contact.name}</h2>
              <p className="text-slate-400">{contact.company}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => onEdit(contact)}
            >
              <ApperIcon name="Edit2" size={16} />
              Edit
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-8 w-8 p-0"
            >
              <ApperIcon name="X" size={16} />
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-white/10">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex items-center gap-2 px-6 py-4 text-sm font-medium transition-colors relative",
                activeTab === tab.id
                  ? "text-white border-b-2 border-indigo-500"
                  : "text-slate-400 hover:text-slate-200"
              )}
            >
              <ApperIcon name={tab.icon} size={16} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="p-6 h-[calc(100vh-200px)] lg:h-auto overflow-y-auto">
          {activeTab === "info" && (
            <div className="space-y-6">
              <InfoSection title="Contact Information" icon="User">
                <div className="space-y-1">
                  <InfoItem label="Email" value={contact.email} icon="Mail" />
                  <InfoItem label="Phone" value={contact.phone} icon="Phone" />
                  <InfoItem label="Company" value={contact.company} icon="Building2" />
                </div>
              </InfoSection>

              <InfoSection title="Details" icon="Info">
                <div className="space-y-1">
                  <InfoItem 
                    label="Created" 
                    value={contact.createdAt ? format(new Date(contact.createdAt), "MMM dd, yyyy 'at' h:mm a") : "Unknown"} 
                    icon="Calendar" 
                  />
                  <InfoItem 
                    label="Last Contact" 
                    value={contact.lastContactDate ? format(new Date(contact.lastContactDate), "MMM dd, yyyy") : "Never"} 
                    icon="Clock" 
                  />
                </div>
              </InfoSection>

              {contact.tags?.length > 0 && (
                <InfoSection title="Tags" icon="Tag">
                  <div className="flex flex-wrap gap-2">
                    {contact.tags.map((tag, index) => (
                      <span 
                        key={index}
                        className="px-3 py-1 text-sm bg-indigo-500/20 text-indigo-300 rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </InfoSection>
              )}
            </div>
          )}

          {activeTab === "activity" && (
            <div className="space-y-4">
              {activities?.length > 0 ? (
                activities.map((activity) => (
                  <div key={activity.Id} className="glass-card rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center flex-shrink-0">
                        <ApperIcon name="Activity" size={14} className="text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-medium text-white capitalize">{activity.type}</span>
                          <span className="text-xs text-slate-400">
                            {format(new Date(activity.date), "MMM dd, h:mm a")}
                          </span>
                        </div>
                        <p className="text-slate-300 text-sm">{activity.description}</p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-12">
                  <ApperIcon name="Activity" size={48} className="text-slate-600 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-slate-400 mb-2">No Activity Yet</h3>
                  <p className="text-slate-500">Activity with this contact will appear here.</p>
                </div>
              )}
            </div>
          )}

          {activeTab === "notes" && (
            <div>
              {contact.notes ? (
                <div className="glass-card rounded-lg p-4">
                  <p className="text-slate-200 whitespace-pre-wrap">{contact.notes}</p>
                </div>
              ) : (
                <div className="text-center py-12">
                  <ApperIcon name="FileText" size={48} className="text-slate-600 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-slate-400 mb-2">No Notes</h3>
                  <p className="text-slate-500">Add notes about this contact to keep track of important information.</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="p-6 border-t border-white/10">
          <div className="flex gap-3">
            <Button
              variant="secondary"
              className="flex-1"
              onClick={() => onEdit(contact)}
            >
              <ApperIcon name="Edit2" size={16} />
              Edit Contact
            </Button>
            <Button
              variant="danger"
              onClick={() => {
                if (window.confirm("Are you sure you want to delete this contact?")) {
                  onDelete(contact.Id);
                  onClose();
                }
              }}
            >
              <ApperIcon name="Trash2" size={16} />
              Delete
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactDetail;