"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { type MedicalRecord, MedicalPermissionLevel } from "@/types/medical"
import { Plus, FileText, Calendar, User, Edit, Trash2 } from "lucide-react"

interface MedicalRecordsProps {
  records: MedicalRecord[]
  patientId: string
  userPermission: MedicalPermissionLevel
  onAddRecord: (record: Omit<MedicalRecord, "id">) => void
  onUpdateRecord: (id: string, record: Partial<MedicalRecord>) => void
  onDeleteRecord: (id: string) => void
}

export function MedicalRecords({
  records,
  patientId,
  userPermission,
  onAddRecord,
  onUpdateRecord,
  onDeleteRecord,
}: MedicalRecordsProps) {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [editingRecord, setEditingRecord] = useState<MedicalRecord | null>(null)
  const [newRecord, setNewRecord] = useState({
    type: "",
    diagnosis: "",
    treatment: "",
    notes: "",
    doctorName: "",
  })

  const canWrite =
    userPermission === MedicalPermissionLevel.READ_WRITE ||
    userPermission === MedicalPermissionLevel.FULL_ACCESS ||
    userPermission === MedicalPermissionLevel.SURGICAL_ACCESS

  const canDelete = userPermission === MedicalPermissionLevel.FULL_ACCESS

  const handleAddRecord = () => {
    if (newRecord.type && newRecord.diagnosis) {
      onAddRecord({
        patientId,
        date: new Date().toISOString().split("T")[0],
        doctorId: "current-user-id", // À remplacer par l'ID de l'utilisateur connecté
        ...newRecord,
      })
      setNewRecord({
        type: "",
        diagnosis: "",
        treatment: "",
        notes: "",
        doctorName: "",
      })
      setIsAddDialogOpen(false)
    }
  }

  const handleUpdateRecord = () => {
    if (editingRecord) {
      onUpdateRecord(editingRecord.id, editingRecord)
      setEditingRecord(null)
    }
  }

  const getRecordTypeColor = (type: string) => {
    const colors: { [key: string]: string } = {
      Consultation: "bg-blue-100 text-blue-800",
      Urgence: "bg-red-100 text-red-800",
      Chirurgie: "bg-purple-100 text-purple-800",
      Radiologie: "bg-green-100 text-green-800",
      Laboratoire: "bg-yellow-100 text-yellow-800",
    }
    return colors[type] || "bg-gray-100 text-gray-800"
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <FileText className="h-5 w-5" />
            <span>Dossiers Médicaux</span>
          </CardTitle>
          {canWrite && (
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Nouveau dossier
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Ajouter un nouveau dossier médical</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="type">Type de consultation</Label>
                      <Select
                        value={newRecord.type}
                        onValueChange={(value) => setNewRecord({ ...newRecord, type: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner le type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Consultation">Consultation</SelectItem>
                          <SelectItem value="Urgence">Urgence</SelectItem>
                          <SelectItem value="Chirurgie">Chirurgie</SelectItem>
                          <SelectItem value="Radiologie">Radiologie</SelectItem>
                          <SelectItem value="Laboratoire">Laboratoire</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="doctorName">Médecin</Label>
                      <Input
                        id="doctorName"
                        value={newRecord.doctorName}
                        onChange={(e) => setNewRecord({ ...newRecord, doctorName: e.target.value })}
                        placeholder="Nom du médecin"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="diagnosis">Diagnostic</Label>
                    <Input
                      id="diagnosis"
                      value={newRecord.diagnosis}
                      onChange={(e) => setNewRecord({ ...newRecord, diagnosis: e.target.value })}
                      placeholder="Diagnostic principal"
                    />
                  </div>
                  <div>
                    <Label htmlFor="treatment">Traitement</Label>
                    <Input
                      id="treatment"
                      value={newRecord.treatment}
                      onChange={(e) => setNewRecord({ ...newRecord, treatment: e.target.value })}
                      placeholder="Traitement prescrit"
                    />
                  </div>
                  <div>
                    <Label htmlFor="notes">Notes</Label>
                    <Textarea
                      id="notes"
                      value={newRecord.notes}
                      onChange={(e) => setNewRecord({ ...newRecord, notes: e.target.value })}
                      placeholder="Notes additionnelles"
                      rows={3}
                    />
                  </div>
                </div>
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                    Annuler
                  </Button>
                  <Button onClick={handleAddRecord}>Ajouter</Button>
                </div>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {records.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">Aucun dossier médical disponible</p>
          ) : (
            records.map((record) => (
              <div key={record.id} className="border rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Badge className={getRecordTypeColor(record.type)}>{record.type}</Badge>
                    <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span>{new Date(record.date).toLocaleDateString("fr-FR")}</span>
                    </div>
                    <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                      <User className="h-4 w-4" />
                      <span>{record.doctorName}</span>
                    </div>
                  </div>
                  {canWrite && (
                    <div className="flex space-x-2">
                      <Button variant="ghost" size="sm" onClick={() => setEditingRecord(record)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      {canDelete && (
                        <Button variant="ghost" size="sm" onClick={() => onDeleteRecord(record.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  )}
                </div>
                <div>
                  <h4 className="font-medium">Diagnostic: {record.diagnosis}</h4>
                  {record.treatment && (
                    <p className="text-sm text-muted-foreground mt-1">Traitement: {record.treatment}</p>
                  )}
                  {record.notes && <p className="text-sm text-muted-foreground mt-1">Notes: {record.notes}</p>}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Dialog d'édition */}
        <Dialog open={!!editingRecord} onOpenChange={() => setEditingRecord(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Modifier le dossier médical</DialogTitle>
            </DialogHeader>
            {editingRecord && (
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="edit-type">Type de consultation</Label>
                    <Select
                      value={editingRecord.type}
                      onValueChange={(value) => setEditingRecord({ ...editingRecord, type: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Consultation">Consultation</SelectItem>
                        <SelectItem value="Urgence">Urgence</SelectItem>
                        <SelectItem value="Chirurgie">Chirurgie</SelectItem>
                        <SelectItem value="Radiologie">Radiologie</SelectItem>
                        <SelectItem value="Laboratoire">Laboratoire</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="edit-doctorName">Médecin</Label>
                    <Input
                      id="edit-doctorName"
                      value={editingRecord.doctorName}
                      onChange={(e) => setEditingRecord({ ...editingRecord, doctorName: e.target.value })}
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="edit-diagnosis">Diagnostic</Label>
                  <Input
                    id="edit-diagnosis"
                    value={editingRecord.diagnosis}
                    onChange={(e) => setEditingRecord({ ...editingRecord, diagnosis: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="edit-treatment">Traitement</Label>
                  <Input
                    id="edit-treatment"
                    value={editingRecord.treatment}
                    onChange={(e) => setEditingRecord({ ...editingRecord, treatment: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="edit-notes">Notes</Label>
                  <Textarea
                    id="edit-notes"
                    value={editingRecord.notes}
                    onChange={(e) => setEditingRecord({ ...editingRecord, notes: e.target.value })}
                    rows={3}
                  />
                </div>
              </div>
            )}
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setEditingRecord(null)}>
                Annuler
              </Button>
              <Button onClick={handleUpdateRecord}>Sauvegarder</Button>
            </div>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  )
}
