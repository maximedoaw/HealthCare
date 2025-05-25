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
import { Checkbox } from "@/components/ui/checkbox"
import {  HospitalStaff, MedicalStaff } from "@/types"
import { Plus, Users, Edit, Trash2, Shield } from "lucide-react"
import { MedicalOperationType, MedicalPermissionLevel, MedicalStaffRole } from "@/types/medical"

interface StaffManagementProps {
  staff: HospitalStaff[]
  currentUserRole: MedicalStaffRole
  onAddStaff: (staff: HospitalStaff) => void
  onUpdateStaff: (id: string, staff: Partial<HospitalStaff>) => void
  onDeleteStaff: (id: string) => void
}

export function StaffManagement({
  staff,
  currentUserRole,
  onAddStaff,
  onUpdateStaff,
  onDeleteStaff,
}: StaffManagementProps) {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [editingStaff, setEditingStaff] = useState<HospitalStaff | null>(null)
  const [selectedRole, setSelectedRole] = useState<MedicalStaffRole>(MedicalStaffRole.NURSE)
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    department: "",
    permissions: MedicalPermissionLevel.READ_ONLY,
    allowedOperations: [] as MedicalOperationType[],
    // Champs spécifiques selon le rôle
    specialty: "",
    isChief: false,
    shift: "Jour" as "Jour" | "Nuit" | "Mixte",
    canAdministerMedication: false,
    surgicalSpecialty: "",
    yearsOfExperience: 0,
    canPerformIntubation: false,
    managesPainClinic: false,
    canPerformCT: false,
    canPerformMRI: false,
    supervisorId: "",
    graduationYear: new Date().getFullYear(),
    accessToFinancialData: false,
    canManageStaff: false,
  })

  const canManageStaff = currentUserRole === MedicalStaffRole.ADMINISTRATOR

  const resetForm = () => {
    setFormData({
      firstName: "",
      lastName: "",
      department: "",
      permissions: MedicalPermissionLevel.READ_ONLY,
      allowedOperations: [],
      specialty: "",
      isChief: false,
      shift: "Jour",
      canAdministerMedication: false,
      surgicalSpecialty: "",
      yearsOfExperience: 0,
      canPerformIntubation: false,
      managesPainClinic: false,
      canPerformCT: false,
      canPerformMRI: false,
      supervisorId: "",
      graduationYear: new Date().getFullYear(),
      accessToFinancialData: false,
      canManageStaff: false,
    })
  }

  const handleAddStaff = () => {
    if (formData.firstName && formData.lastName && formData.department) {
      const baseStaff : MedicalStaff = {
        id: Date.now().toString(),
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.firstName.toLowerCase() + "." + formData.lastName.toLowerCase() + "@example.com",
        role: selectedRole,
        department: formData.department,
        permissions: formData.permissions,
        allowedOperations: formData.allowedOperations,
        specialization: "",
      }

      let newStaff: HospitalStaff

      switch (selectedRole) {
        case MedicalStaffRole.DOCTOR:
          newStaff = {
            ...baseStaff,
            specialty: formData.specialty,
            isChief: formData.isChief,
          }
          break
        case MedicalStaffRole.NURSE:
          newStaff = {
            ...baseStaff,
            shift: formData.shift,
            canAdministerMedication: formData.canAdministerMedication,
          }
          break
        case MedicalStaffRole.SURGEON:
          newStaff = {
            ...baseStaff,
            surgicalSpecialty: formData.surgicalSpecialty,
            yearsOfExperience: formData.yearsOfExperience,
          }
          break
        case MedicalStaffRole.ANESTHESIOLOGIST:
          newStaff = {
            ...baseStaff,
            canPerformIntubation: formData.canPerformIntubation,
            managesPainClinic: formData.managesPainClinic,
          }
          break
        case MedicalStaffRole.RADIOLOGIST:
          newStaff = {
            ...baseStaff,
            canPerformCT: formData.canPerformCT,
            canPerformMRI: formData.canPerformMRI,
          }
          break
        case MedicalStaffRole.INTERN:
          newStaff = {
            ...baseStaff,
            supervisorId: formData.supervisorId,
            graduationYear: formData.graduationYear,
          }
          break
        case MedicalStaffRole.ADMINISTRATOR:
          newStaff = {
            ...baseStaff,
            accessToFinancialData: formData.accessToFinancialData,
            canManageStaff: formData.canManageStaff,
          }
          break
        default:
          newStaff = baseStaff as HospitalStaff
      }

      onAddStaff(newStaff)
      resetForm()
      setIsAddDialogOpen(false)
    }
  }

  const handleOperationToggle = (operation: MedicalOperationType, checked: boolean) => {
    if (checked) {
      setFormData({
        ...formData,
        allowedOperations: [...formData.allowedOperations, operation],
      })
    } else {
      setFormData({
        ...formData,
        allowedOperations: formData.allowedOperations.filter((op) => op !== operation),
      })
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
      [MedicalStaffRole.ANESTHESIOLOGIST]: "bg-orange-100 text-orange-800",
      [MedicalStaffRole.RADIOLOGIST]: "bg-cyan-100 text-cyan-800",
      [MedicalStaffRole.INTERN]: "bg-yellow-100 text-yellow-800",
    }
    return colors[role] || "bg-gray-100 text-gray-800"
  }

  const renderRoleSpecificFields = () => {
    switch (selectedRole) {
      case MedicalStaffRole.DOCTOR:
        return (
          <>
            <div>
              <Label htmlFor="specialty">Spécialité</Label>
              <Input
                id="specialty"
                value={formData.specialty}
                onChange={(e) => setFormData({ ...formData, specialty: e.target.value })}
                placeholder="Cardiologie, Neurologie..."
              />
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="isChief"
                checked={formData.isChief}
                onCheckedChange={(checked : any) => setFormData({ ...formData, isChief: checked as boolean })}
              />
              <Label htmlFor="isChief">Chef de service</Label>
            </div>
          </>
        )
      case MedicalStaffRole.NURSE:
        return (
          <>
            <div>
              <Label htmlFor="shift">Équipe</Label>
              <Select
                value={formData.shift}
                onValueChange={(value) => setFormData({ ...formData, shift: value as "Jour" | "Nuit" | "Mixte" })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Jour">Jour</SelectItem>
                  <SelectItem value="Nuit">Nuit</SelectItem>
                  <SelectItem value="Mixte">Mixte</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="canAdministerMedication"
                checked={formData.canAdministerMedication}
                onCheckedChange={(checked : any) => setFormData({ ...formData, canAdministerMedication: checked as boolean })}
              />
              <Label htmlFor="canAdministerMedication">Peut administrer des médicaments</Label>
            </div>
          </>
        )
      case MedicalStaffRole.SURGEON:
        return (
          <>
            <div>
              <Label htmlFor="surgicalSpecialty">Spécialité chirurgicale</Label>
              <Input
                id="surgicalSpecialty"
                value={formData.surgicalSpecialty}
                onChange={(e) => setFormData({ ...formData, surgicalSpecialty: e.target.value })}
                placeholder="Chirurgie cardiaque, orthopédie..."
              />
            </div>
            <div>
              <Label htmlFor="yearsOfExperience">Années d'expérience</Label>
              <Input
                id="yearsOfExperience"
                type="number"
                value={formData.yearsOfExperience}
                onChange={(e) => setFormData({ ...formData, yearsOfExperience: Number.parseInt(e.target.value) || 0 })}
              />
            </div>
          </>
        )
      default:
        return null
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <Users className="h-5 w-5" />
            <span>Gestion du Personnel</span>
          </CardTitle>
          {canManageStaff && (
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Ajouter personnel
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Ajouter un membre du personnel</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName">Prénom</Label>
                      <Input
                        id="firstName"
                        value={formData.firstName}
                        onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                        placeholder="Prénom"
                      />
                    </div>
                    <div>
                      <Label htmlFor="lastName">Nom</Label>
                      <Input
                        id="lastName"
                        value={formData.lastName}
                        onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                        placeholder="Nom de famille"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="role">Rôle</Label>
                      <Select
                        value={selectedRole}
                        onValueChange={(value) => setSelectedRole(value as MedicalStaffRole)}
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
                      <Label htmlFor="department">Département</Label>
                      <Input
                        id="department"
                        value={formData.department}
                        onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                        placeholder="Cardiologie, Urgences..."
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="permissions">Niveau de permission</Label>
                    <Select
                      value={formData.permissions}
                      onValueChange={(value) =>
                        setFormData({ ...formData, permissions: value as MedicalPermissionLevel })
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

                  {renderRoleSpecificFields()}

                  <div>
                    <Label>Opérations autorisées</Label>
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      {Object.values(MedicalOperationType).map((operation) => (
                        <div key={operation} className="flex items-center space-x-2">
                          <Checkbox
                            id={operation}
                            checked={formData.allowedOperations.includes(operation)}
                            onCheckedChange={(checked : any) => handleOperationToggle(operation, checked as boolean)}
                          />
                          <Label htmlFor={operation} className="text-sm">
                            {operation}
                          </Label>
                        </div>
                      ))}
                    </div>
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
              <TableHead>Opérations</TableHead>
              {canManageStaff && <TableHead>Actions</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {staff.map((member) => (
              <TableRow key={member.id}>
                <TableCell className="font-medium">
                  {member.firstName} {member.lastName}
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
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {member.allowedOperations.slice(0, 2).map((op) => (
                      <Badge key={op} variant="outline" className="text-xs">
                        {op}
                      </Badge>
                    ))}
                    {member.allowedOperations.length > 2 && (
                      <Badge variant="outline" className="text-xs">
                        +{member.allowedOperations.length - 2}
                      </Badge>
                    )}
                  </div>
                </TableCell>
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
      </CardContent>
    </Card>
  )
}
