import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { MedicalRecord } from "@/types"
import { Calendar, User } from "lucide-react"

interface PatientHeaderProps {
  record: MedicalRecord
}

export function PatientHeader({ record }: PatientHeaderProps) {
  const getInitials = (name: string) => {
    const names = name.split(" ")
    return names.length >= 2
      ? `${names[0].charAt(0)}${names[names.length - 1].charAt(0)}`.toUpperCase()
      : name.substring(0, 2).toUpperCase()
  }

  const calculateAge = (birthDate: string) => {
    const today = new Date()
    const birth = new Date(birthDate)
    let age = today.getFullYear() - birth.getFullYear()
    const monthDiff = today.getMonth() - birth.getMonth()
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--
    }
    return age
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center space-x-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src="/placeholder.svg?height=64&width=64" />
            <AvatarFallback className="text-lg">{getInitials(record.patientName)}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <CardTitle className="text-2xl">{record.patientName}</CardTitle>
            <div className="flex items-center space-x-4 mt-2 text-sm text-muted-foreground">
              <div className="flex items-center space-x-1">
                <Calendar className="h-4 w-4" />
                <span>{calculateAge(record.birthDate)} ans</span>
              </div>
              <div className="flex items-center space-x-1">
                <User className="h-4 w-4" />
                <span>ID: {record.patientId}</span>
              </div>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h4 className="font-medium text-sm text-muted-foreground">Date de naissance</h4>
            <p className="text-sm">{new Date(record.birthDate).toLocaleDateString("fr-FR")}</p>
          </div>
          <div>
            <h4 className="font-medium text-sm text-muted-foreground">Dernière mise à jour</h4>
            <p className="text-sm">
              {new Date(record.lastUpdated).toLocaleDateString("fr-FR")} par {record.lastUpdatedBy}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
