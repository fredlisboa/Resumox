#!/bin/bash

# Script para criar automaticamente a estrutura de um novo produto
# Uso: ./scripts/create-new-product.sh

echo "🚀 Assistente de Criação de Novo Produto"
echo "========================================"
echo ""

# Solicitar informações do produto
read -p "Product ID (ex: 7891234): " PRODUCT_ID
read -p "Nome do Produto (ex: Curso de Meditação): " PRODUCT_NAME
read -p "Slug da rota (ex: meditacao): " ROUTE_SLUG
read -p "Tema (dark ou light): " THEME
read -p "Descrição breve: " DESCRIPTION

echo ""
echo "Configuração:"
echo "- Product ID: $PRODUCT_ID"
echo "- Nome: $PRODUCT_NAME"
echo "- Rota de login: /$ROUTE_SLUG"
echo "- Dashboard: /$ROUTE_SLUG/dashboard"
echo "- Tema: $THEME"
echo "- Descrição: $DESCRIPTION"
echo ""

read -p "Confirma a criação? (s/n): " CONFIRM

if [ "$CONFIRM" != "s" ]; then
  echo "❌ Operação cancelada."
  exit 0
fi

echo ""
echo "📁 Criando estrutura de pastas..."

# Criar diretórios
mkdir -p "app/$ROUTE_SLUG/dashboard"

echo "✅ Pastas criadas:"
echo "   - app/$ROUTE_SLUG/"
echo "   - app/$ROUTE_SLUG/dashboard/"
echo ""

# Copiar templates baseado no tema
if [ "$THEME" = "light" ]; then
  TEMPLATE_LOGIN="app/iemocional/page.tsx"
  TEMPLATE_DASHBOARD="app/iemocional/dashboard/page.tsx"
  echo "📋 Usando templates do tema CLARO (iEmocional)"
else
  TEMPLATE_LOGIN="app/neuroreset/page.tsx"
  TEMPLATE_DASHBOARD="app/dashboard/page.tsx"
  echo "📋 Usando templates do tema ESCURO (NeuroReset)"
fi

echo ""
echo "📄 Copiando templates..."

# Copiar e customizar página de login
cp "$TEMPLATE_LOGIN" "app/$ROUTE_SLUG/page.tsx"
echo "✅ Login criado: app/$ROUTE_SLUG/page.tsx"

# Copiar e customizar dashboard
cp "$TEMPLATE_DASHBOARD" "app/$ROUTE_SLUG/dashboard/page.tsx"
echo "✅ Dashboard criado: app/$ROUTE_SLUG/dashboard/page.tsx"

echo ""
echo "⚙️  Próximos passos MANUAIS:"
echo ""
echo "1. Adicionar configuração em lib/product-routes-map.ts:"
echo ""
echo "  '$PRODUCT_ID': {"
echo "    product_id: '$PRODUCT_ID',"
echo "    product_name: '$PRODUCT_NAME',"
echo "    login_route: '/$ROUTE_SLUG',"
echo "    dashboard_route: '/$ROUTE_SLUG/dashboard',"
echo "    theme: '$THEME',"
echo "    description: '$DESCRIPTION'"
echo "  }"
echo ""
echo "2. Atualizar middleware.ts:"
echo ""
echo "   const publicPaths = [..., '/$ROUTE_SLUG', ...]"
echo "   const protectedPaths = [..., '/$ROUTE_SLUG/dashboard', ...]"
echo ""
echo "3. Customizar arquivos criados:"
echo "   - app/$ROUTE_SLUG/page.tsx (logo, títulos, cores)"
echo "   - app/$ROUTE_SLUG/dashboard/page.tsx (tema, textos)"
echo ""
echo "4. Adicionar logo:"
echo "   - public/logo-$ROUTE_SLUG.png"
echo ""
echo "5. Se tiver order bumps, adicionar em lib/product-order-bumps-map.ts"
echo ""
echo "✅ Estrutura base criada com sucesso!"
echo ""
echo "📖 Consulte docs/ADICIONAR_NOVO_PRODUTO.md para mais detalhes"
