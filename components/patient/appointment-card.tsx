// src/components/patient/appointment-card.tsx
import { Calendar, Clock, User } from "lucide-react";

interface AppointmentCardProps {
  date: string;
  time: string;
  doctor: string;
  specialty: string;
  status: "Confirmé" | "En attente" | "Annulé";
}

export function AppointmentCard({ date, time, doctor, specialty, status }: AppointmentCardProps) {
  const statusColors = {
    "Confirmé": "bg-green-100 text-green-800",
    "En attente": "bg-yellow-100 text-yellow-800",
    "Annulé": "bg-red-100 text-red-800"
  };

  return (
    <div className=" rounded-xl shadow-sm border p-6">
      <h2 className="text-xl font-semibold mb-4">Prochain rendez-vous</h2>
      
      <div className="space-y-4">
        <div className="flex items-center">
          <Calendar className="h-5 w-5 text-blue-500 mr-3" />
          <span>{date} à {time}</span>
        </div>
        
        <div className="flex items-center">
          <User className="h-5 w-5 text-blue-500 mr-3" />
          <div>
            <p className="font-medium">{doctor}</p>
            <p className="text-sm text-gray-500">{specialty}</p>
          </div>
        </div>
        
        <div className="flex justify-between items-center pt-2">
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusColors[status]}`}>
            {status}
          </span>
          <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
            Voir détails
          </button>
        </div>
      </div>
    </div>
  );
}