# Guia de Setup - HuskyApp MVP

## Passo 1: Configurar o Supabase

### 1.1 Criar Projeto
1. Acesse https://supabase.com
2. Clique em "New Project"
3. Escolha um nome e senha
4. Aguarde a criação (2-3 minutos)

### 1.2 Executar Schema SQL
1. No menu lateral, clique em "SQL Editor"
2. Clique em "+ New Query"
3. Copie todo o conteúdo de `supabase/schema.sql`
4. Cole no editor e clique em "Run"
5. Aguarde a confirmação "Success. No rows returned"

### 1.3 Obter Credenciais
1. Vá em "Settings" > "API"
2. Copie:
   - Project URL → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon` `public` key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role` `secret` key → `SUPABASE_SERVICE_ROLE_KEY`

## Passo 2: Configurar Variáveis de Ambiente

### 2.1 Criar arquivo .env.local
```bash
cp .env.local.example .env.local
```

### 2.2 Preencher as variáveis

```env
# Cole as credenciais copiadas do Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...

# Hotmart (configurar depois)
HOTMART_WEBHOOK_SECRET=seu_secret_aqui
HOTMART_API_KEY=sua_chave_api

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_WHATSAPP_SUPPORT=5511999999999  # Seu WhatsApp com DDI

# Gerar um secret aleatório (mínimo 32 caracteres)
SESSION_SECRET=cole_uma_string_aleatoria_aqui_min_32_chars
```

Para gerar `SESSION_SECRET`:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

## Passo 3: Adicionar Usuário de Teste

No Supabase SQL Editor, execute:

```sql
INSERT INTO public.users_access (
  email,
  status_compra,
  product_id,
  product_name,
  data_compra,
  data_expiracao
) VALUES (
  'seu-email@teste.com',  -- Substitua pelo seu e-mail
  'active',
  'PRODUTO_TESTE',
  'Produto de Teste',
  NOW(),
  NOW() + INTERVAL '1 year'
);
```

## Passo 4: Adicionar Conteúdo de Teste

```sql
-- Vídeo de exemplo
INSERT INTO public.product_contents (
  product_id,
  content_type,
  title,
  description,
  content_url,
  thumbnail_url,
  duration,
  order_index
) VALUES (
  'PRODUTO_TESTE',
  'video',
  'Aula 1: Bem-vindo',
  'Introdução ao curso',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/images/BigBuckBunny.jpg',
  596,
  1
);

-- Áudio de exemplo
INSERT INTO public.product_contents (
  product_id,
  content_type,
  title,
  description,
  content_url,
  duration,
  order_index
) VALUES (
  'PRODUTO_TESTE',
  'audio',
  'Meditação Guiada',
  'Áudio de relaxamento - 5 minutos',
  'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
  300,
  2
);

-- PDF de exemplo
INSERT INTO public.product_contents (
  product_id,
  content_type,
  title,
  description,
  content_url,
  order_index
) VALUES (
  'PRODUTO_TESTE',
  'pdf',
  'Material Complementar',
  'PDF com exercícios práticos',
  'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
  3
);
```

## Passo 5: Instalar e Executar

```bash
# Instalar dependências
npm install

# Executar em desenvolvimento
npm run dev
```

Acesse: http://localhost:3000

## Passo 6: Testar o Login

1. Na página inicial, digite o e-mail que você cadastrou no Passo 3
2. Clique em "Acessar Meu Conteúdo"
3. Você deve ser redirecionado para o dashboard
4. Visualize os conteúdos de teste

## Passo 7: Configurar Webhook da Hotmart (Produção)

### 7.1 Fazer Deploy
Primeiro, faça deploy do app em produção (Vercel, Railway, etc.)

### 7.2 Configurar na Hotmart
1. Acesse o painel da Hotmart
2. Vá em "Ferramentas" > "Webhooks"
3. Clique em "+ Novo Webhook"
4. Configure:
   - **URL**: `https://seu-dominio.com/api/webhook/hotmart`
   - **Eventos**: Selecione todos (PURCHASE_*, SUBSCRIPTION_*)
   - **Versão**: v2
5. Salve e copie o "Hot Secret"
6. Cole no `.env.local` como `HOTMART_WEBHOOK_SECRET`

### 7.3 Testar Webhook
1. No painel da Hotmart, clique em "Testar Webhook"
2. Verifique os logs no Supabase:
```sql
SELECT * FROM public.hotmart_webhooks ORDER BY created_at DESC LIMIT 10;
```

## Passo 8: Personalizar o App

### 8.1 Cores e Branding
Edite `tailwind.config.ts` para mudar as cores principais

### 8.2 Logo e Ícones
Substitua os arquivos em `/public`:
- `icon-192x192.png` (192x192px)
- `icon-512x512.png` (512x512px)
- `favicon.ico` (32x32px)

Use ferramentas como:
- https://realfavicongenerator.net/
- https://www.favicon-generator.org/

### 8.3 Textos
Edite os textos nos componentes:
- `app/page.tsx` - Landing page de login
- `app/dashboard/page.tsx` - Dashboard
- `app/layout.tsx` - Meta tags

### 8.4 WhatsApp de Suporte
Configure `NEXT_PUBLIC_WHATSAPP_SUPPORT` com seu número (formato: 5511999999999)

## Passo 9: Deploy em Produção

### Opção A: Vercel (Recomendado)

```bash
# Instalar Vercel CLI
npm install -g vercel

# Fazer deploy
vercel

# Configurar variáveis de ambiente
vercel env add NEXT_PUBLIC_SUPABASE_URL
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
vercel env add SUPABASE_SERVICE_ROLE_KEY
# ... adicione todas as outras variáveis

# Deploy em produção
vercel --prod
```

### Opção B: Railway

1. Vá em https://railway.app
2. "New Project" > "Deploy from GitHub repo"
3. Selecione seu repositório
4. Adicione as variáveis de ambiente
5. Deploy automático

### Opção C: Render

1. Vá em https://render.com
2. "New" > "Web Service"
3. Conecte seu repositório
4. Configure:
   - Build Command: `npm install && npm run build`
   - Start Command: `npm start`
5. Adicione variáveis de ambiente
6. Deploy

## Passo 10: Configurar Domínio (Opcional)

### 10.1 Comprar Domínio
- Registro.br
- GoDaddy
- Namecheap

### 10.2 Configurar DNS
No painel do seu provedor de domínio, adicione:

**Vercel:**
```
Type: CNAME
Name: @
Value: cname.vercel-dns.com
```

**Railway/Render:**
Siga as instruções específicas da plataforma

### 10.3 Configurar SSL
A maioria das plataformas configura SSL automaticamente

## Passo 11: Testar PWA

### No Mobile

**iOS:**
1. Abra o site no Safari
2. Toque no botão "Compartilhar" (quadrado com seta)
3. Role até "Adicionar à Tela de Início"
4. Toque em "Adicionar"

**Android:**
1. Abra o site no Chrome
2. Aguarde o banner de instalação
3. Ou: Menu > "Adicionar à tela inicial"

O app deve abrir sem a barra de endereço do navegador!

## Troubleshooting Comum

### "E-mail não encontrado"
→ Verifique se adicionou o usuário no Supabase (Passo 3)

### "Erro ao conectar"
→ Verifique as credenciais do Supabase no `.env.local`

### Conteúdos não aparecem
→ Confirme que `product_id` no usuário e nos conteúdos são iguais

### PWA não instala
→ Use HTTPS em produção (deploy feito)

### Webhook não funciona
→ Verifique URL e secret no painel da Hotmart

## Próximos Passos

- [ ] Adicionar seus conteúdos reais
- [ ] Customizar cores e logo
- [ ] Configurar webhook da Hotmart
- [ ] Testar compra real
- [ ] Monitorar logs de acesso
- [ ] Configurar backup automático do Supabase

## Suporte

Se precisar de ajuda:
1. Revise este guia
2. Confira o README.md
3. Entre em contato pelo WhatsApp configurado

Boa sorte com seu lançamento! 🚀
