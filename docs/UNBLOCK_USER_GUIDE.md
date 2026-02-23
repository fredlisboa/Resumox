# Guia Completo: Desbloquear Usuário

## Problema
Usuário `frederiqueelisboa@gmail.com` está vendo a mensagem:
> "Muitas tentativas. Bloqueado até 10:21:32"

## Causa
O sistema de rate limiting baseado em IP está bloqueando o acesso. Isso acontece quando:
1. **5 tentativas falhadas** do mesmo IP em 1 hora → Bloqueio por 1 hora
2. **3+ emails diferentes** tentados do mesmo IP → Bloqueio por 24 horas (atividade suspeita)

## Solução Completa

### PASSO 1: Executar no Supabase SQL Editor

Copie e cole TODO o código abaixo no SQL Editor do Supabase e execute:

```sql
-- ==================================================
-- SOLUÇÃO COMPLETA - DESBLOQUEAR USUÁRIO
-- ==================================================

-- 1. LIMPAR BLOQUEIO DO USUÁRIO
UPDATE public.users_access
SET
  bloqueado_ate = NULL,
  tentativas_login = 0
WHERE email = 'frederiqueelisboa@gmail.com';

-- 2. REMOVER BLOQUEIOS DE IP (MÉTODO AGRESSIVO)
-- Este comando remove TODOS os bloqueios de IP que tentaram logar com este email
DELETE FROM public.ip_rate_limits
WHERE ip_address IN (
  SELECT DISTINCT ip_address
  FROM public.login_attempts
  WHERE email = 'frederiqueelisboa@gmail.com'
);

-- 3. VERIFICAÇÃO: Confirmar que não há bloqueios ativos
SELECT
  'Bloqueios de IP ativos' as tipo,
  COUNT(*) as quantidade
FROM public.ip_rate_limits
WHERE blocked_until > NOW()
  AND ip_address IN (
    SELECT DISTINCT ip_address
    FROM public.login_attempts
    WHERE email = 'frederiqueelisboa@gmail.com'
  )
UNION ALL
SELECT
  'Bloqueio do usuário' as tipo,
  CASE
    WHEN bloqueado_ate IS NULL THEN 0
    WHEN bloqueado_ate < NOW() THEN 0
    ELSE 1
  END as quantidade
FROM public.users_access
WHERE email = 'frederiqueelisboa@gmail.com';

-- RESULTADO ESPERADO: Ambos devem mostrar quantidade = 0
```

### PASSO 2: Verificar Status do Usuário

Execute esta query para confirmar que está tudo OK:

```sql
SELECT
  email,
  status_compra,
  bloqueado_ate,
  tentativas_login,
  data_expiracao,
  CASE
    WHEN status_compra = 'active' THEN '✅ Ativo'
    ELSE '❌ Inativo: ' || status_compra
  END as status,
  CASE
    WHEN bloqueado_ate IS NULL THEN '✅ Não bloqueado'
    WHEN bloqueado_ate < NOW() THEN '✅ Bloqueio expirado'
    ELSE '❌ BLOQUEADO até ' || bloqueado_ate::text
  END as bloqueio_status
FROM public.users_access
WHERE email = 'frederiqueelisboa@gmail.com';
```

**Resultado Esperado:**
- `status`: ✅ Ativo
- `bloqueio_status`: ✅ Não bloqueado
- `tentativas_login`: 0

### PASSO 3: Se AINDA não funcionar - Limpeza Total

Se após executar os passos acima o problema persistir, execute este comando mais agressivo:

```sql
-- ATENÇÃO: Isto remove TODOS os bloqueios de IP do sistema!
-- Use apenas se os comandos anteriores não funcionarem

-- Ver quantos IPs estão bloqueados
SELECT COUNT(*) as total_bloqueios FROM public.ip_rate_limits WHERE blocked_until > NOW();

-- Remover TODOS os bloqueios (último recurso)
DELETE FROM public.ip_rate_limits;

-- Confirmar remoção
SELECT COUNT(*) as bloqueios_restantes FROM public.ip_rate_limits;
-- Deve retornar: 0
```

### PASSO 4: Limpar Cache do Navegador

Peça ao usuário para:
1. Fechar TODAS as abas do site
2. Limpar cache do navegador (Ctrl+Shift+Del)
3. Ou usar aba anônima/privada
4. Tentar fazer login novamente

### PASSO 5: Diagnóstico Avançado

Se o problema AINDA persistir após tudo acima, execute este diagnóstico:

```sql
-- A. Ver TODAS as tentativas de login do usuário
SELECT
  email,
  ip_address,
  success,
  attempted_at,
  NOW() - attempted_at as tempo_desde_tentativa
FROM public.login_attempts
WHERE email = 'frederiqueelisboa@gmail.com'
ORDER BY attempted_at DESC
LIMIT 20;

-- B. Ver TODOS os IPs bloqueados (ativos e expirados)
SELECT
  ip_address,
  blocked_reason,
  blocked_until,
  CASE
    WHEN blocked_until > NOW() THEN 'ATIVO'
    ELSE 'EXPIRADO'
  END as status,
  attempt_count,
  unique_emails_attempted
FROM public.ip_rate_limits
ORDER BY last_attempt DESC;

-- C. Ver se há algum problema na tabela users_access
SELECT
  email,
  status_compra,
  bloqueado_ate,
  tentativas_login,
  data_expiracao,
  ultimo_acesso,
  ultimo_ip
FROM public.users_access
WHERE email = 'frederiqueelisboa@gmail.com';
```

## Prevenção Futura

### Opção 1: Desabilitar Rate Limiting Temporariamente

Se você está tendo muitos problemas com rate limiting, pode desabilitar temporariamente:

1. Edite `lib/auth.ts`
2. Na função `checkRateLimit` (linha 24), adicione no início:
```typescript
// TEMPORÁRIO: Desabilitar rate limiting
return { allowed: true, remainingAttempts: 5 }
```

**⚠️ ATENÇÃO:** Isto remove a proteção contra ataques! Use apenas temporariamente.

### Opção 2: Aumentar os Limites

Edite `lib/auth.ts`:

```typescript
// Linha 92: Mudar de 5 para 10 tentativas
if (failedIpAttempts >= 10) {  // era 5

// Linha 70: Mudar de 3 para 5 emails únicos
if (uniqueEmailsAttempted >= 5) {  // era 3
```

### Opção 3: Criar Script de Desbloqueio Automático

Execute este comando periodicamente (a cada hora) no Supabase:

```sql
-- Remover bloqueios expirados automaticamente
DELETE FROM public.ip_rate_limits
WHERE blocked_until < NOW();
```

## Checklist de Resolução

- [ ] Executei a query do PASSO 1
- [ ] Executei a query de verificação do PASSO 2
- [ ] Confirmei que `bloqueios_ativos = 0`
- [ ] Confirmei que `status_compra = 'active'`
- [ ] Pedi ao usuário para limpar cache/usar aba anônima
- [ ] Testei fazer login novamente
- [ ] Se ainda falhar, executei a limpeza total do PASSO 3
- [ ] Se ainda falhar, executei o diagnóstico do PASSO 5

## Contato para Suporte

Se após todos esses passos o problema persistir, pode haver um bug no código. Entre em contato com:
- Desenvolvedores do sistema
- Suporte técnico

Inclua as seguintes informações:
1. Email do usuário: `frederiqueelisboa@gmail.com`
2. Resultado das queries de diagnóstico
3. Horário da última tentativa de login
4. Screenshot do erro
