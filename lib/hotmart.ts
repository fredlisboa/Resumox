/**
 * Hotmart API Client
 *
 * Provides methods to interact with Hotmart's REST API for:
 * - Authentication (OAuth2)
 * - Sales data retrieval
 * - Subscriber management
 * - Product information
 * - Transaction details
 */

// ==================== TypeScript Types ====================

export interface HotmartConfig {
  clientId: string
  clientSecret: string
  basicToken: string
  baseUrl?: string
}

export interface HotmartAuthResponse {
  access_token: string
  token_type: string
  expires_in: number
  scope: string
  refresh_token?: string
}

export interface HotmartSubscriber {
  subscriber_code: string
  name: string
  email: string
  phone?: string
  status: 'ACTIVE' | 'INACTIVE' | 'CANCELLED' | 'DELAYED'
  accession_date: string
  plan_name: string
  product: {
    id: number
    name: string
  }
}

export interface HotmartTransaction {
  transaction: string
  transaction_ext: string
  status: string
  product: {
    id: number
    name: string
  }
  buyer: {
    name: string
    email: string
    phone?: string
  }
  purchase: {
    order_date: string
    price: {
      value: number
      currency_code: string
    }
    status: string
  }
}

export interface HotmartSalesHistoryParams {
  start_date?: string // Format: YYYY-MM-DD
  end_date?: string   // Format: YYYY-MM-DD
  transaction_status?: 'APPROVED' | 'COMPLETE' | 'CANCELLED' | 'REFUNDED' | 'CHARGEBACK'
  max_results?: number
  page_token?: string
}

export interface HotmartSalesHistoryResponse {
  items: HotmartTransaction[]
  page_info: {
    total_results: number
    results_per_page: number
  }
  next_page_token?: string
}

export interface HotmartSubscribersParams {
  product_id?: number
  subscriber_status?: 'ACTIVE' | 'INACTIVE' | 'CANCELLED' | 'DELAYED'
  accession_date?: string
  max_results?: number
  page_token?: string
}

export interface HotmartSubscribersResponse {
  items: HotmartSubscriber[]
  page_info: {
    total_results: number
    results_per_page: number
  }
  next_page_token?: string
}

// ==================== Hotmart API Client ====================

export class HotmartClient {
  private config: Required<HotmartConfig>
  private accessToken: string | null = null
  private tokenExpiresAt: number | null = null
  private authUrl = 'https://api-sec-vlc.hotmart.com'

  constructor(config: HotmartConfig) {
    this.config = {
      ...config,
      baseUrl: config.baseUrl || 'https://developers.hotmart.com',
    }
  }

  /**
   * Authenticates with Hotmart API using OAuth2 Client Credentials flow
   * Caches the access token until it expires
   */
  private async authenticate(): Promise<string> {
    // Return cached token if still valid (with 5-minute buffer)
    if (this.accessToken && this.tokenExpiresAt && Date.now() < this.tokenExpiresAt - 300000) {
      return this.accessToken
    }

    // Hotmart uses form-urlencoded for OAuth2
    const params = new URLSearchParams({
      grant_type: 'client_credentials',
    })

    const response = await fetch(`${this.authUrl}/security/oauth/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json',
        'Authorization': `Basic ${this.config.basicToken}`,
      },
      body: params.toString(),
    })

    const responseText = await response.text()

    if (!response.ok) {
      throw new Error(
        `Hotmart authentication failed: ${response.status} ${response.statusText}\n` +
        `Response: ${responseText}\n` +
        `URL: ${this.authUrl}/security/oauth/token`
      )
    }

    if (!responseText || responseText.trim() === '') {
      throw new Error(
        `Hotmart authentication returned empty response.\n` +
        `Status: ${response.status}\n` +
        `This might indicate:\n` +
        `1. Invalid credentials\n` +
        `2. Wrong API endpoint\n` +
        `3. Account not activated for API access`
      )
    }

    let data: HotmartAuthResponse
    try {
      data = JSON.parse(responseText)
    } catch (error) {
      throw new Error(
        `Failed to parse Hotmart auth response:\n` +
        `Status: ${response.status}\n` +
        `Response: ${responseText}`
      )
    }

    this.accessToken = data.access_token
    this.tokenExpiresAt = Date.now() + (data.expires_in * 1000)

    return this.accessToken
  }

  /**
   * Makes an authenticated request to the Hotmart API
   */
  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const token = await this.authenticate()

    const response = await fetch(`${this.config.baseUrl}${endpoint}`, {
      ...options,
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        ...options.headers,
      },
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`Hotmart API request failed: ${response.status} - ${errorText}`)
    }

    return response.json()
  }

  /**
   * Retrieves sales history with optional filters
   *
   * @param params - Filter parameters for sales history
   * @returns Sales history response with transactions
   */
  async getSalesHistory(params?: HotmartSalesHistoryParams): Promise<HotmartSalesHistoryResponse> {
    const queryParams = new URLSearchParams()

    if (params?.start_date) queryParams.append('start_date', params.start_date)
    if (params?.end_date) queryParams.append('end_date', params.end_date)
    if (params?.transaction_status) queryParams.append('transaction_status', params.transaction_status)
    if (params?.max_results) queryParams.append('max_results', params.max_results.toString())
    if (params?.page_token) queryParams.append('page_token', params.page_token)

    const endpoint = `/payments/api/v1/sales/history?${queryParams.toString()}`
    return this.makeRequest<HotmartSalesHistoryResponse>(endpoint)
  }

  /**
   * Retrieves all subscribers with optional filters
   *
   * @param params - Filter parameters for subscribers
   * @returns Subscribers response
   */
  async getSubscribers(params?: HotmartSubscribersParams): Promise<HotmartSubscribersResponse> {
    const queryParams = new URLSearchParams()

    if (params?.product_id) queryParams.append('product_id', params.product_id.toString())
    if (params?.subscriber_status) queryParams.append('subscriber_status', params.subscriber_status)
    if (params?.accession_date) queryParams.append('accession_date', params.accession_date)
    if (params?.max_results) queryParams.append('max_results', params.max_results.toString())
    if (params?.page_token) queryParams.append('page_token', params.page_token)

    const endpoint = `/payments/api/v1/subscriptions?${queryParams.toString()}`
    return this.makeRequest<HotmartSubscribersResponse>(endpoint)
  }

  /**
   * Retrieves details of a specific subscriber by subscriber code
   *
   * @param subscriberCode - The unique subscriber code
   * @returns Subscriber details
   */
  async getSubscriberDetails(subscriberCode: string): Promise<HotmartSubscriber> {
    const endpoint = `/payments/api/v1/subscriptions/${subscriberCode}`
    return this.makeRequest<HotmartSubscriber>(endpoint)
  }

  /**
   * Retrieves details of a specific transaction
   *
   * @param transaction - The transaction ID
   * @returns Transaction details
   */
  async getTransactionDetails(transaction: string): Promise<HotmartTransaction> {
    const endpoint = `/payments/api/v1/sales/transaction/${transaction}`
    return this.makeRequest<HotmartTransaction>(endpoint)
  }

  /**
   * Retrieves summary of sales for a specific period
   *
   * @param startDate - Start date (YYYY-MM-DD)
   * @param endDate - End date (YYYY-MM-DD)
   * @returns Sales summary data
   */
  async getSalesSummary(startDate: string, endDate: string): Promise<any> {
    const endpoint = `/payments/api/v1/sales/summary?start_date=${startDate}&end_date=${endDate}`
    return this.makeRequest(endpoint)
  }

  /**
   * Validates if subscriber has active access
   *
   * @param subscriberCode - The unique subscriber code
   * @returns Boolean indicating if subscriber has active access
   */
  async validateSubscriberAccess(subscriberCode: string): Promise<boolean> {
    try {
      const subscriber = await this.getSubscriberDetails(subscriberCode)
      return subscriber.status === 'ACTIVE'
    } catch (error) {
      console.error('Error validating subscriber access:', error)
      return false
    }
  }
}

// ==================== Singleton Instance ====================

/**
 * Default Hotmart client instance configured with environment variables
 * Use this for most operations unless you need a custom configuration
 */
export const hotmart = new HotmartClient({
  clientId: process.env.HOTMART_CLIENT_ID || '',
  clientSecret: process.env.HOTMART_CLIENT_SECRET || '',
  basicToken: process.env.HOTMART_BASIC_TOKEN || '',
})

// ==================== Helper Functions ====================

/**
 * Formats a Date object to YYYY-MM-DD format for Hotmart API
 *
 * @param date - Date to format
 * @returns Formatted date string
 */
export function formatDateForHotmart(date: Date): string {
  return date.toISOString().split('T')[0]
}

/**
 * Gets date range for common periods
 *
 * @param period - Period identifier
 * @returns Object with start_date and end_date
 */
export function getDateRange(period: 'today' | 'yesterday' | 'last7days' | 'last30days' | 'thisMonth'): {
  start_date: string
  end_date: string
} {
  const now = new Date()
  const today = formatDateForHotmart(now)

  switch (period) {
    case 'today':
      return { start_date: today, end_date: today }

    case 'yesterday': {
      const yesterday = new Date(now)
      yesterday.setDate(yesterday.getDate() - 1)
      const formattedYesterday = formatDateForHotmart(yesterday)
      return { start_date: formattedYesterday, end_date: formattedYesterday }
    }

    case 'last7days': {
      const weekAgo = new Date(now)
      weekAgo.setDate(weekAgo.getDate() - 7)
      return { start_date: formatDateForHotmart(weekAgo), end_date: today }
    }

    case 'last30days': {
      const monthAgo = new Date(now)
      monthAgo.setDate(monthAgo.getDate() - 30)
      return { start_date: formatDateForHotmart(monthAgo), end_date: today }
    }

    case 'thisMonth': {
      const firstDay = new Date(now.getFullYear(), now.getMonth(), 1)
      return { start_date: formatDateForHotmart(firstDay), end_date: today }
    }

    default:
      return { start_date: today, end_date: today }
  }
}
