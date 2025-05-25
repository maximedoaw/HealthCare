import { User, Clock, HeartPulse } from "lucide-react";

interface PatientCardProps {
  name: string;
  age: number;
  gender: string;
  lastVisit: string;
  status: "Critical" | "Stable" | "Recovering";
  condition: string;
}

export function PatientCard({ name, age, gender, lastVisit, status, condition }: PatientCardProps) {
  const statusColors = {
    Critical: "bg-red-100 text-red-800",
    Stable: "bg-green-100 text-green-800",
    Recovering: "bg-blue-100 text-blue-800",
  };
  
  return (
    <div className="flex items-center p-4 border rounded-lg hover:shadow-sm transition-shadow">
      <div className="flex-shrink-0 mr-4">
        <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
          <User className="h-5 w-5 text-blue-600" />
        </div>
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-gray-900 truncate">{name}</h3>
          <span className="text-xs text-gray-500">{age}y, {gender}</span>
        </div>
        <p className="text-sm text-gray-500 truncate">{condition}</p>
        <div className="mt-1 flex items-center text-xs text-gray-500">
          <Clock className="mr-1 h-3 w-3" />
          <span>Last visit: {lastVisit}</span>
        </div>
      </div>
      <div className="ml-4">
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[status]}`}>
          <HeartPulse className="mr-1 h-3 w-3" />
          {status}
        </span>
      </div>
    </div>
  );
}