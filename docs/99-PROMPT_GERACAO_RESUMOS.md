# Resumox — Guia de Geração de Resumos para LLMs

## Visão Geral

Você receberá um **PDF com o resumo detalhado de um livro**. Sua tarefa é interpretar esse conteúdo e devolver **4 saídas independentes** que serão armazenadas no banco de dados do projeto Resumox:

| # | Campo no Banco | Tipo    | Descrição                              |
|---|----------------|---------|----------------------------------------|
| 1 | `summary_html` | `TEXT`  | HTML do resumo editorial (aba "Resumo")|
| 2 | `mindmap_json`  | `JSONB` | Estrutura JSON do mapa mental          |
| 3 | `insights_json` | `JSONB` | Array JSON de insights/citações        |
| 4 | `exercises_json`| `JSONB` | Array JSON de exercícios práticos      |

**Cada saída deve ser devolvida separadamente e claramente identificada.**

---

## 1. `summary_html` — O Resumo Editorial

### O que é

Um fragmento HTML que será injetado dentro de uma `<div class="resumox-content">` via `dangerouslySetInnerHTML` no React. **NÃO** inclua `<!DOCTYPE>`, `<html>`, `<head>`, `<body>`, `<style>` ou qualquer wrapper externo. Entregue **apenas o conteúdo interno** — os estilos já existem no CSS do projeto.

### Estrutura obrigatória

```html
<h2>Título da primeira seção</h2>
<p>Texto do parágrafo com <strong>destaques em negrito</strong> para conceitos-chave.</p>

<div class="highlight-box">
  "Citação literal do livro ou frase de impacto em itálico."
</div>

<h2>Título da segunda seção</h2>

<h3>Subtítulo dentro da seção</h3>
<p>Texto explicativo...</p>

<div class="key-point">
  <div class="kp-num">1</div>
  <div class="kp-text"><strong>Conceito-chave:</strong> Explicação concisa do ponto.</div>
</div>

<div class="key-point">
  <div class="kp-num">💡</div>
  <div class="kp-text"><strong>Insight:</strong> Outro ponto relevante.</div>
</div>
```

### Tags HTML permitidas e seus usos

| Tag / Classe | Uso | Estilo aplicado automaticamente |
|---|---|---|
| `<h2>` | Títulos de seção principal | Playfair Display 22px, barra lateral roxa à esquerda |
| `<h3>` | Subtítulos dentro de seções | 16px, cor roxa clara (`#A29BFE`) |
| `<p>` | Parágrafos de texto | Inter 15px, line-height 1.8, cor `#E8E8ED` |
| `<strong>` | Negrito / destaque em conceitos | Cor roxa clara (`#A29BFE`) |
| `<em>` | Itálico / ênfase sutil | Itálico padrão |
| `.highlight-box` | Citações do livro ou frases de impacto | Caixa com borda dourada à esquerda, fundo dourado translúcido, texto itálico dourado |
| `.key-point` | Pontos-chave numerados ou com ícone | Card com fundo escuro, ícone/número à esquerda + texto à direita |
| `.key-point > .kp-num` | Número ou emoji do ponto-chave | Badge 28x28px, fundo roxo, texto branco |
| `.key-point > .kp-text` | Texto do ponto-chave | 14px, line-height 1.6 |

### Regras de conteúdo para o `summary_html`

1. **Comece com `<h2>`** — nunca use `<h1>` (o título do livro já é exibido no hero da página)
2. **Primeira seção**: "A Ideia Central" ou equivalente — síntese do livro em 1-2 parágrafos
3. **Seções intermediárias**: Cubra os principais conceitos/capítulos do livro com `<h2>` para cada grande tema e `<h3>` para subtemas
4. **Use `.highlight-box`** para 2-4 citações literais ou frases de grande impacto do livro
5. **Use `.key-point`** para listas de conceitos numerados (use números 1, 2, 3... no `.kp-num`) ou para insights isolados (use emojis como 💡, ⚡, 🎯 no `.kp-num`)
6. **Última seção**: "Conclusão" — amarre os conceitos e reforce a mensagem central
7. **Feche com um `.highlight-box`** contendo a citação mais marcante do livro
8. **Extensão**: entre 2.000 e 4.000 palavras — detalhado mas objetivo
9. **Idioma**: Português do Brasil
10. **Tom**: Educativo e envolvente, como se estivesse explicando para alguém inteligente que quer absorver o essencial sem ler o livro inteiro

### O que NÃO fazer no `summary_html`

- NÃO inclua tags `<style>`, `<script>`, `<link>` ou CSS inline
- NÃO use `class` em `<h2>`, `<h3>`, `<p>` — os estilos já são aplicados pelo seletor `.resumox-content`
- NÃO use `<h1>` — é reservado para o título do livro no hero
- NÃO use `<ul>`, `<ol>`, `<li>` — use `.key-point` para listas
- NÃO use `<img>` — não há imagens inline nos resumos
- NÃO use `<a>` com links externos
- NÃO invente citações — use apenas frases que existem no PDF ou parafraseie fielmente

---

## 2. `mindmap_json` — Mapa Mental

### Estrutura JSON obrigatória

```json
{
  "center_label": "TÍTULO DO LIVRO EM MAIÚSCULAS",
  "center_sublabel": "Subtítulo descritivo curto",
  "branches": [
    {
      "title": "Nome da Ramificação",
      "icon": "🔥",
      "items": [
        "Item curto 1 (máximo ~6 palavras)",
        "Item curto 2",
        "Item curto 3",
        "Item curto 4"
      ]
    },
    {
      "title": "Outra Ramificação",
      "icon": "⚡",
      "items": [
        "Item curto 1",
        "Item curto 2",
        "Item curto 3"
      ]
    }
  ]
}
```

### TypeScript correspondente

```typescript
interface MindMapData {
  center_label: string       // Título central (livro em maiúsculas)
  center_sublabel: string    // Subtítulo descritivo
  branches: MindMapBranch[]  // Array de ramificações
}

interface MindMapBranch {
  title: string        // Título da ramificação
  icon: string         // Emoji representativo (1 único emoji)
  items: string[]      // Itens da ramificação (3-6 itens)
  full_width?: boolean // Se true, ocupa 2 colunas (para rama especial)
}
```

### Regras do mapa mental

1. **4 a 6 ramificações** (branches) que cubram os grandes temas do livro
2. **3 a 6 itens por ramificação** — frases ultra-curtas (máximo ~6 palavras cada)
3. **Cada ramificação tem 1 emoji** no campo `icon`
4. As ramificações são exibidas em **grid de 2 colunas** — planeje para que fiquem equilibradas
5. Use `"full_width": true` em **no máximo 1 ramificação** se houver um tema transversal que mereça destaque (ex: "inimigos a vencer", "armadilhas comuns")
6. O `center_label` deve ser o título do livro em MAIÚSCULAS
7. O `center_sublabel` deve resumir a essência em poucas palavras (ex: "13 Princípios da Riqueza", "O Poder dos Hábitos")

---

## 3. `insights_json` — Insights / Citações

### Estrutura JSON obrigatória

```json
[
  {
    "text": "O ponto de partida de toda riqueza é uma ideia. Ideias são produtos da imaginação — e a imaginação pode ser treinada.",
    "source_chapter": "Cap. 5 — Imaginação"
  },
  {
    "text": "Os bem-sucedidos decidem rápido e mudam devagar. Os fracassados decidem devagar — e mudam de ideia ao primeiro obstáculo.",
    "source_chapter": "Cap. 7 — Decisão"
  }
]
```

### TypeScript correspondente

```typescript
interface InsightData {
  text: string           // Texto do insight (1-3 frases)
  source_chapter: string // Referência ao capítulo (ex: "Cap. 3 — Título")
}
```

### Regras dos insights

1. **5 a 8 insights** por livro
2. Cada insight deve ser **uma frase poderosa e memorável** — algo que o leitor queira salvar ou compartilhar
3. Podem ser citações literais do livro (parafraseadas se necessário) ou sínteses de ideias centrais
4. O `source_chapter` deve referenciar o capítulo ou seção de origem no formato `"Cap. X — Nome do Capítulo"` ou `"Parte X — Nome"`
5. Os insights devem cobrir **diferentes partes do livro** — não concentre tudo em um só capítulo
6. **Tom**: Direto, impactante, como se fosse um destaque no Kindle

---

## 4. `exercises_json` — Exercícios Práticos

### Estrutura JSON obrigatória

```json
[
  {
    "title": "Exercício 1 — Declaração de Propósito",
    "icon": "🎯",
    "color_theme": "accent",
    "description": "Escreva uma declaração clara do que você quer alcançar, com valor e prazo específicos.",
    "template_text": "Até [DATA], eu terei alcançado [OBJETIVO]. Em troca, farei [AÇÃO]. Meu plano é: [PLANO].",
    "checklist": [
      "Escrevi minha declaração com objetivo e data específicos",
      "Li em voz alta com emoção pela manhã",
      "Li em voz alta com emoção à noite"
    ]
  },
  {
    "title": "Exercício 2 — Mapeie Seu Grupo de Apoio",
    "icon": "🤝",
    "color_theme": "green",
    "description": "Identifique 2 a 5 pessoas que podem ajudá-lo a alcançar seu objetivo.",
    "checklist": [
      "Listei 3-5 pessoas alinhadas ao meu objetivo",
      "Entrei em contato com pelo menos 1 pessoa",
      "Marquei uma primeira conversa"
    ]
  },
  {
    "title": "Exercício 3 — Confronte Seus Medos",
    "icon": "👻",
    "color_theme": "orange",
    "description": "Identifique o medo que mais impacta sua vida e defina uma ação concreta para enfrentá-lo esta semana.",
    "checklist": [
      "Identifiquei meu medo dominante",
      "Escrevi uma ação concreta para enfrentá-lo",
      "Executei a ação esta semana"
    ]
  }
]
```

### TypeScript correspondente

```typescript
interface ExerciseData {
  title: string                          // "Exercício N — Título Descritivo"
  icon: string                           // 1 emoji representativo
  color_theme: 'accent' | 'green' | 'orange'  // Tema de cor do card
  description: string                    // Descrição do exercício (1-3 frases)
  template_text?: string                 // Texto modelo (opcional) para o usuário preencher
  checklist: string[]                    // Array de itens do checklist (3-5 itens)
}
```

### Regras dos exercícios

1. **3 exercícios** por livro (exatamente 3)
2. **Distribuição de cores**: use cada `color_theme` uma vez:
   - `"accent"` (roxo) — exercício reflexivo ou de autoconhecimento
   - `"green"` — exercício de ação prática ou social
   - `"orange"` — exercício de desafio ou confronto
3. Cada exercício tem **3 a 5 itens no checklist** — ações concretas e verificáveis
4. O `template_text` é **opcional** — use quando fizer sentido ter um modelo para o usuário preencher
5. Os exercícios devem ser **aplicáveis na vida real esta semana** — nada abstrato ou genérico
6. **Título**: sempre no formato `"Exercício N — Título Descritivo"`
7. **Descrição**: 1-3 frases explicando o que fazer e por quê

---

## Metadados do Livro (para referência)

Além das 4 saídas acima, forneça também os seguintes metadados para cadastro:

```json
{
  "title": "Título em Português",
  "original_title": "Original Title in English (ou null se já for PT)",
  "author": "Nome do Autor",
  "year": 1937,
  "category_slug": "mentalidade-riqueza",
  "category_label": "Mentalidade & Riqueza",
  "category_emoji": "💰",
  "reading_time_min": 12,
  "cover_gradient_from": "#1a1a2e",
  "cover_gradient_to": "#0f3460"
}
```

### Categorias disponíveis

| slug | label | emoji |
|---|---|---|
| `mentalidade-riqueza` | Mentalidade & Riqueza | 💰 |
| `produtividade` | Produtividade | ⚡ |
| `lideranca` | Liderança | 👑 |
| `psicologia` | Psicologia | 🧠 |
| `habitos` | Hábitos & Comportamento | 🔄 |
| `comunicacao` | Comunicação | 🗣 |
| `empreendedorismo` | Empreendedorismo | 🚀 |
| `relacionamentos` | Relacionamentos | ❤️ |
| `saude-bemestar` | Saúde & Bem-estar | 🌱 |
| `espiritualidade` | Espiritualidade | ✨ |
| `carreira` | Carreira & Negócios | 💼 |
| `criatividade` | Criatividade & Inovação | 🎨 |

> Se o livro não se encaixar em nenhuma categoria acima, sugira uma nova com o mesmo formato (slug, label, emoji).

### Estimativa de `reading_time_min`

Calcule baseado na contagem de palavras do `summary_html`:
- ~250 palavras/minuto
- Arredonde para o inteiro mais próximo
- Geralmente fica entre 8-16 minutos

### Gradientes da capa (`cover_gradient_from` / `cover_gradient_to`)

Escolha cores escuras que combinem com o tema do livro. Exemplos:

| Tema | from | to |
|---|---|---|
| Finanças / Riqueza | `#1a1a2e` | `#0f3460` |
| Psicologia / Mente | `#1a0a2e` | `#2d1b69` |
| Natureza / Saúde | `#0a1a0f` | `#1a3a2e` |
| Energia / Produtividade | `#2e1a0a` | `#4a2e1a` |
| Genérico / Neutro | `#1a1a2e` | `#16213e` |

---

## Formato de Entrega

Entregue a resposta organizada com estes 5 blocos claramente separados:

### Bloco 1: Metadados
```json
{ ... metadados do livro ... }
```

### Bloco 2: summary_html
```html
<h2>A Ideia Central</h2>
<p>...</p>
...todo o HTML do resumo...
```

### Bloco 3: mindmap_json
```json
{ ... mapa mental ... }
```

### Bloco 4: insights_json
```json
[ ... insights ... ]
```

### Bloco 5: exercises_json
```json
[ ... exercícios ... ]
```

---

## Exemplo Completo de Referência

Consulte o arquivo `summari-01.html` do projeto para um exemplo completo do livro "Quem Pensa Enriquece" de Napoleon Hill. Esse arquivo contém a versão standalone (HTML completo com CSS e JS embutidos), mas o conteúdo dentro de `.resumo-content`, o mapa mental, os insights e os exercícios seguem exatamente os padrões descritos acima.

---

## Geração e Inserção do Áudio no App

Após a produção e inserção do resumo no banco de dados, o próximo passo é gerar o áudio narrado a partir do `summary_html` e disponibilizá-lo no app. O áudio é gerado automaticamente via TTS (Text-to-Speech) usando o Microsoft Edge TTS.

### Pré-requisitos

| Ferramenta | Caminho padrão | Instalação |
|---|---|---|
| `edge-tts` (Python) | `~/miniconda3/envs/resumox/bin/edge-tts` | `conda activate resumox && pip install edge-tts` |
| `ffprobe` (ffmpeg) | `~/miniconda3/envs/resumox/bin/ffprobe` | `conda activate resumox && conda install ffmpeg` |
| Variáveis de ambiente R2 | `.env.local` | `R2_ACCOUNT_ID`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`, `R2_BUCKET_NAME` |

### Pipeline de geração do áudio

O processo completo é executado pela biblioteca `lib/tts.ts` → função `generateAudioForBook()`:

```
summary_html
    │
    ▼
htmlToPlainText()          → Remove tags HTML, insere pausas naturais em quebras de seção
    │
    ▼
edge-tts (pt-BR-AntonioNeural)  → Gera arquivo MP3 temporário em /tmp/tts-<slug>.mp3
    │
    ▼
ffprobe                    → Calcula a duração em minutos (fallback: estimativa por tamanho do arquivo)
    │
    ▼
uploadFileToR2()           → Upload para R2: resumox/audios/<slug>.mp3
    │
    ▼
UPDATE resumox_books       → Grava audio_r2_key = 'r2://resumox/audios/<slug>.mp3'
                              e audio_duration_min = N
```

### Como executar a geração

#### Opção 1 — Script em lote (recomendado para múltiplos livros)

```bash
conda activate resumox

# Gerar áudio para TODOS os livros publicados que ainda não têm áudio
npx tsx scripts/resumox-generate-audio.ts

# Testar sem gerar (dry-run)
npx tsx scripts/resumox-generate-audio.ts --dry-run

# Gerar para um livro específico
npx tsx scripts/resumox-generate-audio.ts --slug "nome-do-livro"

# Forçar regeneração (mesmo que já tenha áudio)
npx tsx scripts/resumox-generate-audio.ts --slug "nome-do-livro" --force

# Usar voz diferente (padrão: pt-BR-AntonioNeural)
npx tsx scripts/resumox-generate-audio.ts --voice "pt-BR-FabioNeural"
```

O script registra logs em `logs/resumox-audio-YYYY-MM-DD.jsonl`.

#### Opção 2 — API admin (livro individual, sob demanda)

```
POST /api/resumox/generate-audio
Content-Type: application/json
Authorization: Bearer <admin-token>

{
  "slug": "nome-do-livro",
  "force": false
}
```

Resposta:
```json
{
  "success": true,
  "slug": "nome-do-livro",
  "title": "Título do Livro",
  "r2Key": "resumox/audios/nome-do-livro.mp3",
  "durationMin": 14,
  "fileSizeBytes": 8523776,
  "textLength": 12450
}
```

> **Atenção**: O endpoint tem timeout de 5 minutos (Vercel). Para resumos muito longos, prefira o script local.

### O que acontece no banco de dados

Após a geração, a tabela `resumox_books` é atualizada:

| Campo | Valor |
|---|---|
| `audio_r2_key` | `r2://resumox/audios/<slug>.mp3` |
| `audio_duration_min` | Duração em minutos (inteiro, calculado via ffprobe) |

### Como o áudio fica disponível no app

1. **Servir o arquivo**: O endpoint `/api/r2-content?key=<r2-key>` funciona como proxy — recebe a key R2, verifica a autenticação do usuário via cookie de sessão e faz streaming dos bytes do MP3 diretamente do R2 com header `Content-Type: audio/mpeg`.

2. **Player no app**: O componente `AudioPlayer` (`components/resumox/AudioPlayer.tsx`) monta a URL:
   ```
   /api/r2-content?key=r2%3A%2F%2Fresumox%2Faudios%2F<slug>.mp3
   ```
   E renderiza um player com visualização de forma de onda, controle de velocidade (0.75x a 2x) e barra de progresso.

3. **Persistência de posição**: O hook `useResumoxProgress` salva `audio_position_sec` na tabela `resumox_user_progress` a cada 10 segundos (debounced). Quando o usuário retorna, o áudio retoma do ponto onde parou.

4. **Estado sem áudio**: Se `audio_r2_key` for `null`, o player exibe o placeholder "Áudio em breve" automaticamente.

### Orientações para a narração (TTS)

- A voz padrão é **`pt-BR-AntonioNeural`** — voz masculina brasileira, natural e clara
- O `htmlToPlainText()` já insere pausas adequadas em títulos (`<h2>`, `<h3>`), parágrafos e blocos especiais (`.highlight-box`, `.key-point`)
- **Não é necessário** adicionar marcações especiais no `summary_html` para TTS — a conversão é automática
- Se o resumo estiver bem escrito com frases claras e pontuação correta, o áudio será fluido e natural
- Duração típica do áudio: **10-20 minutos** para resumos de 2.000-4.000 palavras

### Verificação pós-geração

Após gerar o áudio, verifique:

1. **No banco**: `SELECT slug, audio_r2_key, audio_duration_min FROM resumox_books WHERE slug = '<slug>'` — confirme que os campos foram preenchidos
2. **No R2**: Verifique que o arquivo existe em `resumox/audios/<slug>.mp3` (use `npx tsx scripts/list-r2-files.ts audios`)
3. **No app**: Acesse `/resumox/dashboard/livro/<slug>`, vá para a aba "Áudio" e confirme que o player carrega e reproduz corretamente

---

## Checklist Final de Validação

Antes de entregar, valide:

- [ ] `summary_html` começa com `<h2>`, nunca `<h1>`
- [ ] Não há tags `<style>`, `<script>`, `<link>` ou CSS inline no HTML
- [ ] Usou pelo menos 2 `.highlight-box` com citações do livro
- [ ] Usou `.key-point` para listas numeradas de conceitos
- [ ] Todo `<strong>` dentro de `.resumox-content` será exibido em roxo claro
- [ ] `mindmap_json` tem 4-6 branches com 3-6 items cada
- [ ] `insights_json` tem 5-8 insights de diferentes capítulos
- [ ] `exercises_json` tem exatamente 3 exercícios, um de cada cor (accent/green/orange)
- [ ] Cada exercício tem 3-5 itens no checklist
- [ ] JSON é válido e parseable
- [ ] Texto em Português do Brasil
- [ ] Extensão do resumo: 2.000-4.000 palavras

### Checklist do Áudio (pós-geração)

- [ ] Script/API executou sem erros para o livro
- [ ] `audio_r2_key` preenchido no banco (`r2://resumox/audios/<slug>.mp3`)
- [ ] `audio_duration_min` preenchido com valor coerente (10-20 min para resumos típicos)
- [ ] Arquivo MP3 existe no R2 em `resumox/audios/<slug>.mp3`
- [ ] Player carrega e reproduz o áudio na aba "Áudio" do app
- [ ] Narração está fluida, sem cortes ou artefatos perceptíveis
- [ ] Posição do áudio é salva e restaurada ao recarregar a página
