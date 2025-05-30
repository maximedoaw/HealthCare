import { Header } from "./header";
import { Sidebar } from "../../sidebar";
import { AppointmentCard } from "@/components/patient/appointment-card";
import { HealthMetrics } from "@/components/patient/health-metrics";
import { DocumentsList } from "@/components/patient/documents-list";
import { AIAssistantButton } from "@/components/patient/ai-assistant-button";
import { AIAssistantDialog } from "@/components/patient/ai-assistant-dialog";
import { useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/firebase/config";
import { useModalDoctorStore } from "@/store/useDoctorModalStore";
import { PatientModal } from "@/components/patient/modal-patient";
import DoctorModal from "@/components/Users/modal-doctor";

enum SmokingStatus {
    NEVER = 'never',
    FORMER = 'former',
    CURRENT = 'current'
}
  
enum PhysicalActivityLevel {
    LOW = 'low',
    MODERATE = 'moderate',
    HIGH = 'high'
}

export default function HomeScreen() {
  const [isAIAssistantOpen, setIsAIAssistantOpen] = useState(false);
  const {setIsOpen} = useModalDoctorStore()
  const [user] = useAuthState(auth)

  return (
    <div className="flex min-h-screen ">
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <div className="grid gap-6 max-w-6xl mx-auto">
            {/* Section Bienvenue */}
            <section className="rounded-xl shadow-sm p-6">
              <h1 className="text-2xl font-bold text-gray-800 mb-2">Bonjour, {user?.displayName}</h1>
              <p className="text-gray-600">
                Voici votre espace personnel de suivi médical. Consultez vos rendez-vous, 
                documents de santé et posez vos questions à notre assistant.
              </p>
            </section>

            {/* Section Rendez-vous */}
            <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <AppointmentCard 
                date="15 Nov 2023" 
                time="14:30" 
                doctor="Dr. Kamga Jean" 
                specialty="Cardiologie"
                status="Confirmé"
              />
              
              <div className=" rounded-xl shadow-sm border p-6">
                <h2 className="text-xl font-semibold mb-4">Prendre un nouveau rendez-vous</h2>
                <button 
                    className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
                    onClick={() => setIsOpen(true)}
                >
                  Chercher un médecin
                </button>
                <DoctorModal/>
                <PatientModal/>
              </div>
            </section>

            {/* Section Santé */}
            <HealthMetrics 
    healthData={{
      weightKg: 68,
      bloodPressureSystolic: 120,
      bloodPressureDiastolic: 80,
      heightCm: 175,
      heartRateBpm: 72,
      respiratoryRate: 16,
      temperatureCelsius: 36.6,
      bloodOxygenSaturation: 98,
      bloodSugarMgDl: 90,
      cholesterolTotalMgDl: 190,
      physicalActivityLevel: PhysicalActivityLevel.MODERATE,
      alcoholConsumptionPerWeek: 3,
      smokingStatus: SmokingStatus.NEVER,
      allergies: ["Pollen", "Noix"],
      currentMedications: ["Paracétamol"],
      medicalConditions: ["Asthme léger"]
    }} 
  />

            {/* Section Documents */}
            <DocumentsList />

            {/* Bouton Assistant IA (flottant sur mobile) */}
            <AIAssistantButton onClick={() => setIsAIAssistantOpen(true)} />
          </div>
        </main>

        {/* Dialog Assistant IA */}
        <AIAssistantDialog 
          open={isAIAssistantOpen} 
          onClose={() => setIsAIAssistantOpen(false)} 
        />
      </div>
    </div>
  );
}