import { NextResponse } from 'next/server'
import { hotmart, getDateRange } from '@/lib/hotmart'

/**
 * GET /api/hotmart/sales
 *
 * Retrieves sales data from Hotmart API
 *
 * Query Parameters:
 * - period: 'today' | 'yesterday' | 'last7days' | 'last30days' | 'thisMonth'
 * - status: 'APPROVED' | 'COMPLETE' | 'CANCELLED' | 'REFUNDED' | 'CHARGEBACK'
 * - limit: number (max results to return)
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const period = (searchParams.get('period') as any) || 'last7days'
    const status = searchParams.get('status') as any
    const limit = parseInt(searchParams.get('limit') || '10')

    // Get date range for the period
    const { start_date, end_date } = getDateRange(period)

    // Fetch sales from Hotmart
    const salesResponse = await hotmart.getSalesHistory({
      start_date,
      end_date,
      transaction_status: status,
      max_results: limit,
    })

    return NextResponse.json({
      success: true,
      period: {
        start_date,
        end_date,
      },
      total_results: salesResponse.page_info.total_results,
      sales: salesResponse.items,
      next_page_token: salesResponse.next_page_token,
    })
  } catch (error: any) {
    console.error('Error fetching Hotmart sales:', error)

    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to fetch sales data',
      },
      { status: 500 }
    )
  }
}
