"use client"

import { useState } from "react"
import { PatientHeader } from "@/components/Users/patient-header"
import { MedicalInfo } from "@/components/Users/medical-info"
import { TreatmentsList } from "@/components/Users/treatments-list"
import { StaffManagement } from "@/components/Users/staff-management"
import { HealthForm } from "@/components/Users/health-form"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  type MedicalRecord,
  type Treatment,
  type HospitalStaff,
  type PatientHealthForm,

} from "@/types"

 enum MedicalStaffRole {
  DOCTOR = "Médecin",
  NURSE = "Infirmier/Infirmière",
  SURGEON = "Chirurgien",
  ANESTHESIOLOGIST = "Anesthésiste",
  RADIOLOGIST = "Radiologue",
  INTERN = "Interne",
  ADMINISTRATOR = "Administrateur"
}

// Enumération des permissions
 enum MedicalPermissionLevel {
  NONE = "Aucun accès",
  READ_ONLY = "Lecture seule",
  READ_WRITE = "Lecture et écriture",
  FULL_ACCESS = "Accès complet",
  SURGICAL_ACCESS = "Accès chirurgical"
}

// Enumération des types d'opérations
 enum MedicalOperationType {
  CONSULTATION = "Consultation",
  MINOR_SURGERY = "Petite intervention",
  MAJOR_SURGERY = "Chirurgie majeure",
  DIAGNOSTIC_IMAGING = "Imagerie diagnostique",
  LAB_TEST = "Test laboratoire",
  PRESCRIPTION = "Prescription médicamenteuse",
  EMERGENCY_CARE = "Soins d'urgence",
  ANESTHESIA = "Anesthésie"
}
// Données d'exemple
const mockRecord: MedicalRecord = {
  id: "patient-001",
  patientId: "P001",
  patientName: "Marie Dubois",
  birthDate: "1985-03-15",
  allergies: ["Pénicilline", "Fruits à coque"],
  currentMedications: ["Metformine 500mg", "Lisinopril 10mg"],
  medicalHistory: ["Hypertension", "Diabète type 2"],
  treatments: [
    {
      type: MedicalOperationType.CONSULTATION,
      date: "2024-01-15",
      performedBy: "Dr. Martin",
      notes: "Contrôle diabète - Glycémie stable, patient observant",
      outcome: "Ajustement posologie Metformine",
    },
    {
      type: MedicalOperationType.LAB_TEST,
      date: "2024-01-10",
      performedBy: "Dr. Leroy",
      notes: "Bilan sanguin de routine",
      outcome: "HbA1c: 7.2%, légère amélioration",
    },
  ],
  lastUpdated: "2024-01-15",
  lastUpdatedBy: "Dr. Martin",
}

const mockStaff: HospitalStaff[] = [
  {
    id: "1",
    firstName: "Jean",
    lastName: "Martin",
    email: "XG5lT@example.com",
    role: MedicalStaffRole.DOCTOR,
    department: "Endocrinologie",
    permissions: MedicalPermissionLevel.FULL_ACCESS,
    allowedOperations: [MedicalOperationType.CONSULTATION, MedicalOperationType.PRESCRIPTION],
    specialty: "Diabétologie",
    isChief: true,
  },
  {
    id: "2",
    firstName: "Sophie",
    lastName: "Leroy",
    email: "Gx5A2@example.com",
    role: MedicalStaffRole.NURSE,
    department: "Endocrinologie",
    permissions: MedicalPermissionLevel.READ_WRITE,
    allowedOperations: [MedicalOperationType.CONSULTATION],
    specialization: "Diabétologie",
    shift: "Jour",
    canAdministerMedication: true,},
]

const mockHealthData: PatientHealthForm = {
  weightKg: 75,
  bloodPressureSystolic: 130,
  bloodPressureDiastolic: 85,
  heightCm: 165,
  heartRateBpm: 72,
  respiratoryRate: 16,
  temperatureCelsius: 36.8,
  bloodOxygenSaturation: 98,
  bloodSugarMgDl: 120,
  cholesterolTotalMgDl: 200,
}

export default function PatientPage({ params }: { params: { id: string } }) {
  const [record, setRecord] = useState<MedicalRecord>(mockRecord)
  const [staff, setStaff] = useState<HospitalStaff[]>(mockStaff)
  const [healthData, setHealthData] = useState<PatientHealthForm>(mockHealthData)
  const [currentUser] = useState({
    role: MedicalStaffRole.DOCTOR,
    permissionLevel: MedicalPermissionLevel.FULL_ACCESS,
  })

  // Fonctions pour gérer les traitements
  const handleAddTreatment = (newTreatment: Treatment) => {
    setRecord({
      ...record,
      treatments: [newTreatment, ...record.treatments],
      lastUpdated: new Date().toISOString(),
      lastUpdatedBy: "Utilisateur actuel",
    })
  }

  const handleUpdateTreatment = (index: number, updatedTreatment: Treatment) => {
    const newTreatments = [...record.treatments]
    newTreatments[index] = updatedTreatment
    setRecord({
      ...record,
      treatments: newTreatments,
      lastUpdated: new Date().toISOString(),
      lastUpdatedBy: "Utilisateur actuel",
    })
  }

  const handleDeleteTreatment = (index: number) => {
    const newTreatments = record.treatments.filter((_, i) => i !== index)
    setRecord({
      ...record,
      treatments: newTreatments,
      lastUpdated: new Date().toISOString(),
      lastUpdatedBy: "Utilisateur actuel",
    })
  }

  // Fonctions pour gérer le personnel
  const handleAddStaff = (newStaff: HospitalStaff) => {
    setStaff([...staff, newStaff])
  }

  const handleUpdateStaff = (id: string, updatedStaff: Partial<HospitalStaff>) => {
    setStaff(staff.map((member) => (member.id === id ? { ...member, ...updatedStaff } : member)))
  }

  const handleDeleteStaff = (id: string) => {
    setStaff(staff.filter((member) => member.id !== id))
  }

  // Fonction pour sauvegarder les données de santé
  const handleSaveHealthData = (data: PatientHealthForm) => {
    setHealthData(data)
    setRecord({
      ...record,
      lastUpdated: new Date().toISOString(),
      lastUpdatedBy: "Utilisateur actuel",
    })
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <PatientHeader record={record} />

      <Tabs defaultValue="info" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="info">Informations Patient</TabsTrigger>
          <TabsTrigger value="health">Données de Santé</TabsTrigger>
          <TabsTrigger value="treatments">Traitements</TabsTrigger>
          <TabsTrigger value="staff">Personnel</TabsTrigger>
        </TabsList>

        <TabsContent value="info" className="space-y-6">
          <MedicalInfo record={record} />
        </TabsContent>

        <TabsContent value="health" className="space-y-6">
          <HealthForm
            healthData={healthData}
            onSave={handleSaveHealthData}
            canEdit={currentUser.permissionLevel !== MedicalPermissionLevel.READ_ONLY}
          />
        </TabsContent>

        <TabsContent value="treatments" className="space-y-6">
          <TreatmentsList
            treatments={record.treatments}
            userPermission={currentUser.permissionLevel}
            onAddTreatment={handleAddTreatment}
            onUpdateTreatment={handleUpdateTreatment}
            onDeleteTreatment={handleDeleteTreatment}
          />
        </TabsContent>

        <TabsContent value="staff" className="space-y-6">
          <StaffManagement
            staff={staff}
            currentUserRole={currentUser.role}
            onAddStaff={handleAddStaff}
            onUpdateStaff={handleUpdateStaff}
            onDeleteStaff={handleDeleteStaff}
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}
