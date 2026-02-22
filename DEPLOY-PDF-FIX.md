# Deploy da Correção do PDF Viewer

## Alterações Realizadas

### 1. [components/PDFViewer.tsx](components/PDFViewer.tsx)
**Problema:** URLs públicas do R2 causavam erro de CORS no react-pdf

**Solução:** Detectar URLs do R2 público e automaticamente roteá-las pelo proxy interno

**Mudança:** Linhas 25-37
```typescript
// Antes: URLs HTTPS eram carregadas diretamente (causava CORS error)
const initialUrl = url.startsWith('r2://')
  ? `/api/r2-content?key=${encodeURIComponent(url.replace('r2://', ''))}`
  : url

// Depois: URLs do R2 público são roteadas pelo proxy
const initialUrl = (() => {
  if (url.startsWith('r2://')) {
    return `/api/r2-content?key=${encodeURIComponent(url.replace('r2://', ''))}`
  } else if (url.startsWith('https://pub-') && url.includes('.r2.dev/')) {
    // URL pública do R2 -> sempre usar proxy para evitar CORS
    return `/api/pdf-proxy?url=${encodeURIComponent(url)}`
  } else if (url.startsWith('http://') || url.startsWith('https://')) {
    return `/api/pdf-proxy?url=${encodeURIComponent(url)}`
  }
  return url
})()
```

### 2. [app/api/pdf-proxy/route.ts](app/api/pdf-proxy/route.ts)
**Problema:** Faltava handler para CORS preflight (OPTIONS request)

**Solução:** Adicionado handler OPTIONS para CORS

**Mudança:** Linhas 7-16
```typescript
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  })
}
```

### 3. [app/api/r2-content/route.ts](app/api/r2-content/route.ts)
**Problema:** Faltava handler para CORS preflight (OPTIONS request)

**Solução:** Adicionado handler OPTIONS para CORS

**Mudança:** Linhas 8-17 (mesma implementação do pdf-proxy)

## Como Fazer o Deploy

### Opção 1: Deploy Automático via Vercel (Recomendado)

```bash
# 1. Commit das alterações
git add components/PDFViewer.tsx app/api/pdf-proxy/route.ts app/api/r2-content/route.ts
git commit -m "$(cat <<'EOF'
Fix PDF viewer CORS issue with R2 public URLs

- Auto-detect R2 public URLs and route through internal proxy
- Add CORS preflight handlers (OPTIONS) to both API routes
- Prevent CORS errors when loading PDFs with react-pdf

This fixes the "Error al cargar el PDF" issue in production.

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>
EOF
)"

# 2. Push para o repositório
git push origin main

# 3. Aguardar deploy automático do Vercel (2-3 minutos)
```

### Opção 2: Deploy Manual

Se você não tem deploy automático configurado:

```bash
# 1. Fazer build local
npm run build

# 2. Deploy manual no Vercel
vercel --prod

# Ou se preferir outro serviço de hosting, siga as instruções específicas
```

## Como Testar Após o Deploy

### Teste 1: Verificar se o build passou
1. Acesse o dashboard do Vercel
2. Verifique se o deploy foi bem-sucedido
3. Veja os logs para garantir que não há erros

### Teste 2: Testar a aplicação
1. Acesse seu domínio em produção
2. Faça login na aplicação
3. Vá para a aba "Materiales"
4. Clique no "Material Complementar"
5. **Resultado esperado:** O PDF deve carregar e exibir corretamente no preview

### Teste 3: Verificar a requisição (Opcional)
Se você tiver acesso ao console do navegador em produção:

1. Abra Developer Tools (F12)
2. Vá para a aba Network
3. Clique no PDF para carregar
4. Verifique se há uma requisição para:
   - `/api/pdf-proxy?url=https%3A%2F%2Fpub-bfc09221ea1742d8ab16d9076aa4858b.r2.dev%2Fpdfs%2FRelat%25C3%25B3rio_InfoDental-76.pdf`
5. Status deve ser: **200 OK**
6. Response Type deve ser: **application/pdf**

## Troubleshooting

### Problema: "Error al cargar el PDF" ainda aparece

**Causa possível:** Cache do navegador ou do Vercel

**Solução:**
```bash
# 1. Limpar cache do navegador (Hard Refresh)
# Chrome/Edge: Ctrl + Shift + R
# Firefox: Ctrl + F5
# Safari: Cmd + Option + R

# 2. Se ainda não funcionar, force um novo deploy
git commit --allow-empty -m "Force redeploy to clear cache"
git push origin main
```

### Problema: Build falhou no Vercel

**Causa possível:** Erro de TypeScript

**Solução:**
```bash
# Testar build localmente primeiro
npm run build

# Se houver erros, corrigir e fazer commit novamente
```

### Problema: 401 Unauthorized na API

**Causa:** Usuário não está autenticado

**Solução:**
1. Fazer logout
2. Limpar cookies do navegador
3. Fazer login novamente
4. Testar o PDF

### Problema: 404 Not Found ao acessar a API

**Causa:** As rotas de API não foram deployadas corretamente

**Solução:**
1. Verificar se os arquivos estão no repositório:
   - `app/api/pdf-proxy/route.ts`
   - `app/api/r2-content/route.ts`
2. Fazer redeploy

## Verificação Rápida

Execute este checklist antes e depois do deploy:

**Antes do Deploy:**
- [ ] Código alterado em `components/PDFViewer.tsx`
- [ ] Handler OPTIONS adicionado em `app/api/pdf-proxy/route.ts`
- [ ] Handler OPTIONS adicionado em `app/api/r2-content/route.ts`
- [ ] Build local funciona (`npm run build`)
- [ ] Commit feito com mensagem descritiva

**Depois do Deploy:**
- [ ] Deploy bem-sucedido no Vercel
- [ ] Aplicação carrega sem erros
- [ ] Login funciona normalmente
- [ ] Aba "Materiales" acessível
- [ ] PDF preview funciona (não mostra erro)
- [ ] PDF pode ser visualizado página por página
- [ ] Botão "Descargar" ainda funciona

## Próximos Passos (Opcional)

Após confirmar que está funcionando:

1. **Otimizar Performance:**
   - Considere usar `r2://` ao invés de URLs públicas no banco
   - URLs `r2://` são mais rápidas pois pulam uma camada de proxy

2. **Monitoramento:**
   - Configure alertas no Vercel para erros 500
   - Monitore o uso de banda com o R2

3. **Melhorias Futuras:**
   - Adicionar mais PDFs à biblioteca
   - Implementar upload de PDFs via interface admin
   - Adicionar cache mais agressivo para PDFs

## Suporte

Se após o deploy o problema persistir, me forneça:
1. URL do PDF no banco de dados
2. Screenshot do erro (se conseguir)
3. Logs do Vercel (aba "Deployments" > Clique no deploy > "View Function Logs")

## Resumo Executivo

✅ **O que foi corrigido:** PDFs com URLs públicas do R2 agora passam pelo proxy interno, evitando erros de CORS

✅ **Arquivos modificados:** 3 arquivos (PDFViewer, pdf-proxy, r2-content)

✅ **Ação necessária:** Fazer commit e push para deploy automático

✅ **Tempo estimado:** Deploy completo em 2-3 minutos

✅ **Risco:** Baixo - mudanças são backwards-compatible
