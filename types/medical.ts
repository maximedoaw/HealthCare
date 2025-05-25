export enum SmokingStatus {
  NEVER = 'never',
  FORMER = 'former',
  CURRENT = 'current'
}

export enum PhysicalActivityLevel {
  LOW = 'low',
  MODERATE = 'moderate',
  HIGH = 'high'
}

export enum MedicalStaffRole {
  DOCTOR = "Médecin",
  NURSE = "Infirmier/Infirmière",
  SURGEON = "Chirurgien",
  ANESTHESIOLOGIST = "Anesthésiste",
  RADIOLOGIST = "Radiologue",
  INTERN = "Interne",
  ADMINISTRATOR = "Administrateur"
}

// Enumération des permissions
export enum MedicalPermissionLevel {
  NONE = "Aucun accès",
  READ_ONLY = "Lecture seule",
  READ_WRITE = "Lecture et écriture",
  FULL_ACCESS = "Accès complet",
  SURGICAL_ACCESS = "Accès chirurgical"
}

// Enumération des types d'opérations
export enum MedicalOperationType {
  CONSULTATION = "Consultation",
  MINOR_SURGERY = "Petite intervention",
  MAJOR_SURGERY = "Chirurgie majeure",
  DIAGNOSTIC_IMAGING = "Imagerie diagnostique",
  LAB_TEST = "Test laboratoire",
  PRESCRIPTION = "Prescription médicamenteuse",
  EMERGENCY_CARE = "Soins d'urgence",
  ANESTHESIA = "Anesthésie"
}