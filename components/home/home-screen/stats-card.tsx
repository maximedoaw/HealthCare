import { Users, ClipboardList, AlertCircle, Zap, ArrowUp, ArrowDown } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string;
  change: string;
  icon: "users" | "clipboard" | "alert-circle" | "zap";
}

const iconMap = {
  users: Users,
  clipboard: ClipboardList,
  "alert-circle": AlertCircle,
  zap: Zap,
};

export function StatsCard({ title, value, change, icon }: StatsCardProps) {
  const IconComponent = iconMap[icon];
  const isPositive = change.startsWith("+");
  
  return (
    <div className="rounded-xl shadow-sm border p-6 dark:text-white">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium ">{title}</p>
          <p className="mt-1 text-2xl font-semibold text-gray-500">{value}</p>
        </div>
        <div className="rounded-lg bg-blue-100 p-3">
          <IconComponent className="h-6 w-6 text-blue-600" />
        </div>
      </div>
      <div className="mt-4">
        <div className={`inline-flex items-center text-sm font-medium ${isPositive ? "text-green-600" : "text-red-600"}`}>
          {change}
          {isPositive ? (
            <ArrowUp className="ml-1 h-4 w-4" />
          ) : (
            <ArrowDown className="ml-1 h-4 w-4" />
          )}
          <span className="ml-1 text-gray-500">vs last month</span>
        </div>
      </div>
    </div>
  );
}