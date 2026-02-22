import { NextResponse } from 'next/server'
import { getSessionFromCookie } from '@/lib/auth'
import { supabaseAdmin } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    // Verificar autenticação
    const { valid, user } = await getSessionFromCookie()

    if (!valid || !user) {
      return NextResponse.json(
        { error: 'Não autenticado' },
        { status: 401 }
      )
    }

    // Buscar avisos enviados e ativos
    const { data: avisos, error: avisosError } = await supabaseAdmin
      .from('avisos')
      .select('*')
      .eq('status', 'sent')
      .eq('is_active', true)
      .order('sent_at', { ascending: false }) as { data: any[] | null, error: any }

    if (avisosError) {
      console.error('Error fetching avisos:', avisosError)
      return NextResponse.json(
        { error: 'Erro ao buscar avisos' },
        { status: 500 }
      )
    }

    // Buscar quais avisos o usuário já leu
    const { data: readRecords, error: readError } = await supabaseAdmin
      .from('aviso_reads')
      .select('aviso_id, read_at, clicked, clicked_at')
      .eq('user_id', user.id) as { data: any[] | null, error: any }

    if (readError) {
      console.error('Error fetching read records:', readError)
      // Não retornar erro, apenas continuar sem os dados de leitura
    }

    // Criar um mapa de avisos lidos
    const readMap = new Map(
      (readRecords || []).map(r => [r.aviso_id, r])
    )

    // Filtrar avisos baseado em targeting (se houver)
    const filteredAvisos = await Promise.all(
      (avisos || []).map(async (aviso: any) => {
        // Se não há targeting, mostrar para todos
        if (!aviso.target_user_ids && !aviso.target_product_ids) {
          const readInfo = readMap.get(aviso.id)
          return {
            ...aviso,
            is_read: !!readInfo,
            read_at: readInfo?.read_at || null,
            clicked: readInfo?.clicked || false,
            clicked_at: readInfo?.clicked_at || null
          }
        }

        // Se tem target_user_ids, verificar se o usuário está na lista
        if (aviso.target_user_ids && Array.isArray(aviso.target_user_ids)) {
          if (aviso.target_user_ids.includes(user.id)) {
            const readInfo = readMap.get(aviso.id)
            return {
              ...aviso,
              is_read: !!readInfo,
              read_at: readInfo?.read_at || null,
              clicked: readInfo?.clicked || false,
              clicked_at: readInfo?.clicked_at || null
            }
          }
        }

        // Se tem target_product_ids, verificar se o usuário tem algum dos produtos
        if (aviso.target_product_ids && Array.isArray(aviso.target_product_ids)) {
          const { data: userProducts } = await supabaseAdmin
            .from('user_products')
            .select('product_id')
            .eq('user_id', user.id)
            .eq('status', 'active')
            .in('product_id', aviso.target_product_ids)

          if (userProducts && userProducts.length > 0) {
            const readInfo = readMap.get(aviso.id)
            return {
              ...aviso,
              is_read: !!readInfo,
              read_at: readInfo?.read_at || null,
              clicked: readInfo?.clicked || false,
              clicked_at: readInfo?.clicked_at || null
            }
          }
        }

        // Usuário não está no target, não mostrar este aviso
        return null
      })
    )

    // Remover avisos null (que não passaram no targeting)
    const userAvisos = filteredAvisos.filter(a => a !== null)

    return NextResponse.json({
      success: true,
      avisos: userAvisos
    })
  } catch (error) {
    console.error('Error in GET /api/avisos:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
