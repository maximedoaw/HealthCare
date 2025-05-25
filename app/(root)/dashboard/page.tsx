import { Calendar, ClipboardList, FileText, UserPlus } from "lucide-react";
import { Header } from "@/components/home/home-screen/header";
import { RecentActivity } from "@/components/home/home-screen/recent-activity";
import { StatsCard } from "@/components/home/home-screen/stats-card";
import { PatientCard } from "@/components/home/home-screen/patient-card";
 

export default function DashBoardPage() {
  return (
    <div className="flex min-h-screen">
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <div className="grid gap-6">
            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatsCard 
                title="Total Patients" 
                value="1,248" 
                change="+12%"
                icon="users"
              />
              <StatsCard 
                title="New Cases" 
                value="56" 
                change="+5%"
                icon="clipboard"
              />
              <StatsCard 
                title="Pending Tasks" 
                value="18" 
                change="-3%"
                icon="alert-circle"
              />
              <StatsCard 
                title="AI Suggestions" 
                value="7" 
                change="+120%"
                icon="zap"
              />
            </div>
            
            {/* Main Content Area */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                {/* Patient List */}
                <div className="rounded-xl shadow-sm border p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold">Recent Patients</h2>
                    <button className="text-sm text-blue-600 hover:text-blue-800">
                      View All
                    </button>
                  </div>
                  <div className="space-y-4">
                    <PatientCard
                      name="Jean Dupont"
                      age={45}
                      gender="Male"
                      lastVisit="Today"
                      status="Recovering"
                      condition="Hypertension"
                    />
                    <PatientCard
                      name="Marie Ngo"
                      age={32}
                      gender="Female"
                      lastVisit="Yesterday"
                      status="Critical"
                      condition="Diabetes"
                    />
                    <PatientCard
                      name="Paul Mbappe"
                      age={28}
                      gender="Male"
                      lastVisit="2 days ago"
                      status="Stable"
                      condition="Malaria"
                    />
                  </div>
                </div>
                
              </div>
              
              {/* Side Panel */}
              <div className="space-y-6">
                <RecentActivity />
                
                <div className="rounded-xl shadow-sm border p-6">
                  <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
                  <div className="grid grid-cols-2 gap-4">
                    <button className="flex flex-col items-center justify-center p-4 rounded-lg bg-blue-50 dark:bg-gray-900 hover:bg-blue-100 transition-colors">
                      <span className="text-blue-600 mb-2">
                        <ClipboardList className="h-6 w-6" />
                      </span>
                      <span className="text-sm font-medium">New Record</span>
                    </button>
                    <button className="flex flex-col items-center justify-center p-4 rounded-lg bg-green-50 dark:bg-gray-900 hover:bg-green-100 transition-colors">
                      <span className="text-green-600 mb-2">
                        <UserPlus className="h-6 w-6" />
                      </span>
                      <span className="text-sm font-medium">Add Patient</span>
                    </button>
                    <button className="flex flex-col items-center justify-center p-4 rounded-lg dark:bg-gray-900 bg-purple-50 hover:bg-purple-100 transition-colors">
                      <span className="text-purple-600 mb-2">
                        <FileText className="h-6 w-6" />
                      </span>
                      <span className="text-sm font-medium">Generate Report</span>
                    </button>
                    <button className="flex flex-col items-center justify-center p-4 rounded-lg dark:bg-gray-900 bg-orange-50 hover:bg-orange-100 transition-colors">
                      <span className="text-orange-600 mb-2">
                        <Calendar className="h-6 w-6" />
                      </span>
                      <span className="text-sm font-medium">Schedule</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}