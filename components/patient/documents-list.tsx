import { FileText, Download } from "lucide-react"

export function DocumentsList() {
  const documents = [
    { name: "Ordonnance du 12/11/2023", type: "PDF", date: "12 Nov 2023" },
    { name: "Résultats d'analyses", type: "PDF", date: "5 Nov 2023" },
    { name: "Compte-rendu hospitalier", type: "PDF", date: "20 Oct 2023" }
  ]

  return (
    <section className="rounded-xl shadow-sm border p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold">Mes documents médicaux</h2>
        <button className="text-sm text-blue-600 hover:text-blue-800">
          Voir tout
        </button>
      </div>
      
      <div className="space-y-4">
        {documents.map((doc, index) => (
          <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center">
              <FileText className="h-5 w-5 text-blue-500 mr-3" />
              <div>
                <p className="font-medium">{doc.name}</p>
                <p className="text-sm text-gray-500">{doc.type} • {doc.date}</p>
              </div>
            </div>
            <button className="text-gray-400 hover:text-blue-500">
              <Download className="h-5 w-5" />
            </button>
          </div>
        ))}
      </div>
    </section>
  )
}