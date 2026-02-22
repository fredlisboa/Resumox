# PASSO A PASSO: Desbloquear Usuário no Supabase

## ⚠️ IMPORTANTE
Supabase tem dois editores diferentes:
- **Logs & Analytics** (onde você está) → Apenas SELECT queries
- **SQL Editor** (onde você precisa ir) → Permite DELETE, UPDATE, INSERT

## Siga estes passos EXATAMENTE:

### PASSO 1: Ir para o SQL Editor

1. Na barra lateral esquerda do Supabase
2. Clique em **"SQL Editor"** (ícone com símbolo `</>`)
3. NÃO use "Logs & Analytics"

### PASSO 2: Criar Nova Query

1. Clique em **"New query"** (botão verde no canto superior direito)
2. Cole o código abaixo

### PASSO 3: Cole e Execute Este Código

```sql
-- LIMPAR TUDO - RODE LINHA POR LINHA SE NECESSÁRIO

-- 1. Remover todos os bloqueios de IP
DELETE FROM public.ip_rate_limits;

-- 2. Remover tentativas de login do usuário
DELETE FROM public.login_attempts WHERE email = 'frederiqueelisboa@gmail.com';

-- 3. Desbloquear usuário
UPDATE public.users_access
SET bloqueado_ate = NULL, tentativas_login = 0
WHERE email = 'frederiqueelisboa@gmail.com';
```

### PASSO 4: Verificar se Funcionou

Depois de executar o código acima, cole e execute isto:

```sql
-- Verificação 1: Contar bloqueios de IP (deve retornar 0)
SELECT COUNT(*) as total_ip_blocks FROM public.ip_rate_limits;
```

```sql
-- Verificação 2: Status do usuário (bloqueado_ate deve ser NULL)
SELECT email, bloqueado_ate, tentativas_login, status_compra
FROM public.users_access
WHERE email = 'frederiqueelisboa@gmail.com';
```

**Resultado esperado:**
- `total_ip_blocks`: 0
- `bloqueado_ate`: NULL (ou vazio)
- `tentativas_login`: 0
- `status_compra`: active

### PASSO 5: Depois de Limpar o Banco

1. **Feche TODAS as abas** do seu site
2. **Abra uma aba ANÔNIMA/PRIVADA** (Ctrl+Shift+N no Chrome)
3. Vá para o site
4. Digite o email: `frederiqueelisboa@gmail.com`
5. Clique em "Acessar Meu Conteúdo" **UMA VEZ SÓ**
6. **NÃO clique novamente** se falhar

---

## Se Ainda Não Funcionar

### Opção A: Usar a Ferramenta de Diagnóstico

Após o deploy do Vercel terminar, abra no navegador:

```
https://seu-dominio.vercel.app/api/debug/check-block?email=frederiqueelisboa@gmail.com
```

Cole o JSON que aparecer aqui para eu analisar.

### Opção B: Desabilitar Rate Limiting Temporariamente

Se nada funcionar, posso desabilitar o rate limiting temporariamente no código.

---

## Troubleshooting

### Erro: "Only SELECT queries allowed"
- Você está em "Logs & Analytics"
- Vá para **"SQL Editor"** na barra lateral

### Erro: "permission denied"
- Você não tem permissões de admin
- Use a conta de administrador do Supabase

### Erro: "relation does not exist"
- A tabela pode não existir
- Verifique se as migrations foram aplicadas

---

## Resumo Visual

```
Supabase Dashboard
├── 📊 Logs & Analytics  ← VOCÊ ESTÁ AQUI (não funciona para DELETE/UPDATE)
├── 📝 SQL Editor        ← VOCÊ PRECISA IR AQUI ✅
├── 🗄️ Table Editor
└── ...
```
