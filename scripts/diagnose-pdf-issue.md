# Diagnóstico do Problema do PDF Preview

## Informação Atual

✅ **Download funciona** - O botão "Descargar" redireciona corretamente
❌ **Preview não funciona** - Mostra "Error al cargar el PDF"

## Passo 1: Verificar o Console do Navegador

1. Abra o Developer Tools (F12 ou Ctrl+Shift+I)
2. Vá para a aba "Console"
3. Recarregue a página e clique no PDF
4. Procure por erros em vermelho

### Erros Comuns e Soluções

#### Erro: "Failed to load PDF"
- Problema com o URL ou formato do arquivo

#### Erro: "CORS policy"
- Problema de CORS na API

#### Erro: "401 Unauthorized" ou "403 Forbidden"
- Problema de autenticação

#### Erro: "net::ERR_ABORTED" ou "404 Not Found"
- URL incorreta ou arquivo não existe

## Passo 2: Verificar a Aba Network

1. No Developer Tools, vá para a aba "Network"
2. Marque "Preserve log"
3. Recarregue a página e clique no PDF
4. Procure por requisições para:
   - `/api/r2-content?key=...`
   - `/api/pdf-proxy?url=...`

### O que verificar:

- **Status Code**: Deve ser 200 (OK)
  - Se for 401: Problema de autenticação
  - Se for 404: Arquivo não encontrado
  - Se for 500: Erro no servidor

- **Response Headers**: Verifique se tem:
  - `Content-Type: application/pdf`
  - `Content-Disposition: inline`

- **Preview**: Clique na requisição e vá em "Preview" ou "Response"
  - Deve mostrar o PDF ou pelo menos dados binários

## Passo 3: Verificar qual URL está sendo usada

No console do navegador, execute:

```javascript
// Pegar todos os conteúdos
const contents = document.querySelectorAll('[data-content-type="pdf"]');
console.log('PDFs encontrados:', contents);

// Ou verificar diretamente a URL sendo passada ao PDFViewer
console.log('URL do PDF:', document.querySelector('canvas')?.parentElement?.dataset?.url);
```

## Passo 4: Verificar o content_url no banco

Execute no Supabase SQL Editor:

```sql
SELECT
  id,
  title,
  content_url,
  LENGTH(content_url) as url_length,
  SUBSTRING(content_url, 1, 50) as url_preview
FROM product_contents
WHERE content_type = 'pdf';
```

### Formatos válidos:

- ✅ `r2://pdfs/Relatório_InfoDental-76.pdf`
- ✅ `https://pub-bfc09221ea1742d8ab16d9076aa4858b.r2.dev/pdfs/Relatório_InfoDental-76.pdf`
- ❌ `r2://lt-neuroreset/pdfs/...` (caminho errado)
- ❌ URLs com espaços não codificados

## Passo 5: Teste Manual da API

Abra uma nova aba e tente acessar diretamente:

```
http://localhost:3000/api/r2-content?key=pdfs/Relatório_InfoDental-76.pdf
```

ou se estiver em produção:

```
https://seu-dominio.com/api/r2-content?key=pdfs/Relatório_InfoDental-76.pdf
```

### Resultado esperado:
- Deve mostrar o PDF diretamente no navegador
- Se pedir login: problema de autenticação
- Se mostrar erro: verificar mensagem de erro

## Passo 6: Verificar se é problema de URL encoding

O arquivo tem caracteres especiais (ó). Teste:

```sql
-- Atualizar para URL encoded se necessário
UPDATE product_contents
SET content_url = 'r2://pdfs/Relat%C3%B3rio_InfoDental-76.pdf'
WHERE content_type = 'pdf';
```

## Possíveis Soluções

### Solução 1: Se o download funciona, use URL pública

Se o botão "Descargar" funciona, significa que o `content_url` atual é uma URL HTTPS válida.

Verifique qual URL está no banco e me informe.

### Solução 2: Verificar se o PDFViewer está recebendo a URL correta

Adicione logs no componente temporariamente.

### Solução 3: Verificar autenticação

O preview requer autenticação via cookie. Tente:
1. Fazer logout
2. Limpar cookies
3. Fazer login novamente
4. Testar o preview

## Me informe:

1. ✅ Qual URL está no campo `content_url` do banco?
2. ✅ Quais erros aparecem no Console (F12)?
3. ✅ Qual o status code da requisição na aba Network?
4. ✅ A URL `/api/r2-content?key=...` funciona quando acessada diretamente?

Com essas informações, posso identificar exatamente o problema e corrigi-lo.
