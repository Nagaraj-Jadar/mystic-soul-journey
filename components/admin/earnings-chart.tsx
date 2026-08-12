"use client"

import { useId } from "react"
import { earningsSeries } from "@/lib/data/admin"

const W = 640
const H = 220
const PAD_X = 8
const PAD_TOP = 16
const PAD_BOTTOM = 28

export function EarningsChart() {
  const gradId = useId()
  const values = earningsSeries.map((d) => d.value)
  const max = 100000
  const min = 0

  const innerW = W - PAD_X * 2
  const innerH = H - PAD_TOP - PAD_BOTTOM

  const points = earningsSeries.map((d, i) => {
    const x = PAD_X + (i / (earningsSeries.length - 1)) * innerW
    const y = PAD_TOP + (1 - (d.value - min) / (max - min)) * innerH
    return { x, y }
  })

  const line = points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(" ")
  const area = `${line} L ${points[points.length - 1].x.toFixed(1)} ${(PAD_TOP + innerH).toFixed(1)} L ${points[0].x.toFixed(1)} ${(PAD_TOP + innerH).toFixed(1)} Z`

  const yTicks = [0, 25000, 50000, 75000, 100000]

  return (
    <div className="flex gap-3">
      <div className="flex flex-col justify-between py-1 pb-7 text-right text-[11px] text-muted-foreground">
        {[...yTicks].reverse().map((t) => (
          <span key={t}>{t === 0 ? "0" : `${t / 1000}K`}</span>
        ))}
      </div>
      <div className="min-w-0 flex-1">
        <svg viewBox={`0 0 ${W} ${H}`} className="h-52 w-full" role="img" aria-label="Earnings over June">
          <defs>
            <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.28" />
              <stop offset="100%" stopColor="var(--primary)" stopOpacity="0" />
            </linearGradient>
          </defs>

          {yTicks.map((t) => {
            const y = PAD_TOP + (1 - (t - min) / (max - min)) * innerH
            return (
              <line
                key={t}
                x1={PAD_X}
                x2={W - PAD_X}
                y1={y}
                y2={y}
                stroke="var(--border)"
                strokeWidth="1"
                strokeDasharray="3 4"
              />
            )
          })}

          <path d={area} fill={`url(#${gradId})`} />
          <path d={line} fill="none" stroke="var(--primary)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />

          {points.map((p, i) => (
            <circle key={i} cx={p.x} cy={p.y} r="3" fill="var(--card)" stroke="var(--primary)" strokeWidth="2" />
          ))}
        </svg>
        <div className="flex justify-between px-1 text-[11px] text-muted-foreground">
          {earningsSeries.map((d) => (
            <span key={d.label}>{d.label}</span>
          ))}
        </div>
      </div>
    </div>
  )
}
