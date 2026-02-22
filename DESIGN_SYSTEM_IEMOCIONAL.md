# Design System - Kit Inteligencia Emocional

Comprehensive design tokens and patterns extracted from `/home/fredlisboa/lt-entregaveis/public/pagina-vendas-iemocional.html`

---

## 1. Color Palette

### Custom Brand Colors (Hex)
```css
/* Primary Brand Colors */
--teal-brand: #1CBBB4;      /* Teal/Cyan accent */
--green-brand: #73BE48;     /* Lime green accent */
--pink-brand: #ED145B;      /* Hot pink/magenta */
--orange-brand: #F7941E;    /* Vibrant orange */
```

### Tailwind Color Usage

#### Background Colors
**Solid Backgrounds:**
- `bg-white` - Primary background
- `bg-white/95` - Semi-transparent white (95% opacity)
- `bg-gray-50` - Light gray background
- `bg-blue-50` - Light blue tint
- `bg-lime-100`, `bg-lime-300`, `bg-lime-400`, `bg-lime-500`
- `bg-pink-100`, `bg-pink-200`, `bg-pink-300`
- `bg-yellow-100`, `bg-yellow-300`, `bg-yellow-400`
- `bg-rose-200`

**Gradient Backgrounds:**

*Lime/Green Gradients:*
- `from-lime-500 to-lime-600` - Primary lime CTA
- `from-lime-400 to-lime-600` - Alternative lime CTA
- `from-lime-300 to-lime-300` - Glow effects
- `from-lime-300 via-yellow-300 to-lime-300` - Triple gradient glow
- `from-[#73BE48] to-[#73BE48]` - Custom green brand

*Pink/Purple Gradients:*
- `from-pink-500 to-purple-600` - Primary purple CTA
- `from-pink-500 to-rose-600` - Rose variant CTA
- `from-pink-300 via-purple-300 to-pink-300` - Glow effect
- `from-pink-300 via-rose-300 to-pink-300` - Alternative glow
- `from-purple-500 to-pink-500` - Inverted gradient
- `from-purple-400 to-purple-400` - Solid purple tint

*Orange/Yellow Gradients:*
- `from-yellow-100 to-orange-100` - Light badge
- `from-orange-100 to-pink-100` - Warm badge
- `from-[#F7941E] to-[#F7941E]` - Custom orange brand

*Blue/Cyan Gradients:*
- `from-[#1CBBB4] to-[#1CBBB4]` - Custom teal brand
- `from-blue-500 to-cyan-500` - Blue-cyan blend
- `from-cyan-400 to-cyan-500` - Cyan accent

*Multi-color Gradients:*
- `from-pink-100 via-pink-50 to-purple-100`
- `from-indigo-50 to-pink-50`
- `from-indigo-900 via-blue-900 to-indigo-900`

#### Text Colors
**Dark Text:**
- `text-gray-900`, `text-gray-800`, `text-gray-700`, `text-gray-600`
- `text-indigo-900`, `text-indigo-700`
- `text-blue-900`

**Colored Text:**
- `text-lime-600`, `text-lime-500`, `text-lime-400`, `text-lime-300`
- `text-pink-700`, `text-pink-600`, `text-pink-500`, `text-pink-400`, `text-pink-300`
- `text-purple-600`, `text-purple-500`, `text-purple-300`
- `text-orange-600`, `text-orange-500`, `text-orange-400`
- `text-yellow-600`, `text-yellow-500`, `text-yellow-400`, `text-yellow-300`, `text-yellow-200`, `text-yellow-100`
- `text-red-700`, `text-red-600`, `text-red-300`
- `text-green-600`
- `text-[#1CBBB4]`, `text-[#73BE48]` - Custom brand colors

**Special Text:**
- `text-white`, `text-white/95`, `text-white/90`
- `text-transparent` - Used with `bg-clip-text` for gradient text
- `text-cream-foreground`

#### Border Colors
- `border-gray-100`, `border-gray-200`
- `border-lime-300`, `border-lime-400`
- `border-pink-200`, `border-pink-300`, `border-pink-400`, `border-pink-500`
- `border-purple-200`, `border-purple-300`, `border-purple-400`, `border-purple-500`
- `border-red-200`, `border-red-600`

---

## 2. Typography

### Font Weights
- `font-black` - 900 (Primary for CTAs and headings)
- `font-bold` - 700 (Secondary headings)
- `font-semibold` - 600 (Subheadings)
- `font-medium` - 500 (Body emphasis)

### Font Sizes
**Small:**
- `text-xs` - Extra small (badges, labels)
- `text-sm` - Small (body text, buttons)
- `text-base` - Base (16px default)

**Medium:**
- `text-lg` - Large body
- `text-xl` - Extra large
- `text-2xl` - 2XL

**Large (Headings):**
- `text-3xl` - Mobile headings
- `text-4xl` - Tablet headings
- `text-5xl` - Desktop H2
- `text-7xl` - Hero H1

### Text Utilities
- `text-center`, `text-left` - Alignment
- `bg-clip-text` - Clip background to text (for gradient text)
- `leading-tight` - Tighter line height
- `whitespace-nowrap` - Prevent text wrapping

### Gradient Text Pattern
```html
<span class="relative z-10 bg-gradient-to-r from-lime-500 to-lime-600 bg-clip-text text-transparent">
  Gradient Text
</span>
```

---

## 3. Spacing & Layout

### Padding
**Small:**
- `p-3`, `p-6`, `p-8`, `p-10`
- `px-2`, `px-3`, `px-4`, `px-5`, `px-6`, `px-8`, `px-10`, `px-[11px]`
- `py-1`, `py-1.5`, `py-2`, `py-2.5`, `py-3`, `py-4`, `py-5`, `py-6`

**Large:**
- `py-16`, `py-20`

### Margins
- `mx-auto` - Center horizontally
- `my-10`, `my-16` - Vertical spacing

### Gaps (Flexbox/Grid)
- `gap-1`, `gap-1.5`, `gap-2`, `gap-3`, `gap-4`, `gap-6`, `gap-8`, `gap-12`, `gap-16`

### Border Radius
- `rounded-md` - Small (0.375rem)
- `rounded-lg` - Medium (0.5rem)
- `rounded-xl` - Large (0.75rem)
- `rounded-2xl` - Extra large (1rem)
- `rounded-3xl` - 2XL (1.5rem)
- `rounded-full` - Pills/circles (9999px)

### Shadows
**Standard:**
- `shadow-sm` - Subtle shadow
- `shadow-md` - Medium shadow
- `shadow-lg` - Large shadow
- `shadow-xl` - Extra large shadow
- `shadow-2xl` - Maximum shadow

**Colored Shadows:**
- `shadow-lime-500/20`, `shadow-lime-500/25`
- `shadow-pink-500/15`, `shadow-pink-500/20`, `shadow-pink-500/25`
- `shadow-purple-500/20`
- `shadow-orange-500/20`, `shadow-orange-500/25`
- `shadow-yellow-500/25`
- `shadow-green-500/20`
- `shadow-teal-500/20`

### Blur Effects
- `blur-lg` - Large blur
- `blur-xl` - Extra large blur
- `blur-2xl` - 2XL blur
- `blur-3xl` - Maximum blur
- `backdrop-blur-sm` - Backdrop blur (glassmorphism)

---

## 4. Animations

### Tailwind Animation Classes
**Float/Movement:**
- `animate-float` - Floating motion
- `animate-float-slow` - Slower floating
- `animate-float-slow-glow` - Float with glow
- `animate-float-glow` - Float with glow effect
- `animate-float-delayed` - Delayed float
- `animate-float-delayed-slow` - Delayed slow float

**Bounce:**
- `animate-bounce` - Standard bounce
- `animate-bounce-slow` - Slower bounce
- `animate-bounce-slower` - Very slow bounce
- `animate-bounce-glow` - Bounce with glow

**Pulse/Scale:**
- `animate-pulse` - Pulsing opacity
- `animate-pulse-scale` - Pulsing scale
- `animate-scale-pulse` - Scale pulsing

**Spin/Rotate:**
- `animate-spin-slow` - Slow spin
- `animate-spin-slower` - Very slow spin
- `animate-wiggle` - Wiggle motion

**Special:**
- `animate-nature-wave` - Wave motion
- `animate-nature-float` - Nature-inspired float
- `animate-pricing-bg-move` - Background movement
- `animate-subtle-zoom` - Subtle zoom

**Accordion:**
- `animate-accordion-down` - Slide down
- `animate-accordion-up` - Slide up

### Custom Keyframes

#### Float Badge Motion
```css
@keyframes float-badge-motion {
  0% {
    transform: translate(-50%, -50%) translate(calc(var(--badge-base-x) * 0.3), calc(var(--badge-base-y) * 0.3)) scale(0.7);
    opacity: 0.3;
  }
  25% {
    transform: translate(-50%, -50%) translate(calc(var(--badge-base-x) * 0.6), calc(var(--badge-base-y) * 0.6)) scale(0.85);
    opacity: 0.6;
  }
  50% {
    transform: translate(-50%, -50%) translate(var(--badge-base-x), var(--badge-base-y)) scale(1);
    opacity: 1;
  }
  75% {
    transform: translate(-50%, -50%) translate(calc(var(--badge-base-x) * 0.6), calc(var(--badge-base-y) * 0.6)) scale(0.85);
    opacity: 0.6;
  }
  100% {
    transform: translate(-50%, -50%) translate(calc(var(--badge-base-x) * 0.3), calc(var(--badge-base-y) * 0.3)) scale(0.7);
    opacity: 0.3;
  }
}

/* Mobile variant */
@media (max-width: 768px) {
  @keyframes float-badge-motion {
    /* Reduced scale and translation for mobile */
    0% { transform: translate(-50%, -50%) translate(calc(var(--badge-base-x) * 0.2), calc(var(--badge-base-y) * 0.2)) scale(0.65); }
    50% { transform: translate(-50%, -50%) translate(calc(var(--badge-base-x) * 0.7), calc(var(--badge-base-y) * 0.7)) scale(0.9); }
  }
}
```

#### Float (Standard)
```css
@keyframes float {
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-20px);
  }
}
```

### Animation Delays
Used with `style="animation-delay: Xs"`:
- `0s`, `0.3s`, `0.5s`, `0.8s`, `1s`

---

## 5. Components

### 5.1 Button Styles

#### Primary CTA - Lime (Green)
```html
<!-- Desktop/Main Version -->
<a href="#" class="cta-button-lime relative block px-10 py-5 bg-gradient-to-r from-lime-500 to-lime-600 text-white font-black text-sm rounded-full shadow-2xl hover:shadow-xl hover:scale-105 transition-all duration-300 overflow-hidden border-none cursor-pointer">
  <span class="relative z-10 flex items-center gap-1.5 whitespace-nowrap">
    <svg class="lucide lucide-zap w-5 h-5 animate-pulse" fill="white">...</svg>
    ¡QUIERO EL SUPERPODER!
    <svg class="lucide lucide-zap w-5 h-5 animate-pulse" fill="white">...</svg>
  </span>
</a>

<!-- With Glow Wrapper -->
<div class="relative group">
  <div class="absolute -inset-3 bg-gradient-to-r from-lime-300 via-yellow-300 to-lime-300 rounded-full opacity-40 blur-xl animate-pulse"></div>
  <a href="#" class="cta-button-lime ...">Button Content</a>
</div>

<!-- Alternative Lime (Dark Text) -->
<a href="#" class="cta-button-lime relative block px-6 lg:px-12 py-3 lg:py-5 bg-gradient-to-r from-lime-400 to-lime-600 text-indigo-900 font-black text-base lg:text-xl rounded-full shadow-2xl hover:shadow-xl hover:scale-105 transition-all duration-300 overflow-hidden border-none cursor-pointer">
  ...
</a>
```

**Key Features:**
- Gradient: `from-lime-500 to-lime-600` (or `from-lime-400 to-lime-600`)
- Text: `text-white` or `text-indigo-900`
- Font: `font-black`
- Border radius: `rounded-full`
- Shadow: `shadow-2xl` → `hover:shadow-xl`
- Transform: `hover:scale-105`
- Transition: `transition-all duration-300`
- Icon: Lucide `zap` with `animate-pulse` and `fill="white"`
- Glow: `-inset-3` with `from-lime-300 via-yellow-300 to-lime-300`, `opacity-40`, `blur-xl`, `animate-pulse`

#### Secondary CTA - Pink/Purple
```html
<!-- Desktop Version -->
<a href="#" class="cta-button-purple relative flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white font-black rounded-full shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 overflow-hidden cursor-pointer inline-flex">
  <svg class="lucide lucide-zap w-4 h-4 relative z-10 animate-pulse" fill="white">...</svg>
  <span class="relative z-10">¡Comprar!</span>
</a>

<!-- Mobile Version (Smaller) -->
<a href="#" class="cta-button-purple relative flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white font-black text-sm rounded-full shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 overflow-hidden cursor-pointer inline-flex">
  <svg class="lucide lucide-zap w-3.5 h-3.5 relative z-10 animate-pulse" fill="white">...</svg>
  <span class="relative z-10">Comprar</span>
</a>

<!-- With Glow Wrapper -->
<div class="relative group">
  <div class="absolute -inset-2 bg-gradient-to-r from-pink-300 via-purple-300 to-pink-300 rounded-full opacity-40 blur-lg animate-pulse"></div>
  <a href="#" class="cta-button-purple ...">Button Content</a>
</div>
```

**Key Features:**
- Gradient: `from-pink-500 to-purple-600` (or `from-pink-500 to-rose-600`)
- Text: `text-white`
- Font: `font-black`
- Border radius: `rounded-full`
- Shadow: `shadow-xl` → `hover:shadow-2xl`
- Transform: `hover:scale-105`
- Display: `inline-flex`
- Glow: `-inset-2` with `from-pink-300 via-purple-300 to-pink-300`, `opacity-40`, `blur-lg`, `animate-pulse`

#### Pink Variant
```html
<a href="#" class="cta-button-pink relative block px-10 py-5 bg-gradient-to-r from-pink-500 to-purple-600 text-white font-black text-sm rounded-full shadow-2xl hover:shadow-xl hover:scale-105 transition-all duration-300 overflow-hidden border-none cursor-pointer">
  ...
</a>
```

**Glow Variant:**
- `-inset-3` with `from-pink-300 via-rose-300 to-pink-300`, `opacity-70`, `blur-xl`, `animate-pulse`

### 5.2 Card Styles

#### Standard Card (White with Border)
```html
<div class="flex items-start gap-4 bg-white border border-red-200 p-6 rounded-xl hover:shadow-lg transition-shadow">
  <!-- Card content -->
</div>

<!-- Border color variants -->
border-red-200
border-pink-200
```

**Key Features:**
- Background: `bg-white`
- Border: `border border-{color}-200`
- Padding: `p-6`
- Border radius: `rounded-xl`
- Hover: `hover:shadow-lg`
- Transition: `transition-shadow`

#### Premium Card (Elevated)
```html
<div class="group relative bg-white rounded-2xl shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 overflow-hidden flex-shrink-0">
  <!-- Card content -->
</div>
```

**Key Features:**
- Background: `bg-white`
- Border radius: `rounded-2xl`
- Shadow: `shadow-xl` → `hover:shadow-2xl`
- Transform: `hover:scale-105`
- Transition: `transition-all duration-300`
- Overflow: `overflow-hidden`

### 5.3 Badge/Pill Components

#### Info Badge (Colored Background)
```html
<div class="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-yellow-100 to-orange-100 rounded-full mb-6">
  <svg class="lucide lucide-sparkles w-5 h-5 text-orange-500">...</svg>
  <span class="text-sm font-bold text-orange-600">¡Basado en Neurociencia Comprobada!</span>
  <svg class="lucide lucide-sparkles w-5 h-5 text-orange-500">...</svg>
</div>
```

**Gradient Variants:**
- `from-yellow-100 to-orange-100` + `text-orange-600`
- `from-red-100 to-pink-100` + `text-pink-600`
- `from-pink-100 to-rose-100` + `text-rose-600`
- `from-orange-100 to-pink-100`
- `from-purple-100 to-pink-100` + `text-purple-600`
- `from-pink-100 to-purple-100`

**Key Features:**
- Display: `inline-flex items-center`
- Gap: `gap-2`
- Padding: `px-4 py-2`
- Border radius: `rounded-full`
- Font: `text-sm font-bold`

#### Floating Badge (Animated)
```html
<div class="px-2 py-1.5 md:px-4 md:py-2 bg-gradient-to-r from-pink-500 to-rose-500 rounded-full shadow-lg whitespace-nowrap cursor-pointer">
  <span class="text-xs md:text-sm font-bold text-white drop-shadow-[0_3px_6px_rgba(0,0,0,0.4)] block text-center">
    Padres Entrenadores
  </span>
</div>

<!-- Color variants -->
from-pink-500 to-rose-500
from-purple-500 to-pink-500
from-blue-500 to-cyan-500
```

**Key Features:**
- Responsive padding: `px-2 py-1.5 md:px-4 md:py-2`
- Responsive text: `text-xs md:text-sm`
- Text shadow: `drop-shadow-[0_3px_6px_rgba(0,0,0,0.4)]`
- Whitespace: `whitespace-nowrap`

### 5.4 Header/Navigation

#### Sticky Header
```html
<header class="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100 shadow-sm">
  <div class="container mx-auto px-4">
    <div class="flex items-center justify-between h-20">
      <!-- Logo -->
      <a class="flex items-center gap-1 max-w-[65%] sm:max-w-none cursor-pointer hover:opacity-80 transition-opacity" href="/">
        <img src="/images/logo.png" width="40" height="40" alt="..." class="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10"/>
        <span class="font-bold text-base sm:text-xl md:text-2xl lg:text-3xl leading-tight">Kit Inteligencia Emocional</span>
      </a>

      <!-- Nav links (hidden on mobile) -->
      <nav class="hidden md:flex items-center gap-8">
        <a href="#recursos" class="text-gray-700 hover:text-lime-600 font-medium transition-colors">Recursos</a>
        <a href="#bonos" class="text-gray-700 hover:text-lime-600 font-medium transition-colors">Bonos</a>
        <a href="#precios" class="text-gray-700 hover:text-lime-600 font-medium transition-colors">Precios</a>

        <!-- CTA Button in nav -->
        <div class="relative group">
          <div class="absolute -inset-2 bg-gradient-to-r from-pink-300 via-purple-300 to-pink-300 rounded-full opacity-40 blur-lg animate-pulse"></div>
          <a href="#" class="cta-button-purple ...">¡Comprar!</a>
        </div>
      </nav>

      <!-- Mobile CTA -->
      <div class="md:hidden relative group">
        <div class="absolute -inset-2 bg-gradient-to-r from-pink-300 via-purple-300 to-pink-300 rounded-full opacity-40 blur-lg animate-pulse"></div>
        <a href="#" class="cta-button-purple relative flex items-center gap-1.5 px-4 py-2 ... text-sm ...">Comprar</a>
      </div>
    </div>
  </div>
</header>
```

**Key Features:**
- Position: `sticky top-0 z-50`
- Background: `bg-white/95 backdrop-blur-sm`
- Border: `border-b border-gray-100`
- Shadow: `shadow-sm`
- Height: `h-20`
- Nav hover: `text-gray-700 hover:text-lime-600`
- Transition: `transition-colors`

### 5.5 Glow Effect Wrappers

#### Standard Glow Pattern
```html
<div class="relative group">
  <div class="absolute -inset-3 bg-gradient-to-r from-lime-300 via-yellow-300 to-lime-300 rounded-full opacity-40 blur-xl animate-pulse"></div>
  <button class="relative ...">Button Content</button>
</div>
```

**Variations:**

**Lime/Yellow Glow:**
```html
<!-- Strong glow -->
<div class="absolute -inset-3 bg-gradient-to-r from-lime-300 via-yellow-300 to-lime-300 rounded-full opacity-40 blur-xl animate-pulse"></div>

<!-- Subtle glow -->
<div class="absolute -inset-4 bg-gradient-to-r from-lime-300 to-yellow-300 rounded-3xl opacity-25 blur-xl"></div>

<!-- Intense glow -->
<div class="absolute -inset-3 bg-gradient-to-r from-lime-300 via-yellow-300 to-lime-300 rounded-full opacity-70 blur-xl animate-pulse"></div>

<!-- Maximum glow -->
<div class="absolute -inset-6 bg-gradient-to-r from-lime-300 via-yellow-300 to-lime-300 rounded-full opacity-60 blur-3xl animate-pulse"></div>
```

**Pink/Purple Glow:**
```html
<!-- Standard -->
<div class="absolute -inset-2 bg-gradient-to-r from-pink-300 via-purple-300 to-pink-300 rounded-full opacity-40 blur-lg animate-pulse"></div>

<!-- Strong -->
<div class="absolute -inset-3 bg-gradient-to-r from-pink-300 via-purple-300 to-pink-300 rounded-full opacity-40 blur-xl animate-pulse"></div>

<!-- Rose variant -->
<div class="absolute -inset-3 bg-gradient-to-r from-pink-300 via-rose-300 to-pink-300 rounded-full opacity-70 blur-xl animate-pulse"></div>

<!-- Subtle -->
<div class="absolute -inset-4 bg-gradient-to-r from-pink-300 via-purple-300 to-pink-300 rounded-full opacity-20 blur-2xl -z-10 animate-pulse"></div>

<!-- Extra large -->
<div class="absolute -inset-8 bg-gradient-to-br from-pink-300 via-purple-300 to-pink-300 rounded-3xl opacity-30 blur-2xl"></div>
```

**Pattern Structure:**
- Container: `relative group`
- Glow layer: `absolute -inset-{size}`
- Gradient: `bg-gradient-to-r from-{color}-300 via-{color}-300 to-{color}-300`
- Border radius: `rounded-full` or `rounded-{size}xl`
- Opacity: `opacity-{20-70}`
- Blur: `blur-{lg|xl|2xl|3xl}`
- Animation: `animate-pulse` (optional)
- Z-index: `-z-10` or none (based on context)
- Content: `relative` to ensure it's above glow

### 5.6 Hero Section Decorative Elements

#### Background Gradients (Large Blobs)
```html
<!-- Orange/Pink blob -->
<div class="absolute top-20 right-1/4 w-[500px] h-[500px] bg-gradient-to-br from-[#F7941E]/50 to-[#ED145B]/45 rounded-full blur-xl animate-float-slow opacity-50 hidden lg:block"></div>

<!-- Green/Teal blob -->
<div class="absolute bottom-32 left-1/4 w-[450px] h-[450px] bg-gradient-to-tr from-[#1CBBB4]/55 to-[#73BE48]/50 rounded-full blur-xl animate-bounce-slow opacity-45 hidden lg:block"></div>

<!-- Purple/Pink blob -->
<div class="absolute top-1/3 left-10 w-96 h-96 bg-gradient-to-bl from-purple-400/45 to-pink-400/40 rounded-full blur-xl animate-pulse-scale opacity-40 hidden lg:block"></div>

<!-- Yellow/Orange blob -->
<div class="absolute top-1/2 right-10 w-80 h-80 bg-gradient-to-tl from-yellow-300/45 to-orange-400/40 rounded-full blur-xl animate-float-delayed-slow hidden lg:block"></div>
```

#### Geometric Shapes
```html
<!-- Rotated square -->
<div class="absolute top-10 left-1/3 w-48 h-48 border-[6px] border-[#F7941E]/35 rounded-lg rotate-12 animate-spin-slower hidden lg:block shadow-2xl shadow-orange-500/20"></div>

<!-- Circle -->
<div class="absolute bottom-20 right-1/3 w-40 h-40 border-[6px] border-[#1CBBB4]/35 rounded-full animate-float-delayed hidden lg:block shadow-2xl shadow-teal-500/20"></div>

<!-- Rounded square -->
<div class="absolute top-1/4 left-1/4 w-36 h-36 border-[5px] border-pink-500/30 rotate-45 rounded-2xl animate-wiggle hidden lg:block"></div>
```

#### Icon Decorations
```html
<!-- Star -->
<div class="absolute -top-8 right-10 text-yellow-500 opacity-45 hidden lg:block animate-bounce-glow drop-shadow-2xl">
  <svg class="lucide lucide-star w-16 h-16" fill="currentColor">...</svg>
</div>

<!-- Sparkles -->
<div class="absolute top-40 left-10 text-pink-500 opacity-40 hidden lg:block animate-float-glow drop-shadow-2xl">
  <svg class="lucide lucide-sparkles w-14 h-14">...</svg>
</div>

<!-- Circle -->
<div class="absolute bottom-32 right-20 text-lime-500 opacity-35 hidden lg:block animate-scale-pulse drop-shadow-xl">
  <svg class="lucide lucide-circle w-12 h-12">...</svg>
</div>

<!-- Plus -->
<div class="absolute top-1/2 left-5 text-orange-400 opacity-35 hidden lg:block animate-wiggle drop-shadow-xl">
  <svg class="lucide lucide-plus w-14 h-14" stroke-width="3">...</svg>
</div>

<!-- Heart -->
<div class="absolute top-20 right-1/3 text-[#1CBBB4] opacity-30 hidden lg:block animate-float-slow">
  <svg class="lucide lucide-heart w-12 h-12" fill="currentColor">...</svg>
</div>
```

#### Mobile Fallback Gradients
```html
<!-- Mobile versions (smaller, visible on mobile) -->
<div class="absolute top-10 right-5 w-32 h-32 bg-gradient-to-br from-[#ED145B]/55 to-[#F7941E]/50 rounded-full blur-xl animate-pulse lg:hidden"></div>

<div class="absolute bottom-40 left-5 w-40 h-40 bg-gradient-to-tr from-[#73BE48]/55 to-[#1CBBB4]/50 rounded-full blur-xl animate-float lg:hidden"></div>

<div class="absolute top-1/2 right-10 w-28 h-28 bg-gradient-to-bl from-purple-400/50 to-pink-400/45 rounded-full blur-xl animate-bounce lg:hidden"></div>
```

**Key Patterns:**
- All decorative elements: `hidden lg:block` (desktop only) or `lg:hidden` (mobile only)
- Positioning: `absolute` with specific placements
- Opacity: `opacity-30` to `opacity-55`
- Drop shadows: `drop-shadow-xl` or `drop-shadow-2xl`
- Colored shadows: `shadow-2xl shadow-{color}-500/20`

---

## 6. Lucide Icons

### Icons Used
**Interactive/Action Icons:**
- `lucide-zap` - Lightning bolt (CTAs, energy, action)
- `lucide-circle-check` - Checkmark (features, confirmations)
- `lucide-package` - Package/box (product, kit)
- `lucide-gift` - Gift box (bonuses, rewards)

**Emotional/Social Icons:**
- `lucide-heart` - Heart (love, care, emotional)
- `lucide-smile` - Smile face (happiness, emotions)
- `lucide-users` - People group (community, parents)
- `lucide-brain` - Brain (intelligence, learning)
- `lucide-target` - Target (goals, focus)

**Educational Icons:**
- `lucide-book-open` - Open book (learning, resources)
- `lucide-graduation-cap` - Graduation hat (education)
- `lucide-sparkles` - Stars/sparkles (magic, special)
- `lucide-star` - Star (rating, quality)

**UI/Feedback Icons:**
- `lucide-circle-alert` - Alert circle (warnings)
- `lucide-triangle-alert` - Warning triangle (urgent alerts)
- `lucide-circle-help` - Help circle (info)
- `lucide-thumbs-up` - Thumbs up (approval)
- `lucide-square-check-big` - Large checkbox

**Other:**
- `lucide-award` - Award/medal (achievement)
- `lucide-shield` - Shield (protection, safety)
- `lucide-circle` - Circle (decorative)
- `lucide-plus` - Plus sign (decorative, add)

### Icon Sizing
- `w-3.5 h-3.5` - Extra small (mobile CTAs)
- `w-4 h-4` - Small (inline, badges)
- `w-5 h-5` - Medium (standard buttons)
- `w-6 h-6` - Large (feature icons)
- `w-7 h-7` - Extra large (responsive lg)
- `w-8 h-8` - 2XL (section headers)
- `w-12 h-12` - Large decorative
- `w-14 h-14` - XL decorative
- `w-16 h-16` - XXL decorative
- `w-24 h-24`, `w-28 h-28` - Hero decorative

### Common Icon Patterns

#### CTA Icon (Animated Zap)
```html
<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
     fill="white" stroke="currentColor" stroke-width="2"
     stroke-linecap="round" stroke-linejoin="round"
     class="lucide lucide-zap w-5 h-5 animate-pulse">
  <path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z"></path>
</svg>
```

#### Checkmark Icon
```html
<svg class="lucide lucide-circle-check w-5 h-5 text-lime-600">
  <circle cx="12" cy="12" r="10"></circle>
  <path d="m9 12 2 2 4-4"></path>
</svg>
```

#### Decorative Star (Filled)
```html
<svg class="lucide lucide-star w-16 h-16" fill="currentColor">
  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
</svg>
```

#### Sparkles Icon
```html
<svg class="lucide lucide-sparkles w-5 h-5 text-orange-500">
  <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"></path>
  <path d="M20 3v4"></path>
  <path d="M22 5h-4"></path>
  <path d="M4 17v2"></path>
  <path d="M5 18H3"></path>
</svg>
```

---

## 7. Images & Assets

### Image Paths Referenced
```
/images/logo.png                              - Site logo
/images/banner/banner-hero-lp.png            - Hero banner image
/images/shapes/apple.svg                      - Decorative apple SVG
/images/shapes/pencil-rocket.png              - Decorative pencil rocket
/images/shapes/kite.png                       - Decorative kite
/images/shapes/bread-child.png                - Decorative bread/child character
/images/shapes/arrow.png                      - Pointing arrow
/images/projects/clone-object.png             - Nature wave pattern
/images/projects/mockup2.png                  - Product mockup
/images/testimonial/zap1.png                  - Testimonial screenshot 1
/images/testimonial/zap2.png                  - Testimonial screenshot 2
```

### Image Loading Patterns

#### Responsive Image
```html
<img
  alt="Description"
  loading="lazy"
  width="width"
  height="height"
  decoding="async"
  data-nimg="1"
  class="object-contain"
  style="color:transparent"
  srcSet="/_next/image?url=%2Fimages%2Fpath.png&w=640&q=75 1x,
          /_next/image?url=%2Fimages%2Fpath.png&w=1080&q=75 2x"
  src="/_next/image?url=%2Fimages%2Fpath.png&w=1080&q=75"
/>
```

#### Responsive Sizes Attribute
```html
sizes="(max-width: 640px) 48px, (max-width: 768px) 64px, (max-width: 1024px) 96px, 128px"
```

#### Decorative Floating Image
```html
<div class="absolute ... w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 lg:w-20 lg:h-20 xl:w-24 xl:h-24 animate-float-glow opacity-95 pointer-events-none z-0" style="animation-delay:0s">
  <div class="relative w-full h-full">
    <img alt="" loading="lazy" decoding="async" data-nimg="fill" class="object-contain" style="position:absolute;height:100%;width:100%;left:0;top:0;right:0;bottom:0;color:transparent" sizes="..." srcSet="..." src="..."/>
  </div>
</div>
```

---

## 8. Layout Utilities

### Container
```html
<div class="container mx-auto px-4">
  <!-- Content -->
</div>
```

### Max Width
```html
<div class="max-w-4xl mx-auto">
  <!-- Centered content with max width -->
</div>

<div class="max-w-xs sm:max-w-sm">
  <!-- Responsive max width -->
</div>

<div class="max-w-[65%] sm:max-w-none">
  <!-- Custom max width with breakpoint -->
</div>
```

### Flexbox Layouts
```html
<!-- Standard flex row -->
<div class="flex items-center justify-between">...</div>

<!-- Flex column -->
<div class="flex flex-col items-center justify-center">...</div>

<!-- Flex wrap -->
<div class="flex flex-wrap items-center justify-center gap-6">...</div>

<!-- Flex with gap -->
<div class="flex items-center gap-2">...</div>
```

### Z-Index Layering
- `z-0` - Decorative elements behind
- `z-10` - Main content
- `z-20` - Above main content
- `z-50` - Sticky header
- `-z-10` - Behind parent

### Overflow
- `overflow-hidden` - Hide overflow (cards, buttons)
- `overflow-visible` - Allow overflow
- `overflow-auto` - Scrollable

### Position
- `relative` - For absolute child positioning
- `absolute` - Positioned relative to parent
- `sticky top-0` - Sticky header

---

## 9. Responsive Patterns

### Breakpoint Visibility
```html
<!-- Hide on mobile, show on desktop -->
<div class="hidden md:flex">...</div>

<!-- Show on mobile, hide on desktop -->
<div class="md:hidden">...</div>

<!-- Show only on large screens -->
<div class="hidden lg:block">...</div>
```

### Responsive Sizing
```html
<!-- Responsive text -->
<span class="text-base sm:text-xl md:text-2xl lg:text-3xl">...</span>

<!-- Responsive padding -->
<div class="px-4 py-2 md:px-6 md:py-3 lg:px-12 lg:py-5">...</div>

<!-- Responsive width/height -->
<div class="w-8 h-8 sm:w-10 sm:h-10 md:w-14 md:h-14 lg:w-16 lg:h-16 xl:w-20 xl:h-20">...</div>

<!-- Responsive gap -->
<div class="gap-1.5 lg:gap-3">...</div>
```

### Responsive Grid/Flex
```html
<!-- Responsive flex direction -->
<div class="flex flex-col md:flex-row">...</div>

<!-- Responsive alignment -->
<div class="items-start md:items-center">...</div>
```

---

## 10. Transition & Interaction

### Hover States
```html
<!-- Scale on hover -->
hover:scale-105

<!-- Shadow on hover -->
hover:shadow-2xl
hover:shadow-xl
hover:shadow-lg

<!-- Color on hover -->
hover:text-lime-600
hover:opacity-80

<!-- Combined -->
class="... hover:shadow-2xl hover:scale-105 transition-all duration-300"
```

### Transitions
```html
transition-all duration-300       <!-- All properties, 300ms -->
transition-colors                 <!-- Color transitions only -->
transition-shadow                 <!-- Shadow transitions only -->
transition-opacity                <!-- Opacity transitions only -->
```

### Cursor
```html
cursor-pointer                    <!-- Pointer cursor for interactive elements -->
```

### Pointer Events
```html
pointer-events-none               <!-- Disable pointer events (decorative elements) -->
```

---

## 11. Special Effects

### Backdrop Blur (Glassmorphism)
```html
<header class="... bg-white/95 backdrop-blur-sm">...</header>
```

### Drop Shadow
```html
<!-- Text drop shadow -->
<span class="drop-shadow-[0_3px_6px_rgba(0,0,0,0.4)]">Text</span>

<!-- Icon drop shadow -->
<div class="drop-shadow-2xl">
  <svg>...</svg>
</div>

<div class="drop-shadow-xl">
  <svg>...</svg>
</div>
```

### Opacity
```html
opacity-95, opacity-90              <!-- High opacity -->
opacity-70, opacity-60              <!-- Medium opacity -->
opacity-50, opacity-45, opacity-40  <!-- Lower opacity -->
opacity-35, opacity-30, opacity-25  <!-- Very low opacity -->
opacity-20                          <!-- Minimal opacity -->
```

### Transform
```html
rotate-12                           <!-- Rotate 12 degrees -->
rotate-45                           <!-- Rotate 45 degrees -->
rotate-180                          <!-- Rotate 180 degrees (flip) -->
-rotate-1                           <!-- Rotate -1 degree (slight tilt) -->
```

### Aspect Ratio
```html
<div style="padding-top:177.78%">  <!-- 16:9 aspect ratio via padding -->
  <iframe style="position:absolute;top:0;left:0;height:100%;width:100%">...</iframe>
</div>
```

---

## 12. Component Assembly Examples

### Complete CTA with Glow
```html
<div class="flex flex-col items-center justify-center mb-12 relative overflow-visible">
  <div class="relative group">
    <!-- Glow layer -->
    <div class="absolute -inset-3 bg-gradient-to-r from-lime-300 via-yellow-300 to-lime-300 rounded-full opacity-40 blur-xl animate-pulse"></div>

    <!-- Button -->
    <a href="#precios" class="cta-button-lime relative block px-10 py-5 bg-gradient-to-r from-lime-500 to-lime-600 text-white font-black text-sm rounded-full shadow-2xl hover:shadow-xl hover:scale-105 transition-all duration-300 overflow-hidden border-none cursor-pointer">
      <span class="relative z-10 flex items-center gap-1.5 whitespace-nowrap">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="white" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-zap w-5 h-5 animate-pulse">
          <path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z"></path>
        </svg>
        ¡QUIERO EL SUPERPODER!
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="white" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-zap w-5 h-5 animate-pulse">
          <path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z"></path>
        </svg>
      </span>
    </a>
  </div>

  <!-- Pointing arrow (desktop only) -->
  <div class="hidden sm:block absolute pointer-events-none" style="left:calc(50% + 160px);top:5%;transform:translateY(-1%)">
    <img alt="arrow" loading="lazy" width="70" height="47" decoding="async" data-nimg="1" class="rotate-180" style="color:transparent" srcSet="/_next/image?url=%2Fimages%2Fshapes%2Farrow.png&amp;w=96&amp;q=75 1x, /_next/image?url=%2Fimages%2Fshapes%2Farrow.png&amp;w=256&amp;q=75 2x" src="/_next/image?url=%2Fimages%2Fshapes%2Farrow.png&amp;w=256&amp;q=75"/>
  </div>
</div>

<!-- Feature checks below button -->
<div class="flex flex-wrap items-center justify-center gap-6 text-gray-600">
  <div class="flex items-center gap-2">
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-circle-check w-5 h-5 text-lime-600">
      <circle cx="12" cy="12" r="10"></circle>
      <path d="m9 12 2 2 4-4"></path>
    </svg>
    <span class="text-sm font-medium">Acceso Inmediato</span>
  </div>
  <div class="flex items-center gap-2">
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-circle-check w-5 h-5 text-lime-600">
      <circle cx="12" cy="12" r="10"></circle>
      <path d="m9 12 2 2 4-4"></path>
    </svg>
    <span class="text-sm font-medium">100% Seguro</span>
  </div>
  <div class="flex items-center gap-2">
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-circle-check w-5 h-5 text-lime-600">
      <circle cx="12" cy="12" r="10"></circle>
      <path d="m9 12 2 2 4-4"></path>
    </svg>
    <span class="text-sm font-medium">Garantía de 7 Días</span>
  </div>
</div>
```

### Hero Headline with Gradient Text
```html
<h1 class="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-black leading-tight mb-4 sm:mb-6 text-indigo-900">
  13 Herramientas Visuales
  <span class="relative inline-block">
    <span class="relative z-10 bg-gradient-to-r from-lime-500 to-lime-600 bg-clip-text text-transparent">
      'Anti-Berrinche'
    </span>
    <span class="absolute bottom-2 left-0 w-full h-3 bg-yellow-300 -z-10 transform -rotate-1"></span>
  </span>
  Listas para Imprimir y Usar Hoy Mismo.
</h1>
```

**Pattern Breakdown:**
- Gradient text: `bg-gradient-to-r from-lime-500 to-lime-600 bg-clip-text text-transparent`
- Underline highlight: Absolute positioned span with `bg-yellow-300`, slight rotation `transform -rotate-1`
- Container: `relative inline-block` for positioning

---

## 13. Accessibility & Performance

### Loading Attributes
```html
loading="lazy"                    <!-- Lazy load images -->
decoding="async"                  <!-- Async image decoding -->
```

### Alt Text
```html
alt="Descriptive text"            <!-- Descriptive alt text -->
alt=""                            <!-- Empty alt for decorative images -->
```

### Preloading
```html
<link rel="preload" as="image" href="/images/logo.png"/>
<link rel="preload" as="image" imageSrcSet="..."/>
```

### Will-change (Performance)
```css
will-change: transform;           /* Optimize transform animations */
```

### Contain (Performance)
```css
contain: layout style paint;      /* Containment for better performance */
```

---

## 14. CSS Custom Properties Used

### Floating Badge Variables
```css
--badge-duration: 6s;                    /* Animation duration */
--badge-delay: 0s;                       /* Animation delay */
--badge-base-x: 45px;                    /* Base X translation */
--badge-base-y: 0px;                     /* Base Y translation */
```

**Usage in inline styles:**
```html
<div style="--badge-duration:6s;--badge-delay:0s;--badge-base-x:45px;--badge-base-y:0px">
  ...
</div>
```

---

## 15. Utility Class Patterns

### Negative Inset (Glow Effects)
```
-inset-2    /* -0.5rem all sides */
-inset-3    /* -0.75rem all sides */
-inset-4    /* -1rem all sides */
-inset-6    /* -1.5rem all sides */
-inset-8    /* -2rem all sides */
```

### Fractional Spacing
```
gap-1.5     /* 0.375rem */
px-[11px]   /* Custom 11px padding */
w-3.5       /* 0.875rem (14px) */
```

### Percentage Opacity in Colors
```
from-lime-300/22      /* 22% opacity */
from-pink-400/45      /* 45% opacity */
bg-white/95           /* 95% opacity */
```

---

## 16. Summary: Quick Reference

### Primary CTA Colors
- **Lime:** `from-lime-500 to-lime-600` + `text-white`
- **Pink/Purple:** `from-pink-500 to-purple-600` + `text-white`
- **Pink/Rose:** `from-pink-500 to-rose-600` + `text-white`

### Primary Glow Colors
- **Lime:** `from-lime-300 via-yellow-300 to-lime-300`
- **Pink/Purple:** `from-pink-300 via-purple-300 to-pink-300`
- **Pink/Rose:** `from-pink-300 via-rose-300 to-pink-300`

### Key Animations for CTAs
- Button: `hover:scale-105 transition-all duration-300`
- Icon: `animate-pulse` (Lucide zap icon)
- Glow: `animate-pulse`

### Standard Button Structure
1. Outer wrapper: `relative group`
2. Glow layer: `absolute -inset-{2-3}` + gradient + `blur-{lg|xl}` + `animate-pulse`
3. Button: `relative` + gradient background + `rounded-full` + `shadow-{xl|2xl}` + hover effects
4. Content: `relative z-10` to ensure visibility above effects

### Typography Scale
- Hero H1: `text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-black`
- H2: `text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold`
- Body: `text-sm font-medium` or `text-base`
- Small: `text-xs`

### Color Scheme Philosophy
- **Lime/Yellow:** Energy, action, positivity (primary CTAs)
- **Pink/Purple:** Emotional, caring, premium (secondary CTAs, badges)
- **Orange/Yellow:** Warmth, highlights, attention
- **Teal/Cyan:** Trust, calm, support
- **Indigo/Blue:** Authority, stability (text, backgrounds)

---

## 17. Replication Checklist

To replicate this visual identity:

1. **Install Tailwind CSS** with custom brand colors in config
2. **Add Lucide Icons** library (React/Vue component or SVG sprite)
3. **Configure custom animations** in Tailwind config (float, bounce variants, etc.)
4. **Set up responsive breakpoints**: sm (640px), md (768px), lg (1024px), xl (1280px)
5. **Create component library** with:
   - CTA buttons (lime, pink/purple variants)
   - Glow wrapper component
   - Badge/pill component
   - Card components (standard, elevated)
   - Header component
6. **Add decorative elements** to hero sections (blobs, shapes, icons)
7. **Implement floating badge animation** with CSS custom properties
8. **Configure Next.js Image** optimization (if using Next.js) or similar for other frameworks

---

**End of Design System Documentation**
