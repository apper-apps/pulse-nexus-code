import ComingSoon from "./ComingSoon";

const Deals = () => {
  const features = [
    {
      icon: "DollarSign",
      title: "Deal Pipeline",
      description: "Visual pipeline management with drag-and-drop"
    },
    {
      icon: "TrendingUp",
      title: "Revenue Forecasting",
      description: "Predict future revenue based on current deals"
    },
    {
      icon: "Calendar",
      title: "Deal Timeline",
      description: "Track important dates and milestones"
    },
    {
      icon: "Users",
      title: "Team Collaboration",
      description: "Share deals and collaborate with your team"
    },
    {
      icon: "BarChart3",
      title: "Sales Analytics",
      description: "Detailed reporting and performance metrics"
    },
    {
      icon: "Target",
      title: "Goal Tracking",
      description: "Set and track sales targets and quotas"
    }
  ];

  return (
    <ComingSoon
      title="Deals Management"
      description="A powerful deal pipeline management system is coming soon. Track your sales opportunities, forecast revenue, and close more deals with our comprehensive sales management tools."
      icon="DollarSign"
      features={features}
    />
  );
};

export default Deals;