# Início Rápido - 5 Minutos

## 1. Instalar dependências
```bash
cd huskyapp-mvp
npm install
```

## 2. Configurar Supabase

### Criar projeto em https://supabase.com

### Executar SQL (copie o arquivo `supabase/schema.sql`)

### Copiar credenciais
Settings > API:
- Project URL
- anon public key
- service_role secret key

## 3. Criar .env.local

```bash
cp .env.local.example .env.local
```

Edite `.env.local` e cole as credenciais do Supabase.

## 4. Adicionar usuário de teste

No Supabase SQL Editor:

```sql
INSERT INTO public.users_access (email, status_compra, product_id, product_name, data_compra, data_expiracao)
VALUES ('seu-email@teste.com', 'active', 'PRODUTO_001', 'Meu Produto', NOW(), NOW() + INTERVAL '1 year');
```

## 5. Adicionar conteúdo de teste

```sql
INSERT INTO public.product_contents (product_id, content_type, title, description, content_url, duration, order_index)
VALUES ('PRODUTO_001', 'video', 'Aula de Teste', 'Vídeo de exemplo', 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4', 596, 1);
```

## 6. Executar

```bash
npm run dev
```

## 7. Testar

1. Abra http://localhost:3000
2. Digite seu e-mail (o mesmo do passo 4)
3. Clique em "Acessar"

Pronto! 🎉

Para deploy e configurações avançadas, veja [SETUP.md](./SETUP.md)
