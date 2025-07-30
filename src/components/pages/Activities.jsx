import ComingSoon from "./ComingSoon";

const Activities = () => {
  const features = [
    {
      icon: "Calendar",
      title: "Activity Scheduling",
      description: "Schedule calls, meetings, and follow-ups"
    },
    {
      icon: "Clock",
      title: "Time Tracking",
      description: "Track time spent on customer interactions"
    },
    {
      icon: "CheckSquare",
      title: "Task Management",
      description: "Create and manage CRM-related tasks"
    },
    {
      icon: "Bell",
      title: "Smart Reminders",
      description: "Automated reminders for scheduled activities"
    },
    {
      icon: "BarChart3",
      title: "Activity Analytics",
      description: "Analyze your activity patterns and productivity"
    },
    {
      icon: "Repeat",
      title: "Recurring Activities",
      description: "Set up recurring meetings and check-ins"
    }
  ];

  return (
    <ComingSoon
      title="Activity Management"
      description="Stay on top of your customer interactions with a comprehensive activity management system. Schedule meetings, track communications, and never miss a follow-up again."
      icon="Calendar"
      features={features}
    />
  );
};

export default Activities;