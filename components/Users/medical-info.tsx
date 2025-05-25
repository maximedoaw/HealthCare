import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { MedicalRecord } from "@/types"
import { Heart, AlertTriangle, Pill } from "lucide-react"

interface MedicalInfoProps {
  record: MedicalRecord
}

export function MedicalInfo({ record }: MedicalInfoProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {/* Antécédents médicaux */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Heart className="h-5 w-5" />
            <span>Antécédents Médicaux</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-1">
            {record.medicalHistory.length > 0 ? (
              record.medicalHistory.map((history, index) => (
                <Badge key={index} variant="secondary" className="mr-1 mb-1">
                  {history}
                </Badge>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">Aucun antécédent connu</p>
            )}
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
            {record.allergies.length > 0 ? (
              record.allergies.map((allergy, index) => (
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
            {record.currentMedications.length > 0 ? (
              record.currentMedications.map((medication, index) => (
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
    </div>
  )
}
