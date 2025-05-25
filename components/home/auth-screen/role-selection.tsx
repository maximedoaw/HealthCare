"use client"

import { useState } from "react"
import { ChevronRight, Home, Users, UserCheck, Shield } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

interface RoleSelectionProps {
  onRoleSelect: (role: "patient" | "personalMedical" | "admin") => void
  onGoHome: () => void
  selectedRole: string | null
}

export function RoleSelection({ onRoleSelect, onGoHome, selectedRole }: RoleSelectionProps) {
  const [hoveredRole, setHoveredRole] = useState<string | null>(null)

  const roles = [
    {
      id: "patient",
      label: "Patient",
      description: "Accès aux services de santé",
      icon: UserCheck,
      color: "from-emerald-400 to-emerald-600",
      bgColor: "bg-emerald-50",
      borderColor: "border-emerald-200",
      textColor: "text-emerald-700",
    },
    {
      id: "personalMedical",
      label: "Personnel médical",
      description: "Professionnels de santé",
      icon: Users,
      color: "from-blue-400 to-blue-600",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200",
      textColor: "text-blue-700",
    },
    {
      id: "admin",
      label: "Administrateur",
      description: "Gestion du système",
      icon: Shield,
      color: "from-purple-400 to-purple-600",
      bgColor: "bg-purple-50",
      borderColor: "border-purple-200",
      textColor: "text-purple-700",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-blue-50 to-cyan-50 p-4">
      <div className="max-w-2xl mx-auto pt-8">
        {/* Header */}
        <div className="text-center mb-8">
          <Button
            variant="ghost"
            onClick={onGoHome}
            className="absolute top-4 left-4 text-teal-600 hover:text-teal-700 hover:bg-teal-100"
          >
            <Home className="h-5 w-5 mr-2" />
            Accueil
          </Button>

          <div className="w-20 h-20 bg-gradient-to-br from-teal-400 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
            <UserCheck className="h-10 w-10 text-white" />
          </div>

          <h1 className="text-3xl font-bold text-gray-800 mb-2">Vérification du compte</h1>
          <p className="text-gray-600 text-lg">Sélectionnez votre rôle pour commencer</p>
        </div>

        {/* Role Selection */}
        <div className="space-y-4">
          <RadioGroup
            onValueChange={(value) => onRoleSelect(value as "patient" | "personalMedical" | "admin")}
            value={selectedRole || ""}
            className="space-y-4"
          >
            {roles.map((role) => {
              const Icon = role.icon
              const isSelected = selectedRole === role.id
              const isHovered = hoveredRole === role.id

              return (
                <div
                  key={role.id}
                  className={`relative transition-all duration-300 transform ${
                    isSelected || isHovered ? "scale-105" : "scale-100"
                  }`}
                  onMouseEnter={() => setHoveredRole(role.id)}
                  onMouseLeave={() => setHoveredRole(null)}
                >
                  <div
                    className={`
                    relative p-6 rounded-2xl cursor-pointer transition-all duration-300
                    ${
                      isSelected
                        ? `${role.bgColor} ${role.borderColor} border-2 shadow-lg`
                        : "bg-white border border-gray-200 hover:shadow-md"
                    }
                  `}
                  >
                    <div className="flex items-center space-x-4">
                      <RadioGroupItem value={role.id} id={role.id} className="sr-only" />

                      <div
                        className={`
                        w-16 h-16 rounded-xl flex items-center justify-center transition-all duration-300
                        ${isSelected ? `bg-gradient-to-br ${role.color} shadow-lg` : "bg-gray-100"}
                      `}
                      >
                        <Icon className={`h-8 w-8 ${isSelected ? "text-white" : "text-gray-600"}`} />
                      </div>

                      <div className="flex-1">
                        <Label
                          htmlFor={role.id}
                          className={`text-xl font-semibold cursor-pointer block ${
                            isSelected ? role.textColor : "text-gray-800"
                          }`}
                        >
                          {role.label}
                        </Label>
                        <p className={`text-sm mt-1 ${isSelected ? role.textColor : "text-gray-500"}`}>
                          {role.description}
                        </p>
                      </div>

                      <ChevronRight
                        className={`h-6 w-6 transition-all duration-300 ${
                          isSelected ? role.textColor : "text-gray-400"
                        } ${isSelected || isHovered ? "translate-x-1" : ""}`}
                      />
                    </div>
                  </div>
                </div>
              )
            })}
          </RadioGroup>
        </div>

        {/* Progress indicator */}
        <div className="mt-8 text-center">
          <div className="flex justify-center space-x-2 mb-4">
            <div className="w-3 h-3 bg-teal-500 rounded-full"></div>
            <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
            <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
          </div>
          <p className="text-sm text-gray-500">Étape 1 sur 3</p>
        </div>
      </div>
    </div>
  )
}
