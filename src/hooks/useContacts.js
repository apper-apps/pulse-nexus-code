import { useEffect, useState } from "react";
import { contactService } from "@/services/api/contactService";

export const useContacts = () => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadContacts = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await contactService.getAll();
      setContacts(data);
    } catch (err) {
      setError(err.message || "Failed to load contacts");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadContacts();
  }, []);

const createContact = async (contactData) => {
    try {
      const newContact = await contactService.create(contactData);
      setContacts(prev => [newContact, ...prev]);
      return newContact;
    } catch (err) {
      setError(err.message || "Failed to create contact");
      throw err;
    }
  };

const updateContact = async (id, contactData) => {
    try {
      const updatedContact = await contactService.update(id, contactData);
      setContacts(prev => prev.map(contact => 
        contact.Id === parseInt(id) ? updatedContact : contact
      ));
      return updatedContact;
    } catch (err) {
      setError(err.message || "Failed to update contact");
      throw err;
    }
  };

const deleteContact = async (id) => {
    try {
      await contactService.delete(id);
      setContacts(prev => prev.filter(contact => contact.Id !== parseInt(id)));
    } catch (err) {
      setError(err.message || "Failed to delete contact");
      throw err;
    }
  };

  const searchContacts = async (query) => {
    try {
      setLoading(true);
      setError("");
      const data = await contactService.search(query);
      setContacts(data);
    } catch (err) {
setError(err.message || "Failed to search contacts");
    } finally {
      setLoading(false);
    }
  };

  return {
    contacts,
    loading,
    error,
    loadContacts,
    createContact,
    updateContact,
    deleteContact,
    searchContacts
  };
};