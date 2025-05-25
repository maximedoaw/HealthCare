import { MessageSquarePlus } from "lucide-react"

interface AIAssistantButtonProps {
  onClick: () => void
}

export function AIAssistantButton({ onClick }: AIAssistantButtonProps) {
  return (
    <>
      {/* Version desktop */}
      <button 
        onClick={onClick}
        className="hidden md:flex items-center fixed bottom-6 right-6 bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-full shadow-lg"
      >
        <MessageSquarePlus className="h-5 w-5 mr-2" />
        Assistant IA
      </button>
      
      {/* Version mobile */}
      <button 
        onClick={onClick}
        className="md:hidden flex items-center justify-center fixed bottom-6 right-6 bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full shadow-lg"
      >
        <MessageSquarePlus className="h-6 w-6" />
      </button>
    </>
  )
}