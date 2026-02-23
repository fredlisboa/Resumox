/**
 * Mapeamento de produtos principais para seus order bumps
 *
 * Quando um usuário compra um produto principal, todos os order bumps relacionados
 * são inseridos na tabela user_products com status NULL (locked).
 *
 * Quando o usuário compra um order bump específico, o webhook atualiza o status para 'active'.
 */

export interface OrderBumpConfig {
  product_id: string
  product_name: string
}

export interface MainProductConfig {
  product_id: string
  product_name: string
  order_bumps: OrderBumpConfig[]
}

/**
 * Configuração de produtos principais e seus order bumps relacionados
 */
export const PRODUCT_ORDER_BUMPS_MAP: Record<string, MainProductConfig> = {
  // NeuroReset (produto principal)
  '6844335': {
    product_id: '6844335',
    product_name: 'NeuroReset',
    order_bumps: [
      {
        product_id: '6846443',
        product_name: '🔥 Protocolo de Descompresão Somática - Exclusivo'
      }
      // Adicione outros order bumps do NeuroReset aqui
    ]
  },

  // Kit Inteligencia Emocional (produto principal)
  '6557472': {
    product_id: '6557472',
    product_name: 'Kit Inteligencia Emocional',
    order_bumps: [
      {
        product_id: '6557903',
        product_name: 'Preguntas Poderosas para el Desarrollo Socioemocional'
      },
      {
        product_id: '6558403',
        product_name: 'Ferramentas de Regulacao Emocional'
      },
      {
        product_id: '6558441',
        product_name: 'NeuroAfetividad Infantil'
      },
      {
        product_id: '6558460',
        product_name: 'Order Bump Product 6558460'
      },
      {
        product_id: '6558478',
        product_name: 'Order Bump Product 6558478'
      }
      // Adicione outros order bumps do Kit Inteligencia Emocional aqui
    ]
  },

  // ResumoX (produto principal - sem order bumps)
  // TODO: Substituir RESUMOX_HOTMART_ID pelo ID real do produto na Hotmart
  'RESUMOX_HOTMART_ID': {
    product_id: 'RESUMOX_HOTMART_ID',
    product_name: 'ResumoX',
    order_bumps: []
  }
}

/**
 * Verifica se um product_id é um produto principal (main offer)
 */
export function isMainProduct(productId: string): boolean {
  return productId in PRODUCT_ORDER_BUMPS_MAP
}

/**
 * Retorna os order bumps de um produto principal
 */
export function getOrderBumpsForProduct(productId: string): OrderBumpConfig[] {
  const product = PRODUCT_ORDER_BUMPS_MAP[productId]
  return product ? product.order_bumps : []
}

/**
 * Retorna o produto principal que contém um order bump específico
 */
export function getMainProductForOrderBump(orderBumpId: string): MainProductConfig | null {
  for (const mainProductId in PRODUCT_ORDER_BUMPS_MAP) {
    const product = PRODUCT_ORDER_BUMPS_MAP[mainProductId]
    const hasOrderBump = product.order_bumps.some(ob => ob.product_id === orderBumpId)
    if (hasOrderBump) {
      return product
    }
  }
  return null
}
