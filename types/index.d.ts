
// types.d.ts

import { Timestamp } from "firebase/firestore";
import { MedicalOperationType, MedicalPermissionLevel, MedicalStaffRole } from "./medical";

// Enumération des rôles du personnel médical


// Interface de base pour le personnel médical
export interface MedicalStaff {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: MedicalStaffRole;
  department: string;
  permissions: MedicalPermissionLevel;
  allowedOperations: MedicalOperationType[];
  specialization?: string
}

// Interfaces spécifiques pour chaque rôle
export interface Doctor extends MedicalStaff {
  specialty: string;
  isChief: boolean;
}

export interface Nurse extends MedicalStaff {
  shift: "Jour" | "Nuit" | "Mixte";
  canAdministerMedication: boolean;
}

export interface Surgeon extends MedicalStaff {
  surgicalSpecialty: string;
  yearsOfExperience: number;
}

export interface Anesthesiologist extends MedicalStaff {
  canPerformIntubation: boolean;
  managesPainClinic: boolean;
}

export interface Radiologist extends MedicalStaff {
  canPerformCT: boolean;
  canPerformMRI: boolean;
}

export interface Intern extends MedicalStaff {
  supervisorId: string;
  graduationYear: number;
}

export interface Administrator extends MedicalStaff {
  accessToFinancialData: boolean;
  canManageStaff: boolean;
}

// Type union pour tous les types de personnel
export type HospitalStaff = Doctor | Nurse | Surgeon | Anesthesiologist | Radiologist | Intern | Administrator;



// Interface pour les dossiers médicaux
export interface MedicalRecord {
  id: string;
  patientId: string;
  patientName: string;
  birthDate: string;
  allergies: string[];
  currentMedications: string[];
  medicalHistory: string[];
  treatments: Treatment[];
  lastUpdated: string;
  lastUpdatedBy: string;
}

export interface Treatment {
  type: MedicalOperationType;
  date: string;
  performedBy: string;
  notes: string;
  outcome: string;
}

export interface OTPDocument {
  otpValues: string[]; // Tableau de 6 chaînes vides
  role: 'patient' | 'personalMedical' | 'admin'; // Le rôle semble être "patient" mais pourrait être autre chose
  progress: number; // Valeur numérique entre 0 et 100
  completedAt: Timestamp;
  step: number; // Étape actuelle (2 dans l'exemple)
  verifications: {
    structure: boolean; // Vérification structure
    identite: boolean; // Vérification identité
    diplome: boolean; // Vérification diplôme
  };
  isCompleted: boolean; // Indique si le processus est complet
}
// Fonctions utilitaires
export declare function hasSurgicalAccess(staff: HospitalStaff): boolean;
export declare function canPerformOperation(staff: HospitalStaff, operation: MedicalOperationType): boolean;
export declare function getStaffPermissions(staff: HospitalStaff): MedicalPermissionLevel;

export declare interface Roles {
    id: number
    name: string
    permissions: 'patient' | 'personalMedical' | 'admin';
}

export declare interface PatientHealthForm {
    weightKg: number
    bloodPressureSystolic: number
    bloodPressureDiastolic: number
    heightCm?: number
    heartRateBpm?: number
    respiratoryRate?: number
    temperatureCelsius?: number
    bloodOxygenSaturation?: number
    bloodSugarMgDl?: number
    cholesterolTotalMgDl?: number
    allergies?: string[]
    currentMedications?: string[]
    medicalConditions?: string[]
    smokingStatus?: SmokingStatus
    alcoholConsumptionPerWeek?: number
    physicalActivityLevel?: PhysicalActivityLevel
  }

  export declare interface Patient {
  id: string
  firstName: string
  lastName: string
  dateOfBirth: string
  gender: string
  phone: string
  email: string
  address: string
  emergencyContact: {
    name: string
    phone: string
    relationship: string
  }
  medicalHistory: string[]
  allergies: string[]
  currentMedications: string[]
  bloodType: string
  insuranceNumber: string
}

export interface VerificationFile {
  fileName: string
  fileUrl: string // URL Cloudinary au lieu de base64
  publicId: string // ID public Cloudinary
  uploadedAt: Date
  fileSize: number
  fileType: string
}

export interface VerificationStatusItem {
  status: VerificationStatus
  verifiedAt?: Date
  verifiedBy?: string
}

export interface VerificationProcessProps {
  role: "patient" | "personalMedical" | "admin"
  staffType?: StaffRole
  verifications: {
    diplome: boolean
    identite: boolean
    structure: boolean
  }
  verificationStatuses: {
    diplome?: VerificationStatusItem
    identite?: VerificationStatusItem
    structure?: VerificationStatusItem
  }
  uploadedFiles: {
    diplome?: VerificationFile
    identite?: VerificationFile
    structure?: VerificationFile
  }
  otpValues: string[]
  onVerificationToggle: (type: keyof VerificationProcessProps["verifications"]) => void
  onFileUpload: (type: keyof VerificationProcessProps["verifications"], fileData: VerificationFile) => void
  onOtpChange: (index: number, value: string) => void
  onSubmit: () => void
  onBack: () => void
  onGoHome: () => void
  isSaving: boolean
  progress: number
}