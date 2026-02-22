# 📦 Como Adicionar um Novo Produto ao Sistema

Este guia explica o processo completo para adicionar um novo produto ao sistema multi-produto.

---

## 🎯 Visão Geral

O sistema foi projetado para suportar múltiplos produtos com identidades visuais distintas. Cada produto tem:
- Página de login personalizada
- Dashboard com tema próprio
- Configuração de rotas centralizada

---

## 📋 Checklist de Implementação

### 1️⃣ Configurar Rotas no Sistema

**Arquivo:** `lib/product-routes-map.ts`

Adicione uma nova entrada no objeto `PRODUCT_ROUTES_MAP`:

```typescript
'SEU_PRODUCT_ID': {
  product_id: 'SEU_PRODUCT_ID',
  product_name: 'Nome do Produto',
  login_route: '/seu-produto',
  dashboard_route: '/seu-produto/dashboard',
  theme: 'light', // ou 'dark'
  description: 'Descrição breve do produto'
}
```

**Exemplo:**
```typescript
'7891234': {
  product_id: '7891234',
  product_name: 'Curso de Meditação',
  login_route: '/meditacao',
  dashboard_route: '/meditacao/dashboard',
  theme: 'light',
  description: 'Técnicas avançadas de meditação mindfulness'
}
```

---

### 2️⃣ Configurar Order Bumps (se aplicável)

**Arquivo:** `lib/product-order-bumps-map.ts`

Se o produto tiver order bumps, adicione no `PRODUCT_ORDER_BUMPS_MAP`:

```typescript
'SEU_PRODUCT_ID': {
  product_id: 'SEU_PRODUCT_ID',
  product_name: 'Nome do Produto',
  order_bumps: [
    {
      product_id: 'ID_ORDER_BUMP_1',
      product_name: 'Nome do Order Bump 1'
    },
    {
      product_id: 'ID_ORDER_BUMP_2',
      product_name: 'Nome do Order Bump 2'
    }
  ]
}
```

---

### 3️⃣ Criar Estrutura de Pastas

Crie a seguinte estrutura no diretório `app/`:

```
app/
└── seu-produto/
    ├── page.tsx              # Página de login
    └── dashboard/
        └── page.tsx          # Dashboard do produto
```

---

### 4️⃣ Criar Página de Login

**Arquivo:** `app/seu-produto/page.tsx`

Você pode copiar e adaptar de um produto existente:

**Tema Claro (como iEmocional):**
```bash
cp app/iemocional/page.tsx app/seu-produto/page.tsx
```

**Tema Escuro (como NeuroReset):**
```bash
cp app/neuroreset/page.tsx app/seu-produto/page.tsx
```

**Customizações necessárias:**
1. Logo: Atualizar caminho da imagem (`/logo-seu-produto.png`)
2. Título: Nome do produto
3. Cores: Gradientes e paleta de cores
4. Redirecionamento: Alterar `router.push` para `/seu-produto/dashboard`

---

### 5️⃣ Criar Dashboard

**Arquivo:** `app/seu-produto/dashboard/page.tsx`

Copie de um produto existente:

**Tema Claro:**
```bash
cp app/iemocional/dashboard/page.tsx app/seu-produto/dashboard/page.tsx
```

**Tema Escuro:**
```bash
cp app/dashboard/page.tsx app/seu-produto/dashboard/page.tsx
```

**Customizações necessárias:**
1. Título e badges
2. Cores do tema
3. Redirecionamento de logout (`router.push('/seu-produto')`)
4. Textos e descrições

---

### 6️⃣ Atualizar Middleware

**Arquivo:** `middleware.ts`

Adicione as rotas públicas e protegidas:

```typescript
// Rotas públicas
const publicPaths = [
  '/',
  '/neuroreset',
  '/iemocional',
  '/seu-produto',  // ← ADICIONAR AQUI
  '/api/auth/login',
  '/api/webhook/hotmart'
]

// Rotas protegidas
const protectedPaths = [
  '/dashboard',
  '/iemocional/dashboard',
  '/seu-produto/dashboard'  // ← ADICIONAR AQUI
]
```

---

### 7️⃣ Adicionar Assets Visuais

Adicione os arquivos de imagem no diretório `public/`:

```
public/
├── logo-seu-produto.png       # Logo do produto (recomendado: 512x512px)
└── banner-seu-produto.png     # Banner (opcional)
```

---

### 8️⃣ Configurar Produto no Banco de Dados

Execute as seguintes queries no Supabase:

```sql
-- Não é necessário fazer nada!
-- O sistema webhook do Hotmart criará automaticamente os usuários
-- quando receberem a compra
```

---

## 🎨 Guia de Customização Visual

### Temas Disponíveis

#### Tema Escuro (Dark)
- **Background:** `bg-neuro-dark` com gradientes
- **Cores principais:** Azul elétrico, roxo, cyan
- **Bordas:** `rounded-2xl`, `rounded-3xl`
- **Sombras:** `shadow-neuro-glow`
- **Exemplo:** NeuroReset

#### Tema Claro (Light)
- **Background:** `bg-gradient-to-br from-gray-50 to-white`
- **Cores principais:** Lime, pink, purple, orange
- **Bordas:** `rounded-3xl`, `rounded-full`
- **Sombras:** `shadow-2xl`, `shadow-xl`
- **Exemplo:** Kit Inteligencia Emocional

### Paleta de Cores Personalizadas

Você pode definir cores customizadas no `tailwind.config.ts`:

```typescript
colors: {
  'seu-produto': {
    50: '#...',
    100: '#...',
    // ...
    900: '#...',
  }
}
```

---

## 🔧 Funcionalidades Automáticas

Ao adicionar um produto no `product-routes-map.ts`, o sistema automaticamente:

✅ **Redireciona usuários** para o dashboard correto após login
✅ **Valida autenticação** nas rotas protegidas
✅ **Gerencia sessões** de forma unificada
✅ **Aplica rate limiting** e proteções de segurança
✅ **Integra com Hotmart** via webhooks

---

## 🧪 Testando o Novo Produto

### 1. Testar Login
Acesse: `http://localhost:3000/seu-produto`

1. Insira um email de teste que tenha o `product_id` configurado
2. Complete o Turnstile CAPTCHA
3. Clique em "Entrar al Contenido"
4. Verifique se redireciona para `/seu-produto/dashboard`

### 2. Testar Dashboard
1. Após o login, verifique se o tema está correto
2. Teste a navegação entre abas (Conteúdo e Avisos)
3. Verifique se os conteúdos estão sendo carregados
4. Teste o botão de logout

### 3. Testar Middleware
1. Tente acessar `/seu-produto/dashboard` sem estar logado
2. Deve redirecionar para a página de login
3. Após login, deve permitir acesso

---

## 📊 Exemplo Completo

Aqui está um exemplo completo de adição do produto "Mindfulness Pro":

### 1. Configuração de Rotas

```typescript
// lib/product-routes-map.ts
'8765432': {
  product_id: '8765432',
  product_name: 'Mindfulness Pro',
  login_route: '/mindfulness',
  dashboard_route: '/mindfulness/dashboard',
  theme: 'light',
  description: 'Programa completo de mindfulness'
}
```

### 2. Estrutura de Arquivos

```
app/
└── mindfulness/
    ├── page.tsx              # Login customizado
    └── dashboard/
        └── page.tsx          # Dashboard customizado
```

### 3. Middleware Atualizado

```typescript
const publicPaths = ['/', '/neuroreset', '/iemocional', '/mindfulness', '/api/auth/login', '/api/webhook/hotmart']
const protectedPaths = ['/dashboard', '/iemocional/dashboard', '/mindfulness/dashboard']
```

### 4. Assets

```
public/
└── logo-mindfulness.png
```

---

## 🚀 Deploy

Após implementar tudo localmente:

1. **Commit as mudanças:**
```bash
git add .
git commit -m "feat: adicionar produto Mindfulness Pro"
git push
```

2. **Deploy automático** (se configurado Vercel/Netlify)

3. **Testar em produção:**
   - Acesse `https://seudominio.com/seu-produto`
   - Teste o fluxo completo de login e acesso

---

## 🆘 Problemas Comuns

### Login não redireciona corretamente
- Verifique se o `product_id` está correto em `product-routes-map.ts`
- Confirme que o usuário tem o `product_id` correto na tabela `users_access`

### Dashboard com tema errado
- Revise as classes Tailwind CSS usadas
- Verifique se está usando o template correto (dark ou light)

### Middleware bloqueia acesso
- Confirme que as rotas estão em `publicPaths` e `protectedPaths`
- Limpe o cache do navegador e cookies

### Conteúdo não carrega
- Verifique se há conteúdos na tabela `product_contents` com o `product_id` correto
- Confirme que o usuário tem o produto ativo em `user_products`

---

## 📚 Referências

- [Documentação do Design System](../DESIGN_SYSTEM_IEMOCIONAL.md)
- [Configuração de Produtos](../lib/product-routes-map.ts)
- [Configuração de Order Bumps](../lib/product-order-bumps-map.ts)
- [Middleware](../middleware.ts)

---

## ✅ Checklist Final

Antes de considerar o produto implementado, verifique:

- [ ] Configuração em `product-routes-map.ts`
- [ ] Configuração de order bumps (se aplicável)
- [ ] Estrutura de pastas criada
- [ ] Página de login customizada
- [ ] Dashboard customizado
- [ ] Middleware atualizado
- [ ] Assets visuais adicionados
- [ ] Teste de login funcionando
- [ ] Teste de dashboard funcionando
- [ ] Teste de logout funcionando
- [ ] Deploy em produção

---

**Pronto! Seu novo produto está integrado ao sistema.**

Se tiver dúvidas, consulte os produtos existentes (NeuroReset e iEmocional) como referência.
