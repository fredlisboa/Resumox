'use client'

import type { MindMapData } from '@/lib/resumox-types'

interface PanelMindMapProps {
  data: MindMapData | null
}

export default function PanelMindMap({ data }: PanelMindMapProps) {
  if (!data || !Array.isArray(data.branches) || data.branches.length === 0) {
    return (
      <div className="px-5 text-center py-8">
        <p className="text-sm text-resumox-muted">Mapa mental em breve.</p>
      </div>
    )
  }

  return (
    <div className="px-5">
      <div className="bg-resumox-surface border border-resumox-border rounded-2xl p-6 overflow-x-auto">
        <p className="text-sm font-bold text-resumox-accent-light uppercase tracking-wide mb-4">
          Mapa Mental
        </p>

        <div className="flex flex-col items-center gap-5">
          {/* Central node */}
          <div
            className="px-7 py-3.5 rounded-full font-extrabold text-[15px] text-white text-center"
            style={{
              background: 'linear-gradient(135deg, #6C5CE7, #5a4bd1)',
              boxShadow: '0 4px 20px rgba(108,92,231,0.3)',
            }}
          >
            {data.center_label}
            {data.center_sublabel && (
              <span className="block text-[10px] font-normal text-white/70 mt-0.5">
                {data.center_sublabel}
              </span>
            )}
          </div>

          {/* Branches grid */}
          <div className="grid grid-cols-2 gap-3 w-full">
            {data.branches.map((branch, i) => (
              <div
                key={i}
                className={`bg-resumox-surface2 border border-resumox-border rounded-xl p-3.5 relative ${
                  branch.full_width ? 'col-span-2' : ''
                }`}
              >
                {/* Connector line */}
                <div
                  className="absolute -top-2.5 left-1/2 w-0.5 h-2.5"
                  style={{ background: 'rgba(108,92,231,0.3)' }}
                />

                <p className="text-xs font-bold text-resumox-gold mb-2 flex items-center gap-1.5">
                  <span className="text-sm">{branch.icon}</span>
                  {branch.title}
                </p>

                <ul className="space-y-1.5">
                  {(branch.items ?? []).map((item, j) => (
                    <li key={j} className="text-[11px] text-resumox-text leading-relaxed flex items-start gap-2">
                      <span className="text-resumox-accent mt-0.5 flex-shrink-0">•</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
