import { useState, useEffect } from "react";
import Button from "@/components/atoms/Button";
import FormField from "@/components/molecules/FormField";
import { toast } from "react-toastify";

const ContactForm = ({ contact, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    notes: "",
    tags: ""
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (contact) {
      setFormData({
        name: contact.name || "",
        email: contact.email || "",
        phone: contact.phone || "",
        company: contact.company || "",
        notes: contact.notes || "",
        tags: contact.tags?.join(", ") || ""
      });
    }
  }, [contact]);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }
    
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }
    
    if (!formData.phone.trim()) {
      newErrors.phone = "Phone is required";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error("Please fix the errors below");
      return;
    }

    setIsSubmitting(true);
    
try {
      const contactData = {
        ...formData,
        tags: formData.tags ? formData.tags.split(",").map(tag => tag.trim()).filter(Boolean).join(",") : ""
      };
      
      await onSave(contactData);
      toast.success(contact ? "Contact updated successfully!" : "Contact created successfully!");
    } catch (error) {
      toast.error("Failed to save contact. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (field) => (e) => {
    setFormData(prev => ({
      ...prev,
      [field]: e.target.value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ""
      }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <FormField
        label="Full Name"
        value={formData.name}
        onChange={handleChange("name")}
        error={errors.name}
        placeholder="Enter full name"
      />

      <FormField
        label="Email Address"
        type="email"
        value={formData.email}
        onChange={handleChange("email")}
        error={errors.email}
        placeholder="Enter email address"
      />

      <FormField
        label="Phone Number"
        value={formData.phone}
        onChange={handleChange("phone")}
        error={errors.phone}
        placeholder="Enter phone number"
      />

      <FormField
        label="Company"
        value={formData.company}
        onChange={handleChange("company")}
        error={errors.company}
        placeholder="Enter company name"
      />

      <FormField
        label="Tags"
        value={formData.tags}
        onChange={handleChange("tags")}
        error={errors.tags}
        placeholder="Enter tags separated by commas"
      />

      <FormField
        label="Notes"
        type="textarea"
        value={formData.notes}
        onChange={handleChange("notes")}
        error={errors.notes}
        placeholder="Add any additional notes..."
      />

      <div className="flex gap-3 pt-4">
        <Button
          type="submit"
          disabled={isSubmitting}
          className="flex-1"
        >
          {isSubmitting ? "Saving..." : contact ? "Update Contact" : "Create Contact"}
        </Button>
        <Button
          type="button"
          variant="secondary"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
};

export default ContactForm;