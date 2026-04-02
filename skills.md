# Skills + MCP para Frontend Perrón

## Objetivo
- Subir el nivel visual del sitio estático (HTML/CSS/Assets) con un flujo claro usando Skills y ejecución vía MCP.
- Entregables: tokens de diseño, refactor responsive, accesibilidad, optimización de assets y microinteracciones.

## Brand y Tokens
- Paleta activa en el proyecto:
  - brand-900: #3B3355
  - brand-800: #692A00
  - brand-700: #6F6FBB
  - brand-300: #EBB4A6
  - brand-100: #ECE2D0
- Variables CSS ya integradas en :root (styles.css): color-text, danger, info, shadow, radius, space.
- Tipografía: Inter (con Tailwind configurado en index.html).

## Flujo con MCP (buenas prácticas)
- Antes de interactuar, revisar la página cargada y su estructura; luego actuar.
- Usar esperas cortas y progresivas (2–3s) entre verificaciones; avanzar cuando el contenido esté listo.
- Validar en HTTPS local y revisar mensajes de consola y solicitudes de red cuando sea relevante.
- Evitar interactuar con contenido dentro de iframes (no accesible); verificar estados visuales fuera de ellos.

## Skills recomendadas (qué hace y cuándo invocar)
- Auditoría Visual UI
  - Qué: diagnóstico de tipografía, color, espaciado, jerarquía, responsive y contraste.
  - Cuándo: al inicio o cuando cambie la paleta/tipo.
  - Entradas: index.html, styles.css, assets/, objetivos de marca.
  - Salida: hallazgos y plan de mejora priorizado.
- Design Tokens
  - Qué: genera/aplica variables CSS y utilidades base coherentes con la marca.
  - Cuándo: al definir o ajustar la identidad visual.
  - Entradas: paleta, tipografías, escalas de espaciado y radio.
  - Salida: bloque :root y guía de uso.
- CSS Responsive Refactor
  - Qué: aplica tokens, organiza utilidades y establece grid responsive mobile-first.
  - Cuándo: al mejorar layout o limpiar estilos.
  - Entradas: styles.css y secciones objetivo (hero, cards, nav, footer).
  - Salida: diff sugerido y media queries claras.
- Accessibility Check
  - Qué: contraste, foco visible, roles/aria, tamaños táctiles y “reduce motion”.
  - Cuándo: antes de publicar o tras refactor visual.
  - Entradas: páginas y componentes interactivos.
  - Salida: reporte más parches CSS/HTML.
- Animaciones Sutiles
  - Qué: transiciones cortas y microinteracciones (> botones, tarjetas, links).
  - Cuándo: después de tener tokens y estructura responsive.
  - Entradas: componentes clave.
  - Salida: CSS listo y recomendaciones de timing/easing.
- Optimización de Assets
  - Qué: compresión/formatos modernos, carga diferida, preloads críticos.
  - Cuándo: tras estabilizar el layout.
  - Entradas: assets/img y assets/icons.
  - Salida: acciones y ejemplos de enlaces/preloads.

## Recetas rápidas (aplicación práctica)
- Aplicar tokens a controles interactivos
  - Reemplaza colores “hardcodeados” por variables: brand-700 para acentos, color-text para texto.
  - Usa outline de foco con brand-700 y box-shadow unificado.
- Responsive base
  - Contenedor y rejilla: max-width razonable, gap por escala, grid-2/3 con media queries.
  - Mobile-first: ajusta tipografías con clamp() en títulos y subtítulos.
- Accesibilidad esencial
  - Contraste AA mínimo en texto sobre fondos.
  - Foco visible consistente en enlaces/botones.
  - Respeto de “prefers-reduced-motion”.
- Microinteracciones
  - Transiciones de 160–200ms con easing suave.
  - Hover/focus con ligero movimiento y sombra (sin exagerar).

## Checklist de verificación visual
- Tipografía: jerarquía clara y legible en todas las pantallas.
- Color: uso consistente de brand-700 para acciones y estados; contraste AA.
- Espaciado: escala uniforme en secciones y componentes.
- Responsive: hero, menú móvil, sliders y tarjetas se ven bien en 360–1440px.
- Accesibilidad: foco visible, tamaños táctiles ≥44px, mensajes de estado legibles.
- Rendimiento: imágenes optimizadas, cargas diferidas donde corresponda.

## Archivos del proyecto
- HTML: index.html
- CSS: styles.css
- Recursos: assets/
- Servidor local: server.js (HTTP/HTTPS) y certs/

## Cómo ejecutar el flujo
- Arranca el servidor local (HTTPS recomendado).
- Abre la página principal y recorre las secciones clave.
- Aplica la Skill correspondiente según el objetivo (auditar, tokenizar, refactorizar, validar).
- Revisa visualmente y corrige iterativamente hasta cumplir el checklist.

## Nota final
- Si quieres formalizar estas Skills como ejecutables (SKILL.md) para invocarlas directamente desde el panel, puedo registrarlas con nombres y descripciones autoexplicativas y dejarlas listas para usar.
