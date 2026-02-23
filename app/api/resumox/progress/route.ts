import { NextRequest, NextResponse } from 'next/server'
import { getSessionFromCookie } from '@/lib/auth'
import { supabaseAdminUntyped as supabase } from '@/lib/supabase'
import { TAB_PROGRESS_MAP, type TabName } from '@/lib/resumox-types'

export async function GET(request: NextRequest) {
  try {
    const session = await getSessionFromCookie()
    if (!session.valid || !session.user?.email) {
      return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const bookId = searchParams.get('book_id')

    let query = supabase
      .from('resumox_user_progress')
      .select('*')
      .eq('user_email', session.user.email)

    if (bookId) {
      query = query.eq('book_id', bookId)
    }

    const { data, error } = await query

    if (error) {
      console.error('Error fetching progress:', error)
      return NextResponse.json({ error: 'Erro ao buscar progresso' }, { status: 500 })
    }

    return NextResponse.json({ progress: bookId ? (data?.[0] || null) : data })
  } catch (error) {
    console.error('Progress GET error:', error)
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSessionFromCookie()
    if (!session.valid || !session.user?.email) {
      return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })
    }

    const userEmail = session.user.email
    const body = await request.json()
    const { book_id, tab, audio_position_sec, checklist_state, mark_complete } = body

    if (!book_id) {
      return NextResponse.json({ error: 'book_id é obrigatório' }, { status: 400 })
    }

    // Get or create progress record
    const { data: existing } = await supabase
      .from('resumox_user_progress')
      .select('*')
      .eq('user_email', userEmail)
      .eq('book_id', book_id)
      .single()

    const updates: Record<string, any> = {
      user_email: userEmail,
      book_id,
    }

    // Update tab and progress
    if (tab && TAB_PROGRESS_MAP[tab as TabName] !== undefined) {
      updates.current_tab = tab
      const tabProgress = TAB_PROGRESS_MAP[tab as TabName]
      const currentProgress = existing?.progress_pct || 0
      if (tabProgress > currentProgress) {
        updates.progress_pct = tabProgress
      }
      if (!existing || existing.status === 'not_started') {
        updates.status = 'in_progress'
      }
    }

    // Update audio position
    if (audio_position_sec !== undefined) {
      updates.audio_position_sec = audio_position_sec
    }

    // Update checklist state and award XP per checkbox (+2 XP each)
    let checklistXpDelta = 0
    if (checklist_state !== undefined) {
      updates.checklist_state = checklist_state

      // Count total checked items across all exercises
      let totalChecked = 0
      let totalItems = 0
      for (const key of Object.keys(checklist_state)) {
        const items = checklist_state[key] as boolean[]
        if (Array.isArray(items)) {
          totalItems += items.length
          totalChecked += items.filter(Boolean).length
        }
      }

      // Count previously checked items
      let prevChecked = 0
      if (existing?.checklist_state) {
        for (const key of Object.keys(existing.checklist_state)) {
          const items = existing.checklist_state[key] as boolean[]
          if (Array.isArray(items)) {
            prevChecked += items.filter(Boolean).length
          }
        }
      }

      // XP = 2 per checked item (absolute, not incremental)
      const newChecklistXp = totalChecked * 2
      const prevChecklistXp = prevChecked * 2
      checklistXpDelta = newChecklistXp - prevChecklistXp

      // Base XP = completion XP (10 if completed) + checklist XP
      const completionXp = existing?.status === 'completed' ? 10 : 0
      updates.xp_earned = completionXp + newChecklistXp

      // Update progress_pct: if user has reached pratica tab (>=95%), scale 95→100 by checklist ratio
      const currentProgress = existing?.progress_pct || 0
      if (currentProgress >= 95 && totalItems > 0 && !mark_complete) {
        updates.progress_pct = Math.round(95 + (totalChecked / totalItems) * 5)
      }
    }

    // Mark as complete
    if (mark_complete) {
      updates.status = 'completed'
      updates.progress_pct = 100
      updates.completed_at = new Date().toISOString()
      // Completion awards +10 XP on top of any checklist XP
      const currentChecklistXp = updates.xp_earned ?? (existing?.xp_earned || 0)
      updates.xp_earned = currentChecklistXp + 10
    }

    // Upsert progress
    const { data: progress, error } = await supabase
      .from('resumox_user_progress')
      .upsert(
        existing ? { id: existing.id, ...updates } : updates,
        { onConflict: 'user_email,book_id' }
      )
      .select()
      .single()

    if (error) {
      console.error('Error updating progress:', error)
      return NextResponse.json({ error: 'Erro ao atualizar progresso' }, { status: 500 })
    }

    // If marked complete, update user stats and daily activity
    if (mark_complete) {
      // Upsert user stats
      const { data: stats } = await supabase
        .from('resumox_user_stats')
        .select('*')
        .eq('user_email', userEmail)
        .single()

      if (stats) {
        await supabase
          .from('resumox_user_stats')
          .update({
            total_books_completed: stats.total_books_completed + 1,
            total_xp: stats.total_xp + 10,
            last_activity_date: new Date().toISOString().split('T')[0],
          })
          .eq('user_email', userEmail)
      } else {
        await supabase
          .from('resumox_user_stats')
          .insert({
            user_email: userEmail,
            total_books_completed: 1,
            total_xp: 10,
            last_activity_date: new Date().toISOString().split('T')[0],
          })
      }

      // Upsert daily activity
      const today = new Date().toISOString().split('T')[0]
      const { data: dailyActivity } = await supabase
        .from('resumox_daily_activity')
        .select('*')
        .eq('user_email', userEmail)
        .eq('activity_date', today)
        .single()

      if (dailyActivity) {
        await supabase
          .from('resumox_daily_activity')
          .update({
            books_completed: dailyActivity.books_completed + 1,
            xp_earned: dailyActivity.xp_earned + 10,
          })
          .eq('id', dailyActivity.id)
      } else {
        await supabase
          .from('resumox_daily_activity')
          .insert({
            user_email: userEmail,
            activity_date: today,
            books_completed: 1,
            xp_earned: 10,
          })
      }
    }

    // Update stats/activity for checklist XP changes
    if (checklistXpDelta !== 0 && !mark_complete) {
      const today = new Date().toISOString().split('T')[0]

      const { data: stats } = await supabase
        .from('resumox_user_stats')
        .select('*')
        .eq('user_email', userEmail)
        .single()

      if (stats) {
        await supabase
          .from('resumox_user_stats')
          .update({
            total_xp: Math.max(0, stats.total_xp + checklistXpDelta),
            last_activity_date: today,
          })
          .eq('user_email', userEmail)
      } else {
        await supabase
          .from('resumox_user_stats')
          .insert({
            user_email: userEmail,
            total_xp: Math.max(0, checklistXpDelta),
            last_activity_date: today,
          })
      }

      // Update daily activity XP
      const { data: dailyActivity } = await supabase
        .from('resumox_daily_activity')
        .select('*')
        .eq('user_email', userEmail)
        .eq('activity_date', today)
        .single()

      if (dailyActivity) {
        await supabase
          .from('resumox_daily_activity')
          .update({
            xp_earned: Math.max(0, dailyActivity.xp_earned + checklistXpDelta),
          })
          .eq('id', dailyActivity.id)
      } else {
        await supabase
          .from('resumox_daily_activity')
          .insert({
            user_email: userEmail,
            activity_date: today,
            xp_earned: Math.max(0, checklistXpDelta),
          })
      }
    }

    // Log daily activity for tab visits (for streak)
    if (tab && !mark_complete) {
      const today = new Date().toISOString().split('T')[0]
      await supabase
        .from('resumox_daily_activity')
        .upsert(
          {
            user_email: userEmail,
            activity_date: today,
            books_opened: 1,
          },
          { onConflict: 'user_email,activity_date' }
        )

      // Update last_activity_date in stats
      await supabase
        .from('resumox_user_stats')
        .upsert(
          {
            user_email: userEmail,
            last_activity_date: today,
          },
          { onConflict: 'user_email' }
        )
    }

    return NextResponse.json({ progress })
  } catch (error) {
    console.error('Progress POST error:', error)
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}
