# Guia de Implementação: Bloqueio de Order Bumps na Área de Membros

## 📋 Visão Geral

Sistema **SIMPLIFICADO** de bloqueio usando apenas a coluna `status='order_bump'`. Conteúdos marcados com este status aparecem **sempre bloqueados** para todos os usuários, com **ícone de cadeado vermelho** e redirecionam para o **checkout da Hotmart** ao clicar.

## 🎯 Objetivo

Aumentar o LTV (Lifetime Value) mostrando conteúdos premium bloqueados que incentivam a compra do order bump.

## 🏗️ Arquitetura da Solução (SIMPLIFICADA)

### 1. Configuração de Checkout ([lib/product-config.ts](lib/product-config.ts))

Apenas uma constante com a URL de checkout:

```typescript
export const ORDER_BUMP_CHECKOUT_URL = 'https://pay.hotmart.com/A102740797J'
```

### 2. Migration SQL ([supabase/migrations/add_order_bump_status.sql](supabase/migrations/add_order_bump_status.sql))

Adiciona `'order_bump'` como opção válida na coluna `status`:

```sql
ALTER TABLE public.product_contents
ADD CONSTRAINT product_contents_status_check
CHECK (status IN ('principal', 'bonus', 'order_bump'));
```

### 3. Verificação de Acesso ([app/api/contents/route.ts](app/api/contents/route.ts))

Lógica **SIMPLES**:
1. Busca todos os conteúdos ativos
2. Filtra por produtos do usuário OU status='order_bump'
3. Marca `status='order_bump'` como bloqueado

**Fluxo:**
```
Busca conteúdos → Se status='order_bump' → is_locked=true
                → Adiciona checkout_url
                → Retorna para frontend
```

### 4. Interface de Conteúdo

Interface atualizada com suporte a `status='order_bump'`:

```typescript
interface Content {
  // ... campos existentes
  status?: 'principal' | 'bonus' | 'order_bump' // ⚡ Novo status
  is_locked?: boolean              // Auto-calculado pela API
  checkout_url?: string | null     // Auto-adicionado pela API
}
```

### 5. Renderização Visual ([components/ContentList.tsx](components/ContentList.tsx))

**Características visuais dos order bumps bloqueados:**
- ✅ Borda vermelha semi-transparente (`border-red-500/40`)
- ✅ Gradiente vermelho/laranja (`from-red-500/5 to-orange-500/5`)
- ✅ Opacidade 60% (hover 80%)
- ✅ Ícone de cadeado vermelho no canto superior direito
- ✅ Badge "🔒 BLOQUEADO" vermelho
- ✅ Cadeado substituindo o botão play
- ✅ Efeito de glow vermelho no hover

**Classes CSS:**
```typescript
isOrderBump && isLocked
  ? 'glass border-2 border-red-500/40 bg-gradient-to-br from-red-500/5 to-orange-500/5 opacity-60 hover:opacity-80'
```

### 6. Redirecionamento para Checkout

Ao clicar em order bump bloqueado → redireciona automaticamente:
```typescript
if (content.is_locked && content.checkout_url) {
  window.location.href = content.checkout_url
}
```

## 📝 Como Configurar (3 Passos Simples)

### Passo 1: Executar a Migration SQL

Execute no Supabase SQL Editor:

```sql
-- Copie e execute o conteúdo de:
-- supabase/migrations/add_order_bump_status.sql
```

### Passo 2: Configurar URL de Checkout

Edite [lib/product-config.ts](lib/product-config.ts) (se necessário):

```typescript
export const ORDER_BUMP_CHECKOUT_URL = 'SUA_URL_HOTMART'
// Ex: 'https://pay.hotmart.com/A102740797J'
```

### Passo 3: Cadastrar Conteúdos com status='order_bump'

Use [supabase/example_order_bump_contents.sql](supabase/example_order_bump_contents.sql) como referência:

```sql
INSERT INTO public.product_contents (
  product_id,
  content_type,
  title,
  description,
  content_url,
  duration,
  order_index,
  status,              -- ⚡ AQUI ESTÁ O SEGREDO!
  is_active
) VALUES (
  'ORDERBUMP01',       -- Qualquer ID único (só para organização)
  'audio',
  'Áudio Bônus Exclusivo - Reprogramação Profunda',
  'Clique para desbloquear!',
  'r2://audios/bonus.mp3',
  1800,
  100,
  'order_bump',        -- ⚡ Isto marca como bloqueado!
  true
);
```

## ✅ Pronto! Agora é só testar

1. Faça login na área de membros
2. Veja os conteúdos com `status='order_bump'` bloqueados
3. Clique neles para testar o redirecionamento ao checkout

## 🔄 Fluxo SIMPLIFICADO do Sistema

```
┌──────────────────────────────────────────────┐
│ 1. USUÁRIO ACESSA ÁREA DE MEMBROS          │
└──────────────────┬───────────────────────────┘
                   ▼
┌──────────────────────────────────────────────┐
│ 2. API busca TODOS os conteúdos ativos      │
│    - status='principal'                      │
│    - status='bonus'                          │
│    - status='order_bump' 🔒                  │
└──────────────────┬───────────────────────────┘
                   ▼
┌──────────────────────────────────────────────┐
│ 3. API filtra e marca status                │
│    - principal/bonus → is_locked=false ✅    │
│    - order_bump → is_locked=true 🔒          │
│                   checkout_url=URL_CONFIG    │
└──────────────────┬───────────────────────────┘
                   ▼
┌──────────────────────────────────────────────┐
│ 4. Frontend renderiza                       │
│    ✅ Normal: visual cyan, clicável          │
│    🔒 Bloqueado: vermelho opaco, redireciona │
└──────────────────────────────────────────────┘
```

## 🎨 Referência Visual

### Conteúdo Normal (status='principal' ou 'bonus')
```
┌──────────────────────────────────────────┐
│  1  🎵  Audio de Reprogramação      ▶️  │
│         status='principal'             │
└──────────────────────────────────────────┘
  100%     Borda cyan      Clicável
  opacity  Sem bloqueio    Reproduz
```

### Conteúdo Bloqueado (status='order_bump')
```
┌──────────────────────────────────────────┐ 🔒
│  5  🎵  Áudio Premium Exclusivo  🔒     │
│         🔒 BLOQUEADO                     │
└──────────────────────────────────────────┘
  60%      Borda vermelha   Redireciona
  opacity  Gradiente red    ao checkout
```

## 🔧 Troubleshooting

### Problema: Conteúdos não aparecem bloqueados

**Causa:** Status incorreto

**Solução:**
1. Verifique se executou a migration `add_order_bump_status.sql`
2. Verifique se o campo `status='order_bump'` (não 'bonus')
3. Use esta query:
```sql
SELECT id, title, status FROM public.product_contents
WHERE status = 'order_bump';
```

### Problema: Redirecionamento não funciona

**Causa:** URL de checkout não configurada

**Solução:**
```typescript
// Verifique em lib/product-config.ts:
export const ORDER_BUMP_CHECKOUT_URL = 'https://pay.hotmart.com/...'
```

### Problema: Erro "status check constraint"

**Causa:** Migration não executada

**Solução:**
Execute a migration primeiro:
```sql
-- No Supabase SQL Editor:
-- Copie e execute: supabase/migrations/add_order_bump_status.sql
```

## 📊 Queries Úteis

### Listar todos os conteúdos order_bump
```sql
SELECT
  id,
  title,
  content_type,
  status,
  order_index
FROM public.product_contents
WHERE status = 'order_bump'
ORDER BY order_index;
```

### Contar conteúdos por status
```sql
SELECT
  status,
  COUNT(*) as quantidade
FROM public.product_contents
WHERE is_active = true
GROUP BY status;
```

### Atualizar conteúdos existentes para order_bump
```sql
-- Converter conteúdos específicos para order_bump
UPDATE public.product_contents
SET status = 'order_bump'
WHERE id IN ('uuid1', 'uuid2', 'uuid3');

-- Ou por título
UPDATE public.product_contents
SET status = 'order_bump'
WHERE title ILIKE '%exclusivo%' OR title ILIKE '%premium%';
```

## 🚀 Checklist de Implementação

- [ ] 1. Executar migration `add_order_bump_status.sql` no Supabase
- [ ] 2. Configurar `ORDER_BUMP_CHECKOUT_URL` em [lib/product-config.ts](lib/product-config.ts)
- [ ] 3. Cadastrar conteúdos com `status='order_bump'`
- [ ] 4. Testar visualização na área de membros
- [ ] 5. Testar redirecionamento ao clicar

## 💡 Dicas de Conversão

**Títulos Persuasivos:**
- ❌ "Áudio Bônus"
- ✅ "🔥 Técnica Secreta de Reprogramação Profunda"

**Descrições que Vendem:**
- ❌ "Material complementar"
- ✅ "Sessão exclusiva usada por 10.000+ alunos. Clique para desbloquear!"

**Posicionamento Estratégico:**
- Intercale entre conteúdos principais (cria desejo)
- Use `order_index` entre 50-150 (após conteúdo de valor, antes do final)

## 🎯 Resultado Esperado

✅ Todos veem order bumps bloqueados (cadeado vermelho)
✅ Click → redireciona para checkout instantaneamente
✅ Visual premium cria desejo de compra
✅ Aumento do LTV da oferta
