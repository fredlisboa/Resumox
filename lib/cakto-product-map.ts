/**
 * Mapeamento de produtos Cakto para produtos de conteúdo
 *
 * O Cakto usa UUIDs para identificar produtos, mas nosso conteúdo
 * está armazenado sob os IDs numéricos do Hotmart.
 * Este mapa converte IDs de produtos Cakto para os IDs de conteúdo corretos.
 */

export interface CaktoProductConfig {
  cakto_product_id: string
  cakto_product_name: string
  content_product_id: string
  content_product_name: string
  dashboard_route: string
  language: 'pt-BR' | 'es' | 'en'
}

/**
 * Mapeamento de produtos Cakto para produtos de conteúdo
 *
 * Ao adicionar um novo produto Cakto:
 * 1. Adicione a entrada aqui com o UUID do produto Cakto
 * 2. Especifique o content_product_id que contém o conteúdo correto
 * 3. Certifique-se de que a rota está configurada em PRODUCT_ROUTES_MAP
 */
export const CAKTO_PRODUCT_MAP: Record<string, CaktoProductConfig> = {
  // Kit Sono Infantil - PT-BR (Cakto - Produção)
  'ee5a7622-4cf9-476c-96e6-b0a865bb08cd': {
    cakto_product_id: 'ee5a7622-4cf9-476c-96e6-b0a865bb08cd',
    cakto_product_name: 'Kit Sono Infantil',
    content_product_id: '7065534',
    content_product_name: 'Kit Sono Infantil',
    dashboard_route: '/sono-infantil/dashboard',
    language: 'pt-BR'
  },

  // Kit Sono Infantil - PT-BR (Cakto - Teste)
  'ff3fdf61-e88f-43b5-982a-32d50f112414': {
    cakto_product_id: 'ff3fdf61-e88f-43b5-982a-32d50f112414',
    cakto_product_name: 'Produto Teste',
    content_product_id: '7065534',
    content_product_name: 'Kit Sono Infantil',
    dashboard_route: '/sono-infantil/dashboard',
    language: 'pt-BR'
  }

  // Adicione novos produtos Cakto aqui seguindo o mesmo padrão
  // Exemplo:
  // 'uuid-do-produto-cakto': {
  //   cakto_product_id: 'uuid-do-produto-cakto',
  //   cakto_product_name: 'Nome no Cakto',
  //   content_product_id: '1234567',
  //   content_product_name: 'Nome do Conteúdo',
  //   dashboard_route: '/rota/dashboard',
  //   language: 'pt-BR'
  // }
}

/**
 * Obtém a configuração de um produto Cakto
 */
export function getCaktoProductConfig(caktoProductId: string): CaktoProductConfig | null {
  return CAKTO_PRODUCT_MAP[caktoProductId] || null
}

/**
 * Converte um ID de produto Cakto para o ID de conteúdo correspondente
 * Se não encontrar mapeamento, retorna o próprio ID (fallback)
 */
export function getCaktoContentProductId(caktoProductId: string): string {
  const config = CAKTO_PRODUCT_MAP[caktoProductId]
  return config ? config.content_product_id : caktoProductId
}

/**
 * Obtém o nome do produto de conteúdo para um produto Cakto
 */
export function getCaktoContentProductName(caktoProductId: string): string | null {
  const config = CAKTO_PRODUCT_MAP[caktoProductId]
  return config ? config.content_product_name : null
}

/**
 * Verifica se um produto Cakto está mapeado
 */
export function isCaktoProductMapped(caktoProductId: string): boolean {
  return caktoProductId in CAKTO_PRODUCT_MAP
}
