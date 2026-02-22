// Configuração de Order Bumps
// URL de checkout padrão para conteúdos marcados como order_bump

// URL padrão de fallback caso o product_id não seja encontrado
export const DEFAULT_ORDER_BUMP_CHECKOUT_URL = 'https://pay.hotmart.com/B102739272B'

// Mapeamento de product_id para URL de checkout
// IMPORTANTE: As chaves devem corresponder exatamente aos product_id no banco de dados
export const ORDER_BUMP_CHECKOUT_URLS: Record<string, string> = {
  // Protocolo de Descompresión Somática
  '6846443': 'https://pay.hotmart.com/G103491432B',

  // Preguntas Poderosas para el Desarrollo Socioemocional
  '6557903': 'https://pay.hotmart.com/B102739272B',

  // Ferramentas de Regulação Emocional
  '6558403': 'https://pay.hotmart.com/K102740604W',

  // NeuroAfetividad Infantil
  '6558441': 'https://pay.hotmart.com/A102740710S',

  // Metáforas Emocionales
  '6558460': 'https://pay.hotmart.com/R102740753N',

  // Coloreando Emociones
  '6558478': 'https://pay.hotmart.com/A102740797J' 
}