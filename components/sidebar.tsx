"use client"

import { Home, Stethoscope, ClipboardList, Users, FileText, Settings, MessageSquare, Bell, HelpCircle, Sun, Moon, LogOut, CalendarPlus, FolderDot } from "lucide-react";
import Link from "next/link";
import { signOut } from "firebase/auth";
import { auth, firestore } from "@/firebase/config";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { ModeToggle } from "./mode-toggle";
import { useAuthState } from "react-firebase-hooks/auth";
import { doc, getDoc } from "firebase/firestore";
import { OTPDocument } from "@/types";



export function Sidebar() {
  
  const [darkMode, setDarkMode] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [isPatient, setIsPatient] = useState(false)
  const pathname = usePathname()
  const [user] = useAuthState(auth)

  const mainLinks = [
    { 
      href: "/", 
      icon: Home, 
      label: "Accueil",
      visible: true
    },
    { 
      href: "/dashboard", 
      icon: FolderDot, 
      label: "Dashboard",
      visible: isPatient
    },
    { 
      href: "/patients", 
      icon: Stethoscope, 
      label: "Patients",
      visible: isPatient // Seulement visible pour les médecins/admin
    },
    { 
      href: "/records", 
      icon: ClipboardList, 
      label: "Dossiers médicaux",
      visible: true
    },
    { 
      href: "/staff", 
      icon: Users, 
      label: "Personnel",
      visible: !isPatient
    },
    { 
      href: "/reports", 
      icon: FileText, 
      label: "Rapports",
      visible: !isPatient
    },
    { 
      href: "/schedule", 
      icon: CalendarPlus, 
      label: "Prendre RDV",
      visible: !isPatient // Seulement visible pour les patients
    }
  ]

  const secondaryLinks = [
    { 
      href: "/settings", 
      icon: Settings, 
      label: "Paramètres",
      visible: true
    },
    { 
      href: "/help", 
      icon: HelpCircle, 
      label: "Aide",
      visible: true
    }
  ]

  useEffect(() => {
    const userTypeRole = () => {
      if (user) {
        const userDoc = doc(firestore, "verification", user?.uid)
        const userDocRef = getDoc(userDoc) 
        userDocRef.then((doc) => {
          if (doc.exists()) {
            const userData = doc.data() as OTPDocument
            setIsPatient(userData.role === "patient")
            console.log("Donnees utilisateur: ",userData);
            
          }
        })
      }
    }

    userTypeRole()

  }, [user])
  const handleLogout = async () => {
    try {
      await signOut(auth);
      // Redirection ou gestion après déconnexion
    } catch (error) {
      console.error("Erreur lors de la déconnexion:", error);
    }
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <>
      <button 
        className="md:hidden fixed top-4 left-4 z-50 p-2 rounded-md bg-white dark:bg-gray-900 shadow-md"
        onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
      >
        <svg
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d={mobileSidebarOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
          />
        </svg>
      </button>

      {/* Sidebar */}
      <div className={`${mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 fixed md:relative inset-y-0 left-0 z-40 w-64 transition-transform duration-300 ease-in-out md:flex md:flex-shrink-0`}>
        <div className="flex flex-col w-64 border-r  bg-white dark:bg-gray-950 h-full">
          <div className="flex items-center h-16 px-4 border-b border-gray-200 dark:border-gray-700">
            <h1 className="text-xl font-bold text-blue-600 dark:text-blue-400">healthCare</h1>
          </div>
          <div className="flex flex-col flex-grow overflow-y-auto">
          <nav className="flex-1 px-2 py-4 space-y-1">
            {/* Liens principaux */}
            {mainLinks.map((link) => (
              link.visible && (
                <Link 
                  key={link.href}
                  href={link.href}
                  className={`flex items-center px-4 py-2 text-sm font-medium rounded-lg ${
                    pathname === link.href 
                      ? 'text-white bg-blue-600 dark:bg-blue-700' 
                      : 'text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700'
                  }`}
                  onClick={() => setMobileSidebarOpen(false)}
                >
                  <link.icon className="mr-3 h-5 w-5" />
                  {link.label}
                </Link>
              )
            ))}
            
            <div className="pt-4 mt-4 border-t border-gray-200 dark:border-gray-700">
              {/* Liens secondaires */}
              {secondaryLinks.map((link) => (
                link.visible && (
                  <Link 
                    key={link.href}
                    href={link.href}
                    className={`flex items-center px-4 py-2 text-sm font-medium rounded-lg ${
                      pathname === link.href 
                        ? 'text-white bg-blue-600 dark:bg-blue-700' 
                        : 'text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700'
                    }`}
                    onClick={() => setMobileSidebarOpen(false)}
                  >
                    <link.icon className="mr-3 h-5 w-5" />
                    {link.label}
                  </Link>
                )
              ))}
              
              
              <button
                onClick={handleLogout}
                className="flex items-center w-full px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg dark:text-gray-200 dark:hover:bg-gray-700"
                aria-label="Logout"
              >
                <LogOut className="h-5 w-5 mr-3" />
                Déconnexion
              </button>
              <ModeToggle/>
            </div>
          </nav>
          </div>
          <div className="p-4 border-t mb-auto border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <img className="h-10 w-10 rounded-full" src="/images/avatar-demo.jpg" alt="User avatar" />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-200">Dr. Jean Kamga</p>
                  <p className="text-xs font-medium text-gray-500 dark:text-gray-400">Admin</p>
                </div>
              </div>
              

            </div>
          </div>
        </div>
      </div>

      {/* Overlay pour mobile */}
      {mobileSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}
    </>
  );
}