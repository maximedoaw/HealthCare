//Pagination
//Editer les rendez vous au lieu de tout annuler d'un coup
//fermeture du modal lorsqu'on a reerve un rendez vous

import * as React from "react"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useModalDoctorStore } from "@/store/doctor-modal-store"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { useState } from "react"
import { ptBR } from "date-fns/locale"
import { format } from "date-fns"
import toast from "react-hot-toast"
import Image from "next/image"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ChevronLeft, X } from "lucide-react"

interface Doctor {
  id: number
  name: string
  specialty: string
  hospital: string
  availability: 'disponible' | 'indisponible'
  image: string
}

const DoctorModal = () => {
  const doctors: Doctor[] = [
    {
      id: 1,
      name: "Dr. Jean Mbarga",
      specialty: "Cardiologie",
      hospital: "Hôpital Général de Yaoundé",
      availability: "disponible",
      image: "https://images.unsplash.com/photo-1550831107-1553da8c8464?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80"
    },
    {
      id: 2,
      name: "Dr. Amina Ngo",
      specialty: "Pédiatrie",
      hospital: "Hôpital Laquintinie de Douala",
      availability: "indisponible",
      image: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80"
    },
    {
      id: 3,
      name: "Dr. Samuel Fotso",
      specialty: "Neurologie",
      hospital: "Hôpital Central de Yaoundé",
      availability: "disponible",
      image: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80"
    },
    {
      id: 4,
      name: "Dr. Léa Djoumessi",
      specialty: "Gynécologie",
      hospital: "Clinique des spécialités de Douala",
      availability: "disponible",
      image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80"
    },
    {
      id: 5,
      name: "Dr. Paul Nkengfack",
      specialty: "Chirurgie générale",
      hospital: "Hôpital Protestant de Nkongsamba",
      availability: "indisponible",
      image: "https://images.unsplash.com/photo-1622902046580-2b47f47f5471?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80"
    },
    {
      id: 6,
      name: "Dr. Esther Ngo Nyobe",
      specialty: "Dermatologie",
      hospital: "Hôpital Régional de Bafoussam",
      availability: "disponible",
      image: "https://images.unsplash.com/photo-1527613426441-4da17471b66d?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80"
    },
    {
      id: 7,
      name: "Dr. Marc Tchouaga",
      specialty: "Ophtalmologie",
      hospital: "Hôpital Saint-Jean de Malien",
      availability: "disponible",
      image: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80"
    },
    {
      id: 8,
      name: "Dr. Françoise Mbango",
      specialty: "Radiologie",
      hospital: "Clinique Ngousso",
      availability: "disponible",
      image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80"
    }
  ]

  const { isOpen, setIsOpen } = useModalDoctorStore()
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null)
  const [selectedDates, setSelectedDates] = useState<Date[]>([])
  const [pendingRequests, setPendingRequests] = useState<number[]>([])
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid')

  const handleRequestConsultation = (doctor: Doctor, dates: Date[]) => {
    if (dates.length === 0) {
      toast.error("Veuillez sélectionner au moins une date")
      return
    }

    setPendingRequests([...pendingRequests, doctor.id])
    
    dates.forEach(date => {
      toast.success(`Demande envoyée à ${doctor.name} pour le ${format(date, 'PP', { locale: ptBR })}`)
    })

    setSelectedDoctor(null)
    setSelectedDates([])
  }

  const handleCancelRequest = (doctorId: number) => {
    setPendingRequests(pendingRequests.filter(id => id !== doctorId))
    toast.error('Demande annulée')
  }

  const handleBackToList = () => {
    setSelectedDoctor(null)
    setSelectedDates([])
  }

  return (
    <Dialog open={isOpen} onOpenChange={() => {
      setIsOpen(false)
      handleBackToList()
    }}>
      <DialogContent className="max-w-[95vw] lg:max-w-4xl xl:max-w-6xl h-[90vh] max-h-[800px] overflow-hidden p-0 flex flex-col">
        <DialogHeader className="flex flex-row items-center justify-between px-6 pt-6 pb-4 border-b sticky top-0 bg-background z-10">
          <DialogTitle className="text-2xl">Prendre rendez-vous avec un médecin</DialogTitle>
          <DialogClose>
            <X className="cursor-pointer hover:brightness-95 hover:text-gray-300 transition-colors duration-150"/>
          </DialogClose>
        </DialogHeader>

        <div className="overflow-y-auto flex-1 custom-scrollbar p-6">
          {!selectedDoctor ? (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h3 className="text-lg font-medium">Liste des médecins</h3>
                <Tabs defaultValue="grid" onValueChange={(value) => setViewMode(value as 'grid' | 'table')}>
                  <TabsList className="grid w-full grid-cols-2 sm:w-auto">
                    <TabsTrigger value="grid">Grille</TabsTrigger>
                    <TabsTrigger value="table">Tableau</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>

              {viewMode === 'grid' ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {doctors.map((doctor) => (
                    <Card 
                      key={doctor.id} 
                      className={`flex flex-col h-full ${doctor.availability === 'indisponible' ? 'opacity-80' : 'hover:shadow-md transition-shadow'}`}
                    >
                      <CardHeader className="flex-row items-center space-x-4 space-y-0 p-4">
                        <Image 
                          src={doctor.image} 
                          alt={doctor.name}
                          width={80}
                          height={80}
                          className="rounded-full w-16 h-16 object-cover"
                        />
                        <div>
                          <h4 className="font-semibold">{doctor.name}</h4>
                          <p className="text-sm text-muted-foreground">{doctor.specialty}</p>
                        </div>
                      </CardHeader>
                      <CardContent className="p-4 pt-0">
                        <p className="text-sm">{doctor.hospital}</p>
                        <Badge 
                          variant={doctor.availability === 'disponible' ? 'default' : 'destructive'} 
                          className="mt-2"
                        >
                          {doctor.availability === 'disponible' ? 'Disponible' : 'Indisponible'}
                        </Badge>
                      </CardContent>
                      {doctor.availability === 'disponible' && (
                        <CardFooter className="p-4 pt-0 mt-auto">
                          {pendingRequests.includes(doctor.id) ? (
                            <Button 
                              variant="destructive" 
                              size="sm" 
                              className="w-full"
                              onClick={() => handleCancelRequest(doctor.id)}
                            >
                              Annuler la demande
                            </Button>
                          ) : (
                            <Button 
                              size="sm" 
                              className="w-full"
                              onClick={() => setSelectedDoctor(doctor)}
                            >
                              Prendre rendez-vous
                            </Button>
                          )}
                        </CardFooter>
                      )}
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="border rounded-lg overflow-hidden">
                  <Table>
                    <TableHeader className="bg-muted/50">
                      <TableRow>
                        <TableHead className="w-[200px]">Médecin</TableHead>
                        <TableHead>Spécialité</TableHead>
                        <TableHead>Hôpital</TableHead>
                        <TableHead>Disponibilité</TableHead>
                        <TableHead className="text-right w-[150px]">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {doctors.map((doctor) => (
                        <TableRow key={doctor.id} className={doctor.availability === 'indisponible' ? 'opacity-80' : ''}>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <Image 
                                src={doctor.image} 
                                alt={doctor.name}
                                width={40}
                                height={40}
                                className="rounded-full w-10 h-10 object-cover"
                              />
                              <span>{doctor.name}</span>
                            </div>
                          </TableCell>
                          <TableCell>{doctor.specialty}</TableCell>
                          <TableCell>{doctor.hospital}</TableCell>
                          <TableCell>
                            <Badge variant={doctor.availability === 'disponible' ? 'secondary' : 'destructive'}>
                              {doctor.availability === 'disponible' ? 'Disponible' : 'Indisponible'}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            {doctor.availability === 'disponible' && (
                              pendingRequests.includes(doctor.id) ? (
                                <Button 
                                  variant="destructive" 
                                  size="sm"
                                  onClick={() => handleCancelRequest(doctor.id)}
                                >
                                  Annuler
                                </Button>
                              ) : (
                                <Button 
                                  size="sm"
                                  onClick={() => setSelectedDoctor(doctor)}
                                >
                                  RDV
                                </Button>
                              )
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-col h-full">
              <Button 
                variant="ghost" 
                onClick={handleBackToList}
                className="self-start mb-6 -ml-2"
              >
                <ChevronLeft className="h-4 w-4 mr-2" />
                Retour à la liste
              </Button>

              <div className="flex flex-col lg:flex-row gap-8 flex-1">
                <div className="lg:w-1/3 xl:w-1/4 flex flex-col gap-4">
                  <Card>
                    <CardHeader className="flex-row items-center space-x-4 space-y-0 p-4">
                      <Image 
                        src={selectedDoctor.image} 
                        alt={selectedDoctor.name}
                        width={80}
                        height={80}
                        className="rounded-full w-16 h-16 object-cover"
                      />
                      <div>
                        <h4 className="font-semibold">{selectedDoctor.name}</h4>
                        <p className="text-sm text-muted-foreground">{selectedDoctor.specialty}</p>
                      </div>
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
                      <p className="text-sm">{selectedDoctor.hospital}</p>
                      <Badge 
                        variant={selectedDoctor.availability === 'disponible' ? 'default' : 'destructive'} 
                        className="mt-2"
                      >
                        {selectedDoctor.availability === 'disponible' ? 'Disponible' : 'Indisponible'}
                      </Badge>
                    </CardContent>
                  </Card>

                  <Card className="flex-1">
                    <CardHeader className="p-4 pb-2">
                      <h4 className="font-medium">Sélectionnez vos dates</h4>
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
                      <Calendar
                        mode="multiple"
                        min={1}
                        selected={selectedDates}
                        onSelect={(days) => setSelectedDates(days || [])}
                        locale={ptBR}
                        className="rounded-md border-none"
                        disabled={(date) => 
                          date < new Date() || 
                          date > new Date(new Date().setDate(new Date().getDate() + 30))
                        }
                      />
                      <p className="text-sm text-muted-foreground mt-2">
                        {selectedDates.length > 0 
                          ? `${selectedDates.length} date(s) sélectionnée(s)`
                          : "Cliquez pour sélectionner des dates"}
                      </p>
                    </CardContent>
                  </Card>
                </div>

                <div className="lg:flex-1">
                  <Card className="h-full">
                    <CardHeader>
                      <h4 className="font-medium">Récapitulatif des rendez-vous</h4>
                    </CardHeader>
                    <CardContent>
                      {selectedDates.length > 0 ? (
                        <div className="space-y-6">
                          <div className="space-y-4">
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Médecin:</span>
                              <span className="font-medium">{selectedDoctor.name}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Spécialité:</span>
                              <span className="font-medium">{selectedDoctor.specialty}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Hôpital:</span>
                              <span className="font-medium">{selectedDoctor.hospital}</span>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <p className="font-semibold">Dates sélectionnées :</p>
                            <ul className="border rounded-lg divide-y">
                              {selectedDates
                                .sort((a, b) => a.getTime() - b.getTime())
                                .map((date, index) => (
                                  <li key={index} className="p-3 flex justify-between items-center">
                                    <span>{format(date, 'PP', { locale: ptBR })}</span>
                                    <Button 
                                      variant="ghost" 
                                      size="sm"
                                      onClick={() => setSelectedDates(selectedDates.filter(d => d.getTime() !== date.getTime()))}
                                    >
                                      ×
                                    </Button>
                                  </li>
                                ))}
                            </ul>
                          </div>

                          <div className="flex flex-col sm:flex-row gap-3 pt-4">
                            <Button 
                              onClick={() => handleRequestConsultation(selectedDoctor, selectedDates)}
                              className="flex-1"
                            >
                              Confirmer ({selectedDates.length} rendez-vous)
                            </Button>
                            <Button 
                              variant="outline" 
                              onClick={handleBackToList}
                              className="flex-1"
                            >
                              Changer de médecin
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center h-[200px] text-center">
                          <p className="text-muted-foreground">Veuillez sélectionner au moins une date</p>
                          <p className="text-sm text-muted-foreground mt-2">
                            Choisissez des dates disponibles dans le calendrier
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default DoctorModal