"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

// Types basés sur votre fichier de types
type StaffRole = "Doctor" | "Nurse" | "Surgeon" | "Anesthesiologist" | "Radiologist" | "Intern" | "Administrator"

interface StaffSelectionProps {
  onStaffSelect: (staff: StaffRole) => void
  onBack: () => void
  selectedStaff: StaffRole | null
}

export function StaffSelection({ onStaffSelect, onBack, selectedStaff }: StaffSelectionProps) {
  const [hoveredStaff, setHoveredStaff] = useState<StaffRole | null>(null)

  const staffTypes = [
    {
      id: "Doctor" as StaffRole,
      label: "Médecin",
      icon: "👨‍⚕️",
      color: "from-blue-400 to-blue-600",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200",
      textColor: "text-blue-700",
    },
    {
      id: "Nurse" as StaffRole,
      label: "Infirmier(ère)",
      icon: "👩‍⚕️",
      color: "from-pink-400 to-pink-600",
      bgColor: "bg-pink-50",
      borderColor: "border-pink-200",
      textColor: "text-pink-700",
    },
    {
      id: "Surgeon" as StaffRole,
      label: "Chirurgien(ne)",
      icon: "🏥",
      color: "from-red-400 to-red-600",
      bgColor: "bg-red-50",
      borderColor: "border-red-200",
      textColor: "text-red-700",
    },
    {
      id: "Anesthesiologist" as StaffRole,
      label: "Anesthésiste",
      icon: "💉",
      color: "from-indigo-400 to-indigo-600",
      bgColor: "bg-indigo-50",
      borderColor: "border-indigo-200",
      textColor: "text-indigo-700",
    },
    {
      id: "Radiologist" as StaffRole,
      label: "Radiologue",
      icon: "🔬",
      color: "from-green-400 to-green-600",
      bgColor: "bg-green-50",
      borderColor: "border-green-200",
      textColor: "text-green-700",
    },
    {
      id: "Intern" as StaffRole,
      label: "Interne",
      icon: "📋",
      color: "from-yellow-400 to-yellow-600",
      bgColor: "bg-yellow-50",
      borderColor: "border-yellow-200",
      textColor: "text-yellow-700",
    },
    {
      id: "Administrator" as StaffRole,
      label: "Administrateur médical",
      icon: "💼",
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
            onClick={onBack}
            className="absolute top-4 left-4 text-teal-600 hover:text-teal-700 hover:bg-teal-100"
          >
            <ChevronLeft className="h-5 w-5 mr-2" />
            Retour
          </Button>

          <div className="w-20 h-20 bg-gradient-to-br from-blue-400 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
            <span className="text-3xl">👥</span>
          </div>

          <h1 className="text-3xl font-bold text-gray-800 mb-2">Type de personnel médical</h1>
          <p className="text-gray-600 text-lg">Précisez votre spécialité</p>
        </div>

        {/* Staff Selection */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <RadioGroup
            onValueChange={(value) => onStaffSelect(value as StaffRole)}
            value={selectedStaff || ""}
            className="contents"
          >
            {staffTypes.map((staff) => {
              const isSelected = selectedStaff === staff.id
              const isHovered = hoveredStaff === staff.id

              return (
                <div
                  key={staff.id}
                  className={`relative transition-all duration-300 transform ${
                    isSelected || isHovered ? "scale-105" : "scale-100"
                  }`}
                  onMouseEnter={() => setHoveredStaff(staff.id)}
                  onMouseLeave={() => setHoveredStaff(null)}
                >
                  <div
                    className={`
                    relative p-4 rounded-2xl cursor-pointer transition-all duration-300
                    ${
                      isSelected
                        ? `${staff.bgColor} ${staff.borderColor} border-2 shadow-lg`
                        : "bg-white border border-gray-200 hover:shadow-md"
                    }
                  `}
                  >
                    <div className="flex flex-col items-center text-center space-y-3">
                      <RadioGroupItem value={staff.id} id={staff.id} className="sr-only" />

                      <div
                        className={`
                        w-16 h-16 rounded-xl flex items-center justify-center transition-all duration-300
                        ${isSelected ? `bg-gradient-to-br ${staff.color} shadow-lg` : "bg-gray-100"}
                      `}
                      >
                        <span className="text-2xl">{staff.icon}</span>
                      </div>

                      <Label
                        htmlFor={staff.id}
                        className={`text-lg font-semibold cursor-pointer ${
                          isSelected ? staff.textColor : "text-gray-800"
                        }`}
                      >
                        {staff.label}
                      </Label>

                      {isSelected && <ChevronRight className={`h-5 w-5 ${staff.textColor} animate-pulse`} />}
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
            <div className="w-3 h-3 bg-teal-500 rounded-full"></div>
            <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
          </div>
          <p className="text-sm text-gray-500">Étape 2 sur 3</p>
        </div>
      </div>
    </div>
  )
}
