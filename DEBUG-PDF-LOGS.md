# Como Obter os Logs de Debug do PDF

## Deploy Realizado

✅ Commit: `0842cec` - Logs de debug adicionados
✅ Push: Enviado para produção

## Como Ver os Logs

### Opção 1: Logs do Vercel (RECOMENDADO)

1. **Acesse o Vercel Dashboard:**
   - Vá para [vercel.com/dashboard](https://vercel.com/dashboard)
   - Selecione o projeto `lt-entregaveis`

2. **Vá para a aba "Deployments":**
   - Clique no deployment mais recente (deve ter o commit `0842cec`)
   - Ou espere alguns minutos após o push

3. **Clique em "View Function Logs":**
   - Isso mostra os logs em tempo real das serverless functions

4. **Teste o PDF na aplicação:**
   - Abra seu site em produção
   - Vá para "Materiales"
   - Clique no "Material Complementar"

5. **Observe os logs aparecerem:**
   - Você verá logs começando com emojis:
     - 🔍 = Info do PDFViewer no navegador
     - 📥 = Requisição chegou na API
     - ✅ = Sucesso
     - ❌ = Erro
     - 📍 = Detalhes do erro

### Opção 2: Console do Navegador (SE POSSÍVEL)

Se você conseguir habilitar o F12 temporariamente:

1. Abra Developer Tools (F12)
2. Vá para a aba "Console"
3. Clique no PDF
4. Veja os logs no console com os emojis

## O Que Procurar nos Logs

### Cenário 1: URL Não Está Sendo Detectada Corretamente

```
🔍 PDFViewer - URL original recebida: https://pub-...
⚠️ PDFViewer - URL não processada: https://pub-...
```

**Diagnóstico:** A detecção de URL do R2 falhou
**Solução:** Ajustar a regex de detecção

### Cenário 2: Requisição Não Chega na API

```
🔍 PDFViewer - URL original recebida: https://pub-...
✅ PDFViewer - URL pública do R2 detectada, usando proxy: /api/pdf-proxy?url=...
❌ Error loading PDF: [erro aqui]
(mas NÃO aparece "📥 [PDF-PROXY] Nova requisição recebida")
```

**Diagnóstico:** A requisição não chegou na API (problema de autenticação ou CORS)
**Solução:** Verificar cookies/sessão

### Cenário 3: API Recebe mas Falha na Autenticação

```
📥 [PDF-PROXY] Nova requisição recebida
❌ [PDF-PROXY] Usuário não autenticado
```

**Diagnóstico:** Cookie de sessão não está sendo enviado
**Solução:** Problema com cookies httpOnly ou SameSite

### Cenário 4: API Falha ao Buscar o PDF do R2

```
📥 [PDF-PROXY] Nova requisição recebida
✅ [PDF-PROXY] Usuário autenticado
🔍 [PDF-PROXY] URL solicitada: https://pub-...
📡 [PDF-PROXY] Fazendo fetch do PDF...
❌ [PDF-PROXY] Error fetching PDF: Not Found Status: 404
```

**Diagnóstico:** URL do R2 está incorreta ou arquivo não existe
**Solução:** Verificar URL no banco de dados

### Cenário 5: Tudo Funciona mas react-pdf Falha

```
📥 [PDF-PROXY] Nova requisição recebida
✅ [PDF-PROXY] Usuário autenticado
🔍 [PDF-PROXY] URL solicitada: https://pub-...
📡 [PDF-PROXY] Fazendo fetch do PDF...
✅ [PDF-PROXY] PDF fetched successfully
✅ [PDF-PROXY] Buffer obtido, tamanho: 51200 bytes
✅ [PDF-PROXY] Retornando PDF ao cliente
(mas ainda dá erro no navegador)
```

**Diagnóstico:** Problema com react-pdf ou PDF.js worker
**Solução:** Verificar se o worker está acessível

## Após Coletar os Logs

Me envie os logs que apareceram. Com base neles, vou identificar exatamente onde está o problema e criar a correção específica.

### Formato Ideal:

Copie e cole todos os logs que aparecerem, incluindo:
- Logs do console do navegador (se possível)
- Logs do Vercel Function Logs
- Screenshot do erro (se quiser)

## Possíveis Problemas Identificados

### Hipótese 1: Cookie httpOnly não está sendo enviado em requisições client-side

**Teste:** Tente acessar diretamente no navegador:
```
https://seu-dominio.com/api/pdf-proxy?url=https%3A%2F%2Fpub-bfc09221ea1742d8ab16d9076aa4858b.r2.dev%2Fpdfs%2FRelat%25C3%25B3rio_InfoDental-76.pdf
```

- Se mostrar o PDF: API funciona, problema é no react-pdf
- Se mostrar erro 401: Problema de autenticação
- Se mostrar o PDF mas preview não funciona: Problema com CORS ou Content-Type

### Hipótese 2: URL encoding duplo

A URL já está encoded no banco (`%C3%B3`), e estamos encodando novamente.

**Solução:** Decodificar antes de encodar novamente

### Hipótese 3: Worker do PDF.js não está acessível

**Teste:** Abra:
```
https://seu-dominio.com/pdf.worker.min.mjs
```

- Deve mostrar o código JavaScript do worker
- Se der 404: Worker não foi deployado

## Próximos Passos

1. ⏳ Aguarde o deploy do Vercel (2-3 minutos)
2. 🔍 Teste o PDF novamente
3. 📝 Acesse os logs no Vercel ou console
4. 📤 Me envie os logs
5. 🔧 Vou criar a correção baseada nos logs

## Atalho Rápido

Se você quiser pular direto para uma solução alternativa sem esperar logs:

Execute no Supabase para usar o protocolo `r2://` ao invés de URL pública:

```sql
UPDATE product_contents
SET content_url = 'r2://pdfs/Relatório_InfoDental-76.pdf'
WHERE id = 'f9833cfc-664a-4348-b34a-81c50cabd1b0';
```

Isso pode funcionar melhor pois evita o double-encoding e usa a API interna diretamente.
