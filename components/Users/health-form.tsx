"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { type PatientHealthForm } from "@/types"
import { Activity, Heart, Thermometer, Droplets } from 'lucide-react'
import { PhysicalActivityLevel, SmokingStatus } from "@/types/medical"

interface HealthFormProps {
  healthData?: PatientHealthForm
  onSave: (data: PatientHealthForm) => void
  canEdit: boolean
}

export function HealthForm({ healthData, onSave, canEdit }: HealthFormProps) {
  const [formData, setFormData] = useState<PatientHealthForm>(
    healthData || {
      weightKg: 0,
      bloodPressureSystolic: 0,
      bloodPressureDiastolic: 0,
      heightCm: 0,
      heartRateBpm: 0,
      respiratoryRate: 0,
      temperatureCelsius: 0,
      bloodOxygenSaturation: 0,
      bloodSugarMgDl: 0,
      cholesterolTotalMgDl: 0,
      allergies: [],
      currentMedications: [],
      medicalConditions: [],
      smokingStatus: SmokingStatus.NEVER,
      alcoholConsumptionPerWeek: 0,
      physicalActivityLevel: PhysicalActivityLevel.LOW,
    }
  )

  const [isEditing, setIsEditing] = useState(false)

  const handleSave = () => {
    onSave(formData)
    setIsEditing(false)
  }

  const getBMI = () => {
    if (formData.heightCm && formData.weightKg) {
      const heightM = formData.heightCm / 100
      return (formData.weightKg / (heightM * heightM)).toFixed(1)
    }
    return "N/A"
  }

  const getBMICategory = (bmi: string) => {
    const bmiValue = parseFloat(bmi)
    if (bmiValue < 18.5) return { text: "Insuffisance pondérale", color: "bg-blue-100 text-blue-800" }
    if (bmiValue < 25) return { text: "Poids normal", color: "bg-green-100 text-green-800" }
    if (bmiValue < 30) return { text: "Surpoids", color: "bg-yellow-100 text-yellow-800" }
    return { text: "Obésité", color: "bg-red-100 text-red-800" }
  }

  const getBloodPressureCategory = () => {
    const systolic = formData.bloodPressureSystolic
    const diastolic = formData.bloodPressureDiastolic
    
    if (systolic < 120 && diastolic < 80) return { text: "Normale", color: "bg-green-100 text-green-800" }
    if (systolic < 130 && diastolic < 80) return { text: "Élevée", color: "bg-yellow-100 text-yellow-800" }
    if (systolic < 140 || diastolic < 90) return { text: "Hypertension stade 1", color: "bg-orange-100 text-orange-800" }
    return { text: "Hypertension stade 2", color: "bg-red-100 text-red-800" }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <Activity className="h-5 w-5" />
            <span>Données de Santé</span>
          </CardTitle>
          {canEdit && (
            <Button
              variant={isEditing ? "default" : "outline"}
              onClick={() => (isEditing ? handleSave() : setIsEditing(true))}
            >
              {isEditing ? "Sauvegarder" : "Modifier"}
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Mesures vitales */}
        <div>
          <h3 className="text-lg font-semibold mb-4 flex items-center space-x-2">
            <Heart className="h-5 w-5" />
            <span>Signes Vitaux</span>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="weight">Poids (kg)</Label>
              <Input
                id="weight"
                type="number"
                value={formData.weightKg || ""}
                onChange={(e) => setFormData({ ...formData, weightKg: parseFloat(e.target.value) || 0 })}
                disabled={!isEditing}
              />
            </div>
            <div>
              <Label htmlFor="height">Taille (cm)</Label>
              <Input
                id="height"
                type="number"
                value={formData.heightCm || ""}
                onChange={(e) => setFormData({ ...formData, heightCm: parseFloat(e.target.value) || 0 })}
                disabled={!isEditing}
              />
            </div>
            <div>
              <Label htmlFor="systolic">Tension systolique</Label>
              <Input
                id="systolic"
                type="number"
                value={formData.bloodPressureSystolic || ""}
                onChange={(e) => setFormData({ ...formData, bloodPressureSystolic: parseFloat(e.target.value) || 0 })}
                disabled={!isEditing}
              />
            </div>
            <div>
              <Label htmlFor="diastolic">Tension diastolique</Label>
              <Input
                id="diastolic"
                type="number"
                value={formData.bloodPressureDiastolic || ""}
                onChange={(e) => setFormData({ ...formData, bloodPressureDiastolic: parseFloat(e.target.value) || 0 })}
                disabled={!isEditing}
              />
            </div>
            <div>
              <Label htmlFor="heartRate">Fréquence cardiaque</Label>
              <Input
                id="heartRate"
                type="number"
                value={formData.heartRateBpm || ""}
                onChange={(e) => setFormData({ ...formData, heartRateBpm: parseFloat(e.target.value) || 0 })}
                disabled={!isEditing}
              />
            </div>
            <div>
              <Label htmlFor="temperature">Température (°C)</Label>
              <Input
                id="temperature"
                type="number"
                step="0.1"
                value={formData.temperatureCelsius || ""}
                onChange={(e) => setFormData({ ...formData, temperatureCelsius: parseFloat(e.target.value) || 0 })}
                disabled={!isEditing}
              />
            </div>
            <div>
              <Label htmlFor="oxygen">Saturation O2 (%)</Label>
              <Input
                id="oxygen"
                type="number"
                value={formData.bloodOxygenSaturation || ""}
                onChange={(e) => setFormData({ ...formData, bloodOxygenSaturation: parseFloat(e.target.value) || 0 })}
                disabled={!isEditing}
              />
            </div>
            <div>
              <Label htmlFor="respiratory">Fréquence respiratoire</Label>
              <Input
                id="respiratory"
                type="number"
                value={formData.respiratoryRate || ""}
                onChange={(e) => setFormData({ ...formData, respiratoryRate: parseFloat(e.target.value) || 0 })}
                disabled={!isEditing}
              />
            </div>
          </div>
        </div>

        {/* Indicateurs calculés */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Indicateurs</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 border rounded-lg">
              <div className="flex items-center justify-between">
                <span className="font-medium">IMC</span>
                <span className="text-2xl font-bold">{getBMI()}</span>
              </div>
              {getBMI() !== "N/A" && (
                <Badge className={getBMICategory(getBMI()).color} variant="secondary">
                  {getBMICategory(getBMI()).text}
                </Badge>
              )}
            </div>
            <div className="p-4 border rounded-lg">
              <div className="flex items-center justify-between">
                <span className="font-medium">Tension artérielle</span>
                <span className="text-lg font-bold">
                  {formData.bloodPressureSystolic}/{formData.bloodPressureDiastolic}
                </span>
              </div>
              <Badge className={getBloodPressureCategory().color} variant="secondary">
                {getBloodPressureCategory().text}
              </Badge>
            </div>
          </div>
        </div>

        {/* Analyses biologiques */}
        <div>
          <h3 className="text-lg font-semibold mb-4 flex items-center space-x-2">
            <Droplets className="h-5 w-5" />
            <span>Analyses Biologiques</span>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="bloodSugar">Glycémie (mg/dL)</Label>
              <Input
                id="bloodSugar"
                type="number"
                value={formData.bloodSugarMgDl || ""}
                onChange={(e) => setFormData({ ...formData, bloodSugarMgDl: parseFloat(e.target.value) || 0 })}
                disabled={!isEditing}
              />
            </div>
            <div>
              <Label htmlFor="cholesterol">Cholestérol total (mg/dL)</Label>
              <Input
                id="cholesterol"
                type="number"
                value={formData.cholesterolTotalMgDl || ""}
                onChange={(e) => setFormData({ ...formData, cholesterolTotalMgDl: parseFloat(e.target.value) || 0 })}
                disabled={!isEditing}
              />
            </div>
          </div>
        </div>

        {/* Mode de vie */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Mode de Vie</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="smoking">Statut tabagique</Label>
              <Select
                value={formData.smokingStatus}
                onValueChange={(value) => setFormData({ ...formData, smokingStatus: value as SmokingStatus })}
                disabled={!isEditing}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(SmokingStatus).map((status) => (
                    <SelectItem key={status} value={status}>
                      {status}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="alcohol">Consommation d'alcool (verres/semaine)</Label>
              <Input
                id="alcohol"
                type="number"
                value={formData.alcoholConsumptionPerWeek || ""}
                onChange={(e) => setFormData({ ...formData, alcoholConsumptionPerWeek: parseFloat(e.target.value) || 0 })}
                disabled={!isEditing}
              />
            </div>
            <div>
              <Label htmlFor="activity">Niveau d'activité physique</Label>
              <Select
                value={formData.physicalActivityLevel}
                onValueChange={(value) => setFormData({ ...formData, physicalActivityLevel: value as PhysicalActivityLevel })}
                disabled={!isEditing}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(PhysicalActivityLevel).map((level) => (
                    <SelectItem key={level} value={level}>
                      {level}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {isEditing && (
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setIsEditing(false)}>
              Annuler
            </Button>
            <Button onClick={handleSave}>Sauvegarder</Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
