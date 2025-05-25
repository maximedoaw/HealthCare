"use client"

import { AuthScreen } from "@/components/home/auth-screen/auth-screen"
import HomeScreen from "@/components/home/home-screen/home-screen";
import { MedicalLoader } from "@/components/medical-loader";
import { auth, firestore } from "@/firebase/config";
import { useDisplaySidebarStore } from "@/store/display-sidebar-store";
import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import { useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";

type User = () => any

export default function Home() {
  const [user, loading] = useAuthState(auth)
  const {isOpen, onClose} = useDisplaySidebarStore()

  useEffect(() : User => {
    const createUser = async () => {
      if (!user) return
      
      const userDoc = doc(firestore, `users/${user.uid}`)
      const existingUser = await getDoc(userDoc)

      if(existingUser.exists()) return

      if(user){
        setDoc(userDoc, {
          userId: user?.uid,
          username: user?.displayName,
          email:user?.email,
          isPatient: true,
          createAt: serverTimestamp()
        })
        onClose()
      }
    }

    return () => createUser()
  }, [user])
  
  
  if(loading) return <MedicalLoader/>

  return (
    <>
    {user ? <HomeScreen/> : <AuthScreen />}
    </>
  )
}
