import { NextResponse } from 'next/server'
import { getSessionFromCookie } from '@/lib/auth'
import { supabaseAdminUntyped as supabase } from '@/lib/supabase'

export async function GET() {
  try {
    const session = await getSessionFromCookie()
    if (!session.valid || !session.user?.email) {
      return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })
    }

    const userEmail = session.user.email

    // Get or create user stats
    let { data: stats } = await supabase
      .from('resumox_user_stats')
      .select('*')
      .eq('user_email', userEmail)
      .single()

    if (!stats) {
      const { data: newStats } = await supabase
        .from('resumox_user_stats')
        .insert({ user_email: userEmail })
        .select()
        .single()
      stats = newStats
    }

    // Calculate streak from daily_activity
    const { data: activities } = await supabase
      .from('resumox_daily_activity')
      .select('activity_date')
      .eq('user_email', userEmail)
      .order('activity_date', { ascending: false })
      .limit(365)

    let currentStreak = 0
    if (activities && activities.length > 0) {
      const today = new Date()
      today.setHours(0, 0, 0, 0)

      const yesterday = new Date(today)
      yesterday.setDate(yesterday.getDate() - 1)

      const firstDate = new Date(activities[0].activity_date)
      firstDate.setHours(0, 0, 0, 0)

      // Streak counts if last activity was today or yesterday
      if (firstDate.getTime() >= yesterday.getTime()) {
        currentStreak = 1
        for (let i = 1; i < activities.length; i++) {
          const prevDate = new Date(activities[i - 1].activity_date)
          const currDate = new Date(activities[i].activity_date)
          const diffDays = (prevDate.getTime() - currDate.getTime()) / (1000 * 60 * 60 * 24)

          if (diffDays === 1) {
            currentStreak++
          } else {
            break
          }
        }
      }
    }

    // Update streak in stats if changed
    if (stats && currentStreak !== stats.current_streak) {
      const longestStreak = Math.max(currentStreak, stats.longest_streak || 0)
      await supabase
        .from('resumox_user_stats')
        .update({
          current_streak: currentStreak,
          longest_streak: longestStreak,
        })
        .eq('user_email', userEmail)

      stats.current_streak = currentStreak
      stats.longest_streak = longestStreak
    }

    // Get recent activity (last 7 days)
    const { data: recentActivity } = await supabase
      .from('resumox_daily_activity')
      .select('*')
      .eq('user_email', userEmail)
      .order('activity_date', { ascending: false })
      .limit(7)

    return NextResponse.json({
      stats: stats || { user_email: userEmail, total_books_completed: 0, total_xp: 0, current_streak: currentStreak },
      recent_activity: recentActivity || [],
    })
  } catch (error) {
    console.error('Stats API error:', error)
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}
