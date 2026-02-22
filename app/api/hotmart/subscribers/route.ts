import { NextResponse } from 'next/server'
import { hotmart } from '@/lib/hotmart'

/**
 * GET /api/hotmart/subscribers
 *
 * Retrieves subscriber data from Hotmart API
 *
 * Query Parameters:
 * - status: 'ACTIVE' | 'INACTIVE' | 'CANCELLED' | 'DELAYED'
 * - product_id: number (optional)
 * - limit: number (max results to return)
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status') as any
    const product_id = searchParams.get('product_id')
    const limit = parseInt(searchParams.get('limit') || '10')

    // Fetch subscribers from Hotmart
    const subscribersResponse = await hotmart.getSubscribers({
      subscriber_status: status || 'ACTIVE',
      product_id: product_id ? parseInt(product_id) : undefined,
      max_results: limit,
    })

    return NextResponse.json({
      success: true,
      total_results: subscribersResponse.page_info.total_results,
      subscribers: subscribersResponse.items,
      next_page_token: subscribersResponse.next_page_token,
    })
  } catch (error: any) {
    console.error('Error fetching Hotmart subscribers:', error)

    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to fetch subscribers data',
      },
      { status: 500 }
    )
  }
}
