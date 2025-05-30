// components/view-mode-toggle.tsx
import { Button } from "@/components/ui/button"
import { Toggle } from "@/components/ui/toggle"
import { Table, Grid } from "lucide-react"

export type ViewMode = "grid" | "table"

interface ViewModeToggleProps {
  viewMode: ViewMode
  onViewModeChange: (mode: ViewMode) => void
}

export function ViewModeToggle({ viewMode, onViewModeChange }: ViewModeToggleProps) {
  return (
    <div className="flex items-center space-x-1">
      <Toggle
        pressed={viewMode === "grid"}
        onPressedChange={() => onViewModeChange("grid")}
        aria-label="Vue grille"
        className="h-9 w-9 p-0"
      >
        <Grid className="h-4 w-4" />
      </Toggle>
      <Toggle
        pressed={viewMode === "table"}
        onPressedChange={() => onViewModeChange("table")}
        aria-label="Vue tableau"
        className="h-9 w-9 p-0"
      >
        <Table className="h-4 w-4" />
      </Toggle>
    </div>
  )
}