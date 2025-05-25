import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Heart, AlertTriangle, Pill, Phone } from "lucide-react"
import { Patient } from "@/types"

interface PatientInfoProps {
  patient: Patient
}

export function PatientInfo({ patient }: PatientInfoProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {/* Informations médicales */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Heart className="h-5 w-5" />
            <span>Informations Médicales</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-medium text-sm text-muted-foreground">Groupe Sanguin</h4>
            <Badge variant="outline" className="mt-1">
              {patient.bloodType}
            </Badge>
          </div>
          <div>
            <h4 className="font-medium text-sm text-muted-foreground">Numéro d'assurance</h4>
            <p className="text-sm">{patient.insuranceNumber}</p>
          </div>
          <div>
            <h4 className="font-medium text-sm text-muted-foreground">Antécédents médicaux</h4>
            <div className="space-y-1 mt-1">
              {patient.medicalHistory.length > 0 ? (
                patient.medicalHistory.map((history, index) => (
                  <Badge key={index} variant="secondary" className="mr-1 mb-1">
                    {history}
                  </Badge>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">Aucun antécédent connu</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Allergies */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <AlertTriangle className="h-5 w-5 text-red-500" />
            <span>Allergies</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-1">
            {patient.allergies.length > 0 ? (
              patient.allergies.map((allergy, index) => (
                <Badge key={index} variant="destructive" className="mr-1 mb-1">
                  {allergy}
                </Badge>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">Aucune allergie connue</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Médicaments actuels */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Pill className="h-5 w-5" />
            <span>Médicaments Actuels</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-1">
            {patient.currentMedications.length > 0 ? (
              patient.currentMedications.map((medication, index) => (
                <Badge key={index} variant="outline" className="mr-1 mb-1">
                  {medication}
                </Badge>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">Aucun médicament en cours</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Contact d'urgence */}
      <Card className="md:col-span-2 lg:col-span-3">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Phone className="h-5 w-5" />
            <span>Contact d'Urgence</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <h4 className="font-medium text-sm text-muted-foreground">Nom</h4>
              <p className="text-sm">{patient.emergencyContact.name}</p>
            </div>
            <div>
              <h4 className="font-medium text-sm text-muted-foreground">Téléphone</h4>
              <p className="text-sm">{patient.emergencyContact.phone}</p>
            </div>
            <div>
              <h4 className="font-medium text-sm text-muted-foreground">Relation</h4>
              <p className="text-sm">{patient.emergencyContact.relationship}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
