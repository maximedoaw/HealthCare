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
import { Treatment } from "@/types"
import { Plus, FileText, Calendar, User, Edit, Trash2 } from "lucide-react"
import { MedicalOperationType, MedicalPermissionLevel } from "@/types/medical"

interface TreatmentsListProps {
  treatments: Treatment[]
  userPermission: MedicalPermissionLevel
  onAddTreatment: (treatment: Treatment) => void
  onUpdateTreatment: (index: number, treatment: Treatment) => void
  onDeleteTreatment: (index: number) => void
}

export function TreatmentsList({
  treatments,
  userPermission,
  onAddTreatment,
  onUpdateTreatment,
  onDeleteTreatment,
}: TreatmentsListProps) {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [editingIndex, setEditingIndex] = useState<number | null>(null)
  const [newTreatment, setNewTreatment] = useState<Treatment>({
    type: MedicalOperationType.CONSULTATION,
    date: new Date().toISOString().split("T")[0],
    performedBy: "",
    notes: "",
    outcome: "",
  })

  const canWrite =
    userPermission === MedicalPermissionLevel.READ_WRITE ||
    userPermission === MedicalPermissionLevel.FULL_ACCESS ||
    userPermission === MedicalPermissionLevel.SURGICAL_ACCESS

  const canDelete = userPermission === MedicalPermissionLevel.FULL_ACCESS

  const handleAddTreatment = () => {
    if (newTreatment.performedBy && newTreatment.notes) {
      onAddTreatment(newTreatment)
      setNewTreatment({
        type: MedicalOperationType.CONSULTATION,
        date: new Date().toISOString().split("T")[0],
        performedBy: "",
        notes: "",
        outcome: "",
      })
      setIsAddDialogOpen(false)
    }
  }

  const handleUpdateTreatment = () => {
    if (editingIndex !== null) {
      onUpdateTreatment(editingIndex, newTreatment)
      setEditingIndex(null)
      setNewTreatment({
        type: MedicalOperationType.CONSULTATION,
        date: new Date().toISOString().split("T")[0],
        performedBy: "",
        notes: "",
        outcome: "",
      })
    }
  }

  const startEdit = (index: number) => {
    setEditingIndex(index)
    setNewTreatment(treatments[index])
  }

  const getOperationTypeColor = (type: MedicalOperationType) => {
    const colors: { [key: string]: string } = {
      [MedicalOperationType.CONSULTATION]: "bg-blue-100 text-blue-800",
      [MedicalOperationType.EMERGENCY_CARE]: "bg-red-100 text-red-800",
      [MedicalOperationType.MAJOR_SURGERY]: "bg-purple-100 text-purple-800",
      [MedicalOperationType.MINOR_SURGERY]: "bg-orange-100 text-orange-800",
      [MedicalOperationType.DIAGNOSTIC_IMAGING]: "bg-green-100 text-green-800",
      [MedicalOperationType.LAB_TEST]: "bg-yellow-100 text-yellow-800",
      [MedicalOperationType.PRESCRIPTION]: "bg-cyan-100 text-cyan-800",
      [MedicalOperationType.ANESTHESIA]: "bg-pink-100 text-pink-800",
    }
    return colors[type] || "bg-gray-100 text-gray-800"
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <FileText className="h-5 w-5" />
            <span>Traitements et Interventions</span>
          </CardTitle>
          {canWrite && (
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Nouveau traitement
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Ajouter un nouveau traitement</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="type">Type d'opération</Label>
                      <Select
                        value={newTreatment.type}
                        onValueChange={(value) =>
                          setNewTreatment({ ...newTreatment, type: value as MedicalOperationType })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.values(MedicalOperationType).map((type) => (
                            <SelectItem key={type} value={type}>
                              {type}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="date">Date</Label>
                      <Input
                        id="date"
                        type="date"
                        value={newTreatment.date}
                        onChange={(e) => setNewTreatment({ ...newTreatment, date: e.target.value })}
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="performedBy">Effectué par</Label>
                    <Input
                      id="performedBy"
                      value={newTreatment.performedBy}
                      onChange={(e) => setNewTreatment({ ...newTreatment, performedBy: e.target.value })}
                      placeholder="Nom du médecin/personnel"
                    />
                  </div>
                  <div>
                    <Label htmlFor="notes">Notes</Label>
                    <Textarea
                      id="notes"
                      value={newTreatment.notes}
                      onChange={(e) => setNewTreatment({ ...newTreatment, notes: e.target.value })}
                      placeholder="Description du traitement"
                      rows={3}
                    />
                  </div>
                  <div>
                    <Label htmlFor="outcome">Résultat</Label>
                    <Textarea
                      id="outcome"
                      value={newTreatment.outcome}
                      onChange={(e) => setNewTreatment({ ...newTreatment, outcome: e.target.value })}
                      placeholder="Résultat du traitement"
                      rows={2}
                    />
                  </div>
                </div>
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                    Annuler
                  </Button>
                  <Button onClick={handleAddTreatment}>Ajouter</Button>
                </div>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {treatments.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">Aucun traitement enregistré</p>
          ) : (
            treatments.map((treatment, index) => (
              <div key={index} className="border rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Badge className={getOperationTypeColor(treatment.type)}>{treatment.type}</Badge>
                    <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span>{new Date(treatment.date).toLocaleDateString("fr-FR")}</span>
                    </div>
                    <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                      <User className="h-4 w-4" />
                      <span>{treatment.performedBy}</span>
                    </div>
                  </div>
                  {canWrite && (
                    <div className="flex space-x-2">
                      <Button variant="ghost" size="sm" onClick={() => startEdit(index)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      {canDelete && (
                        <Button variant="ghost" size="sm" onClick={() => onDeleteTreatment(index)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  )}
                </div>
                <div>
                  <h4 className="font-medium">Notes: {treatment.notes}</h4>
                  {treatment.outcome && (
                    <p className="text-sm text-muted-foreground mt-1">Résultat: {treatment.outcome}</p>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Dialog d'édition */}
        <Dialog open={editingIndex !== null} onOpenChange={() => setEditingIndex(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Modifier le traitement</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-type">Type d'opération</Label>
                  <Select
                    value={newTreatment.type}
                    onValueChange={(value) => setNewTreatment({ ...newTreatment, type: value as MedicalOperationType })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.values(MedicalOperationType).map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="edit-date">Date</Label>
                  <Input
                    id="edit-date"
                    type="date"
                    value={newTreatment.date}
                    onChange={(e) => setNewTreatment({ ...newTreatment, date: e.target.value })}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="edit-performedBy">Effectué par</Label>
                <Input
                  id="edit-performedBy"
                  value={newTreatment.performedBy}
                  onChange={(e) => setNewTreatment({ ...newTreatment, performedBy: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="edit-notes">Notes</Label>
                <Textarea
                  id="edit-notes"
                  value={newTreatment.notes}
                  onChange={(e) => setNewTreatment({ ...newTreatment, notes: e.target.value })}
                  rows={3}
                />
              </div>
              <div>
                <Label htmlFor="edit-outcome">Résultat</Label>
                <Textarea
                  id="edit-outcome"
                  value={newTreatment.outcome}
                  onChange={(e) => setNewTreatment({ ...newTreatment, outcome: e.target.value })}
                  rows={2}
                />
              </div>
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setEditingIndex(null)}>
                Annuler
              </Button>
              <Button onClick={handleUpdateTreatment}>Sauvegarder</Button>
            </div>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  )
}
