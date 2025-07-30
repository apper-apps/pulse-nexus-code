import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import SearchBar from "@/components/molecules/SearchBar";
import Modal from "@/components/molecules/Modal";
import ContactTable from "@/components/organisms/ContactTable";
import ContactForm from "@/components/organisms/ContactForm";
import ContactDetail from "@/components/organisms/ContactDetail";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import { useContacts } from "@/hooks/useContacts";
import { useActivities } from "@/hooks/useActivities";

const Contacts = () => {
  const { 
    contacts, 
    loading, 
    error, 
    loadContacts, 
    createContact, 
    updateContact, 
    deleteContact,
    searchContacts 
  } = useContacts();

  const [showForm, setShowForm] = useState(false);
  const [editingContact, setEditingContact] = useState(null);
  const [selectedContact, setSelectedContact] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  
  const { 
    activities: selectedContactActivities, 
    loading: activitiesLoading 
  } = useActivities(selectedContact?.Id);

  // Handle search with debounce
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchQuery.trim()) {
        searchContacts(searchQuery);
      } else {
        loadContacts();
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  const handleAddContact = () => {
    setEditingContact(null);
    setShowForm(true);
  };

  const handleEditContact = (contact) => {
    setEditingContact(contact);
    setShowForm(true);
    setSelectedContact(null);
  };

  const handleViewContact = (contact) => {
    setSelectedContact(contact);
  };

  const handleSaveContact = async (contactData) => {
    try {
      if (editingContact) {
        await updateContact(editingContact.Id, contactData);
      } else {
        await createContact(contactData);
      }
      setShowForm(false);
      setEditingContact(null);
    } catch (error) {
      throw error;
    }
  };

  const handleDeleteContact = async (contactId) => {
    if (window.confirm("Are you sure you want to delete this contact?")) {
      try {
        await deleteContact(contactId);
        toast.success("Contact deleted successfully!");
        setSelectedContact(null);
      } catch (error) {
        toast.error("Failed to delete contact");
      }
    }
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingContact(null);
  };

  const handleCloseDetail = () => {
    setSelectedContact(null);
  };

  if (loading && !searchQuery) return <Loading />;
  if (error) return <Error message={error} onRetry={loadContacts} />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
            Contacts
          </h1>
          <p className="text-slate-400 mt-1">
            Manage your customer relationships and contact information
          </p>
        </div>
        <Button onClick={handleAddContact}>
          <ApperIcon name="UserPlus" size={16} />
          Add Contact
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 max-w-md">
          <SearchBar
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search contacts by name, email, company..."
          />
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" size="sm">
            <ApperIcon name="Filter" size={16} />
            Filters
          </Button>
          <Button variant="secondary" size="sm">
            <ApperIcon name="Download" size={16} />
            Export
          </Button>
        </div>
      </div>

      {/* Contacts List */}
      {loading && searchQuery ? (
        <div className="glass-card rounded-xl p-8 text-center">
          <div className="inline-flex items-center gap-2 text-slate-400">
            <div className="w-4 h-4 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
            Searching contacts...
          </div>
        </div>
      ) : contacts.length > 0 ? (
        <ContactTable
          contacts={contacts}
          onEditContact={handleEditContact}
          onDeleteContact={handleDeleteContact}
          onViewContact={handleViewContact}
        />
      ) : (
        <Empty
          title={searchQuery ? "No contacts found" : "No contacts yet"}
          description={
            searchQuery 
              ? `No contacts match "${searchQuery}". Try adjusting your search.`
              : "Start building your customer database by adding your first contact."
          }
          actionLabel="Add Contact"
          onAction={handleAddContact}
          icon="Users"
        />
      )}

      {/* Contact Form Modal */}
      <Modal
        isOpen={showForm}
        onClose={handleCloseForm}
        title={editingContact ? "Edit Contact" : "Add New Contact"}
        className="max-w-lg"
      >
        <ContactForm
          contact={editingContact}
          onSave={handleSaveContact}
          onCancel={handleCloseForm}
        />
      </Modal>

      {/* Contact Detail Sidebar */}
      {selectedContact && (
        <ContactDetail
          contact={selectedContact}
          activities={selectedContactActivities}
          onEdit={handleEditContact}
          onDelete={handleDeleteContact}
          onClose={handleCloseDetail}
        />
      )}
    </div>
  );
};

export default Contacts;