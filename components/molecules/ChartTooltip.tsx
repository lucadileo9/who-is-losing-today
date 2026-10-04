"use client"

export interface TooltipPayloadItem {
  name?: string
  value?: number | string
  color?: string
  fill?: string
  stroke?: string
}

export interface ChartTooltipProps {
  active?: boolean
  payload?: TooltipPayloadItem[]
  label?: string
}

export function ChartTooltip({ active, payload, label }: ChartTooltipProps) {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-xl border border-border bg-card px-3.5 py-2.5 shadow-xl text-xs font-semibold text-foreground">
        <p className="text-muted-foreground font-medium border-b border-border pb-1 mb-1">{label}</p>
        {payload.map((entry: TooltipPayloadItem, index: number) => (
          <div key={index} className="flex items-center justify-between gap-3 py-0.5">
            <span className="flex items-center gap-1.5">
              <span
                className="size-2 rounded-full"
                style={{ backgroundColor: entry.fill || entry.stroke || entry.color }}
              />
              <span>{entry.name || "Punteggio"}:</span>
            </span>
            <span className="font-bold">{entry.value}</span>
          </div>
        ))}
      </div>
    )
  }
  return null
}
