"use client"

import { HeartPulse } from "lucide-react"

export function MedicalLoader() {
  return (
    <div className="flex flex-col items-center justify-center gap-3 my-auto mx-auto ">
      {/* Cœur médical animé */}
      <div className="relative">
        <HeartPulse 
          className="h-16 w-16 text-red-500"
          style={{
            animation: 'pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite',
            filter: 'drop-shadow(0 0 8px rgba(239, 68, 68, 0.6))'
          }}
        />
        <div 
          className="absolute inset-0 rounded-full bg-red-100 -z-10"
          style={{
            animation: 'ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite'
          }}
        />
      </div>

      {/* Texte animé */}
      <p 
        className="text-gray-600 font-medium"
        style={{
          animation: 'pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite'
        }}
      >
      </p>

      {/* Barre de progression */}
      <div className="w-48 h-1.5 bg-gray-200 rounded-full overflow-hidden">
        <div 
          className="h-full bg-red-500 rounded-full"
          style={{
            width: '70%',
            animation: 'progress 2s linear infinite',
            transformOrigin: 'left center'
          }}
        />
      </div>

      {/* Styles inline pour les animations */}
      <style jsx>{`
        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.05); opacity: 0.8; }
        }
        @keyframes ping {
          0% { transform: scale(1); opacity: 0.7; }
          100% { transform: scale(1.5); opacity: 0; }
        }
        @keyframes progress {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  )
}