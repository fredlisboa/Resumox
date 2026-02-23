# ResumoX - Estrutura do Projeto

Plataforma PWA multi-produto para entrega de conteúdos digitais, construída com **Next.js 14 (App Router)**, **Supabase** e **Cloudflare R2**.

---

## Visão Geral da Arquitetura

```
Resumox/
├── app/                    # Rotas e páginas (Next.js App Router)
├── components/             # Componentes React reutilizáveis
├── lib/                    # Lógica de negócio e utilitários
├── hooks/                  # Custom React hooks
├── public/                 # Assets estáticos e PWA
├── scripts/                # Scripts de desenvolvimento e testes
├── supabase/               # Migrações SQL do banco de dados
├── mcp-servers/            # Servidores MCP auxiliares
├── docs/                   # Documentação adicional
└── [configs]               # Arquivos de configuração na raiz
```

---

## Stack Tecnológica

| Camada         | Tecnologia                          |
| -------------- | ----------------------------------- |
| Framework      | Next.js 14.2 (App Router)          |
| UI             | React 18.3 + Tailwind CSS 3.4      |
| Linguagem      | TypeScript 5.3                      |
| Banco de dados | Supabase (PostgreSQL)               |
| Armazenamento  | Cloudflare R2 (S3-compatible)       |
| Animações      | Framer Motion                       |
| PDF            | pdfjs-dist                          |
| Ícones         | lucide-react                        |
| Auth/JWT       | jose                                |
| CAPTCHA        | Cloudflare Turnstile                |
| Deploy         | Vercel                              |

---

## `app/` — Rotas e Páginas

Cada produto possui sua própria rota com login e dashboard dedicados.

```
app/
├── layout.tsx                  # Layout raiz (metadata, fonts, globals)
├── page.tsx                    # Página inicial (redirect)
├── globals.css                 # Estilos globais Tailwind
│
├── dashboard/                  # Dashboard principal (NeuroReset)
├── neuroreset/                 # Login NeuroReset
├── iemocional/                 # Kit Inteligência Emocional
├── nutricha/                   # NutriChá
├── sono-infantil/              # Kit Sono Infantil (PT-BR, Cakto)
├── sueno-infantil/             # Kit Sueño Infantil (Espanhol)
├── admin/                      # Painel administrativo
├── pdf-viewer/                 # Visualizador de PDF
│
└── api/                        # API Routes
    ├── auth/
    │   ├── login/              # Login com email + Turnstile
    │   ├── logout/             # Destruição de sessão
    │   └── session/            # Validação e renovação de sessão
    │
    ├── webhook/
    │   ├── hotmart/            # Webhooks de compra Hotmart
    │   └── cakto/              # Webhooks de compra Cakto
    │
    ├── avisos/                 # Sistema de notificações (CRUD)
    ├── contents/               # Conteúdos do produto
    ├── r2-content/             # Proxy de acesso ao R2
    ├── pdf-proxy/              # Proxy de download de PDF
    │
    ├── hotmart/
    │   ├── sales/              # Consulta de vendas
    │   └── subscribers/        # Consulta de assinantes
    │
    └── debug/                  # Endpoints de desenvolvimento
```

### Produtos Configurados

| Produto                       | Provedor | Rota             | Tema  |
| ----------------------------- | -------- | ---------------- | ----- |
| NeuroReset                    | Hotmart  | `/neuroreset`    | Dark  |
| Kit Inteligência Emocional    | Hotmart  | `/iemocional`    | Light |
| Kit Sueño Infantil            | Hotmart  | `/sueno-infantil`| Dark  |
| Kit Sono Infantil             | Cakto    | `/sono-infantil` | —     |
| NutriChá                      | Cakto    | `/nutricha`      | Light |

---

## `components/` — Componentes React

| Componente              | Finalidade                                      |
| ----------------------- | ----------------------------------------------- |
| `ContentList.tsx`       | Lista principal de conteúdos (filtro, busca, order bumps) |
| `ContentPlayer.tsx`     | Player de mídia (áudio/vídeo)                   |
| `PDFViewer.tsx`         | Visualizador de PDF com pdfjs-dist              |
| `FullScreenPDFViewer.tsx` | PDF em tela cheia com navegação de páginas     |
| `AvisosSection.tsx`     | UI do sistema de notificações                   |
| `AvisoCard.tsx`         | Card individual de notificação                  |
| `UserHeader.tsx`        | Cabeçalho com perfil e navegação                |
| `SessionWarningModal.tsx` | Aviso de expiração de sessão                  |
| `PWAInstallButton.tsx`  | Botão de instalação PWA                         |
| `PWAInstallPrompt.tsx`  | Prompt de instalação do app                     |
| `SecurityProvider.tsx`  | Proteção de conteúdo (anti-cópia)               |
| `TurnstileWidget.tsx`   | Widget CAPTCHA Cloudflare                       |
| `EmailSupportModal.tsx` | Modal de suporte por email                      |
| `HTMLContentItem.tsx`   | Renderizador de conteúdo HTML                   |

---

## `lib/` — Lógica de Negócio

| Arquivo                     | Responsabilidade                                   |
| --------------------------- | -------------------------------------------------- |
| `auth.ts`                   | Sessões, login, validação, sliding window          |
| `hotmart.ts`                | Cliente da API Hotmart (vendas, assinantes)         |
| `supabase.ts`               | Cliente Supabase (server/client)                   |
| `r2.ts`                     | Cliente Cloudflare R2 (upload, signed URLs)         |
| `anti-fraud.ts`             | Detecção de fraude (IP, User-Agent, rate limiting) |
| `admin-auth.ts`             | Autenticação de administradores                    |
| `product-config.ts`         | Configuração centralizada dos produtos             |
| `product-routes-map.ts`     | Mapeamento de rotas por produto                    |
| `product-order-bumps-map.ts`| Configuração de order bumps (upsell)               |
| `cakto-product-map.ts`      | Mapeamento de produtos Cakto                       |
| `utils.ts`                  | Funções utilitárias gerais                         |

---

## `hooks/` — Custom Hooks

| Hook              | Finalidade                              |
| ----------------- | --------------------------------------- |
| `useSession.ts`   | Gerenciamento de sessão no client-side  |

---

## `supabase/migrations/` — Banco de Dados

15+ migrações SQL que definem o schema. Tabelas principais:

| Tabela              | Descrição                                          |
| ------------------- | -------------------------------------------------- |
| `users_access`      | Registros de acesso (email, status, produto, IP)   |
| `user_sessions`     | Sessões ativas (token, IP, expiração, atividade)   |
| `user_products`     | Compras individuais (produtos + order bumps)        |
| `product_contents`  | Itens de conteúdo (vídeo, áudio, PDF, texto, HTML) |
| `login_attempts`    | Histórico de tentativas de login                   |
| `hotmart_webhooks`  | Log de eventos de webhook                          |
| `avisos`            | Sistema de notificações/avisos                     |
| `admin_users`       | Gerenciamento de administradores                   |
| `ip_rate_limits`    | Rate limiting por IP                               |

**Recursos do banco:**
- Row-Level Security (RLS) habilitado
- Triggers automáticos de `created_at` / `updated_at`
- Índices compostos para performance
- Constraints UNIQUE e foreign keys com CASCADE

---

## `public/` — Assets Estáticos e PWA

```
public/
├── manifest.json           # Manifesto PWA
├── sw.js                   # Service Worker (offline)
├── favicon.ico             # Favicon
├── icon-192x192.png        # Ícone PWA pequeno
├── icon-512x512.png        # Ícone PWA grande
├── apple-touch-icon.png    # Ícone iOS
├── pdf.worker.min.mjs      # Worker do pdfjs-dist
├── brain-icon.svg          # Ícone NeuroReset
├── neuroreset-banner.png   # Banner hero
├── nutricha/               # Assets do NutriChá
├── sono-infantil/          # Assets do Sono Infantil
└── sueno-infantil/         # Assets do Sueño Infantil
```

---

## `scripts/` — Utilitários de Desenvolvimento

40+ scripts organizados por tipo:

- **`test-*.ts`** — Testes de integração (Hotmart, R2, order bumps, PDF)
- **`check-*.ts`** — Verificações de estado (webhooks, produtos)
- **`verify-*.ts`** — Validações de configuração
- **`create-*.ts`** — Scripts de setup (primeiro admin)
- **`generate-*.js`** — Geração de assets (ícones, favicon)
- **`*.sql`** — Utilitários de banco de dados
- **`*.sh`** — Scripts bash auxiliares

---

## Segurança

| Recurso                  | Implementação                                     |
| ------------------------ | ------------------------------------------------- |
| Sessões                  | Token com expiração de 30 dias + sliding window   |
| Rate Limiting            | Por IP (10 tentativas → bloqueio de 15min)        |
| Anti-Fraude              | Detecção por IP, User-Agent, emails únicos por IP |
| CAPTCHA                  | Cloudflare Turnstile no login                     |
| Webhook Auth             | Verificação HMAC SHA256                           |
| Proteção de Conteúdo     | Bloqueio de right-click, copy-paste, drag         |
| RLS                      | Políticas PostgreSQL por tabela                   |
| Headers de Segurança     | CSP, X-Frame-Options: SAMEORIGIN, noindex         |

---

## Integrações Externas

| Serviço           | Uso                                            |
| ----------------- | ---------------------------------------------- |
| **Hotmart**       | Processador de pagamentos + webhooks           |
| **Cakto**         | Processador alternativo + webhooks             |
| **Cloudflare R2** | Armazenamento de arquivos (S3-compatible)      |
| **Supabase**      | Banco PostgreSQL + infraestrutura de auth      |
| **Vercel**        | Hospedagem e deploy                            |
| **Cloudflare**    | Turnstile CAPTCHA                              |

---

## Variáveis de Ambiente

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Hotmart
HOTMART_WEBHOOK_SECRET=
HOTMART_API_KEY=

# Cakto
CAKTO_WEBHOOK_SECRET=

# Cloudflare R2
R2_ACCOUNT_ID=
R2_ACCESS_KEY_ID=
R2_SECRET_ACCESS_KEY=
R2_BUCKET_NAME=

# App
NEXT_PUBLIC_APP_URL=
NEXT_PUBLIC_WHATSAPP_SUPPORT=
SESSION_SECRET=
TURNSTILE_SECRET_KEY=
```

---

## Scripts npm

| Comando                | Ação                             |
| ---------------------- | -------------------------------- |
| `npm run dev`          | Servidor de desenvolvimento      |
| `npm run build`        | Build de produção                |
| `npm run start`        | Iniciar servidor de produção     |
| `npm run lint`         | Verificação ESLint               |
| `npm run test:r2`      | Testar armazenamento R2          |
| `npm run test:pdf`     | Testar acesso a PDFs             |
| `npm run test:order-bump` | Testar order bumps            |
| `npm run verify:hotmart`  | Verificar setup Hotmart        |
| `npm run check:webhooks`  | Checar status de webhooks      |
| `npm run create:first-admin` | Criar primeiro admin        |

---

## Fluxo de Funcionamento

```
Compra (Hotmart/Cakto)
  → Webhook recebido e validado (HMAC)
  → Registro em users_access + user_products
  → Usuário acessa rota do produto
  → Login com email + CAPTCHA
  → Sessão criada (token 30 dias)
  → Dashboard com conteúdos do produto
  → Conteúdos servidos via proxy R2 (URLs assinadas)
```

---

## Tema e Estilização

- **Paleta principal:** Azul elétrico → Roxo (gradiente neuro)
- **Acentos:** Cyan neon
- **10+ animações customizadas:** pulse, glow, float, shimmer
- **Suporte a tema claro** (iemocional, nutricha) e **escuro** (neuroReset, sueño infantil)
- **Backdrop blur, sombras customizadas** (neuro-glow, cyan-glow)
- **Design responsivo** para mobile-first (PWA)
