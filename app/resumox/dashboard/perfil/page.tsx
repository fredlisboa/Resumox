'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { BookOpen, Flame, Trophy, Zap, LogOut } from 'lucide-react'
import ResumoxNav from '@/components/resumox/ResumoxNav'
import StatsCard from '@/components/resumox/StatsCard'
import type { ResumoxUserStats, ResumoxDailyActivity } from '@/lib/resumox-types'

export default function PerfilPage() {
  const router = useRouter()
  const [stats, setStats] = useState<ResumoxUserStats | null>(null)
  const [recentActivity, setRecentActivity] = useState<ResumoxDailyActivity[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch('/api/resumox/stats')
        if (res.ok) {
          const data = await res.json()
          setStats(data.stats)
          setRecentActivity(data.recent_activity || [])
        }
      } catch {
        // ignore
      } finally {
        setLoading(false)
      }
    }
    fetchStats()
  }, [])

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
      router.push('/resumox')
    } catch {
      // ignore
    }
  }

  return (
    <>
      <ResumoxNav showBack streak={stats?.current_streak || 0} />

      <main className="max-w-lg mx-auto px-4 py-6 pb-24">
        <h1 className="text-xl font-extrabold text-resumox-text mb-6">Meu Perfil</h1>

        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-resumox-accent border-t-transparent" />
          </div>
        ) : (
          <>
            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              <StatsCard
                icon={<BookOpen className="w-6 h-6" />}
                value={stats?.total_books_completed || 0}
                label="Livros Completos"
                color="#00D68F"
              />
              <StatsCard
                icon={<Zap className="w-6 h-6" />}
                value={stats?.total_xp || 0}
                label="XP Total"
                color="#A29BFE"
              />
              <StatsCard
                icon={<Flame className="w-6 h-6" />}
                value={stats?.current_streak || 0}
                label="Streak Atual"
                color="#F0C040"
              />
              <StatsCard
                icon={<Trophy className="w-6 h-6" />}
                value={stats?.longest_streak || 0}
                label="Maior Streak"
                color="#FFA94D"
              />
            </div>

            {/* Recent Activity */}
            {recentActivity.length > 0 && (
              <section className="mb-6">
                <h2 className="text-sm font-bold text-resumox-accent-light uppercase tracking-wide mb-3">
                  Atividade Recente
                </h2>
                <div className="space-y-2">
                  {recentActivity.map((activity) => (
                    <div
                      key={activity.id}
                      className="flex items-center justify-between bg-resumox-surface border border-resumox-border rounded-xl px-4 py-3"
                    >
                      <span className="text-xs text-resumox-muted">
                        {new Date(activity.activity_date).toLocaleDateString('pt-BR', {
                          weekday: 'short',
                          day: 'numeric',
                          month: 'short',
                        })}
                      </span>
                      <div className="flex items-center gap-3">
                        {activity.books_completed > 0 && (
                          <span className="text-[10px] text-resumox-green font-semibold">
                            {activity.books_completed} completo{activity.books_completed > 1 ? 's' : ''}
                          </span>
                        )}
                        {activity.xp_earned > 0 && (
                          <span className="text-[10px] text-resumox-accent-light font-semibold">
                            +{activity.xp_earned} XP
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Logout */}
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 py-3 bg-resumox-surface border border-resumox-border rounded-2xl text-resumox-red text-sm font-semibold hover:border-resumox-red/40 transition-all"
            >
              <LogOut className="w-4 h-4" />
              Sair da Conta
            </button>
          </>
        )}
      </main>
    </>
  )
}
