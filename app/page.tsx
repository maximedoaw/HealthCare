"use client"

import { AuthScreen } from "@/components/home/auth-screen/auth-screen"
import HomeScreen from "@/components/home/home-screen/home-screen";
import { MedicalLoader } from "@/components/medical-loader";
import { auth, firestore } from "@/firebase/config";
import { useDisplaySidebarStore } from "@/store/display-sidebar-store";
import { VerificationProcessProps } from "@/types";
import { doc, getDoc, serverTimestamp, setDoc, Timestamp } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";

type User = () => any

type StaffRole = "Doctor" | "Nurse" | "Surgeon" | "Anesthesiologist" | "Radiologist" | "Intern" | "Administrator"
type VerificationStatus = "pending" | "verified" | "rejected"

interface VerificationFile {
  fileName: string
  fileUrl: string // URL Cloudinary au lieu de base64
  publicId: string // ID public Cloudinary
  uploadedAt: Date
  fileSize: number
  fileType: string
}

interface VerificationStatusItem {
  status: VerificationStatus
  verifiedAt?: Date
  verifiedBy?: string
}

// Interface consolidée pour la collection "verifications"
interface VerificationDocument {
  // Données de base du processus
  otpValues: string[]
  role: "patient" | "personalMedical" | "admin"
  progress: number
  completedAt: Timestamp | null
  step: number
  verifications: {
    structure: boolean
    identite: boolean
    diplome: boolean
  }
  isCompleted: boolean

  // Données étendues
  staffType?: StaffRole
  uploadedFiles?: {
    diplome?: VerificationFile
    identite?: VerificationFile
    structure?: VerificationFile
  }

  // Statuts de vérification
  verificationStatuses?: {
    diplome?: VerificationStatusItem
    identite?: VerificationStatusItem
    structure?: VerificationStatusItem
  }

  // Métadonnées
  createdAt?: Date
  updatedAt?: Date
}

export default function Home() {
  const [user, loading] = useAuthState(auth)
  const { isOpen, onClose } = useDisplaySidebarStore()
  const [status, setStatus] = useState<boolean>(false)
  const [verificationData, setVerificationData] = useState<VerificationDocument | null>(null)
  const [accessGranted, setAccessGranted] = useState<boolean>(false)

  useEffect(() => {
    if (!user) return;

    const fetchUserData = async () => {
      try {
        // Vérification/création de l'utilisateur
        const userDoc = doc(firestore, `users/${user.uid}`);
        const existingUser = await getDoc(userDoc);

        if (!existingUser.exists()) {
          await setDoc(userDoc, {
            userId: user.uid,
            username: user.displayName,
            email: user.email,
            isPatient: true,
            createdAt: serverTimestamp()
          });
          onClose();
        }

        // Récupération des données de vérification
        const verificationDoc = doc(firestore, `verifications/${user.uid}`);
        const verificationSnap = await getDoc(verificationDoc);

        if (verificationSnap.exists()) {
          const data = verificationSnap.data() as VerificationDocument;
          setVerificationData(data);
          
          // Vérification du statut de vérification
          if (data.verificationStatuses) {
            const allPending = Object.values(data.verificationStatuses).every(
              statusItem => statusItem?.status === "pending"
            );
            
            // Si l'utilisateur est un patient OU si toutes les vérifications ne sont pas en pending
            const shouldGrantAccess = data.role === "patient" || !allPending;
            
            setAccessGranted(shouldGrantAccess);
            setStatus(shouldGrantAccess);
          } else {
            // Si pas de verificationStatuses, on considère que l'accès est possible
            setAccessGranted(true);
            setStatus(true);
          }
          
          console.log("Données de vérification:", data);
        } else {
          // Si pas de données de vérification mais que l'utilisateur est patient
          const isPatient = existingUser.data()?.isPatient;
          setAccessGranted(isPatient);
          setStatus(isPatient);
          setVerificationData(null);
        }
      } catch (error) {
        console.error("Erreur lors de la récupération des données:", error);
        // En cas d'erreur, on autorise l'accès aux patients par sécurité
        setAccessGranted(verificationData?.role === "patient");
      }
    };

    fetchUserData();
  }, [user]);

  if (loading) return <MedicalLoader />;

  return (
    <>
      {user ?   accessGranted ? <HomeScreen /> : <AuthScreen /> : <AuthScreen />}
    </>
  );
}
