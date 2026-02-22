# HuskyApp MVP - Plataforma de Entrega de Infoprodutos

MVP de aplicativo de entrega de infoprodutos focado no mercado LATAM com experiência mobile-first e integração com Hotmart.

## Características Principais

### Autenticação
- Login sem senha (Magic Link via e-mail)
- Sessão persistente por 30 dias
- Rate limiting para prevenir força bruta
- Bloqueio automático após tentativas falhadas

### Segurança
- Validação de compra via Hotmart Webhook
- Proteção contra compartilhamento de conta
- Bloqueio de múltiplos acessos simultâneos
- Proteção de conteúdo (disable right-click, copy-paste)
- Detecção anti-fraude por IP e User-Agent
- Revogação automática de acesso em caso de reembolso

### PWA (Progressive Web App)
- Instalável como app nativo
- Funciona offline (cache básico)
- Ícones e manifest configurados
- Banner de instalação customizado

### Interface
- Design Mobile-First
- UI limpa e intuitiva para baixa consciência digital
- Player de vídeo/áudio integrado
- Área de downloads para PDFs
- Botão de suporte WhatsApp flutuante

## Stack Tecnológica

- **Framework**: Next.js 14+ (App Router)
- **Linguagem**: TypeScript
- **Estilização**: Tailwind CSS
- **Banco de Dados**: Supabase (PostgreSQL)
- **Autenticação**: Custom (Session-based)
- **Integração**: Hotmart Webhooks

## Estrutura do Projeto

```
huskyapp-mvp/
├── app/
│   ├── api/
│   │   ├── auth/
│   │   │   ├── login/route.ts      # Endpoint de login
│   │   │   ├── logout/route.ts     # Endpoint de logout
│   │   │   └── session/route.ts    # Validação de sessão
│   │   ├── webhook/
│   │   │   └── hotmart/route.ts    # Webhook da Hotmart
│   │   └── contents/route.ts       # API de conteúdos
│   ├── dashboard/
│   │   └── page.tsx                # Dashboard principal
│   ├── layout.tsx                  # Layout root
│   ├── page.tsx                    # Landing page de login
│   └── globals.css                 # Estilos globais
├── components/
│   ├── ContentPlayer.tsx           # Player de mídia
│   ├── ContentList.tsx             # Lista de conteúdos
│   ├── UserHeader.tsx              # Header do dashboard
│   ├── PWAInstallPrompt.tsx        # Prompt de instalação PWA
│   └── SecurityProvider.tsx        # Proteções de segurança
├── lib/
│   ├── supabase.ts                 # Cliente Supabase
│   ├── auth.ts                     # Funções de autenticação
│   ├── anti-fraud.ts               # Sistema anti-fraude
│   └── utils.ts                    # Utilitários
├── public/
│   ├── manifest.json               # PWA manifest
│   ├── sw.js                       # Service Worker
│   └── [icons]                     # Ícones do app
├── supabase/
│   └── schema.sql                  # Schema do banco de dados
└── middleware.ts                   # Middleware de proteção
```

## Instalação e Configuração

### 1. Instalar Dependências

```bash
cd huskyapp-mvp
npm install
```

### 2. Configurar Supabase

1. Crie um projeto no [Supabase](https://supabase.com)
2. Execute o script SQL em `supabase/schema.sql` no SQL Editor
3. Copie as credenciais do projeto

### 3. Configurar Variáveis de Ambiente

Copie `.env.local.example` para `.env.local` e preencha:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_anon_key
SUPABASE_SERVICE_ROLE_KEY=sua_service_role_key

# Hotmart
HOTMART_WEBHOOK_SECRET=seu_webhook_secret
HOTMART_API_KEY=sua_api_key

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_WHATSAPP_SUPPORT=5511999999999

# Session
SESSION_SECRET=seu_secret_aleatorio_min_32_chars
```

### 4. Executar em Desenvolvimento

```bash
npm run dev
```

Acesse: http://localhost:3000

### 5. Build para Produção

```bash
npm run build
npm start
```

## Configuração da Hotmart

### Webhook URL

Configure o webhook da Hotmart para:

```
https://seu-dominio.com/api/webhook/hotmart
```

### Eventos Suportados

- `PURCHASE_COMPLETE` / `PURCHASE_APPROVED` - Ativa acesso
- `PURCHASE_REFUNDED` - Revoga acesso
- `PURCHASE_CANCELED` - Cancela acesso
- `PURCHASE_CHARGEBACK` - Bloqueia acesso
- `SUBSCRIPTION_CANCELLATION` - Cancela assinatura

## Banco de Dados

### Tabelas Principais

#### users_access
Armazena clientes autorizados:
- `email` - E-mail do cliente
- `status_compra` - Status da compra (active/refunded/cancelled/chargeback)
- `hotmart_transaction_id` - ID da transação Hotmart
- `data_expiracao` - Data de expiração do acesso
- `ultimo_ip` - Último IP de acesso
- `tentativas_login` - Contador de tentativas de login

#### user_sessions
Controle de sessões ativas:
- `user_id` - Referência ao usuário
- `session_token` - Token único da sessão
- `ip_address` - IP da sessão
- `expires_at` - Data de expiração
- `is_active` - Se a sessão está ativa

#### product_contents
Conteúdos do produto:
- `product_id` - ID do produto
- `content_type` - Tipo (video/audio/pdf/text/image)
- `title` - Título do conteúdo
- `content_url` - URL do arquivo
- `order_index` - Ordem de exibição

#### login_attempts
Log de tentativas de login para rate limiting

#### hotmart_webhooks
Histórico de webhooks recebidos

## Adicionando Conteúdo

Insira conteúdos diretamente no Supabase:

```sql
INSERT INTO public.product_contents (
  product_id,
  content_type,
  title,
  description,
  content_url,
  order_index
) VALUES (
  'PRODUTO_001',
  'video',
  'Aula 1: Introdução',
  'Bem-vindo ao curso',
  'https://seu-cdn.com/video1.mp4',
  1
);
```

### Tipos de Conteúdo Suportados

- **video** - Vídeos MP4
- **audio** - Áudios MP3
- **pdf** - Documentos PDF
- **image** - Imagens (JPG, PNG)
- **text** - Conteúdo HTML

## Proteções de Segurança

### Client-Side
- Desabilitar botão direito do mouse
- Bloquear teclas de atalho (F12, Ctrl+Shift+I, etc.)
- Prevenir seleção e cópia de texto
- Detecção de DevTools aberto
- Proteção contra drag-and-drop

### Server-Side
- Rate limiting por IP e e-mail
- Validação de sessão em cada requisição
- Bloqueio de múltiplos acessos simultâneos
- Verificação de IP e User-Agent
- Expiração automática de sessões

## PWA - Instalação

### iOS (Safari)
1. Abra o site no Safari
2. Toque no botão "Compartilhar"
3. Selecione "Adicionar à Tela de Início"

### Android (Chrome)
1. Abra o site no Chrome
2. Toque no menu (3 pontos)
3. Selecione "Adicionar à tela inicial"
4. Ou use o banner automático

## Deploy

### Vercel (Recomendado)

```bash
npm install -g vercel
vercel
```

### Outras Plataformas
- Railway
- Render
- AWS Amplify
- DigitalOcean App Platform

## Personalização

### Cores e Branding

Edite `tailwind.config.ts`:

```typescript
colors: {
  primary: {
    500: '#sua-cor-principal',
    600: '#sua-cor-escura',
    // ...
  }
}
```

### Ícones PWA

Substitua os arquivos em `/public`:
- `icon-192x192.png`
- `icon-512x512.png`
- `favicon.ico`

### Textos e Mensagens

Edite diretamente nos componentes React em `/app` e `/components`

## Troubleshooting

### Login não funciona
- Verifique as variáveis de ambiente
- Confirme que o e-mail está na tabela `users_access`
- Verifique se `status_compra = 'active'`

### Webhook não processa
- Verifique a URL no painel da Hotmart
- Confirme o `HOTMART_WEBHOOK_SECRET`
- Veja os logs em `hotmart_webhooks` no Supabase

### PWA não instala
- Certifique-se de estar usando HTTPS em produção
- Verifique se `manifest.json` está acessível
- Confirme que o Service Worker está registrado

## Segurança em Produção

### Checklist
- [ ] Usar HTTPS
- [ ] Configurar CORS adequadamente
- [ ] Rotacionar `SESSION_SECRET`
- [ ] Habilitar RLS (Row Level Security) no Supabase
- [ ] Configurar rate limiting no servidor
- [ ] Monitorar logs de acesso
- [ ] Implementar alertas de fraude
- [ ] Fazer backup regular do banco

## Próximos Passos

### Melhorias Sugeridas
- [ ] Sistema de notificações push
- [ ] Analytics e métricas de uso
- [ ] Sistema de comentários/feedback
- [ ] Gamificação (progresso, badges)
- [ ] Integração com outras plataformas (Eduzz, Kiwify)
- [ ] Suporte a múltiplos idiomas
- [ ] Dark mode
- [ ] Certificado de conclusão

## Suporte

Para dúvidas e suporte:
- WhatsApp configurado em `NEXT_PUBLIC_WHATSAPP_SUPPORT`
- Issues no GitHub
- E-mail: seu-email@dominio.com

## Licença

Proprietário - Todos os direitos reservados

---

Desenvolvido com Next.js 14 + Supabase
