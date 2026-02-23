# Configuração do Cloudflare R2 Storage

Este guia explica como configurar o Cloudflare R2 para armazenar e servir arquivos de mídia (PDFs, áudios, vídeos) na aplicação.

## Por que usar Cloudflare R2?

- ✅ **Zero custos de saída**: Diferente do S3 da AWS, o R2 não cobra por tráfego de saída
- ✅ **Compatível com S3**: Usa a mesma API do S3, facilitando migração
- ✅ **Global CDN**: Distribuição global de conteúdo
- ✅ **Armazenamento barato**: ~$0.015 por GB/mês

## Passo 1: Criar conta no Cloudflare

1. Acesse [dash.cloudflare.com](https://dash.cloudflare.com)
2. Crie uma conta ou faça login
3. No menu lateral, vá em **R2 Object Storage**

## Passo 2: Criar um Bucket

1. Clique em **Create bucket**
2. Nome do bucket: `lt-entregaveis` (ou outro nome de sua preferência)
3. Região: Escolha **Automatic** para distribuição global
4. Clique em **Create bucket**

## Passo 3: Obter credenciais de acesso

### 3.1 Account ID

1. No dashboard do R2, você verá seu **Account ID** no topo da página
2. Copie este ID (ex: `abc123def456`)

### 3.2 Access Key e Secret Key

1. No dashboard do R2, vá em **Manage R2 API Tokens**
2. Clique em **Create API Token**
3. Configure:
   - **Token name**: `lt-entregaveis-api`
   - **Permissions**: `Admin Read & Write` (ou apenas Read/Write se preferir)
   - **TTL**: Escolha um tempo de expiração ou deixe sem expiração
4. Clique em **Create API Token**
5. **IMPORTANTE**: Copie e salve em local seguro:
   - **Access Key ID** (ex: `abc123...`)
   - **Secret Access Key** (ex: `xyz789...`)
   - ⚠️ **A Secret Key só aparece uma vez!** Se perder, precisará criar nova chave.

## Passo 4: Configurar variáveis de ambiente

### 4.1 Local (desenvolvimento)

Adicione no arquivo `.env.local`:

```bash
# Cloudflare R2 Storage
R2_ACCOUNT_ID=seu_account_id_aqui
R2_ACCESS_KEY_ID=sua_access_key_aqui
R2_SECRET_ACCESS_KEY=sua_secret_key_aqui
R2_BUCKET_NAME=lt-neuroreset
```

### 4.2 Vercel (produção)

1. Acesse o dashboard do Vercel
2. Vá em **Settings** → **Environment Variables**
3. Adicione as seguintes variáveis:

| Nome | Valor | Ambiente |
|------|-------|----------|
| `R2_ACCOUNT_ID` | Seu Account ID | Production, Preview, Development |
| `R2_ACCESS_KEY_ID` | Sua Access Key | Production, Preview, Development |
| `R2_SECRET_ACCESS_KEY` | Sua Secret Key | Production, Preview, Development |
| `R2_BUCKET_NAME` | `lt-entregaveis` | Production, Preview, Development |

4. Faça um novo deploy ou redeploy do projeto

## Passo 5: Fazer upload de arquivos

### 5.1 Via Dashboard do Cloudflare

1. Acesse seu bucket no dashboard do R2
2. Clique em **Upload**
3. Organize os arquivos em pastas:
   ```
   pdfs/
     └── material-complementar.pdf
   audios/
     └── aula-01.mp3
   videos/
     └── introducao.mp4
   ```

### 5.2 Via Código (programaticamente)

Use a biblioteca criada em `lib/r2.ts`:

```typescript
import { uploadFileToR2, generateR2Key } from '@/lib/r2'

// Exemplo: Upload de um PDF
const file = // ... arquivo do upload
const key = generateR2Key('pdf', 'material-complementar.pdf')
await uploadFileToR2({
  key: key,
  body: fileBuffer,
  contentType: 'application/pdf'
})
```

## Passo 6: Usar arquivos do R2 na aplicação

### URLs suportadas

A aplicação suporta três tipos de URLs para conteúdo:

1. **URLs externas (HTTPS)**:
   ```
   https://example.com/arquivo.pdf
   ```

2. **URLs do Supabase Storage**:
   ```
   https://xftofvacirebjcypfqnj.supabase.co/storage/v1/object/public/...
   ```

3. **URLs do R2** (novo):
   ```
   r2://pdfs/material-complementar.pdf
   r2://audios/aula-01.mp3
   ```

### Exemplo: Adicionar conteúdo no banco de dados

```sql
-- Inserir um PDF armazenado no R2
INSERT INTO module_contents (
  module_id,
  content_type,
  title,
  description,
  content_url,
  order_index
) VALUES (
  'module-uuid-aqui',
  'pdf',
  'Material Complementar',
  'PDF com exercícios práticos',
  'r2://pdfs/material-complementar.pdf',
  1
);

-- Inserir um áudio armazenado no R2
INSERT INTO module_contents (
  module_id,
  content_type,
  title,
  description,
  content_url,
  duration,
  order_index
) VALUES (
  'module-uuid-aqui',
  'audio',
  'Aula 1: Bem-vindo',
  'Introdução ao curso',
  'r2://audios/aula-01.mp3',
  1800, -- 30 minutos em segundos
  2
);
```

## Estrutura recomendada de pastas no R2

```
lt-entregaveis/
├── pdfs/
│   ├── 1702912345-material-complementar.pdf
│   └── 1702912346-exercicios.pdf
├── audios/
│   ├── 1702912347-aula-01.mp3
│   └── 1702912348-aula-02.mp3
├── videos/
│   ├── 1702912349-introducao.mp4
│   └── 1702912350-modulo-01.mp4
└── images/
    ├── 1702912351-thumbnail-01.jpg
    └── 1702912352-thumbnail-02.jpg
```

## Custos estimados

Exemplo para um curso com:
- 50 PDFs (total: 500 MB)
- 100 áudios (total: 5 GB)
- 20 vídeos (total: 20 GB)

**Total de armazenamento**: ~25.5 GB

**Custo mensal**:
- Armazenamento: 25.5 GB × $0.015 = **$0.38/mês**
- Operações (Classe A): Praticamente zero com caching
- Operações (Classe B): Praticamente zero com caching
- Transferência de saída: **$0.00** (Cloudflare não cobra!)

**Total estimado**: **< $1/mês** 🎉

## Verificar se está funcionando

1. Após configurar as variáveis de ambiente, reinicie o servidor:
   ```bash
   npm run dev
   ```

2. Adicione um conteúdo com URL do R2 no banco:
   ```sql
   UPDATE module_contents
   SET content_url = 'r2://pdfs/teste.pdf'
   WHERE id = 'seu-content-id';
   ```

3. Acesse o dashboard e tente visualizar o conteúdo

4. Verifique os logs do navegador para confirmar que está carregando do R2

## Solução de problemas

### Erro: "Cloudflare R2 não configurado"

- Verifique se todas as variáveis de ambiente estão corretas
- Reinicie o servidor após adicionar as variáveis

### Erro: "Access Denied"

- Verifique se a API Token tem permissões de leitura/escrita
- Confirme que o bucket name está correto

### PDF não carrega

1. Verifique se o arquivo existe no bucket
2. Verifique se a URL está no formato correto: `r2://pasta/arquivo.pdf`
3. Abra o console do navegador para ver logs de erro
4. Verifique se o `pdf.worker.min.mjs` está acessível em `/pdf.worker.min.mjs`

## Migração do Supabase Storage para R2

Se você já tem arquivos no Supabase Storage e quer migrar para o R2:

1. Baixe todos os arquivos do Supabase
2. Faça upload no R2 seguindo a estrutura de pastas recomendada
3. Atualize as URLs no banco de dados:
   ```sql
   UPDATE module_contents
   SET content_url = REPLACE(
     content_url,
     'https://xftofvacirebjcypfqnj.supabase.co/storage/v1/object/public/audios/',
     'r2://audios/'
   )
   WHERE content_type = 'audio';
   ```

## Recursos adicionais

- [Documentação oficial do Cloudflare R2](https://developers.cloudflare.com/r2/)
- [Migração do S3 para R2](https://developers.cloudflare.com/r2/examples/aws/aws-sdk-go/)
- [Preços do R2](https://developers.cloudflare.com/r2/pricing/)

---

**Dúvidas?** Abra uma issue no repositório ou consulte a documentação do Cloudflare.
