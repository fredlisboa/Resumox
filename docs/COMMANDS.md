# Comandos Úteis - HuskyApp MVP

## 🚀 Desenvolvimento

### Instalação Inicial
```bash
cd huskyapp-mvp
npm install
```

### Executar em Desenvolvimento
```bash
npm run dev
# Acesse: http://localhost:3000
```

### Build de Produção
```bash
npm run build
npm start
```

### Linting
```bash
npm run lint
```

---

## 📦 Deploy

### Vercel (Recomendado)

```bash
# Instalar CLI
npm install -g vercel

# Login
vercel login

# Deploy em preview
vercel

# Deploy em produção
vercel --prod

# Ver logs
vercel logs

# Adicionar variáveis de ambiente
vercel env add NEXT_PUBLIC_SUPABASE_URL
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
vercel env add SUPABASE_SERVICE_ROLE_KEY
vercel env add HOTMART_WEBHOOK_SECRET
vercel env add NEXT_PUBLIC_APP_URL
vercel env add NEXT_PUBLIC_WHATSAPP_SUPPORT
vercel env add SESSION_SECRET

# Listar projetos
vercel list

# Remover projeto
vercel remove huskyapp-mvp
```

### Railway

```bash
# Instalar CLI
npm install -g @railway/cli

# Login
railway login

# Iniciar projeto
railway init

# Deploy
railway up

# Ver logs
railway logs

# Adicionar variáveis
railway variables set NEXT_PUBLIC_SUPABASE_URL=valor
```

### Docker (Opcional)

```bash
# Build da imagem
docker build -t huskyapp-mvp .

# Executar container
docker run -p 3000:3000 huskyapp-mvp

# Parar container
docker stop huskyapp-mvp
```

---

## 🗄️ Supabase

### CLI do Supabase

```bash
# Instalar
npm install -g supabase

# Login
supabase login

# Iniciar projeto local
supabase init

# Executar migrations
supabase db push

# Ver status
supabase status

# Dump do schema
supabase db dump -f supabase/schema.sql

# Reset database (CUIDADO!)
supabase db reset
```

### Queries via CLI

```bash
# Conectar ao banco
psql postgresql://postgres:[PASSWORD]@db.[PROJECT].supabase.co:5432/postgres

# Ou via supabase CLI
supabase db psql
```

---

## 🔍 Debugging

### Ver logs de desenvolvimento
```bash
npm run dev 2>&1 | tee debug.log
```

### Limpar cache do Next.js
```bash
rm -rf .next
npm run dev
```

### Verificar build
```bash
npm run build
# Verificar erros de TypeScript
```

### Testar produção localmente
```bash
npm run build
npm start
```

---

## 🧪 Testes

### Testar autenticação
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"teste@exemplo.com"}'
```

### Testar sessão
```bash
curl http://localhost:3000/api/auth/session \
  -H "Cookie: huskyapp_session=TOKEN_AQUI"
```

### Testar webhook (local)
```bash
curl -X POST http://localhost:3000/api/webhook/hotmart \
  -H "Content-Type: application/json" \
  -d @webhook-test.json
```

Onde `webhook-test.json`:
```json
{
  "event": "PURCHASE_APPROVED",
  "version": "2.0",
  "data": {
    "product": {
      "id": "PRODUTO_001",
      "name": "Meu Produto"
    },
    "buyer": {
      "email": "cliente@teste.com",
      "name": "Cliente Teste"
    },
    "purchase": {
      "transaction": "TR123456",
      "status": "approved",
      "order_date": 1640000000
    }
  }
}
```

---

## 📊 Monitoramento

### Ver logs em tempo real (Vercel)
```bash
vercel logs --follow
```

### Ver logs de erros
```bash
vercel logs --filter=error
```

### Estatísticas de deploy
```bash
vercel inspect [DEPLOYMENT-URL]
```

---

## 🔧 Manutenção

### Atualizar dependências
```bash
# Ver atualizações disponíveis
npm outdated

# Atualizar tudo
npm update

# Atualizar Next.js
npm install next@latest react@latest react-dom@latest

# Auditoria de segurança
npm audit
npm audit fix
```

### Limpar node_modules
```bash
rm -rf node_modules package-lock.json
npm install
```

### Verificar tamanho do build
```bash
npm run build
du -sh .next
```

---

## 🗃️ Backup e Restore

### Backup do Supabase
```bash
# Via CLI
supabase db dump -f backup-$(date +%Y%m%d).sql

# Via pg_dump (direto)
pg_dump postgresql://postgres:[PASSWORD]@db.[PROJECT].supabase.co:5432/postgres > backup.sql
```

### Restore do Supabase
```bash
# Via psql
psql postgresql://postgres:[PASSWORD]@db.[PROJECT].supabase.co:5432/postgres < backup.sql
```

### Exportar dados de usuários
```bash
# No SQL Editor do Supabase
COPY (
  SELECT email, status_compra, data_compra
  FROM users_access
  WHERE status_compra = 'active'
) TO STDOUT WITH CSV HEADER;
```

---

## 🎨 Customização

### Gerar favicon
```bash
# Via ImageMagick
convert logo.png -resize 32x32 favicon.ico
convert logo.png -resize 192x192 icon-192x192.png
convert logo.png -resize 512x512 icon-512x512.png
```

### Otimizar imagens
```bash
# Instalar imagemin-cli
npm install -g imagemin-cli

# Otimizar
imagemin public/*.png --out-dir=public/
```

---

## 🔐 Segurança

### Gerar SESSION_SECRET
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Gerar hash de senha (se necessário)
```bash
node -e "console.log(require('crypto').createHash('sha256').update('senha').digest('hex'))"
```

### Verificar variáveis de ambiente
```bash
# Listar todas
vercel env ls

# Ver valores (produção)
vercel env pull .env.production
```

---

## 📈 Performance

### Analisar bundle
```bash
# Instalar analyzer
npm install -D @next/bundle-analyzer

# Adicionar ao next.config.js:
# const withBundleAnalyzer = require('@next/bundle-analyzer')({
#   enabled: process.env.ANALYZE === 'true',
# })
# module.exports = withBundleAnalyzer(config)

# Rodar análise
ANALYZE=true npm run build
```

### Lighthouse CI
```bash
# Instalar
npm install -g @lhci/cli

# Rodar
lhci autorun --collect.url=http://localhost:3000
```

---

## 🧹 Limpeza

### Limpar tudo
```bash
rm -rf node_modules .next .vercel
npm install
```

### Limpar cache npm
```bash
npm cache clean --force
```

### Limpar logs do Vercel
```bash
vercel logs --clear
```

---

## 🔄 Git

### Inicializar repositório
```bash
git init
git add .
git commit -m "Initial commit: HuskyApp MVP"
```

### Criar repositório no GitHub
```bash
# Via GitHub CLI
gh repo create huskyapp-mvp --private --source=. --remote=origin
git push -u origin main
```

### Deploy automático (Vercel + GitHub)
```bash
# Conectar Vercel ao GitHub
vercel --confirm

# Agora cada push faz deploy automático
git push origin main
```

---

## 📱 PWA

### Testar PWA localmente
```bash
# Usar HTTPS local com ngrok
npm install -g ngrok
npm run build && npm start
ngrok http 3000

# Abrir URL do ngrok no mobile
```

### Validar manifest
```bash
# Chrome DevTools
# F12 > Application > Manifest
# Verificar se não há erros
```

### Testar Service Worker
```bash
# Chrome DevTools
# F12 > Application > Service Workers
# Verificar se está registrado
```

---

## 🐛 Troubleshooting

### Erro "Module not found"
```bash
rm -rf node_modules package-lock.json
npm install
```

### Erro de TypeScript
```bash
npm run build
# Ver erros específicos
```

### Erro de Supabase
```bash
# Verificar conexão
curl https://[PROJECT].supabase.co/rest/v1/
```

### Port 3000 já em uso
```bash
# Encontrar processo
lsof -i :3000

# Matar processo
kill -9 [PID]

# Ou usar outra porta
PORT=3001 npm run dev
```

---

## 📞 Comandos de Suporte

### Obter informações do sistema
```bash
node -v
npm -v
next info
```

### Criar issue report
```bash
npx envinfo --system --binaries --npmPackages next,react,react-dom
```

---

## 🎯 Comandos Rápidos

```bash
# Setup completo
npm install && cp .env.local.example .env.local && echo "Configure .env.local agora"

# Deploy rápido (Vercel)
npm run build && vercel --prod

# Debug completo
npm run build && npm start | tee debug.log

# Reset total
rm -rf node_modules .next .vercel && npm install && npm run dev
```

---

**Salve este arquivo para referência rápida!**
