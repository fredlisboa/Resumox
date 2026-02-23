/**
 * Mapeamento centralizado de rotas por produto
 *
 * Este arquivo define as rotas de login e dashboard para cada produto.
 * Ao adicionar um novo produto, basta adicionar uma entrada aqui.
 */

export interface ProductRouteConfig {
  product_id: string
  product_name: string
  login_route: string
  dashboard_route: string
  theme: 'dark' | 'light'
  description?: string
}

/**
 * Configuração de rotas para todos os produtos
 *
 * Ao adicionar um novo produto:
 * 1. Adicione uma nova entrada neste objeto
 * 2. Crie a estrutura de pastas correspondente em /app
 * 3. As rotas serão automaticamente configuradas
 */
export const PRODUCT_ROUTES_MAP: Record<string, ProductRouteConfig> = {
  // NeuroReset - Produto Original
  '6844335': {
    product_id: '6844335',
    product_name: 'NeuroReset',
    login_route: '/neuroreset',
    dashboard_route: '/dashboard',
    theme: 'dark',
    description: 'Reprogramação mental com neurociência acústica'
  },

  // Kit Inteligência Emocional
  '6557472': {
    product_id: '6557472',
    product_name: 'Kit Inteligência Emocional',
    login_route: '/iemocional',
    dashboard_route: '/iemocional/dashboard',
    theme: 'light',
    description: '13 recursos visuais para gestão emocional'
  },

  // Kit Sono Infantil - Hotmart
  '7065534': {
    product_id: '7065534',
    product_name: 'Kit Sono Infantil',
    login_route: '/sueno-infantil',
    dashboard_route: '/sueno-infantil/dashboard',
    theme: 'dark',
    description: 'Guias e áudios para o sono do bebê'
  },

  // Kit Sono Infantil - PT-BR version (Cakto - Produção)
  'ee5a7622-4cf9-476c-96e6-b0a865bb08cd': {
    product_id: 'ee5a7622-4cf9-476c-96e6-b0a865bb08cd',
    product_name: 'Kit Sono Infantil',
    login_route: '/sono-infantil',
    dashboard_route: '/sono-infantil/dashboard',
    theme: 'dark',
    description: 'Guias e áudios para o sono do bebê (PT-BR)'
  },

  // Kit Sono Infantil - PT-BR version (Cakto - Teste)
  'ff3fdf61-e88f-43b5-982a-32d50f112414': {
    product_id: 'ff3fdf61-e88f-43b5-982a-32d50f112414',
    product_name: 'Kit Sono Infantil',
    login_route: '/sono-infantil',
    dashboard_route: '/sono-infantil/dashboard',
    theme: 'dark',
    description: 'Guias e áudios para o sono do bebê (PT-BR) - Teste'
  },

  // NutriChá - PT-BR (product_id temporário, atualizar quando tiver o ID real)
  '49b310d8-e59a-4aed-9f12-dbba39891b27': {
    product_id: '49b310d8-e59a-4aed-9f12-dbba39891b27',
    product_name: 'NutriChá',
    login_route: '/nutricha',
    dashboard_route: '/nutricha/dashboard',
    theme: 'light',
    description: 'Receita personalizada do NutriChá para emagrecimento natural (PT-BR)'
  },

  // Resumox - PT-BR (product_id placeholder, atualizar com o ID real da Hotmart)
  'RESUMOX_HOTMART_ID': {
    product_id: 'RESUMOX_HOTMART_ID',
    product_name: 'Resumox',
    login_route: '/resumox',
    dashboard_route: '/resumox/dashboard',
    theme: 'dark',
    description: '659 resumos de livros com áudio, mapa mental, insights e exercícios práticos'
  }
}

/**
 * Retorna a configuração de rotas para um product_id
 */
export function getProductRoutes(productId: string): ProductRouteConfig | null {
  return PRODUCT_ROUTES_MAP[productId] || null
}

/**
 * Retorna a rota de dashboard para um product_id
 * Se o produto não for encontrado, retorna a rota padrão do NeuroReset
 */
export function getDashboardRoute(productId: string): string {
  const config = PRODUCT_ROUTES_MAP[productId]
  return config ? config.dashboard_route : '/dashboard'
}

/**
 * Retorna a rota de login para um product_id
 * Se o produto não for encontrado, retorna a rota padrão do NeuroReset
 */
export function getLoginRoute(productId: string): string {
  const config = PRODUCT_ROUTES_MAP[productId]
  return config ? config.login_route : '/neuroreset'
}

/**
 * Verifica se um product_id está configurado no sistema
 */
export function isProductConfigured(productId: string): boolean {
  return productId in PRODUCT_ROUTES_MAP
}

/**
 * Retorna todos os product_ids configurados
 */
export function getAllProductIds(): string[] {
  return Object.keys(PRODUCT_ROUTES_MAP)
}

/**
 * Retorna todas as configurações de produtos
 */
export function getAllProductConfigs(): ProductRouteConfig[] {
  return Object.values(PRODUCT_ROUTES_MAP)
}

/**
 * Encontra um produto pela rota de login
 * Útil para identificar qual produto está sendo acessado
 */
export function getProductByLoginRoute(loginRoute: string): ProductRouteConfig | null {
  return Object.values(PRODUCT_ROUTES_MAP).find(
    config => config.login_route === loginRoute
  ) || null
}

/**
 * Encontra um produto pela rota de dashboard
 * Útil para identificar qual produto está sendo acessado
 */
export function getProductByDashboardRoute(dashboardRoute: string): ProductRouteConfig | null {
  return Object.values(PRODUCT_ROUTES_MAP).find(
    config => config.dashboard_route === dashboardRoute
  ) || null
}
