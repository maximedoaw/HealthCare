"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Users, Edit, Trash2, Shield } from "lucide-react"
import { MedicalStaff } from "@/types"

interface StaffPermissionsProps {
  staff: MedicalStaff[]
  currentUserRole: MedicalStaffRole
  onAddStaff: (staff: Omit<MedicalStaff, "id">) => void
  onUpdateStaff: (id: string, staff: Partial<MedicalStaff>) => void
  onDeleteStaff: (id: string) => void
}
enum MedicalStaffRole {
  DOCTOR = "Médecin",
  NURSE = "Infirmier/Infirmière",
  SURGEON = "Chirurgien",
  ANESTHESIOLOGIST = "Anesthésiste",
  RADIOLOGIST = "Radiologue",
  INTERN = "Interne",
  ADMINISTRATOR = "Administrateur"
}

enum MedicalPermissionLevel {
  NONE = "Aucun accès",
  READ_ONLY = "Lecture seule",
  READ_WRITE = "Lecture et écriture",
  FULL_ACCESS = "Accès complet",
  SURGICAL_ACCESS = "Accès chirurgical"
}


export function StaffPermissions({
  staff,
  currentUserRole,
  onAddStaff,
  onUpdateStaff,
  onDeleteStaff,
}: StaffPermissionsProps) {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [editingStaff, setEditingStaff] = useState<MedicalStaff | null>(null)
  const [newStaff, setNewStaff] = useState<Omit<MedicalStaff, "id">>({
    firstName: "",
    lastName: "",
    email: "",
    role: MedicalStaffRole.NURSE,
    department: "",
    permissions: MedicalPermissionLevel.READ_ONLY,
    allowedOperations: [],
    specialization: "",
  })

  const canManageStaff =
    currentUserRole === MedicalStaffRole.ADMINISTRATOR || currentUserRole === MedicalStaffRole.DOCTOR

  const handleAddStaff = () => {
    if (newStaff.firstName && newStaff.lastName && newStaff.email) {
      onAddStaff(newStaff)
      setNewStaff({
        firstName: "",
        lastName: "",
        role: MedicalStaffRole.NURSE,
        email: "",
        department: "",
        permissions: MedicalPermissionLevel.READ_ONLY,
        specialization: "",
        allowedOperations: [],
      })
      setIsAddDialogOpen(false)
    }
  }

  const handleUpdateStaff = () => {
    if (editingStaff) {
      onUpdateStaff(editingStaff.id, editingStaff)
      setEditingStaff(null)
    }
  }

  const getPermissionColor = (permission: MedicalPermissionLevel) => {
    const colors: { [key: string]: string } = {
      [MedicalPermissionLevel.NONE]: "bg-gray-100 text-gray-800",
      [MedicalPermissionLevel.READ_ONLY]: "bg-blue-100 text-blue-800",
      [MedicalPermissionLevel.READ_WRITE]: "bg-green-100 text-green-800",
      [MedicalPermissionLevel.FULL_ACCESS]: "bg-purple-100 text-purple-800",
      [MedicalPermissionLevel.SURGICAL_ACCESS]: "bg-red-100 text-red-800",
    }
    return colors[permission] || "bg-gray-100 text-gray-800"
  }

  const getRoleColor = (role: MedicalStaffRole) => {
    const colors: { [key: string]: string } = {
      [MedicalStaffRole.DOCTOR]: "bg-blue-100 text-blue-800",
      [MedicalStaffRole.SURGEON]: "bg-red-100 text-red-800",
      [MedicalStaffRole.NURSE]: "bg-green-100 text-green-800",
      [MedicalStaffRole.ADMINISTRATOR]: "bg-purple-100 text-purple-800",
    }
    return colors[role] || "bg-gray-100 text-gray-800"
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <Users className="h-5 w-5" />
            <span>Personnel et Permissions</span>
          </CardTitle>
          {canManageStaff && (
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Ajouter personnel
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Ajouter un membre du personnel</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName">Prénom</Label>
                      <Input
                        id="firstName"
                        value={newStaff.firstName}
                        onChange={(e) => setNewStaff({ ...newStaff, firstName: e.target.value })}
                        placeholder="Prénom"
                      />
                    </div>
                    <div>
                      <Label htmlFor="lastName">Nom</Label>
                      <Input
                        id="lastName"
                        value={newStaff.lastName}
                        onChange={(e) => setNewStaff({ ...newStaff, lastName: e.target.value })}
                        placeholder="Nom de famille"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={newStaff.email}
                        onChange={(e) => setNewStaff({ ...newStaff, email: e.target.value })}
                        placeholder="email@exemple.com"
                      />
                    </div>
                    <div>
                      <Label htmlFor="department">Département</Label>
                      <Input
                        id="department"
                        value={newStaff.department}
                        onChange={(e) => setNewStaff({ ...newStaff, department: e.target.value })}
                        placeholder="Cardiologie, Urgences..."
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="role">Rôle</Label>
                      <Select
                        value={newStaff.role}
                        onValueChange={(value) => setNewStaff({ ...newStaff, role: value as MedicalStaffRole })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.values(MedicalStaffRole).map((role ) => (
                            <SelectItem key={role} value={role}>
                              {role}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="permission">Niveau de permission</Label>
                      <Select
                        value={newStaff.permissions}
                        onValueChange={(value) =>
                          setNewStaff({ ...newStaff, permissions: value as MedicalPermissionLevel })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.values(MedicalPermissionLevel).map((permission : any) => (
                            <SelectItem key={permission} value={permission}>
                              {permission}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="specialization">Spécialisation (optionnel)</Label>
                    <Input
                      id="specialization"
                      value={newStaff.specialization}
                      onChange={(e) => setNewStaff({ ...newStaff, specialization: e.target.value })}
                      placeholder="Spécialisation médicale"
                    />
                  </div>
                </div>
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                    Annuler
                  </Button>
                  <Button onClick={handleAddStaff}>Ajouter</Button>
                </div>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nom</TableHead>
              <TableHead>Rôle</TableHead>
              <TableHead>Département</TableHead>
              <TableHead>Permission</TableHead>
              <TableHead>Email</TableHead>
              {canManageStaff && <TableHead>Actions</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {staff.map((member) => (
              <TableRow key={member.id}>
                <TableCell className="font-medium">
                  {member.firstName} {member.lastName}
                  {member.specialization && (
                    <div className="text-sm text-muted-foreground">{member.specialization}</div>
                  )}
                </TableCell>
                <TableCell>
                  <Badge className={getRoleColor(member.role)}>{member.role}</Badge>
                </TableCell>
                <TableCell>{member.department}</TableCell>
                <TableCell>
                  <Badge className={getPermissionColor(member.permissions)}>
                    <Shield className="h-3 w-3 mr-1" />
                    {member.permissions}
                  </Badge>
                </TableCell>
                <TableCell>{member.email}</TableCell>
                {canManageStaff && (
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button variant="ghost" size="sm" onClick={() => setEditingStaff(member)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => onDeleteStaff(member.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {/* Dialog d'édition */}
        <Dialog open={!!editingStaff} onOpenChange={() => setEditingStaff(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Modifier le membre du personnel</DialogTitle>
            </DialogHeader>
            {editingStaff && (
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="edit-firstName">Prénom</Label>
                    <Input
                      id="edit-firstName"
                      value={editingStaff.firstName}
                      onChange={(e) => setEditingStaff({ ...editingStaff, firstName: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="edit-lastName">Nom</Label>
                    <Input
                      id="edit-lastName"
                      value={editingStaff.lastName}
                      onChange={(e) => setEditingStaff({ ...editingStaff, lastName: e.target.value })}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="edit-role">Rôle</Label>
                    <Select
                      value={editingStaff.role}
                      onValueChange={(value) => setEditingStaff({ ...editingStaff, role: value as MedicalStaffRole })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.values(MedicalStaffRole).map((role) => (
                          <SelectItem key={role} value={role}>
                            {role}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="edit-permission">Niveau de permission</Label>
                    <Select
                      value={editingStaff.permissions}
                      onValueChange={(value) =>
                        setEditingStaff({ ...editingStaff, permissions: value as MedicalPermissionLevel })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.values(MedicalPermissionLevel).map((permission) => (
                          <SelectItem key={permission} value={permission}>
                            {permission}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <Label htmlFor="edit-department">Département</Label>
                  <Input
                    id="edit-department"
                    value={editingStaff.department}
                    onChange={(e) => setEditingStaff({ ...editingStaff, department: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="edit-specialization">Spécialisation</Label>
                  <Input
                    id="edit-specialization"
                    value={editingStaff.specialization || ""}
                    onChange={(e) => setEditingStaff({ ...editingStaff, specialization: e.target.value })}
                  />
                </div>
              </div>
            )}
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setEditingStaff(null)}>
                Annuler
              </Button>
              <Button onClick={handleUpdateStaff}>Sauvegarder</Button>
            </div>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  )
}
