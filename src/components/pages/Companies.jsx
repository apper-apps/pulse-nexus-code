import ComingSoon from "./ComingSoon";

const Companies = () => {
  const features = [
    {
      icon: "Building2",
      title: "Company Profiles",
      description: "Comprehensive company information and history"
    },
    {
      icon: "Users",
      title: "Contact Relationships",
      description: "Map contacts to their respective companies"
    },
    {
      icon: "TrendingUp",
      title: "Company Analytics",
      description: "Track engagement and deal history per company"
    },
    {
      icon: "Globe",
      title: "Company Intelligence",
      description: "Automatic data enrichment and social profiles"
    },
    {
      icon: "FileText",
      title: "Document Management",
      description: "Store contracts, proposals, and company documents"
    },
    {
      icon: "Calendar",
      title: "Account Planning",
      description: "Strategic account management and planning tools"
    }
  ];

  return (
    <ComingSoon
      title="Company Management"
      description="Manage your business relationships at the company level. Track account information, organize contacts by company, and develop strategic account plans to grow your business relationships."
      icon="Building2"
      features={features}
    />
  );
};

export default Companies;