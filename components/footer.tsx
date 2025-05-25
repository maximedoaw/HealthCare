import Link from "next/link"
import { Heart } from "lucide-react"

export function Footer() {
  return (
    <footer className="w-full border-t py-6">
      <div className="container px-4 md:px-6">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <Heart className="h-6 w-6 text-blue-600" />
              <span className="text-xl font-bold text-blue-600">
                health<span className="text-blue-800">Care</span>
              </span>
            </Link>
            <p className="text-sm text-gray-500">
              Simplifiez la gestion des dossiers médicaux de vos patients avec notre solution complète.
            </p>
          </div>
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Produit</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="#" className="text-gray-500 hover:text-blue-600">
                  Fonctionnalités
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-500 hover:text-blue-600">
                  Tarifs
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-500 hover:text-blue-600">
                  Témoignages
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-500 hover:text-blue-600">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Ressources</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="#" className="text-gray-500 hover:text-blue-600">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-500 hover:text-blue-600">
                  Documentation
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-500 hover:text-blue-600">
                  Guides
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-500 hover:text-blue-600">
                  Support
                </Link>
              </li>
            </ul>
          </div>
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Entreprise</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="#" className="text-gray-500 hover:text-blue-600">
                  À propos
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-500 hover:text-blue-600">
                  Carrières
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-500 hover:text-blue-600">
                  Confidentialité
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-500 hover:text-blue-600">
                  Conditions d'utilisation
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t pt-6">
          <p className="text-center text-sm text-gray-500">
            &copy; {new Date().getFullYear()} healthCare. Tous droits réservés.
          </p>
        </div>
      </div>
    </footer>
  )
}
