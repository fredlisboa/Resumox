# Como Adicionar os Áudios do R2 no Banco de Dados

Você já fez upload dos 7 áudios no Cloudflare R2! 🎉

Agora precisa adicionar essas referências no banco de dados para que apareçam na aplicação.

## Passo 1: Descobrir o Product ID

Execute o script [scripts/get-module-id.sql](scripts/get-module-id.sql) no **Supabase SQL Editor**:

1. Acesse [Supabase Dashboard](https://supabase.com/dashboard)
2. Vá em **SQL Editor**
3. Copie e cole o conteúdo de `scripts/get-module-id.sql`
4. Execute
5. Copie o `product_id` onde quer adicionar os áudios

> **Nota**: Se ainda não tiver nenhum product_id, pode criar um novo (ex: 'NEURORESET_001') ou usar o product_id que vem da Hotmart quando um cliente compra.

## Passo 2: Inserir os Áudios

1. Abra [scripts/add-r2-audios.sql](scripts/add-r2-audios.sql)
2. **Substitua** todas as ocorrências de `'SEU_PRODUCT_ID_AQUI'` pelo product_id que você copiou
3. Execute o script no **Supabase SQL Editor**

### Exemplo:

```sql
-- Antes:
product_id = 'SEU_PRODUCT_ID_AQUI'

-- Depois (com seu product_id real):
product_id = 'NEURORESET_001'
-- ou
product_id = 'hotmart_product_123456'
```

## Áudios que serão adicionados

Os 7 áudios do R2:

1. ✅ Track01_El_Despertar_Energético_Manhã.mp3
2. ✅ Track02_SOS_Ansiedad_O_Botão_de_Pânico.mp3
3. ✅ Track03_Dormir_Profundo_Noite.mp3
4. ✅ Track04_Enfoque_Láser_Produtividade.mp3
5. ✅ Track05_Detox_Emocional_Transição_Trabalho-Casa.mp3
6. ✅ Track06_Confianza_Inquebrantable.mp3
7. ✅ Track07_Pausa_de_Mediodía.mp3

Todos estão no formato: `r2://audios/nome-do-arquivo.mp3`

## Passo 3: Verificar

Depois de inserir, execute esta query para confirmar:

```sql
SELECT
  id,
  product_id,
  title,
  content_url,
  order_index,
  is_active
FROM product_contents
WHERE content_type = 'audio'
ORDER BY order_index;
```

## Passo 4: Testar na Aplicação

1. Acesse o dashboard: http://localhost:3000/dashboard (ou sua URL de produção)
2. Faça login com um usuário que tenha acesso ao product_id configurado
3. Os áudios devem aparecer na lista de conteúdos "Tu Biblioteca"
4. Clique em um áudio para reproduzir e verificar se carrega do R2

## Comandos Úteis

```bash
# Listar todos os arquivos no R2
npm run list:r2

# Testar conexão com R2
npm run test:r2

# Rodar aplicação localmente
npm run dev
```

## Solução de Problemas

### Áudio não aparece na lista
- Verifique se o `product_id` está correto e corresponde ao product do usuário logado
- Confirme que o registro foi inserido (execute a query de verificação)
- Verifique se `is_active = true`

### Áudio não reproduz
- Verifique se a URL está no formato correto: `r2://audios/nome.mp3`
- Confirme que o arquivo existe no R2 com `npm run list:r2`
- Verifique os logs do navegador (F12 → Console)

### Erro 401 ou 403
- Confirme que as variáveis de ambiente R2 estão configuradas no Vercel
- Verifique se o usuário está autenticado

## Adicionar Duração dos Áudios (Opcional)

Se você souber a duração dos áudios em segundos, pode atualizar:

```sql
UPDATE product_contents
SET duration = 1800  -- 30 minutos em segundos
WHERE title LIKE 'Track01%';
```

A duração aparecerá como badge na lista de conteúdos.

## Próximos Passos

Depois de adicionar os áudios:

1. ✅ Faça deploy das alterações (se estiver em produção)
2. 📱 Teste em diferentes dispositivos
3. 🎨 Adicione thumbnails se desejar (opcional)
4. 📄 Adicione PDFs ou outros materiais complementares
5. 🎥 Adicione vídeos (mesmo processo, pasta `videos/`)

---

**Dúvidas?** Consulte [CLOUDFLARE-R2-SETUP.md](CLOUDFLARE-R2-SETUP.md) para documentação completa.
