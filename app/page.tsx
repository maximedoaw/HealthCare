"use client"

import { AuthScreen } from "@/components/home/auth-screen/auth-screen"
import HomeScreen from "@/components/home/home-screen/home-screen";
import { MedicalLoader } from "@/components/medical-loader";
import { auth, firestore } from "@/firebase/config";
import { useDisplaySidebarStore } from "@/store/useDisplaySideBarStore";
import { VerificationDocument } from "@/types";
import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";

export default function Home() {
  const [user, loading, error] = useAuthState(auth);
  const { onClose } = useDisplaySidebarStore();
  const [verificationData, setVerificationData] = useState<VerificationDocument | null>(null);
  const [accessGranted, setAccessGranted] = useState<boolean | null>(null); // null = état initial

  useEffect(() => {
    if (!user) {
      setAccessGranted(false);
      return;
    }

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
          
          let shouldGrantAccess = false;
          
          if (data.verificationStatuses) {
            const allPending = Object.values(data.verificationStatuses).every(
              statusItem => statusItem?.status === "pending"
            );
            shouldGrantAccess = (data.role === "patient" && data.isCompleted) || !allPending;
          } else {
            shouldGrantAccess = data.role === "patient" && data.isCompleted;
          }
          
          setAccessGranted(shouldGrantAccess);
        } else {
          const isPatient = existingUser.data()?.isPatient ?? true;
          setAccessGranted(isPatient);
          setVerificationData(null);
        }
      } catch (error) {
        console.error("Erreur lors de la récupération des données:", error);
        setAccessGranted(verificationData?.role === "patient");
      }
    };

    fetchUserData();
  }, [user]);

  // État de chargement global
  if (loading || accessGranted === null) {
    return <MedicalLoader />;
  }

  // Gestion des erreurs
  if (error) {
    console.error("Authentication error:", error);
    return <AuthScreen />;
  }

  // Affichage en fonction de l'état d'authentification
  return user && accessGranted ? <HomeScreen /> : <AuthScreen />;
}