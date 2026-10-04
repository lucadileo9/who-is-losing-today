"use client"

import { Calendar } from "lucide-react"

interface DatePickerProps {
  label?: string
  value: string
  onChange: (value: string) => void
  className?: string
}

export function DatePicker({ label, value, onChange, className = "" }: DatePickerProps) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {label && <span className="text-xs font-medium text-muted-foreground">{label}</span>}
      <div className="relative flex items-center">
        <Calendar className="size-3.5 absolute left-3 text-muted-foreground pointer-events-none" />
        <input
          type="date"
          value={value}
          onChange={(e) => {
            if (e.target.value) onChange(e.target.value)
          }}
          className="h-8 rounded-xl border border-input bg-background pl-8 pr-2.5 text-xs font-medium focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring cursor-pointer"
        />
      </div>
    </div>
  )
}
