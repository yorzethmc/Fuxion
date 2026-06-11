# Auditoría QA y Mejoras

## 1. Discrepancias de Datos Resueltas
- **Número de WhatsApp**: La documentación principal queda alineada con el número oficial `50687292124`. Se define `docs/menu-data-clean.json` como la Única Fuente de Verdad (SSOT) y en todas las refactorizaciones se utilizará de manera estricta ese valor.

## 2. Reporte de Enlaces Rotos y Soluciones
- **Enlaces de Waze y Google Maps**: Se identificó en la documentación y demos anteriores la presencia de enlaces vacíos (`href="#"`) o búsquedas ambiguas.
  - *Solución*: Los enlaces de ubicación deben usar esquemas funcionales:
    - **Waze**: `https://waze.com/ul?q=Fusion+Culinaria+Sabanilla`
    - **Google Maps**: `https://www.google.com/maps/search/?api=1&query=Fusion+Culinaria+Sabanilla`
- **Enlaces de WhatsApp**:
  - *Solución*: Todos los links de pedidos se generarán utilizando la API de WhatsApp (`https://wa.me/50687292124?text=...`). Los textos y pedidos serán siempre parseados con `encodeURIComponent()` para prevenir enlaces rotos por caracteres especiales o espacios.

## 3. Áreas de Mejora UI/UX y Performance
- **Performance (Optimización de Recursos)**:
  - Utilizar el atributo `loading="lazy"` para imágenes de productos que están fuera de pantalla (below the fold) con el objetivo de acelerar el LCP (Largest Contentful Paint).
- **Accesibilidad (A11y)**:
  - Garantizar áreas de toque de al menos 44x44px en móviles para todos los botones.
  - Agregar etiquetas `aria-label` a botones icónicos (ej. el botón flotante global de WhatsApp).
  - Revisar los contrastes de colores de Tailwind CSS en textos y botones para cumplir con el estándar WCAG AA.
- **UX y UI Estricta (Feature Escalation)**:
  - Para el **Rango 1**, se mantendrá un diseño estricto de solo lectura ("Pizarra Estática") con un único CTA global, eliminando botones de pedido individuales o lógica de carrito, para no distorsionar la propuesta de valor del Rango 2.
- **SEO Técnico**:
  - Emplear semántica HTML5 adecuada (`<header>`, `<main>`, `<article>`) y preparar metadatos base para asegurar que la presentación de la página en motores de búsqueda y redes sociales sea profesional.
