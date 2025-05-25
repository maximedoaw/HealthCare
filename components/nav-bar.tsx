"use client"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Heart, Menu, X } from "lucide-react"
import { AuthForm } from "./home/auth-screen/auth-form"
import { useAuthStore } from "@/store/auth-store"
import { useState } from "react"
import { useRouter } from "next/navigation"

export function NavBar() {
  const { setDialogType, setIsOpen } = useAuthStore()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const router = useRouter()

  const handleOpenLogin = () => {
    setDialogType("login")
    router.push("/auth")
  }

  const handleOpenSignup = () => {
    setDialogType("signup")
    router.push("/auth")

  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white dark:bg-gray-950">
      <div className="container flex h-16 items-center justify-between px-4 sm:px-6">
        <div className="flex items-center">
          <Link href="/" className="flex items-center gap-2">
            <Heart className="h-6 w-6 text-blue-600" />
            <span className="text-xl font-bold text-blue-600">
              health<span className="text-blue-800">Care</span>
            </span>
          </Link>
        </div>

        {/* Mobile menu button */}
        <div className="flex lg:hidden">
          <button
            type="button"
            className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-blue-600 focus:outline-none"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <span className="sr-only">{mobileMenuOpen ? "Fermer le menu" : "Ouvrir le menu"}</span>
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Desktop navigation */}
        <nav className="hidden lg:flex items-center space-x-8">
          <Link href="#features" className="text-sm font-medium hover:underline underline-offset-4">
            Fonctionnalités
          </Link>
          <Link href="#pricing" className="text-sm font-medium hover:underline underline-offset-4">
            Tarifs
          </Link>
          <Link href="#about" className="text-sm font-medium hover:underline underline-offset-4">
            À propos
          </Link>
          <Link href="#contact" className="text-sm font-medium hover:underline underline-offset-4">
            Contact
          </Link>
        </nav>

        {/* Desktop auth buttons */}
        <div className="hidden lg:flex items-center gap-4 ml-8">
          <Button variant="ghost" onClick={handleOpenLogin} className="hover:bg-blue-50">
            Connexion
          </Button>
          <Button onClick={handleOpenSignup} className="bg-blue-600 hover:bg-blue-700 text-white">
            Créer un compte
          </Button>
        </div>

        {/* Mobile menu (shown when mobileMenuOpen is true) */}
        {mobileMenuOpen && (
          <div className="absolute inset-x-0 top-16 bg-white shadow-lg lg:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <Link
                href="#features"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50"
                onClick={() => setMobileMenuOpen(false)}
              >
                Fonctionnalités
              </Link>
              <Link
                href="#pricing"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50"
                onClick={() => setMobileMenuOpen(false)}
              >
                Tarifs
              </Link>
              <Link
                href="#about"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50"
                onClick={() => setMobileMenuOpen(false)}
              >
                À propos
              </Link>
              <Link
                href="#contact"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50"
                onClick={() => setMobileMenuOpen(false)}
              >
                Contact
              </Link>
              <div className="pt-4 pb-2 border-t border-gray-200">
                <div className="flex flex-col space-y-3 px-2">
                  <Button
                    variant="ghost"
                    onClick={() => {
                      handleOpenLogin()
                      setMobileMenuOpen(false)
                    }}
                    className="w-full justify-start hover:bg-blue-50"
                  >
                    Connexion
                  </Button>
                  <Button
                    onClick={() => {
                      handleOpenSignup()
                      setMobileMenuOpen(false)
                    }}
                    className="w-full bg-blue-600 hover:bg-blue-700"
                  >
                    Créer un compte
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}