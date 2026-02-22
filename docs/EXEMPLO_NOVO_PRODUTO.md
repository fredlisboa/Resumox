# 📝 Exemplo Prático: Adicionando o Produto "Academia de Vendas"

Este é um exemplo completo e real de como adicionar um novo produto ao sistema.

---

## Cenário

Você acabou de criar um novo produto no Hotmart:
- **Nome:** Academia de Vendas
- **Product ID:** `7654321`
- **Tema:** Dark (similar ao NeuroReset)
- **Descrição:** Treinamento completo em técnicas de vendas
- **Order Bumps:** 2 produtos extras
  - Scripts de Vendas Pro (`7654322`)
  - Planilha de Metas (`7654323`)

---

## Passo a Passo

### 1. Configurar Rotas

**Arquivo:** `lib/product-routes-map.ts`

```typescript
export const PRODUCT_ROUTES_MAP: Record<string, ProductRouteConfig> = {
  // ... produtos existentes ...

  // Academia de Vendas - NOVO PRODUTO
  '7654321': {
    product_id: '7654321',
    product_name: 'Academia de Vendas',
    login_route: '/vendas',
    dashboard_route: '/vendas/dashboard',
    theme: 'dark',
    description: 'Treinamento completo em técnicas de vendas'
  }
}
```

### 2. Configurar Order Bumps

**Arquivo:** `lib/product-order-bumps-map.ts`

```typescript
export const PRODUCT_ORDER_BUMPS_MAP: Record<string, MainProductConfig> = {
  // ... produtos existentes ...

  // Academia de Vendas
  '7654321': {
    product_id: '7654321',
    product_name: 'Academia de Vendas',
    order_bumps: [
      {
        product_id: '7654322',
        product_name: 'Scripts de Vendas Pro'
      },
      {
        product_id: '7654323',
        product_name: 'Planilha de Metas'
      }
    ]
  }
}
```

### 3. Executar Script de Criação

```bash
./scripts/create-new-product.sh
```

**Respostas:**
```
Product ID: 7654321
Nome do Produto: Academia de Vendas
Slug da rota: vendas
Tema: dark
Descrição breve: Treinamento completo em técnicas de vendas
```

Isso criará:
- `app/vendas/page.tsx`
- `app/vendas/dashboard/page.tsx`

### 4. Atualizar Middleware

**Arquivo:** `middleware.ts`

```typescript
const publicPaths = [
  '/',
  '/neuroreset',
  '/iemocional',
  '/vendas',  // ← ADICIONAR
  '/api/auth/login',
  '/api/webhook/hotmart'
]

const protectedPaths = [
  '/dashboard',
  '/iemocional/dashboard',
  '/vendas/dashboard'  // ← ADICIONAR
]
```

### 5. Customizar Página de Login

**Arquivo:** `app/vendas/page.tsx`

Modificar:

```typescript
// Linha ~105: Atualizar logo
<img
  src="/logo-vendas.png"
  alt="Academia de Vendas Logo"
  className="w-16 h-16 sm:w-20 sm:h-20"
/>

// Linha ~109: Atualizar título
<h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white leading-tight">
  Academia de Vendas
</h1>

// Linha ~115: Atualizar badge
<div className="inline-flex items-center gap-2 px-6 py-2 bg-neuro-gradient/10 border border-neuro-400/30 rounded-full mb-4">
  <p className="text-4xl font-bold text-white tracking-tight">
    Academia de Vendas
  </p>
</div>

// Linha ~57: Atualizar redirecionamento
router.push(data.redirectTo || '/vendas/dashboard')
```

### 6. Customizar Dashboard

**Arquivo:** `app/vendas/dashboard/page.tsx`

Modificar:

```typescript
// Linha ~96: Atualizar redirecionamento de logout
const handleLogout = async () => {
  try {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/vendas')  // ← MUDAR AQUI
  } catch (error) {
    console.error('Logout error:', error)
  }
}

// Linha ~152: Atualizar título
<h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
  Domine as técnicas de vendas de alta performance
</h1>
<p className="text-neuro-200">
  Seu treinamento completo começa aqui
</p>

// Linha ~171: Atualizar texto dos tabs
<span className="hidden sm:inline">Módulos de Treinamento</span>
<span className="sm:hidden">Módulos</span>
```

### 7. Adicionar Logo

Adicionar arquivo: `public/logo-vendas.png`
- Dimensões recomendadas: 512x512px
- Formato: PNG com fundo transparente

### 8. Customizar Cores (Opcional)

Se quiser cores específicas, adicionar em `tailwind.config.ts`:

```typescript
colors: {
  // ... cores existentes ...

  'vendas': {
    900: '#1a0f2e',  // Roxo escuro
    800: '#2d1b4e',
    700: '#3f2768',
    500: '#7c3aed',  // Roxo vibrante
    400: '#a78bfa',
    300: '#c4b5fd',
    200: '#ddd6fe',
    100: '#ede9fe',
  }
}
```

E usar no código:
```typescript
className="bg-vendas-900 text-vendas-300"
```

### 9. Testar Localmente

```bash
# Iniciar servidor
npm run dev

# Acessar:
# http://localhost:3000/vendas
```

**Teste:**
1. Fazer login com um email que tenha `product_id = '7654321'`
2. Verificar redirecionamento para `/vendas/dashboard`
3. Testar navegação entre tabs
4. Testar logout

### 10. Commit e Deploy

```bash
git add .
git commit -m "feat: adicionar produto Academia de Vendas"
git push
```

---

## Resultado Final

Após seguir todos os passos, você terá:

### Estrutura de Arquivos
```
app/
├── vendas/
│   ├── page.tsx              ✅ Login customizado
│   └── dashboard/
│       └── page.tsx          ✅ Dashboard customizado

lib/
├── product-routes-map.ts     ✅ Configuração de rotas
└── product-order-bumps-map.ts ✅ Order bumps configurados

public/
└── logo-vendas.png           ✅ Logo do produto

middleware.ts                 ✅ Rotas públicas/protegidas
```

### Rotas Funcionais
- ✅ Login: `https://seudominio.com/vendas`
- ✅ Dashboard: `https://seudominio.com/vendas/dashboard`
- ✅ Redirecionamento automático baseado em `product_id`
- ✅ Proteção de rotas via middleware
- ✅ Logout redireciona para página de login correta

### Integrações
- ✅ Webhook Hotmart integrado automaticamente
- ✅ Order bumps rastreados no banco
- ✅ Conteúdos carregados por `product_id`
- ✅ Sessões gerenciadas automaticamente

---

## Tempo Estimado

Com o sistema atual:
- **Configuração:** 5 minutos
- **Customização visual:** 15-20 minutos
- **Testes:** 10 minutos
- **Total:** ~30-35 minutos por produto

Sem o sistema (manualmente):
- **Configuração manual:** 30 minutos
- **Criar lógica de redirecionamento:** 20 minutos
- **Customização visual:** 20 minutos
- **Testes e debugging:** 30 minutos
- **Total:** ~1h40min por produto

**Economia de tempo: ~70%** 🚀

---

## Próximos Produtos

Seguindo este mesmo padrão, você pode adicionar quantos produtos quiser:

1. **Coaching Financeiro** (`product_id: 8765432`)
2. **Marketing Digital Pro** (`product_id: 9876543`)
3. **Gestão de Equipes** (`product_id: 1234567`)
4. E muitos outros...

Cada produto terá:
- Identidade visual própria
- Dashboard independente
- Gerenciamento automático de acessos
- Order bumps configuráveis

---

**Sistema totalmente escalável e preparado para crescimento!** 📈
