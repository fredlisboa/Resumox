// ══════════════════════════════════════════════════════════
// ResumoX — TypeScript types for book summaries product
// ══════════════════════════════════════════════════════════

// ── Database row types ──

export interface ResumoxBook {
  id: string
  slug: string
  title: string
  original_title: string | null
  author: string
  year: number | null
  category_slug: string
  category_label: string
  category_emoji: string
  reading_time_min: number
  audio_duration_min: number | null
  audio_r2_key: string | null
  pdf_r2_key: string | null
  mindmap_image_r2_key: string | null
  cover_gradient_from: string
  cover_gradient_to: string
  cover_image_r2_key: string | null
  rating_avg: number
  rating_count: number
  is_featured: boolean
  is_published: boolean
  sort_order: number
  created_at: string
  updated_at: string
}

export interface ResumoxBookContent {
  id: string
  book_id: string
  summary_html: string
  mindmap_json: MindMapData | null
  insights_json: InsightData[] | null
  exercises_json: ExerciseData[] | null
  created_at: string
  updated_at: string
}

export interface ResumoxCategory {
  slug: string
  label: string
  emoji: string
  sort_order: number
  book_count: number
  created_at: string
}

export interface ResumoxUserProgress {
  id: string
  user_email: string
  book_id: string
  status: 'not_started' | 'in_progress' | 'completed'
  current_tab: TabName
  progress_pct: number
  rating: number | null
  completed_at: string | null
  xp_earned: number
  checklist_state: ChecklistState
  audio_position_sec: number
  created_at: string
  updated_at: string
}

export interface ResumoxUserStats {
  user_email: string
  total_books_completed: number
  total_xp: number
  current_streak: number
  longest_streak: number
  last_activity_date: string | null
  favorite_category: string | null
  total_audio_minutes: number
  created_at: string
  updated_at: string
}

export interface ResumoxSavedInsight {
  id: string
  user_email: string
  book_id: string
  insight_text: string
  insight_source: string | null
  saved_at: string
}

export interface ResumoxDailyActivity {
  id: string
  user_email: string
  activity_date: string
  books_opened: number
  books_completed: number
  xp_earned: number
  audio_minutes: number
  created_at: string
}

// ── JSONB column types ──

export interface MindMapData {
  center_label: string
  center_sublabel: string
  branches: MindMapBranch[]
}

export interface MindMapBranch {
  title: string
  icon: string
  items: string[]
  full_width?: boolean
}

export interface InsightData {
  text: string
  source_chapter: string
}

export interface ExerciseData {
  title: string
  icon: string
  color_theme: 'accent' | 'green' | 'orange'
  description: string
  template_text?: string
  checklist: string[]
}

export interface ChecklistState {
  [exerciseKey: string]: boolean[]
}

// ── Shared types ──

export type TabName = 'resumo' | 'audio' | 'mindmap' | 'insights' | 'pratica'

export const TAB_PROGRESS_MAP: Record<TabName, number> = {
  resumo: 25,
  audio: 50,
  mindmap: 70,
  insights: 85,
  pratica: 95,
}

export const TABS: { id: TabName; label: string; emoji: string }[] = [
  { id: 'resumo', label: 'Resumo', emoji: '📖' },
  { id: 'audio', label: 'Áudio', emoji: '🎧' },
  { id: 'mindmap', label: 'Mind Map', emoji: '🧠' },
  { id: 'insights', label: 'Insights', emoji: '💡' },
  { id: 'pratica', label: 'Prática', emoji: '✅' },
]

export const STEP_LABELS = ['Início', 'Leitura', 'Áudio', 'Mind Map', 'Praticar']

// ── API response types ──

export interface BookWithContent extends ResumoxBook {
  content: ResumoxBookContent | null
}

export interface BookWithProgress extends ResumoxBook {
  progress?: ResumoxUserProgress | null
}

export interface BookDetailResponse {
  book: ResumoxBook
  content: ResumoxBookContent | null
  progress: ResumoxUserProgress | null
  related_books: ResumoxBook[]
}

export interface BooksListResponse {
  books: BookWithProgress[]
  total: number
  page: number
  has_more: boolean
}

export interface UserStatsResponse {
  stats: ResumoxUserStats
  recent_activity: ResumoxDailyActivity[]
}

// ── Trail types ──

export interface ResumoxTrail {
  id: string
  slug: string
  title: string
  description: string
  emoji: string
  cover_gradient_from: string
  cover_gradient_to: string
  sort_order: number
  is_published: boolean
  created_at: string
}

export interface ResumoxTrailBook {
  trail_id: string
  book_id: string
  position: number
}

export interface TrailWithBooks extends ResumoxTrail {
  books: BookWithProgress[]
  total_books: number
  completed_books: number
}

export interface TrailsListResponse {
  trails: TrailWithBooks[]
}
