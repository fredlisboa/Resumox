# Guia de Correção do PDF Viewer

## Problema Identificado

O visualizador de PDF está mostrando o erro "Error al cargar el PDF - Por favor, intenta descargarlo".

## Causa Raiz

O PDF cadastrado no banco de dados pode estar com:
1. URL inválida ou inexistente
2. Caminho incorreto do arquivo no R2
3. Arquivo não existente no R2

## Solução

### Passo 1: Verificar PDF Atual no Banco de Dados

Execute o script SQL no Supabase SQL Editor:

```bash
# Abra: scripts/check-pdf-content.sql
```

Isso mostrará todos os PDFs cadastrados e seus URLs.

### Passo 2: Atualizar o PDF com o Arquivo Correto

1. Abra o arquivo: [scripts/update-pdf-to-r2.sql](../scripts/update-pdf-to-r2.sql)

2. Execute o **PASSO 1** no Supabase para ver o `id` e `product_id` do PDF

3. Copie o `id` do PDF que deseja atualizar

4. No **PASSO 2**, substitua `'PDF_ID_AQUI'` pelo ID copiado

5. Execute o UPDATE - use a **Opção A** (recomendada):

```sql
UPDATE product_contents
SET
  content_url = 'r2://pdfs/Relatório_InfoDental-76.pdf',
  updated_at = NOW()
WHERE id = 'seu-pdf-id-aqui'
  AND content_type = 'pdf';
```

6. Execute o **PASSO 3** para verificar se a atualização funcionou

7. Execute o **PASSO 4** para garantir que o PDF está ativo

### Passo 3: Verificar o Resultado

1. Faça logout e login novamente na aplicação (para limpar cache)
2. Vá para a aba "Materiales"
3. Clique no "Material Complementar"
4. O PDF deve carregar corretamente agora

## Informações Técnicas

### Arquivo PDF no R2

- **Localização confirmada:** `pdfs/Relatório_InfoDental-76.pdf`
- **Tamanho:** 49.92 KB
- **Validação:** ✅ PDF válido (header: %PDF)

### URLs Suportadas

O componente [PDFViewer.tsx](../components/PDFViewer.tsx) aceita três formatos de URL:

1. **R2 Protocol** (RECOMENDADO):
   ```
   r2://pdfs/Relatório_InfoDental-76.pdf
   ```
   - Processado via `/api/r2-content`
   - Requer autenticação
   - Cache de 1 hora

2. **URL Pública do R2**:
   ```
   https://pub-bfc09221ea1742d8ab16d9076aa4858b.r2.dev/pdfs/Relatório_InfoDental-76.pdf
   ```
   - Acesso direto (se bucket for público)
   - Sem necessidade de API proxy

3. **URL Externa HTTPS**:
   ```
   https://exemplo.com/arquivo.pdf
   ```
   - Processado via `/api/pdf-proxy`
   - Para PDFs hospedados externamente

## Componentes Envolvidos

1. **[PDFViewer.tsx](../components/PDFViewer.tsx)** (Linhas 1-147)
   - Componente principal de visualização
   - Suporta navegação entre páginas
   - Implementa fallback automático para proxy

2. **[ContentPlayer.tsx](../components/ContentPlayer.tsx)** (Linhas 146-197)
   - Wrapper que carrega o PDFViewer
   - Mostra botão de download
   - Lazy loading com Suspense

3. **[/api/r2-content/route.ts](../app/api/r2-content/route.ts)**
   - API que serve arquivos do R2
   - Verifica autenticação
   - Retorna PDF com headers corretos

4. **[Dashboard](../app/dashboard/page.tsx)** (Linhas 186-252)
   - Tab "Materiales" que lista PDFs
   - Integração com ContentList e ContentPlayer

## Comandos Úteis

```bash
# Listar todos os arquivos no R2
npm run list:r2

# Testar acesso ao PDF específico
npm run test:pdf

# Verificar configuração do R2
npm run test:r2
```

## Troubleshooting

### Erro: "Não autenticado"
- Certifique-se de estar logado
- Limpe os cookies e faça login novamente

### Erro: "Cloudflare R2 não configurado"
- Verifique as variáveis de ambiente no `.env.local`:
  - `R2_ACCOUNT_ID`
  - `R2_ACCESS_KEY_ID`
  - `R2_SECRET_ACCESS_KEY`
  - `R2_BUCKET_NAME`

### PDF ainda não carrega após atualização
1. Limpe o cache do navegador (Ctrl+Shift+Delete)
2. Faça logout e login novamente
3. Verifique o console do navegador (F12) para erros
4. Verifique os logs do servidor Next.js

### Verificar se o problema é no banco ou no código
Execute o teste:
```bash
npm run test:pdf
```

Se retornar ✅ mas o PDF não aparecer no site, o problema está:
- No código do componente
- Na autenticação
- No cache do navegador

Se retornar ❌, o problema está:
- Na configuração do R2
- No arquivo não existir
- Nas credenciais de acesso

## Próximos Passos Recomendados

1. ✅ Atualizar o `content_url` no banco de dados usando o script
2. ✅ Testar o carregamento do PDF na aplicação
3. ⚠️  Considerar adicionar mais PDFs para a biblioteca
4. ⚠️  Implementar upload de PDFs via interface admin (futuro)

## Notas Importantes

- O PDF **DEVE** estar no formato `r2://path/to/file.pdf` ou URL HTTPS válida
- O arquivo **DEVE** existir no R2 (verificar com `npm run list:r2`)
- O usuário **DEVE** estar autenticado para acessar PDFs via API
- O campo `is_active` **DEVE** estar como `true` na tabela `product_contents`
