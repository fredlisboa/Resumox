'use client'

import { TABS, type TabName } from '@/lib/resumox-types'

interface BookTabBarProps {
  activeTab: TabName
  onTabChange: (tab: TabName) => void
}

export default function BookTabBar({ activeTab, onTabChange }: BookTabBarProps) {
  return (
    <div
      className="flex gap-1 px-5 mb-6 overflow-x-auto scrollbar-hide"
      style={{ WebkitOverflowScrolling: 'touch' }}
    >
      {TABS.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`flex-shrink-0 px-4 py-2.5 rounded-xl text-[13px] font-semibold whitespace-nowrap transition-all ${
            activeTab === tab.id
              ? 'bg-resumox-accent text-white border border-resumox-accent'
              : 'bg-resumox-surface border border-resumox-border text-resumox-muted hover:border-resumox-accent/40 hover:text-resumox-text'
          }`}
        >
          {tab.emoji} {tab.label}
        </button>
      ))}
    </div>
  )
}
