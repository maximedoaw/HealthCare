
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { X } from "lucide-react"
import { useForm } from "react-hook-form"
import toast from "react-hot-toast"
import { usePatientModalStore } from "@/store/usePatientModal"
import { useState } from "react"
import { PatientHealthForm } from "@/types"
import { PhysicalActivityLevel, SmokingStatus } from "@/types/medical"




export const PatientModal = () => {
  const { isOpen, onClose } = usePatientModalStore()
  const { register, handleSubmit, control, reset } = useForm<PatientHealthForm>()
  const [currentTab, setCurrentTab] = useState('vitals')

  const onSubmit = (data: PatientHealthForm) => {
    console.log(data)
    toast.success('Paramètres de santé enregistrés avec succès')
    onClose()
  }

  const onDelete = () => {
    toast.error('Paramètres de santé supprimés')
    reset()
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="flex flex-row items-center justify-between px-6 pt-6 pb-4 border-b sticky top-0 bg-background z-10">
          <DialogTitle className="text-2xl">Paramètres de santé du patient</DialogTitle>
          <DialogClose asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <X className="h-4 w-4" />
              <span className="sr-only">Fermer</span>
            </Button>
          </DialogClose>
        </DialogHeader>

        <Tabs value={currentTab} onValueChange={setCurrentTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="vitals">Signes vitaux</TabsTrigger>
            <TabsTrigger value="lifestyle">Mode de vie</TabsTrigger>
            <TabsTrigger value="medical">Antécédents</TabsTrigger>
          </TabsList>

          <form onSubmit={handleSubmit(onSubmit)} className="mt-6">
            <TabsContent value="vitals">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="weight">Poids (kg)</Label>
                      <Input id="weight" type="number" {...register("weightKg")} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="height">Taille (cm)</Label>
                      <Input id="height" type="number" {...register("heightCm")} />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="systolic">Pression artérielle (systolique)</Label>
                      <Input id="systolic" type="number" {...register("bloodPressureSystolic")} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="diastolic">Pression artérielle (diastolique)</Label>
                      <Input id="diastolic" type="number" {...register("bloodPressureDiastolic")} />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="heartRate">Fréquence cardiaque (bpm)</Label>
                      <Input id="heartRate" type="number" {...register("heartRateBpm")} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="respiratoryRate">Fréquence respiratoire</Label>
                      <Input id="respiratoryRate" type="number" {...register("respiratoryRate")} />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="temperature">Température (°C)</Label>
                      <Input id="temperature" type="number" step="0.1" {...register("temperatureCelsius")} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="oxygen">Saturation O2 (%)</Label>
                      <Input id="oxygen" type="number" {...register("bloodOxygenSaturation")} />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="bloodSugar">Glycémie (mg/dL)</Label>
                      <Input id="bloodSugar" type="number" {...register("bloodSugarMgDl")} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cholesterol">Cholestérol total (mg/dL)</Label>
                      <Input id="cholesterol" type="number" {...register("cholesterolTotalMgDl")} />
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="lifestyle">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Statut tabagique</Label>
                    <Select {...register("smokingStatus")}>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value={SmokingStatus.NEVER}>Jamais fumé</SelectItem>
                        <SelectItem value={SmokingStatus.FORMER}>Ancien fumeur</SelectItem>
                        <SelectItem value={SmokingStatus.CURRENT}>Fumeur actuel</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="alcohol">Consommation d'alcool (verres/semaine)</Label>
                    <Input id="alcohol" type="number" {...register("alcoholConsumptionPerWeek")} />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Niveau d'activité physique</Label>
                    <Select {...register("physicalActivityLevel")}>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value={PhysicalActivityLevel.LOW}>Faible</SelectItem>
                        <SelectItem value={PhysicalActivityLevel.MODERATE}>Modéré</SelectItem>
                        <SelectItem value={PhysicalActivityLevel.HIGH}>Élevé</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="medical">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="allergies">Allergies (séparées par des virgules)</Label>
                    <Input id="allergies" {...register("allergies")} />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="medications">Médicaments actuels (séparés par des virgules)</Label>
                    <Input id="medications" {...register("currentMedications")} />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="conditions">Problèmes médicaux (séparés par des virgules)</Label>
                    <Input id="conditions" {...register("medicalConditions")} />
                  </div>
                </div>
              </div>
            </TabsContent>

            <div className="flex justify-end gap-4 mt-8">
              <Button type="button" variant="outline" onClick={onClose}>
                Annuler
              </Button>
              <Button type="button" variant="destructive" onClick={onDelete}>
                Supprimer
              </Button>
              <Button type="submit">
                Enregistrer
              </Button>
            </div>
          </form>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}