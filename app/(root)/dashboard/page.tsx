"use client"

import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { type Timestamp, collection, getDocs, doc, updateDoc } from "firebase/firestore"
import { useEffect, useState } from "react"
import { firestore } from "@/firebase/config"
import { ViewModeToggle } from "@/components/view-mode-toggle"
import { Users, FileCheck, Clock, CheckCircle, ExternalLink } from "lucide-react"
import Link from "next/link"
import toast from "react-hot-toast"

interface VerificationStatusItem {
  verified: boolean
  verifiedBy?: string
  verifiedAt?: Timestamp
  comment?: string
}

interface VerificationFile {
  url: string
  name: string
  uploadedAt: Timestamp
}

interface VerificationDocument {
  userId: string
  role: "patient" | "personalMedical" | "admin"
  staffType?: string
  verifications: {
    diplome: boolean
    identite: boolean
    structure: boolean
  }
  verificationStatuses: {
    diplome?: VerificationStatusItem
    identite?: VerificationStatusItem
    structure?: VerificationStatusItem
  }
  uploadedFiles: {
    diplome?: VerificationFile
    identite?: VerificationFile
    structure?: VerificationFile
  }
  name?: string
  email?: string
  completedAt: Timestamp | null
  step: number
  isCompleted: boolean
  createdAt?: Date
  updatedAt?: Date
  id?: string
}

interface User {
  userId: string
  username: string
  email: string
  createdAt: Timestamp
}

export default function VerificationDashboard() {
  const [documents, setDocuments] = useState<VerificationDocument[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [selectedDocIndex, setSelectedDocIndex] = useState<number>(0)
  const [activeTab, setActiveTab] = useState<"diplome" | "identite" | "structure">("diplome")
  const [isSaving, setIsSaving] = useState(false)
  const [progress, setProgress] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid")
  const [filterStatus, setFilterStatus] = useState<"all" | "verified" | "pending" | "rejected">("all")

  // Charger les documents et utilisateurs depuis Firestore
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)

        // Charger les documents de vérification avec rôle personalMedical uniquement
        const verificationsSnapshot = await getDocs(collection(firestore, "verifications"))
        const verificationsDocs: VerificationDocument[] = []

        verificationsSnapshot.forEach((doc) => {
          const data = doc.data()
          // Filtrer uniquement les documents avec le rôle personalMedical
          if (data.role === "personalMedical") {
            // Mettre automatiquement tous les paramètres de vérification à true
            const updatedData = {
              ...data,
              verifications: {
                diplome: true,
                identite: true,
                structure: true,
              },
              isCompleted: true,
              id: doc.id,
              createdAt: data.createdAt?.toDate(),
              updatedAt: data.updatedAt?.toDate(),
              completedAt: data.completedAt?.toDate(),
            } as VerificationDocument

            verificationsDocs.push(updatedData)
          }
        })

        // Charger les utilisateurs
        const usersSnapshot = await getDocs(collection(firestore, "users"))
        const usersData: User[] = []

        usersSnapshot.forEach((doc) => {
          const data = doc.data()
          usersData.push({
            ...data,
            createdAt: data.createdAt,
          } as User)
        })

        // Récupérer les userId correspondants et fusionner les données
        const mergedDocs = verificationsDocs.map((doc) => {
          const user = usersData.find((u) => u.userId === doc.userId)
          return {
            ...doc,
            name: user?.username || "Utilisateur inconnu",
            email: user?.email || "Email non trouvé",
          }
        })

        setDocuments(mergedDocs)
        setUsers(usersData)
      } catch (err) {
        setError("Erreur lors du chargement des données")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const currentDocument = documents[selectedDocIndex] || null

  const filteredDocuments = documents.filter((doc) => {
    if (filterStatus === "all") return true
    if (filterStatus === "verified") return doc.isCompleted
    if (filterStatus === "pending") return !doc.isCompleted && Object.values(doc.verifications).some((v) => v)
    if (filterStatus === "rejected") return !doc.isCompleted && Object.values(doc.verifications).every((v) => !v)
    return true
  })

  const handleDocSelect = (index: number) => {
    setSelectedDocIndex(index)
  }

  const handleVerificationToggle = async (type: keyof VerificationDocument["verifications"]) => {
    const updatedDocs = [...documents]
    if (updatedDocs[selectedDocIndex]) {
      updatedDocs[selectedDocIndex].verifications[type] = !updatedDocs[selectedDocIndex].verifications[type]

      // Mettre à jour le statut de vérification
      updatedDocs[selectedDocIndex].verificationStatuses[type] = {
        verified: updatedDocs[selectedDocIndex].verifications[type],
        verifiedBy: "Admin", // À remplacer par l'utilisateur actuel
        verifiedAt: new Date() as unknown as Timestamp,
        comment: updatedDocs[selectedDocIndex].verifications[type] ? "Document approuvé" : "Document rejeté",
      }

      setDocuments(updatedDocs)

      // Mettre à jour dans Firestore
      try {
        await updateDoc(doc(firestore, "verifications", updatedDocs[selectedDocIndex].id!), {
          [`verifications.${type}`]: updatedDocs[selectedDocIndex].verifications[type],
          [`verificationStatuses.${type}`]: updatedDocs[selectedDocIndex].verificationStatuses[type],
        })
      } catch (err) {
        console.error("Erreur lors de la mise à jour", err)
      }
    }
  }

  const handleSubmit = async () => {
    setIsSaving(true)
    setProgress(0)

    try {
      // Sauvegarde des modifications
      const docRef = doc(firestore, "verifications", currentDocument.id!)
      await updateDoc(docRef, {
        verifications: currentDocument.verifications,
        verificationStatuses: currentDocument.verificationStatuses,
        isCompleted: currentDocument.isCompleted,
        updatedAt: new Date(),
      })

      // Simulation de progression
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval)
            setIsSaving(false)
            return 100
          }
          return prev + 10
        })
      }, 300)
      toast.success("Sauvegarde effectuée avec succes")

    } catch (err) {
      setIsSaving(false)
      console.error("Erreur lors de la sauvegarde", err)
    }
  }

  const getStatusColor = (status?: VerificationStatusItem) => {
    if (!status) return "bg-orange-500" // En attente
    return status.verified ? "bg-green-500" : "bg-red-500"
  }

  const getStatusText = (status?: VerificationStatusItem) => {
    if (!status) return "En attente"
    return status.verified ? "Validé" : "Rejeté"
  }

  const getVerificationProgress = (doc: VerificationDocument) => {
    if (!doc) return 0
    const total = Object.keys(doc.verifications).length
    const completed = Object.values(doc.verifications).filter((v) => v).length
    return Math.round((completed / total) * 100)
  }

  const getOverallStatus = (doc: VerificationDocument) => {
    const progress = getVerificationProgress(doc)
    if (progress === 100) return "success"
    if (progress > 0) return "warning"
    return "error"
  }

  const getStaffTypeColor = (staffType?: string) => {
    switch (staffType) {
      case "medecin":
        return "bg-blue-100 text-blue-800"
      case "infirmier":
        return "bg-green-100 text-green-800"
      case "pharmacien":
        return "bg-purple-100 text-purple-800"
      case "kinesitherapeute":
        return "bg-orange-100 text-orange-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  if (loading)
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-lg">Chargement des données...</p>
          </div>
        </div>
      </div>
    )

  if (error)
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-red-600">
              <span className="text-lg">⚠️</span>
              <span>Erreur: {error}</span>
            </div>
          </CardContent>
        </Card>
      </div>
    )

  if (documents.length === 0)
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun personnel médical à vérifier</h3>
              <p className="text-gray-500">
                Il n'y a actuellement aucun document de personnel médical en attente de vérification.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    )

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Personnel Médical - Vérifications</h1>
          <p className="text-gray-600 mt-1">Gestion des vérifications pour le personnel médical</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <Select value={filterStatus} onValueChange={(value) => setFilterStatus(value as any)}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Filtrer par statut" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous</SelectItem>
              <SelectItem value="verified">Validés</SelectItem>
              <SelectItem value="pending">En attente</SelectItem>
              <SelectItem value="rejected">Rejetés</SelectItem>
            </SelectContent>
          </Select>
          <ViewModeToggle viewMode={viewMode} onViewModeChange={setViewMode} />
        </div>
      </div>

      {/* Statistiques rapides */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <Users className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600" />
              <div className="ml-3 sm:ml-4">
                <p className="text-xs sm:text-sm font-medium text-gray-600">Total Personnel</p>
                <p className="text-xl sm:text-2xl font-bold text-gray-900">{documents.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <CheckCircle className="h-6 w-6 sm:h-8 sm:w-8 text-green-600" />
              <div className="ml-3 sm:ml-4">
                <p className="text-xs sm:text-sm font-medium text-gray-600">Validés</p>
                <p className="text-xl sm:text-2xl font-bold text-gray-900">
                  {documents.filter((doc) => doc.isCompleted).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <Clock className="h-6 w-6 sm:h-8 sm:w-8 text-orange-600" />
              <div className="ml-3 sm:ml-4">
                <p className="text-xs sm:text-sm font-medium text-gray-600">En attente</p>
                <p className="text-xl sm:text-2xl font-bold text-gray-900">
                  {documents.filter((doc) => !doc.isCompleted).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <FileCheck className="h-6 w-6 sm:h-8 sm:w-8 text-purple-600" />
              <div className="ml-3 sm:ml-4">
                <p className="text-xs sm:text-sm font-medium text-gray-600">Taux validation</p>
                <p className="text-xl sm:text-2xl font-bold text-gray-900">
                  {documents.length > 0
                    ? Math.round((documents.filter((doc) => doc.isCompleted).length / documents.length) * 100)
                    : 0}
                  %
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col xl:flex-row gap-6">
        {/* Sidebar - Liste des utilisateurs */}
        <div className="w-full xl:w-1/3">
          <Card className="h-fit">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Users className="h-5 w-5" />
                Personnel Médical
              </CardTitle>
              <CardDescription>{filteredDocuments.length} membres du personnel</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2 max-h-[600px] overflow-y-auto">
              {viewMode === "grid" ? (
                <div className="space-y-3">
                  {filteredDocuments.map((doc, index) => (
                    <div
                      key={doc.id}
                      className={`p-3 sm:p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 hover:shadow-md ${
                        selectedDocIndex === index
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                      onClick={() => handleDocSelect(index)}
                    >
                      <div className="flex items-start gap-3">
                        <Avatar className="h-10 w-10 sm:h-12 sm:w-12">
                          <AvatarImage src="/placeholder-user.jpg" />
                          <AvatarFallback className="bg-blue-100 text-blue-600">
                            {doc.name?.charAt(0) || "U"}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <p className="font-semibold text-gray-900 truncate text-sm sm:text-base">{doc.name}</p>
                            <div
                              className={`h-3 w-3 rounded-full ${
                                getOverallStatus(doc) === "success"
                                  ? "bg-green-500"
                                  : getOverallStatus(doc) === "warning"
                                    ? "bg-orange-500"
                                    : "bg-red-500"
                              }`}
                            />
                          </div>
                          <p className="text-xs sm:text-sm text-gray-600 truncate mb-2">{doc.email}</p>
                          {doc.staffType && (
                            <Badge className={`text-xs ${getStaffTypeColor(doc.staffType)}`}>{doc.staffType}</Badge>
                          )}
                          <div className="mt-2">
                            <div className="flex justify-between text-xs text-gray-500 mb-1">
                              <span>Progression</span>
                              <span>{getVerificationProgress(doc)}%</span>
                            </div>
                            <Progress value={getVerificationProgress(doc)} className="h-2" />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="border rounded-lg overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-gray-50">
                        <TableHead className="text-xs sm:text-sm">Personnel</TableHead>
                        <TableHead className="text-xs sm:text-sm">Type</TableHead>
                        <TableHead className="text-xs sm:text-sm">Statut</TableHead>
                        <TableHead className="text-right text-xs sm:text-sm">Progression</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredDocuments.map((doc, index) => (
                        <TableRow
                          key={doc.id}
                          className={`cursor-pointer transition-colors ${
                            selectedDocIndex === index ? "bg-blue-50" : "hover:bg-gray-50"
                          }`}
                          onClick={() => handleDocSelect(index)}
                        >
                          <TableCell className="py-3 sm:py-4">
                            <div className="flex items-center gap-2 sm:gap-3">
                              <Avatar className="h-8 w-8 sm:h-10 sm:w-10">
                                <AvatarImage src="/placeholder-user.jpg" />
                                <AvatarFallback className="bg-blue-100 text-blue-600">
                                  {doc.name?.charAt(0) || "U"}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-medium text-gray-900 text-xs sm:text-sm">{doc.name}</p>
                                <p className="text-xs text-gray-500">{doc.email}</p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            {doc.staffType && (
                              <Badge className={`text-xs ${getStaffTypeColor(doc.staffType)}`}>{doc.staffType}</Badge>
                            )}
                          </TableCell>
                          <TableCell>
                            <div
                              className={`inline-flex h-3 w-3 rounded-full ${
                                getOverallStatus(doc) === "success"
                                  ? "bg-green-500"
                                  : getOverallStatus(doc) === "warning"
                                    ? "bg-orange-500"
                                    : "bg-red-500"
                              }`}
                            />
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center gap-2 justify-end">
                              <Progress value={getVerificationProgress(doc)} className="h-2 w-12 sm:w-16" />
                              <span className="text-xs sm:text-sm text-gray-600">{getVerificationProgress(doc)}%</span>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="w-full xl:w-2/3">
          {currentDocument ? (
            <>
              <Card>
                <CardHeader>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <CardTitle className="text-lg sm:text-xl">{currentDocument.name}</CardTitle>
                      <CardDescription className="text-sm sm:text-base">{currentDocument.email}</CardDescription>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                        Personnel médical
                      </Badge>
                      {currentDocument.staffType && (
                        <Badge className={getStaffTypeColor(currentDocument.staffType)}>
                          {currentDocument.staffType}
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="diplome" onValueChange={(value) => setActiveTab(value as any)}>
                    <TabsList className="grid grid-cols-3 w-full">
                      <TabsTrigger value="diplome" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm">
                        <FileCheck className="h-3 w-3 sm:h-4 sm:w-4" />
                        <span className="hidden sm:inline">Diplôme</span>
                        <span className="sm:hidden">Dip.</span>
                      </TabsTrigger>
                      <TabsTrigger value="identite" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm">
                        <Users className="h-3 w-3 sm:h-4 sm:w-4" />
                        <span className="hidden sm:inline">Identité</span>
                        <span className="sm:hidden">ID</span>
                      </TabsTrigger>
                      <TabsTrigger value="structure" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm">
                        <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4" />
                        <span className="hidden sm:inline">Structure</span>
                        <span className="sm:hidden">Str.</span>
                      </TabsTrigger>
                    </TabsList>

                    <div className="mt-6">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                        <div>
                          <h3 className="text-base sm:text-lg font-semibold">
                            {activeTab === "diplome" && "Vérification du diplôme"}
                            {activeTab === "identite" && "Vérification d'identité"}
                            {activeTab === "structure" && "Vérification de la structure"}
                          </h3>
                          <div className="flex flex-wrap items-center gap-2 mt-2">
                            <span className="text-sm text-gray-600">Statut:</span>
                            <Badge
                              className={`${getStatusColor(currentDocument.verificationStatuses[activeTab])} text-white`}
                            >
                              {getStatusText(currentDocument.verificationStatuses[activeTab])}
                            </Badge>
                            {currentDocument.verificationStatuses[activeTab]?.verifiedBy && (
                              <span className="text-sm text-gray-500">
                                par {currentDocument.verificationStatuses[activeTab]?.verifiedBy}
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <Label htmlFor="verification-toggle" className="text-sm font-medium">
                            {currentDocument.verifications[activeTab] ? "Validé" : "Non validé"}
                          </Label>
                          <Switch
                            id="verification-toggle"
                            checked={currentDocument.verifications[activeTab]}
                            onCheckedChange={() => handleVerificationToggle(activeTab)}
                          />
                        </div>
                      </div>

                      {currentDocument.uploadedFiles[activeTab] ? (
                        <div className="border rounded-lg p-4 sm:p-6 bg-gray-50">
                          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                            <div className="flex items-center gap-3">
                              <FileCheck className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600 flex-shrink-0" />
                              <div className="min-w-0">
                                <p className="font-medium text-gray-900 text-sm sm:text-base truncate">
                                  {currentDocument.uploadedFiles[activeTab]?.name}
                                </p>
                                <p className="text-xs sm:text-sm text-gray-500">
                                  Uploadé le{" "}
                                  {currentDocument.uploadedFiles[activeTab]?.uploadedAt?.toDate().toLocaleDateString()}
                                </p>
                              </div>
                            </div>
                            <Link
                              href={currentDocument.uploadedFiles[activeTab]?.url || "#"}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-white hover:bg-accent hover:text-accent-foreground h-9 px-3 w-full sm:w-auto"
                            >
                              <ExternalLink className="h-4 w-4 mr-2" />
                              Ouvrir le document
                            </Link>
                          </div>
                        </div>
                      ) : (
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 sm:p-8 text-center bg-gray-50">
                          <FileCheck className="h-10 w-10 sm:h-12 sm:w-12 text-gray-400 mx-auto mb-4" />
                          <p className="text-gray-600 mb-2 text-sm sm:text-base">Aucun document disponible</p>
                          <p className="text-xs sm:text-sm text-gray-500">
                            Le document pour cette section n'a pas encore été fourni.
                          </p>
                        </div>
                      )}

                      {currentDocument.verificationStatuses[activeTab]?.comment && (
                        <div className="mt-6 space-y-2">
                          <Label className="text-sm font-medium">Commentaire</Label>
                          <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
                            <p className="text-sm text-orange-800">
                              {currentDocument.verificationStatuses[activeTab]?.comment}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </Tabs>
                </CardContent>
                <CardFooter className="flex flex-col sm:flex-row justify-between gap-4 bg-gray-50">
                  <Button variant="outline" className="w-full sm:w-auto">
                    Retour
                  </Button>
                  <Button
                    onClick={handleSubmit}
                    disabled={isSaving}
                    className="bg-blue-600 hover:bg-blue-700 w-full sm:w-auto"
                  >
                    {isSaving ? (
                      <div className="flex items-center gap-2">
                        <span>Sauvegarde...</span>
                        <Progress value={progress} className="h-2 w-20" />
                      </div>
                    ) : (
                      "Sauvegarder les modifications"
                    )}
                  </Button>
                </CardFooter>
              </Card>

              {/* Verification Summary */}
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <CheckCircle className="h-5 w-5" />
                    Résumé des vérifications
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
                    <div className="border rounded-lg p-4 sm:p-6 bg-gradient-to-br from-blue-50 to-blue-100">
                      <div className="flex justify-between items-center mb-3">
                        <h3 className="font-semibold text-blue-900 text-sm sm:text-base">Diplôme</h3>
                        <Badge
                          className={`${getStatusColor(currentDocument.verificationStatuses.diplome)} text-white text-xs`}
                        >
                          {getStatusText(currentDocument.verificationStatuses.diplome)}
                        </Badge>
                      </div>
                      {currentDocument.verificationStatuses.diplome?.verifiedBy && (
                        <p className="text-xs sm:text-sm text-blue-700 mb-3">
                          Vérifié par: {currentDocument.verificationStatuses.diplome.verifiedBy}
                        </p>
                      )}
                      <Progress value={currentDocument.verifications.diplome ? 100 : 0} className="h-3" />
                    </div>

                    <div className="border rounded-lg p-4 sm:p-6 bg-gradient-to-br from-green-50 to-green-100">
                      <div className="flex justify-between items-center mb-3">
                        <h3 className="font-semibold text-green-900 text-sm sm:text-base">Identité</h3>
                        <Badge
                          className={`${getStatusColor(currentDocument.verificationStatuses.identite)} text-white text-xs`}
                        >
                          {getStatusText(currentDocument.verificationStatuses.identite)}
                        </Badge>
                      </div>
                      {currentDocument.verificationStatuses.identite?.verifiedBy && (
                        <p className="text-xs sm:text-sm text-green-700 mb-3">
                          Vérifié par: {currentDocument.verificationStatuses.identite.verifiedBy}
                        </p>
                      )}
                      <Progress value={currentDocument.verifications.identite ? 100 : 0} className="h-3" />
                    </div>

                    <div className="border rounded-lg p-4 sm:p-6 bg-gradient-to-br from-purple-50 to-purple-100">
                      <div className="flex justify-between items-center mb-3">
                        <h3 className="font-semibold text-purple-900 text-sm sm:text-base">Structure</h3>
                        <Badge
                          className={`${getStatusColor(currentDocument.verificationStatuses.structure)} text-white text-xs`}
                        >
                          {getStatusText(currentDocument.verificationStatuses.structure)}
                        </Badge>
                      </div>
                      {currentDocument.verificationStatuses.structure?.verifiedBy && (
                        <p className="text-xs sm:text-sm text-purple-700 mb-3">
                          Vérifié par: {currentDocument.verificationStatuses.structure.verifiedBy}
                        </p>
                      )}
                      <Progress value={currentDocument.verifications.structure ? 100 : 0} className="h-3" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </>
          ) : (
            <Card className="h-96">
              <CardHeader>
                <CardTitle className="text-lg">Aucun utilisateur sélectionné</CardTitle>
              </CardHeader>
              <CardContent className="flex items-center justify-center h-full">
                <div className="text-center">
                  <Users className="h-12 w-12 sm:h-16 sm:w-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 text-sm sm:text-base">
                    Sélectionnez un membre du personnel médical dans la liste pour commencer la vérification.
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
