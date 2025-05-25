import { useState } from "react"
import { usePatientModalStore } from "@/store/patients-modal-store"
import { 
  Activity, 
  Heart, 
  Weight, 
  Droplet,
  Thermometer,
  Ruler,
  Wind,
  Droplets,
  Pill,
  AlertTriangle,
  ActivitySquare,
  Wine
} from "lucide-react"
import { PatientHealthForm } from "@/types"

interface HealthMetricsProps {
  healthData: PatientHealthForm
}

export function HealthMetrics({ healthData }: HealthMetricsProps) {
  const [showMore, setShowMore] = useState(false)
  const { onOpen } = usePatientModalStore()

  // Indicateurs principaux (obligatoires)
  const primaryMetrics = [
    { 
      icon: Weight, 
      name: "Poids", 
      value: `${healthData.weightKg} kg`,
      key: 'weight'
    },
    { 
      icon: Droplet, 
      name: "Pression art.", 
      value: `${healthData.bloodPressureSystolic}/${healthData.bloodPressureDiastolic}`,
      key: 'bloodPressure'
    },
    { 
      icon: Heart, 
      name: "Rythme cardiaque", 
      value: `${healthData.heartRateBpm} bpm`,
      key: 'heartRate'
    }
  ]

  // Indicateurs secondaires
  const secondaryMetrics = [
    healthData.heightCm && {
      icon: Ruler,
      name: "Taille",
      value: `${healthData.heightCm} cm`,
      key: 'height'
    },
    healthData.respiratoryRate && {
      icon: Wind,
      name: "Respiration",
      value: `${healthData.respiratoryRate} /min`,
      key: 'respiratoryRate'
    },
    healthData.temperatureCelsius && {
      icon: Thermometer,
      name: "Température",
      value: `${healthData.temperatureCelsius}°C`,
      key: 'temperature'
    },
    healthData.bloodOxygenSaturation && {
      icon: Droplets,
      name: "Oxygène sanguin",
      value: `${healthData.bloodOxygenSaturation}%`,
      key: 'oxygen'
    },
    healthData.bloodSugarMgDl && {
      icon: Droplet,
      name: "Glycémie",
      value: `${healthData.bloodSugarMgDl} mg/dL`,
      key: 'bloodSugar'
    },
    healthData.cholesterolTotalMgDl && {
      icon: AlertTriangle,
      name: "Cholestérol",
      value: `${healthData.cholesterolTotalMgDl} mg/dL`,
      key: 'cholesterol'
    },
    healthData.physicalActivityLevel && {
      icon: ActivitySquare,
      name: "Activité physique",
      value: `${healthData.physicalActivityLevel}`,
      key: 'activity'
    },
    healthData.alcoholConsumptionPerWeek && {
      icon: Wine,
      name: "Alcool/semaine",
      value: `${healthData.alcoholConsumptionPerWeek} verres`,
      key: 'alcohol'
    }
  ].filter(Boolean) // Filtre les valeurs null/undefined

  return (
    <section className="rounded-xl shadow-sm border p-6">
      <h2 className="text-xl font-semibold mb-6">Mes indicateurs de santé</h2>
      
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {primaryMetrics.map((metric) => (
          <MetricCard key={metric.key} metric={metric} />
        ))}
        
        {showMore && secondaryMetrics.map((metric: any) => (
          <MetricCard key={metric.key} metric={metric} />
        ))}
      </div>
      
      {secondaryMetrics.length > 0 && (
        <button
          onClick={() => setShowMore(!showMore)}
          className="mt-4 text-sm text-blue-600 hover:text-blue-800"
        >
          {showMore ? 'Montrer moins' : 'Montrer plus'}
        </button>
      )}
      
      <button
        onClick={() => onOpen()}
        className="mt-6 w-full py-2 border border-blue-600 text-blue-600 hover:bg-blue-50 rounded-lg"
      >
        Ajouter un indicateur
      </button>
    </section>
  )
}

interface MetricCardProps {
  metric: {
    icon: any
    name: string
    value: string
  }
}

function MetricCard({ metric }: MetricCardProps) {
  return (
    <div className="flex flex-col items-center p-4 rounded-lg bg-gray-50">
      <metric.icon className="h-6 w-6 text-blue-500 mb-2" />
      <h3 className="text-sm font-medium text-gray-500">{metric.name}</h3>
      <p className="text-lg font-semibold">{metric.value}</p>
    </div>
  )
}