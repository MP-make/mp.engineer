# Página de Proyectos — Documentación Técnica

## Ubicación
- **Lista**: `src/app/proyectos/page.tsx`
- **Detalle**: `src/app/proyectos/[id]/page.tsx`
- **Layout**: `src/app/proyectos/layout.tsx` (solo `force-dynamic`)

---

## 1. Estructura general

### Página principal (`/proyectos`)

```
┌──────────────────────────────────────────────────┐
│ Navbar (fija + backdrop-blur)                    │
│━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━│
│                                                   │
│  Hero section:                                    │
│  ┌──────────────┐ ┌──────────────────────┐       │
│  │ Badge (Rocket) │ │ Imagen setupweb.webp │       │
│  │ Título gradiente│ │ Gradient overlay     │       │
│  │ Subtítulo      │ │ Inner shadow        │       │
│  └──────────────┘ │ Círculo rotatorio    │       │
│                    │ Punto pulsante       │       │
│                    └──────────────────────┘       │
│                                                   │
│  Tabs (Capsule Segmented Control):                │
│  ┌───────────────────────────────────────┐        │
│  │  [ Personales (3) ] [ Empresa (2) ]   │        │
│  └───────────────────────────────────────┘        │
│                                                   │
│  Grid de proyectos (sliding):                     │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐         │
│  │ Card     │ │ Card     │ │ Card     │         │
│  │ (img+bg) │ │ (img+bg) │ │ (img+bg) │         │
│  │ Featured │ │          │ │          │         │
│  │ ⭐ col-2  │ │          │ │          │         │
│  └──────────┘ └──────────┘ └──────────┘         │
│                                                   │
│  CTA: GitHub link (con glow)                      │
│                                                   │
│  Background: Glows + patrón dots SVG              │
└──────────────────────────────────────────────────┘
```

### Página de detalle (`/proyectos/[id]`)

```
┌──────────────────────────────────────────────────┐
│ Navbar                                           │
│━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━│
│                                                   │
│  ← Volver a Proyectos                            │
│                                                   │
│  Título del proyecto        [COMPLETADO ✓]       │
│  Descripción                                      │
│                                                   │
│  ┌────────────────────────────────────────────┐   │
│  │         Carrusel de imágenes               │   │
│  │           ● ○ ○ ○                          │   │
│  └────────────────────────────────────────────┘   │
│                                                   │
│  Tecnologías Utilizadas:                          │
│  [React] [TypeScript] [Node.js]                   │
│                                                   │
│  [Ver Demo en Vivo] [Ver Código en GitHub]        │
└──────────────────────────────────────────────────┘
```

---

## 2. Data Flow

1. **Supabase query**: `portfolio_project` con join a `portfolio_projectimage`
2. **Orden**: `featured` primero, luego por `created_at` descendente
3. **Filtro local**: `project_type === 'personal'` / `'company'`
4. **Refetch**: Al hacer focus en la ventana (`window.addEventListener('focus')`)

```typescript
interface Project {
  id: number;
  title: string;
  description: string;
  link?: string;
  github_link?: string;
  technologies: string[];
  status: 'COMPLETADO' | 'EN DESARROLLO';
  project_type: 'personal' | 'company';
  company?: string;
  created_at: string;
  images?: { image: string }[];
  featured?: boolean;
}
```

---

## 3. Efectos y animaciones (lista completa)

### Fondo tecnológico
| Efecto | Código | Descripción |
|--------|--------|-------------|
| Glow cyan superior | `bg-cyan-900/8 blur-[150px]` | Mancha de color difuminada arriba-izquierda |
| Glow azul inferior | `bg-blue-900/8 blur-[150px]` | Mancha de color difuminada abajo-derecha |
| Patrón dots SVG | `pattern id="tech-dots-proy"` | Círculos + líneas diagonales (opacidad 0.04) |

### Hero section
| Efecto | Tipo | Detalle |
|--------|------|---------|
| Badge "Portafolio" | Framer Motion | Fade-in + slide, icono Rocket, tracking 0.15em |
| Título gradiente | CSS + Motion | `gradient-title` con drop-shadow glow, bg animado |
| Subtítulo | Static | `text-lg md:text-xl text-text-muted font-light` |
| **Imagen setup** | **---** | **---** |
| Gradient overlay | CSS | `from-background/50 via-transparent to-background/30` — integra la foto con el fondo |
| Inner shadow | CSS | `shadow-[inset_0_0_80px_rgba(0,0,0,0.4)]` — profundidad oscura |
| Borde | CSS | `border-border-color` + `shadow-xl shadow-black/10` — visible en light mode |
| Ring | CSS | `ring-1 ring-white/5` — borde interno sutil |
| Zoom hover | CSS | `transition-transform duration-[3s] scale(105%)` |
| Círculo decorativo | CSS | `animate-[spin_8s_linear_infinite]` rotación |
| Punto pulsante | CSS | `animate-pulse` con glow cyan 60% opacity |

### Tabs (Capsule Segmented Control)
| Efecto | Tipo | Detalle |
|--------|------|---------|
| Indicador deslizante | Framer Motion | `transition ease-[cubic-bezier(0.34,1.56,0.64,1)]` — spring |
| Opacidad indicador | CSS | `from-cyan-500/90 to-blue-500/90` — saturación reducida (antes 100%) |
| Texto tab activo | CSS | `text-white drop-shadow` — compensa el indicador reducido |
| Iconos | Lucide | `User` (personal), `Briefcase` (empresa) — size 20 |
| Contadores | CSS | Badge numérico con fondo `bg-white/15` en activo |

### Grid de proyectos
| Efecto | Tipo | Detalle |
|--------|------|---------|
| **Entrada cards** | **whileInView** | **Cada card se anima independientemente con `whileInView={{ opacity:1, y:0 }}` + `viewport: { once: true }` — NUNCA se congela** |
| Delay escalonado | JS | `delay: index * 0.06` — stagger sin depender del container |
| Gap grid | CSS | `gap-6` fijo y consistente entre todas las filas |
| Imagen background | CSS hover | `transition-transform duration-[2s] scale(110%)` + opacidad |
| Overlay gradient | CSS | `from-surface via-surface/80 to-transparent` |
| Card hover | CSS | `hover:-translate-y-1` |
| **Card featured** | **CSS** | **`border-cyan-500/20` + `shadow-[0_0_25px_rgba(34,211,238,0.08)]` — glow permanente desde el inicio** |
| Badge "Destacado" | Conditional | Solo si `featured`, con icono Star (fill cyan) |
| Badge estado | Conditional | `COMPLETADO` = emerald, `EN DESARROLLO` = amber |
| Badge empresa | Conditional | Purple, muestra `project.company` |
| Links GitHub/Demo | CSS hover | Opacidad: solo visibles en hover del card, `-translate-y-2 → 0` |
| Tech tags | CSS hover | `group-hover:border-cyan-500/30 group-hover:text-cyan-300` |
| **+N tooltip** | **CSS hover** | **`title` attribute + tooltip flotante con `group-hover/tooltip:opacity-100` + `z-20`** |
| Card hero (featured) | Layout | `md:col-span-2 lg:col-span-2`, padding variable |

### Sliding panel
| Efecto | Tipo | Detalle |
|--------|------|---------|
| Slide horizontal | Framer Motion | `animate={{ x: '0%' | '-50%' }}` con `ease: [0.25, 0.1, 0.25, 1] as const` |
| Container 200% | CSS | `width: 200%`, cada panel `w-1/2` con padding lateral |

### CTA final
| Efecto | Tipo | Detalle |
|--------|------|---------|
| Fade-in on view | Framer Motion | `whileInView={{ opacity: 1 }}`, `viewport: { once: true }` |
| **Presencia** | **CSS** | **`bg-cyan-500/10 border-cyan-500/30 hover:shadow-[0_0_30px_rgba(34,211,238,0.15)]` + icono `ArrowUpRight` + `hover:-translate-y-0.5`** |
| Línea divisoria | CSS | `border-t border-border-color/50 mt-24 pt-16` |

### Loading state
| Efecto | Tipo | Detalle |
|--------|------|---------|
| Spinner | CSS | `border-4 border-cyan-500/20 border-t-cyan-400 animate-spin` |

### Empty state
| Efecto | Tipo | Detalle |
|--------|------|---------|
| Icono grande + texto | Static | `User` o `Briefcase` size 48, `opacity-30`, texto `text-text-muted/60` |

---

## 4. Página de detalle — efectos

| Efecto | Tipo | Detalle |
|--------|------|---------|
| Back button | Hover | `hover:text-cyan-400 transition-colors` |
| Badge estado | Condicional | `CheckCircle` (completado, green) / `Clock` (progreso, yellow) |
| Carrusel | Auto + manual | Cambia c/3s, dots navegables, `object-cover` |
| Tech pills | CSS | `bg-cyan-400/10 border-cyan-400/30 text-cyan-400 rounded-full` |
| Botones acción | Hover + scale | `hover:shadow-lg hover:scale-105` (Demo), `hover:border-cyan-400` (GitHub) |

---

## 5. Dependencias

| Librería | Uso |
|----------|-----|
| `framer-motion` | Animaciones de entrada (`whileInView`), slides |
| `lucide-react` | Iconos (Rocket, Star, User, Briefcase, Github, ArrowUpRight, etc.) |
| `@supabase/supabase-js` | Fetch de proyectos desde Supabase |
| `next/link` | Navegación cliente |
| `next/navigation` | `useParams` para detalle |

---

## 6. Responsive behavior

- **Mobile**: Cards en 1 columna, tabs sin iconos, hero apilado (order flex)
- **Tablet (md)**: Cards en 2 columnas, hero side-by-side
- **Desktop (lg)**: Cards en 3 columnas, hero imagen más grande
- **Featured card**: `md:col-span-2 lg:col-span-2` en desktop

---

## 7. Traducciones usadas

```typescript
t.projects.title       // "Proyectos" / "Projects"
t.projects.subtitle    // Subtítulo del hero
t.projects.personal    // "Proyectos Personales"
t.projects.company     // "Proyectos de Empresa"
t.projects.completed   // "COMPLETADO"
t.projects.inProgress  // "EN DESARROLLO"
t.projects.viewMore    // CTA texto
t.projects.visitGithub // CTA botón
```

---

## 8. Fixes aplicados (Julio 2026)

### Lista (`/proyectos`)

| Problema | Fix | Archivo |
|----------|-----|---------|
| 🔴 Opacity ghost — stagger congelado | Reemplazado `whileInView` por `animate` + `initial` con key-based re-mount en cada tab switch | `page.tsx` |
| 🔴 +N sin tooltip | Agregado `title` attr + tooltip flotante con `group-hover/tooltip` + `z-20` | `page.tsx` |
| 🌙 Imagen hero sin integración | Gradient overlay `from-slate-900/70` + inner shadow `80px` + ring `white/10` | `page.tsx` |
| 🌙 Tab sólido sobresaturado | Opacidad reducida a `/90` + texto con `drop-shadow` | `page.tsx` |
| 🌙 Featured card plana | `border-cyan-500/20` + `shadow-[0_0_25px_rgba(...)]` permanente | `page.tsx` |
| ☀️ Imagen hero sin contraste | Overlay oscuro unificado `from-slate-900/70` (funciona en ambos modos) | `page.tsx` |
| ☀️ Badges pálidos | Saturación aumentada en overrides light mode | `globals.css` |
| ☀️ Sin separación secciones | Page background cambiado a `bg-surface` | `page.tsx` |
| 📐 CTA discreto | Glow hover + icono `ArrowUpRight` + `translate-y` | `page.tsx` |
| 📐 Grid spacing | Gap fijo `gap-6` en el container grid | `page.tsx` |
| 🔴 next/image hostname | Agregado `remotePatterns` en `next.config.ts` para Supabase Storage | `next.config.ts` |
| 🟡 Tab context al volver | Card link incluye `?from=personal\|company`; list page lee `?tab=` query param | `page.tsx` (lista y detalle) |

### Detalle (`/proyectos/[id]`)

| Problema | Fix | Archivo |
|----------|-----|---------|
| 🔴 XSS via dangerouslySetInnerHTML | Instalado `isomorphic-dompurify` + sanitizado `content_structure` antes de renderizar | `ProjectDetailClient.tsx` |
| 🟡 Sin metadata dinámica (SEO) | Separado en Server Component con `generateMetadata` (title, description, OpenGraph) + Client wrapper | `page.tsx` + `ProjectDetailClient.tsx` |
| 🟡 Loading state texto plano | Eliminado loading state (server component ya entrega data lista) | `ProjectDetailClient.tsx` |
| 🟡 Pérdida de tab al volver | Back link usa `?from=` recibido del list page | `ProjectDetailClient.tsx` |
| 🟢 content_structure: any | Tipado como `string \| null` en la interfaz Project | `ProjectDetailClient.tsx` |

| Problema | Fix | Archivo |
|----------|-----|---------|
| 🔴 Opacity ghost — stagger congelado | Reemplazado `containerVariants` + `itemVariants` por `whileInView` con `once: true` por card | `page.tsx` |
| 🔴 +N sin tooltip | Agregado `title` attr + tooltip flotante con `group-hover/tooltip` + `z-20` | `page.tsx` |
| 🌙 Imagen hero sin integración | Gradient overlay `from-background/50` + inner shadow `80px` + ring `white/5` | `page.tsx` |
| 🌙 Tab sólido sobresaturado | Opacidad reducida a `/90` + texto con `drop-shadow` | `page.tsx` |
| 🌙 Featured card plana | `border-cyan-500/20` + `shadow-[0_0_25px_rgba(...)]` permanente | `page.tsx` |
| ☀️ Imagen hero sin contraste | `border-border-color` + `shadow-xl shadow-black/10` | `page.tsx` |
| ☀️ Badges pálidos | Saturación aumentada en overrides light mode (`globals.css`) | `globals.css` |
| ☀️ Sin separación secciones | Page background cambiado a `bg-surface` (fondo ligeramente distinto a cards) | `page.tsx` |
| 📐 CTA discreto | Glow hover + icono `ArrowUpRight` + `translate-y` | `page.tsx` |
| 📐 Grid spacing | Gap fijo `gap-6` en el container grid | `page.tsx` |
