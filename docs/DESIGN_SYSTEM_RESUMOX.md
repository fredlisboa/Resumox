# Design System — ResumoX

Especificacao completa de design, cores, UI e UX do produto **ResumoX** para uso como referencia na criacao de quizzes e demais materiais visuais que precisem manter a mesma identidade visual.

---

## 1. Identidade da Marca

| Atributo       | Valor                                                          |
| -------------- | -------------------------------------------------------------- |
| Nome           | ResumoX                                                        |
| Proposta       | 659 resumos de livros com audio, mapa mental, insights e exercicios praticos |
| Slogan         | "Resumos de Livros que Transformam"                            |
| Modelo         | Pagamento unico. Zero mensalidade.                             |
| Tema visual    | Dark mode (OLED-friendly)                                      |
| Personalidade  | Premium, intelectual, sofisticado, acessivel                   |
| Publico        | Desenvolvimento pessoal, negocios, financas, produtividade     |

---

## 2. Paleta de Cores

### 2.1 Cores Primarias (CSS Variables)

```css
--rx-bg:           #0A0A0F;    /* Fundo principal — preto profundo */
--rx-surface:      #13131A;    /* Fundo de cards */
--rx-surface2:     #1A1A24;    /* Superficie elevada */
--rx-surface3:     #22222E;    /* Superficie mais elevada */
--rx-border:       #2A2A3A;    /* Bordas */
--rx-text:         #E8E8ED;    /* Texto primario */
--rx-text-muted:   #8888A0;    /* Texto secundario/muted */
--rx-accent:       #6C5CE7;    /* Acento principal — roxo */
--rx-accent-light: #A29BFE;    /* Acento claro — lavanda */
--rx-accent-glow:  rgba(108, 92, 231, 0.3);  /* Glow do acento */
```

### 2.2 Cores Semanticas

```css
--rx-gold:     #F0C040;    /* Badges, streaks, destaques especiais */
--rx-gold-dim: rgba(240, 192, 64, 0.15);  /* Fundo de highlight boxes */
--rx-green:    #00D68F;    /* Sucesso, conclusao, progresso completo */
--rx-green-dim: rgba(0, 214, 143, 0.12);  /* Fundo de sucesso */
--rx-red:      #FF6B6B;    /* Erro, alertas criticos */
--rx-orange:   #FFA94D;    /* Avisos, pendencias */
--rx-blue:     #4DABF7;    /* Informacoes */
```

### 2.3 Cores Tailwind (resumox namespace)

```js
resumox: {
  bg:            '#0A0A0F',
  surface:       '#13131A',
  surface2:      '#1A1A24',
  surface3:      '#22222E',
  border:        '#2A2A3A',
  text:          '#E8E8ED',
  muted:         '#8888A0',
  accent:        '#6C5CE7',
  'accent-light':'#A29BFE',
  gold:          '#F0C040',
  green:         '#00D68F',
  red:           '#FF6B6B',
  orange:        '#FFA94D',
  blue:          '#4DABF7',
}
```

### 2.4 Gradientes da Marca

| Nome             | Valor                                                         | Uso                          |
| ---------------- | ------------------------------------------------------------- | ---------------------------- |
| Accent gradient  | `from-[#6C5CE7] to-[#A29BFE]`                                | Botoes CTA, barra de progresso |
| Text gradient    | `from-[#E8E8ED] via-[#A29BFE] to-[#6C5CE7]`                 | Titulos hero (bg-clip-text)  |
| Surface gradient | `linear-gradient(135deg, #13131A 0%, #0A0A0F 100%)`          | Logo container, cards especiais |
| Glow radial      | `radial-gradient(circle, rgba(108,92,231,0.25) 0%, transparent 70%)` | Circulos flutuantes decorativos |
| Scrollbar        | `linear-gradient(135deg, #6C5CE7 0%, #A29BFE 100%)`          | Scrollbar thumb              |

### 2.5 Psicologia das Cores

| Cor                   | Emocao / Associacao                                    |
| --------------------- | ------------------------------------------------------ |
| Roxo `#6C5CE7`        | Sabedoria, transformacao, premium, intelectualidade    |
| Lavanda `#A29BFE`     | Calma, inspiracao, clareza mental                      |
| Preto `#0A0A0F`       | Elegancia, foco, sofisticacao (OLED-friendly)          |
| Ouro `#F0C040`        | Conquista, recompensa, valor                           |
| Verde `#00D68F`       | Progresso, conclusao, sucesso                          |
| Vermelho `#FF6B6B`    | Urgencia, atencao, erros                               |

---

## 3. Tipografia

### 3.1 Fontes

| Familia            | Uso                        | Pesos         | Variavel CSS       |
| ------------------ | -------------------------- | ------------- | ------------------ |
| **Inter**          | Corpo de texto, UI geral   | 400–900       | `--font-inter`     |
| **Playfair Display** | Titulos editoriais (h2)  | 700, 800      | `--font-playfair`  |

**Fallback do body:** `-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif`

### 3.2 Escala Tipografica

| Elemento                | Tamanho          | Peso          | Cor                        |
| ----------------------- | ---------------- | ------------- | -------------------------- |
| Hero H1 (login)         | `text-4xl sm:text-5xl` | `font-bold` | Gradiente text-transparent |
| Dashboard H1             | `text-2xl`       | `font-extrabold` | `text-resumox-text`    |
| Subtitulo H2 (editorial)| 22px             | 800 (Playfair)| `#fff` com borda-esquerda accent |
| H3 (editorial)          | 16px             | 700           | `var(--rx-accent-light)`   |
| Corpo de texto           | 15px             | 400           | `var(--rx-text)` / line-height: 1.8 |
| Texto secundario         | `text-sm`        | 400–500       | `text-resumox-muted`       |
| Labels/badges            | `text-[10px]`    | 600           | `text-resumox-muted` uppercase tracking-wide |
| Precos/numeros grandes   | `text-lg`        | 700           | Cor semantica (green/gold/accent) |

### 3.3 Texto Editorial (classe `.resumox-content`)

```css
p  → font-size: 15px; line-height: 1.8; text-indent: 1.5em; text-align: justify;
h2 → Playfair Display 22px/800; borda-esquerda gradiente accent;
h3 → 16px/700; cor: accent-light;
strong → cor: accent-light;
```

---

## 4. Espacamento e Layout

### 4.1 Container Principal

```
max-w-lg mx-auto px-4 py-6 pb-24
```

Mobile-first. A largura maxima do conteudo e `max-w-lg` (32rem / 512px) para uma experiencia focada tipo app.

### 4.2 Border Radius

| Token          | Valor       | Uso                           |
| -------------- | ----------- | ----------------------------- |
| `--rx-radius`  | 16px        | Cards, botoes principais      |
| `--rx-radius-sm` | 10px      | Elementos menores, key-points |
| `rounded-2xl`  | 1rem (16px) | Cards, inputs, botoes         |
| `rounded-3xl`  | 1.5rem      | Login card, modais            |
| `rounded-full` | 9999px      | Badges, pills, avatar         |

### 4.3 Espacamento Comum

| Contexto            | Padding / Gap        |
| ------------------- | -------------------- |
| Card interno        | `p-3` a `p-6`       |
| Login card          | `p-8`               |
| Secao               | `py-6` a `py-16`    |
| Gap entre stats     | `gap-3`              |
| Gap de formulario   | `space-y-6`          |
| Margem entre secoes | `mb-6`               |

---

## 5. Componentes UI

### 5.1 Botoes

#### CTA Principal (Gradiente Accent)

```
bg-gradient-to-r from-[#6C5CE7] to-[#A29BFE]
text-white font-bold py-5 px-6
rounded-2xl
shadow-[0_0_30px_rgba(108,92,231,0.5)]
hover:shadow-[0_0_40px_rgba(108,92,231,0.7)]
hover:scale-[1.03]
active:scale-[0.98]
transition-all duration-300
disabled:opacity-50 disabled:cursor-not-allowed
text-lg
```

#### CTA Secundario

```
bg-gradient-to-r from-[#6C5CE7] to-[#A29BFE]
hover:from-[#A29BFE] hover:to-[#6C5CE7]
text-white font-semibold py-3 px-6
rounded-2xl
shadow-[0_0_15px_rgba(108,92,231,0.3)]
hover:shadow-lg hover:scale-[1.03]
active:scale-[0.98]
transition-all duration-300
```

#### Botao de Navegacao (Tab Bar)

```
Ativo:   text-resumox-accent
Inativo: text-resumox-muted hover:text-resumox-accent-light
Tamanho: text-[10px] font-semibold + icone w-5 h-5
```

### 5.2 Cards

#### Card Padrao (Stats, categorias)

```
bg-resumox-surface
border border-resumox-border
rounded-2xl
p-3
text-center
```

#### Card Elevado (Login, modal)

```
background: rgba(19, 19, 26, 0.9);
backdrop-filter: blur(16px);
border: 1px solid rgba(108, 92, 231, 0.2);  /* border-[#6C5CE7]/20 */
box-shadow: 0 8px 32px 0 rgba(108, 92, 231, 0.15);
rounded-3xl p-8
```

#### Highlight Box (editorial)

```
background: var(--rx-gold-dim);      /* rgba(240, 192, 64, 0.15) */
border-left: 4px solid var(--rx-gold);
border-radius: 0 10px 10px 0;
padding: 16px 20px;
color: var(--rx-gold);
font-style: italic; font-weight: 500;
```

#### Key-Point Box (editorial)

```
background: var(--rx-surface2);
border: 1px solid var(--rx-border);
border-radius: 10px;
padding: 14px 16px;
display: flex; gap: 12px;
Numero: 28x28px, rounded-lg, bg-accent, text-white, font-800, text-xs
```

### 5.3 Inputs

#### Campo de Email

```
w-full px-5 py-4
bg-[#0A0A0F]/50
border border-[#6C5CE7]/30
rounded-2xl
text-lg text-[#E8E8ED]
placeholder-[#8888A0]/50
backdrop-blur-sm
focus:ring-2 focus:ring-[#6C5CE7]
focus:border-[#6C5CE7]
focus:shadow-[0_0_20px_rgba(108,92,231,0.4)]
outline-none
transition-all
```

### 5.4 Barra de Progresso

```
Container: h-1 bg-resumox-surface3 rounded-full overflow-hidden
Fill:      h-full rounded-full
Gradiente: linear-gradient(90deg, #6C5CE7, #A29BFE)
Completo:  bg-resumox-green (#00D68F)
Transicao: transition-all duration-500
```

### 5.5 Badges / Pills

#### Streak Badge

```
bg: rgba(240, 192, 64, 0.15)
color: #F0C040
padding: px-2.5 py-1
font: text-xs font-semibold
icone: emoji ou icone de fogo
```

#### Badge do Logo

```
inline-block px-6 py-2
bg-[#13131A]/80
border border-[#6C5CE7]/30
rounded-full
text-3xl font-bold text-[#E8E8ED]
```

### 5.6 Navegacao Inferior (Tab Bar)

```
Posicao: fixed bottom-0 left-0 right-0 z-40
Fundo:   rgba(10,10,15,0.95) + backdrop-filter: blur(16px)
Borda:   border-t border-resumox-border
Layout:  max-w-lg mx-auto flex
Items:   flex-1 flex flex-col items-center py-3
Icone:   w-5 h-5
Label:   text-[10px] font-semibold mt-0.5
Ativo:   text-resumox-accent
Inativo: text-resumox-muted hover:text-resumox-accent-light transition-colors
```

### 5.7 Alertas / Erros

```
bg-red-900/30
border border-red-500/50
text-red-200
rounded-2xl p-4
text-sm
backdrop-blur-sm
Layout: flex items-start com icone SVG + mensagem
Sub-texto: text-xs text-red-300
```

### 5.8 Aviso Destacado (Caixa de atencao)

```
rounded-xl
border border-[#FF6B6B]/40
bg-gradient-to-r from-[#FF6B6B]/15 via-[#FF6B6B]/10 to-[#FF6B6B]/15
backdrop-blur-sm
shadow-[0_0_20px_rgba(255,107,107,0.2),0_0_40px_rgba(255,107,107,0.1)]
animate-pulse
texto: text-sm font-semibold text-[#FF6B6B]
icone: w-5 h-5 drop-shadow com glow vermelho
```

---

## 6. Glassmorfismo

### Glass (claro)

```css
.glass {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.1);
}
```

### Glass Dark

```css
.glass-dark {
  background: rgba(10, 14, 39, 0.7);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid rgba(77, 111, 216, 0.2);
}
```

**Aplicacoes:**
- Login card: `rgba(19, 19, 26, 0.9)` + `blur(16px)`
- Tab bar: `rgba(10,10,15,0.95)` + `blur(16px)`
- Modais: glass-dark sobre backdrop `bg-black/80 backdrop-blur-sm`

---

## 7. Sombras e Glows

### Box Shadows Customizados

```css
/* Glow principal */
neuro-glow: 0 0 20px rgba(77, 111, 216, 0.3), 0 0 40px rgba(139, 92, 246, 0.2)

/* Card elevado */
neuro-card: 0 8px 32px 0 rgba(31, 38, 135, 0.37)

/* CTA hover */
0 0 30px rgba(108, 92, 231, 0.5)   → normal
0 0 40px rgba(108, 92, 231, 0.7)   → hover

/* Logo container */
0 0 40px rgba(108, 92, 231, 0.3), inset 0 0 30px rgba(162, 155, 254, 0.15)

/* Orbiting dot */
0 0 14px rgba(162, 155, 254, 0.9), 0 0 28px rgba(108, 92, 231, 0.5)
```

---

## 8. Animacoes

### 8.1 Animacoes de Entrada

| Nome         | Efeito                      | Duracao | Easing   |
| ------------ | --------------------------- | ------- | -------- |
| `fade-in`    | Opacidade 0→1               | 0.6s    | ease-out |
| `scale-in`   | Scale 0.95→1 + fade         | 0.3s    | ease-out |
| `slide-up`   | TranslateY 20px→0 + fade    | 0.6s    | ease-out |
| `slide-down` | TranslateY -20px→0 + fade   | 0.6s    | ease-out |

### 8.2 Animacoes de Loop

| Nome               | Efeito                              | Duracao | Uso                      |
| ------------------ | ----------------------------------- | ------- | ------------------------ |
| `pulse-slow`       | Pulse CSS padrao                    | 3s      | Destaques sutis          |
| `glow-pulse`       | Box-shadow pulsante accent          | 2s      | Botoes, badges           |
| `float-slow`       | Translacao + escala organica        | 20s     | Circulos decorativos     |
| `float-delayed`    | Translacao + rotacao                | 25s     | Variacao dos floats      |
| `float-medium`     | Translacao + escala                 | 18s     | Variacao dos floats      |
| `float-slow-reverse` | Float inverso + rotacao           | 22s     | Variacao dos floats      |
| `bounce-slow`      | TranslateY pulsante                 | 3s      | Elementos decorativos    |
| `shimmer`          | Background-position slide           | 2.5s    | Loading states           |
| `orbit-resumox`    | Rotacao orbital 88px                | 8s      | Dot orbitante no logo    |
| `xp-pop`           | Pop-up + fade + scale               | 1.2s    | Ganho de XP              |
| `particle`         | Translacao aleatoria + opacidade    | ~15s    | Particulas flutuantes    |

### 8.3 Transicoes de Interacao

```
Hover geral:  transition-all duration-300
Hover botao:  scale-[1.03] + sombra ampliada
Active botao: scale-[0.98]
Hover card:   border-resumox-accent/40 + shadow-lg/xl
Focus input:  ring-2 ring-[#6C5CE7] + sombra glow
```

### 8.4 Neuro Glow Button Effect

```css
.neuro-glow-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 0 20px rgba(77, 111, 216, 0.6), 0 0 40px rgba(139, 92, 246, 0.4);
}
/* ::before pseudo-element expande circulo branco semi-transparente no hover */
```

---

## 9. Elementos Decorativos

### 9.1 Circulos Flutuantes (Background)

4 circulos com gradiente radial posicionados em absolute, com blur e mix-blend-screen:

```
Tamanhos:  w-64 a w-96
Blur:      blur-2xl a blur-3xl
Opacidade: 15% a 25%
Cor:       radial-gradient de rgba(108,92,231) ou rgba(162,155,254)
Animacao:  float-slow, float-delayed, float-medium, float-slow-reverse
```

### 9.2 Particulas Flutuantes

20 particulas geradas via JS (client-side):
```
Tamanho:    2–6px (random)
Cor:        radial-gradient de rgba(162, 155, 254, opacity)
BoxShadow:  glow roxo proporcional ao tamanho
Duracao:    10–25s (random)
Delay:      Negativo para inicio aleatorio
Animacao:   animate-particle
```

### 9.3 Logo com Orbita

```
Container:  w-40 h-40 sm:w-48 sm:h-48 relative
Glow:       Circulo blur-2xl animate-pulse (accent radial)
Circulo:    inset-6, borda 2px accent/30, fundo surface gradient
Icone:      BookOpen (Lucide) w-16 h-16 sm:w-20 sm:h-20, cor accent-light
Drop-shadow: 0 0 20px rgba(162, 155, 254, 0.8)
Dot orbital: w-3 h-3 sm:w-4 sm:h-4, bg-accent-light, animate-orbit-resumox
```

---

## 10. Iconografia

### 10.1 Biblioteca: Lucide React

Icones usados no ResumoX:

| Icone        | Uso                                         |
| ------------ | ------------------------------------------- |
| `BookOpen`   | Logo, biblioteca, leitura                   |
| `Search`     | Busca                                       |
| `Star`       | Rating, avaliacao                           |
| `Heart`      | Favoritos                                   |
| `X`          | Fechar, limpar                              |
| `Home`       | Tab biblioteca (SVG inline)                 |
| `Map`        | Tab trilhas (SVG inline)                    |
| `User`       | Tab perfil (SVG inline)                     |
| `CheckCircle`| Completude, confirmacao                     |
| `Award`      | Conquistas                                  |
| `Zap`        | Energia, acao                               |

### 10.2 Tamanhos Padrao

| Contexto           | Tamanho          |
| ------------------ | ---------------- |
| Tab bar            | `w-5 h-5`       |
| Inline em texto    | `w-4 h-4`       |
| Logo principal     | `w-16 h-16` / `w-20 h-20` |
| Decorativo         | `w-8 h-8` a `w-12 h-12` |

---

## 11. Estados da Interface

### 11.1 Loading

```
Spinner: animate-spin w-6 h-6
Circulo: opacity-25 + arco opacity-75
Texto:   "Validando..." ao lado do spinner
Botao:   disabled:opacity-50 disabled:cursor-not-allowed
```

### 11.2 Erro

```
Container: bg-red-900/30 border-red-500/50 text-red-200 rounded-2xl p-4
Icone:     SVG X-circulo em vermelho
Sub-info:  text-xs text-red-300 (ex: tentativas restantes)
```

### 11.3 Sucesso / Completo

```
Cor:    text-resumox-green (#00D68F)
Badge:  bg-resumox-green/10 border-resumox-green/30
Icone:  CheckCircle
```

### 11.4 Destaque / Streak

```
Cor:    text-resumox-gold (#F0C040)
Badge:  bg rgba(240,192,64,0.15)
Icone:  Fogo / Zap
```

### 11.5 Disabled

```
opacity-50
cursor-not-allowed
transform-none (sem hover effects)
```

---

## 12. Responsividade

### 12.1 Breakpoints (Tailwind padrao)

| Breakpoint | Largura  | Uso                    |
| ---------- | -------- | ---------------------- |
| `sm`       | 640px    | Mobile landscape       |
| `md`       | 768px    | Tablet                 |
| `lg`       | 1024px   | Desktop                |
| `xl`       | 1280px   | Desktop grande         |

### 12.2 Abordagem Mobile-First

O ResumoX e projetado como PWA mobile-first. O layout principal usa `max-w-lg` (512px) centralizado, simulando uma experiencia de app nativo.

### 12.3 Padroes Responsivos

```
Logo:           w-40 h-40 sm:w-48 sm:h-48
Titulo hero:    text-4xl sm:text-5xl
Icone logo:     w-16 h-16 sm:w-20 sm:h-20
Dot orbital:    w-3 h-3 sm:w-4 sm:h-4
```

---

## 13. Scrollbar Customizada

```css
::-webkit-scrollbar {
  width: 10px; height: 10px;
}
::-webkit-scrollbar-track {
  background: #0A0A0F;  /* var(--rx-bg) no contexto resumox */
  border-radius: 10px;
}
::-webkit-scrollbar-thumb {
  background: linear-gradient(135deg, #6C5CE7 0%, #A29BFE 100%);
  border-radius: 10px;
  border: 2px solid #0A0A0F;
}
::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(135deg, #A29BFE 0%, #6C5CE7 100%);
  box-shadow: 0 0 10px rgba(108, 92, 231, 0.3);
}
```

---

## 14. PWA e Metadados

| Atributo             | Valor                         |
| -------------------- | ----------------------------- |
| Theme color          | `#0A0A0F`                     |
| Status bar iOS       | `black-translucent`           |
| Viewport             | `width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no` |
| Viewport fit         | `cover`                       |
| Idioma               | `pt-BR`                       |
| Robots               | `noindex, nofollow` (conteudo privado) |

---

## 15. Protecao de Conteudo

```css
/* Anti-copia */
-webkit-user-select: none;
-moz-user-select: none;
user-select: none;
-webkit-touch-callout: none;
```

- Right-click desabilitado
- Copy-paste protegido
- DevTools detection (JS)

---

## 16. UX Patterns e Fluxos

### 16.1 Tela de Login

1. Background `#0A0A0F` com circulos flutuantes e particulas
2. Logo centralizado com glow pulsante e dot orbital
3. Titulo hero em gradiente (text-transparent + bg-clip-text)
4. Subtitulo em accent-light + muted
5. Badge "ResumoX" em pill com borda accent
6. Card glassmorphism com formulario de email
7. Botao CTA gradiente com glow e estados de loading
8. Link de suporte como botao secundario
9. Footer com icone de cadeado + "Acesso Protegido"

### 16.2 Dashboard

1. Nav superior com nome do produto + streak badge
2. Hero centralizado: titulo + slogan
3. Stats em 3 colunas: Completos (green) | XP (accent-light) | Streak (gold)
4. Biblioteca de livros com busca, filtros e categorias
5. Tab bar fixa no rodape com 4 abas (Biblioteca, Trilhas, Buscar, Perfil)

### 16.3 Hierarquia Visual

```
1. CTAs (gradiente accent com glow)           ← Atencao maxima
2. Titulos (branco ou gradiente)               ← Orientacao
3. Numeros/stats (cores semanticas)            ← Informacao rapida
4. Corpo de texto (text claro)                 ← Leitura
5. Texto muted + labels                        ← Contexto
6. Bordas e separadores                        ← Estrutura
7. Background/superficies                      ← Fundacao
```

### 16.4 Micro-interacoes

- **Hover em botoes:** Scale 1.03 + glow ampliado + sombra mais forte
- **Press em botoes:** Scale 0.98 (feedback tatil)
- **Focus em inputs:** Ring accent + glow suave ao redor
- **Tab bar:** Transicao suave de cor (muted → accent)
- **Loading:** Spinner + texto descritivo
- **Ganho de XP:** Animacao pop-up que sobe e desaparece

---

## 17. Checklist de Replicacao para Quiz

Para replicar a identidade visual do ResumoX em um quiz:

### Obrigatorio

- [ ] Fundo escuro `#0A0A0F` ou proximo
- [ ] Cards com fundo `#13131A` e borda `#2A2A3A`
- [ ] Acento principal roxo `#6C5CE7` e lavanda `#A29BFE`
- [ ] Texto primario `#E8E8ED`, secundario `#8888A0`
- [ ] Botoes CTA com gradiente roxo→lavanda e glow
- [ ] Border-radius arredondado (16px / rounded-2xl)
- [ ] Fonte Inter para corpo de texto
- [ ] Efeito hover com scale + glow
- [ ] Estados de erro em vermelho `#FF6B6B`
- [ ] Estados de sucesso em verde `#00D68F`

### Recomendado

- [ ] Glassmorfismo (backdrop-blur) em cards elevados
- [ ] Particulas ou circulos flutuantes decorativos no fundo
- [ ] Animacao de entrada (fade-in / slide-up)
- [ ] Barra de progresso com gradiente accent
- [ ] Badge "ResumoX" em pill com borda accent
- [ ] Scrollbar customizada com gradiente roxo
- [ ] Destaque em ouro `#F0C040` para conquistas/resultados

### Tom e Linguagem

- Tratamento: "voce" (informal, proximo)
- Tom: confiante, motivador, sem exageros
- Foco: transformacao pessoal atraves do conhecimento
- Palavras-chave: "transformacao", "conhecimento", "evolucao", "resultados"

---

## 18. Tokens Resumidos (Quick Reference)

```
BG Principal:     #0A0A0F
Surface:          #13131A
Borda:            #2A2A3A
Texto:            #E8E8ED
Muted:            #8888A0
Accent:           #6C5CE7
Accent Light:     #A29BFE
Gold:             #F0C040
Green:            #00D68F
Red:              #FF6B6B
Radius:           16px (rounded-2xl)
Radius pill:      9999px (rounded-full)
Font body:        Inter
Font heading:     Playfair Display
Transicao:        all 300ms
Hover scale:      1.03
Active scale:     0.98
Blur glass:       16px
Theme color:      #0A0A0F
```

---

**Fim do Design System — ResumoX**
