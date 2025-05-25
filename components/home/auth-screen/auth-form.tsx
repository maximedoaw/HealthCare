"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuthStore } from "@/store/auth-store"
import {
  useSignInWithEmailAndPassword,
  useSignInWithGoogle,
  useCreateUserWithEmailAndPassword,
  useAuthState,
} from "react-firebase-hooks/auth"
import { auth } from "@/firebase/config"
import { Loader2 } from "lucide-react"
import { FirebaseError } from "firebase/app"
import { toast } from "react-hot-toast"
import type { Roles } from "@/types"
import Link from "next/link"
import { useRouter } from "next/navigation"

export function AuthForm() {
  const { dialogType, setIsOpen } = useAuthStore()
  const [activeTab, setActiveTab] = useState<string>("email")
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  })
  const router = useRouter()

  const roles: Roles[] = [
    {
      id: 1,
      name: "Patient",
      permissions: "patient",
    },
    {
      id: 2,
      name: "Docteur",
      permissions: "doctor",
    },
    {
      id: 3,
      name: "Admin",
      permissions: "admin",
    },
  ]

  // Firebase hooks
  const [signInWithGoogle, googleUser, googleLoading, googleError] = useSignInWithGoogle(auth)

  const [signInWithEmailAndPassword, emailUser, emailLoading, emailError] = useSignInWithEmailAndPassword(auth)

  const [createUserWithEmailAndPassword, signUpUser, signUpLoading, signUpError] = useCreateUserWithEmailAndPassword(auth)

  const [user] = useAuthState(auth)
  useEffect(() => {
      const userId = user?.uid
      if (userId) {
        router.push(`/auth/${userId}`)
      }
  }, [user])

  const handleClose = () => {
    setFormData({ email: "", password: "", confirmPassword: "" })
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target
    setFormData((prev) => ({ ...prev, [id]: value }))
  }

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault()

    if (dialogType === "signup" && formData.password !== formData.confirmPassword) {
      toast.error("Les mots de passe ne correspondent pas")
      return
    }

    try {
      if (dialogType === "login") {
        await signInWithEmailAndPassword(formData.email, formData.password)
        toast.success("Connexion réussie")
        router.push("/")
        handleClose()
      } else {
        await createUserWithEmailAndPassword(formData.email, formData.password)
        toast.success("Compte créé avec succès, passer a la verification du status")
        handleClose()
      }
    } catch (error) {
      if (error instanceof FirebaseError) {
        toast.error(getFirebaseErrorMessage(error.code))
      }
    }
  }

  const handleGoogleAuth = async () => {
    try {
      await signInWithGoogle()
      toast.success("Connexion avec Google réussie")
      handleClose()
    } catch (error) {
      if (error instanceof FirebaseError) {
        toast.error(getFirebaseErrorMessage(error.code))
      }
    }
  }

  const getFirebaseErrorMessage = (code: string) => {
    switch (code) {
      case "auth/invalid-email":
        return "Email invalide"
      case "auth/user-disabled":
        return "Compte désactivé"
      case "auth/user-not-found":
        return "Utilisateur non trouvé"
      case "auth/wrong-password":
        return "Mot de passe incorrect"
      case "auth/email-already-in-use":
        return "Cet email est déjà utilisé"
      case "auth/weak-password":
        return "Le mot de passe doit contenir au moins 6 caractères"
      case "auth/too-many-requests":
        return "Trop de tentatives. Veuillez réessayer plus tard"
      default:
        return "Une erreur est survenue"
    }
  }

  const isLoading = googleLoading || emailLoading || signUpLoading


  return (
    <div className="w-full max-w-md mx-auto my-auto bg-white rounded-lg border-2 border-gray-100 shadow-lg p-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold">{dialogType === "login" ? "Connexion" : "Créer un compte"}</h2>
      </div>

      <Tabs defaultValue="email" value={activeTab} onValueChange={setActiveTab} className="mt-4">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="email" className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-600">
            Email
          </TabsTrigger>
          <TabsTrigger value="google" className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-600">
            Google
          </TabsTrigger>
        </TabsList>

        <TabsContent value="email" className="space-y-4">
          <form onSubmit={handleEmailAuth} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="votre@email.com"
                value={formData.email}
                onChange={handleInputChange}
                required
                className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium">
                Mot de passe
              </Label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={handleInputChange}
                required
                minLength={6}
                className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            {dialogType === "signup" && (
              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-sm font-medium">
                  Confirmer le mot de passe
                </Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  required
                  minLength={6}
                  className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
            )}

            <Button
              className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2"
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : dialogType === "login" ? (
                "Se connecter"
              ) : (
                "S'inscrire"
              )}
            </Button>

            {dialogType === "login" && (
              <div className="text-center text-sm pt-2">
                <a href="#" className="text-blue-600 hover:underline">
                  Mot de passe oublié?
                </a>
              </div>
            )}
          </form>
        </TabsContent>

        <TabsContent value="google" className="space-y-4 pt-4">
          <Button
            variant="outline"
            className="w-full border-2 border-gray-200 hover:bg-blue-50 hover:border-blue-200 flex items-center justify-center py-6"
            onClick={handleGoogleAuth}
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader2 className="h-5 w-5 animate-spin mr-2" />
            ) : (
              <svg
                className="mr-2 h-5 w-5 text-blue-600"
                aria-hidden="true"
                focusable="false"
                data-prefix="fab"
                data-icon="google"
                role="img"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 488 512"
              >
                <path
                  fill="currentColor"
                  d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"
                />
              </svg>
            )}
            <span className="text-gray-700 font-medium">
              {dialogType === "login" ? "Se connecter avec Google" : "S'inscrire avec Google"}
            </span>
          </Button>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-white px-2 text-gray-500">ou</span>
            </div>
          </div>

          <Button
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2"
            onClick={() => setActiveTab("email")}
          >
            Continuer avec Email
          </Button>
        </TabsContent>
      </Tabs>

      <div className="mt-6 text-center text-sm text-gray-500">
        {dialogType === "login" ? (
          <>
            <Link href="/" className="text-blue-600 hover:underline mb-8">Retour a la page d'accueil</Link>
            <p>
              Vous n'avez pas de compte?{" "}
              <button
                className="text-blue-600 hover:underline font-medium"
                onClick={() => useAuthStore.setState({ dialogType: "signup" })}
              >
                Créer un compte
              </button>
            </p>
          </>
        ) : (
          <>
            <Link href="/" className="text-blue-600 hover:underline mb-8">Retour a la page d'accueil</Link>
            <p>
            Vous avez déjà un compte?{" "}
              <button
                className="text-blue-600 hover:underline font-medium"
                onClick={() => useAuthStore.setState({ dialogType: "login" })}
              >
                Se connecter
              </button>
            </p>        
          </>
        )}
      </div>
    </div>
  )
}
