import { Clock, User, FileText, Stethoscope } from "lucide-react";

export function RecentActivity() {
  const activities = [
    {
      id: 1,
      type: "consultation",
      description: "New consultation recorded",
      time: "10 minutes ago",
      user: "Dr. Ngo Bassa",
    },
    {
      id: 2,
      type: "record",
      description: "Medical record updated",
      time: "1 hour ago",
      user: "Nurse Paul",
    },
    {
      id: 3,
      type: "patient",
      description: "New patient registered",
      time: "2 hours ago",
      user: "Reception",
    },
    {
      id: 4,
      type: "prescription",
      description: "Prescription generated",
      time: "3 hours ago",
      user: "Dr. Fouda",
    },
  ];
  
  const getIcon = (type: string) => {
    switch (type) {
      case "consultation":
        return <Stethoscope className="h-4 w-4" />;
      case "record":
        return <FileText className="h-4 w-4" />;
      case "patient":
        return <User className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };
  
  return (
    <div className=" rounded-xl shadow-sm border p-6">
      <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
      <div className="space-y-4">
        {activities.map((activity) => (
          <div key={activity.id} className="flex items-start">
            <div className="flex-shrink-0 mt-1 mr-3">
              <div className="h-8 w-8 rounded-full bg-blue-50 flex items-center justify-center">
                {getIcon(activity.type)}
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 dark:text-white">{activity.description}</p>
              <div className="flex items-center text-xs text-gray-500 mt-1">
                <span>{activity.user}</span>
                <span className="mx-1">·</span>
                <Clock className="mr-1 h-3 w-3" />
                <span>{activity.time}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
      <button className="mt-4 text-sm font-medium text-blue-600 hover:text-blue-800">
        View all activity
      </button>
    </div>
  );
}