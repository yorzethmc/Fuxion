# Fusión Culinaria - Documentación del Proyecto

## Descripción General

Este repositorio contiene **7 versiones diferentes** de la página web/menú digital para el restaurante **Fusión Culinaria**, ubicado en Sabanilla, Alajuela, Costa Rica.

Cada versión representa un nivel de complejidad y funcionalidad diferente, organizado en **3 rangos de precio** con sus respectivas **categorías**. Esto permite al cliente elegir la opción que mejor se adapte a su presupuesto y necesidades.

**Contacto WhatsApp:** +506 8729-2124

---

## Estructura de Carpetas

```
Fuxion/
├── docs/                          # Documentación y recursos compartidos
│   ├── FusionLogo.png             # Logo oficial (fuente maestra)
│   └── menu-data-clean.json       # Datos del menú en formato JSON
├── RANGO_1_ECONOMICO/             # Soluciones simples y económicas (HTML estático)
│   ├── CATEGORIA_A_BASICO/        # Menú de solo lectura
│   ├── CATEGORIA_B_QR_PRO/        # Menú QR con ubicación
│   └── CATEGORIA_C_AUTOADMINISTRABLE_MANUAL/  # Menú editable vía JSON
├── RANGO_2_PROFESIONAL/           # Aplicaciones React + Vite
│   ├── CATEGORIA_A_ESTETICO/      # Sitio profesional con diseño premium
│   ├── CATEGORIA_B_PRE_PEDIDO_WHATSAPP/  # Carrito + pedido por WhatsApp
│   └── CATEGORIA_C_COMBO_MARCA/   # Paquete comercial completo con SEO
├── RANGO_3_PREMIUM/               # Experiencia de alta gama
│   └── CATEGORIA_A_AUTOR/         # Sitio editorial con imágenes premium
├── Visor_General.bat              # ⭐ Abre TODAS las versiones en un solo panel
├── iniciar_visor.js               # Script que orquesta los 7 servidores
└── visor.html                     # Interfaz del visor "Todo en Uno"
```

---

## ⭐ Visor Todo en Uno

Para ver todas las versiones simultáneamente sin abrir 7 ventanas:

1. Haz doble clic en `Visor_General.bat` (en la carpeta raíz).
2. Espera ~10 segundos a que arranquen todos los servidores.
3. Se abrirá un panel en el navegador con botones para saltar entre cada categoría.
4. **Mantén la ventana negra abierta** mientras uses el visor.
5. Para cerrar todo, presiona `Ctrl+C` en la ventana negra.

---

## Rangos y Categorías - Detalle

### 🟢 RANGO 1 - ECONÓMICO (HTML Estático)

Soluciones rápidas, livianas y de bajo costo. No requieren Node.js para funcionar (solo un servidor HTTP simple).

---

#### Categoría A - Básico
**Ubicación:** `RANGO_1_ECONOMICO/CATEGORIA_A_BASICO/`

**¿Qué es?** Un menú digital de **solo lectura**. El cliente ve los platillos, los precios y puede contactar por WhatsApp, pero NO puede hacer un pedido estructurado.

**Características:**
- Página única (`index.html`) autocontenida.
- Logo del restaurante en el encabezado.
- Listado completo del menú dividido por categorías (Entradas, Hamburguesas, Platos Fuertes, Combos).
- Precios en colones costarricenses (₡).
- Etiquetas "Recomendado" y "Nuevo" en ciertos platillos.
- Horario de atención visible.
- Botón fijo inferior para consultar por WhatsApp.
- Fondo rústico de madera con tarjetas oscuras translúcidas.

**Ideal para:** Primera presencia digital. Compartir un link por redes sociales. Menú QR básico.

**Limitaciones:** El menú está escrito directo en el HTML. Para cambiar platillos o precios hay que editar el código.

---

#### Categoría B - QR Pro
**Ubicación:** `RANGO_1_ECONOMICO/CATEGORIA_B_QR_PRO/`

**¿Qué es?** Una evolución del Básico con **especiales destacados, navegación sticky y botones de ubicación** (Waze y Google Maps).

**Características:**
- Header fijo (sticky) con logo y marca.
- Sección de "Especiales del Día" visualmente destacada con gradientes.
- Menú completo por categorías.
- Botones de Waze y Google Maps para llegar al restaurante.
- Botón fijo inferior para WhatsApp.
- Mismo fondo rústico de madera.

**Ideal para:** Restaurante que quiere un menú QR más completo, con ubicación y promociones destacadas.

**Limitaciones:** Productos y promociones escritos directamente en el HTML. Los enlaces de Waze/Maps usan placeholders (#), necesitan coordenadas reales.

---

#### Categoría C - Autoadministrable Manual
**Ubicación:** `RANGO_1_ECONOMICO/CATEGORIA_C_AUTOADMINISTRABLE_MANUAL/`

**¿Qué es?** Un menú que se carga desde un archivo `menu.json`. El dueño del restaurante puede **editar platillos y precios sin tocar el HTML**, solo editando un archivo de texto.

**Características:**
- Los datos del menú se cargan dinámicamente desde `menu.json`.
- JavaScript (`app.js`) renderiza las categorías y los items automáticamente.
- Precios formateados en colones.
- Botón por producto para pedir por WhatsApp.
- Estado de carga y mensaje de error si no se puede leer el JSON.

**Ideal para:** Cliente que quiere actualizar su menú él mismo sin saber programar. Solo edita `menu.json`.

**Limitaciones:** No tiene panel visual de administración. Requiere un servidor local o hosting para que `fetch()` funcione (no se puede abrir directamente como archivo).

---

### 🔵 RANGO 2 - PROFESIONAL (React + Vite)

Aplicaciones modernas construidas con React y empaquetadas con Vite. Ofrecen experiencias interactivas más completas.

**Tecnologías:** React 19, Vite 7, TailwindCSS (CDN).

---

#### Categoría A - Estético
**Ubicación:** `RANGO_2_PROFESIONAL/CATEGORIA_A_ESTETICO/`

**¿Qué es?** Un sitio profesional con **diseño premium oscuro**, glassmorphism (efecto cristal), tipografía Outfit y micro-animaciones.

**Características:**
- Header con navegación interna (menú, nosotros, contacto).
- Sección Hero con gradientes y card de especialidad destacada.
- Menú interactivo con **tabs por categoría** (clic para filtrar).
- Tarjetas de productos con animaciones de entrada y hover.
- Sección "Nosotros" y "Contacto" con horarios y ubicación.
- Botón fijo inferior de WhatsApp.
- Fondo rústico de madera con tarjetas oscuras translúcidas y backdrop-blur.
- Fuente tipográfica premium: Outfit de Google Fonts.

**Ideal para:** Marca que quiere un sitio elegante y moderno sin funcionalidad de carrito.

**Limitaciones:** No tiene carrito de compras. Los datos del menú están en `menuData.js`.

---

#### Categoría B - Pre Pedido WhatsApp
**Ubicación:** `RANGO_2_PROFESIONAL/CATEGORIA_B_PRE_PEDIDO_WHATSAPP/`

**¿Qué es?** El primer nivel con **carrito de compras funcional**. El cliente selecciona productos, elige cantidades, personaliza opciones y al final se genera automáticamente un mensaje de WhatsApp con todo el pedido.

**Características:**
- Lista de productos con opciones configurables (tamaño, salsa, acompañamiento, extras).
- Carrito con cantidades editables (+/-).
- Cálculo automático del total.
- Formulario de finalización: nombre, dirección, tipo de pedido (recoger/domicilio), método de pago y notas.
- Generación automática de mensaje de WhatsApp con el resumen completo del pedido.
- Barra inferior fija con total y botón de envío.

**Ideal para:** Restaurante que quiere recibir pedidos organizados por WhatsApp, sin backend ni pasarela de pago.

**Limitaciones:** No guarda historial de pedidos. No valida disponibilidad, horarios ni stock. No calcula costo de envío. No integra SINPE, tarjeta ni comprobantes.

---

#### Categoría C - Combo Marca
**Ubicación:** `RANGO_2_PROFESIONAL/CATEGORIA_C_COMBO_MARCA/`

**¿Qué es?** El **paquete comercial más completo** del Rango 2. Incluye todo lo del Pre Pedido, más presentación de marca, etiquetas comerciales y configuración lista para despliegue en Vercel y Netlify.

**Características:**
- Todo lo de la Categoría B (carrito, formulario, WhatsApp).
- Presentación de marca más cuidada.
- Productos con etiquetas comerciales.
- SEO optimizado en `index.html` (Open Graph tags, meta descriptions).
- Archivos de configuración para despliegue: `vercel.json` y `_redirects` (Netlify).

**Ideal para:** Paquete listo para campañas de marketing, SEO local y despliegue en hosting gratuito.

**Limitaciones:** Datos de productos duplicados en código fuente. Solo esta categoría tiene configuración de despliegue.

---

### 🟣 RANGO 3 - PREMIUM

La experiencia más visual y editorial.

---

#### Categoría A - Autor
**Ubicación:** `RANGO_3_PREMIUM/CATEGORIA_A_AUTOR/`

**¿Qué es?** Un sitio tipo **editorial/revista gastronómica**. Diseño de alta gama con imágenes grandes, secciones de experiencia y un tono más sofisticado.

**Características:**
- Hero visual de pantalla completa con imágenes de Unsplash.
- Promos destacadas con imágenes y precios.
- Sección de "experiencia": horario, servicio a domicilio, ubicación.
- Footer con contacto directo.
- Estilo editorial premium (tipografía grande, espaciado generoso, tonos cálidos).
- Botón de WhatsApp para pedidos premium.

**Ideal para:** Demo visual de alto impacto. Presentación de marca para cliente que busca la imagen más cuidada y profesional.

**Limitaciones:** Usa imágenes externas genéricas de Unsplash, no fotos reales del negocio. No tiene carrito ni pedido detallado. No tiene SEO tan completo como el Combo Marca.

---

## Cómo Iniciar Cada Proyecto Individualmente

Cada carpeta tiene un archivo `iniciar.bat`. Haz doble clic para abrir esa versión específica.

| Proyecto | Tipo | Comando Interno |
|----------|------|-----------------|
| CATEGORIA_A_BASICO | HTML estático | `npx http-server` |
| CATEGORIA_B_QR_PRO | HTML estático | `npx http-server` |
| CATEGORIA_C_AUTOADMINISTRABLE_MANUAL | HTML + JSON | `npx http-server` |
| CATEGORIA_A_ESTETICO | React + Vite | `npm run dev` |
| CATEGORIA_B_PRE_PEDIDO_WHATSAPP | React + Vite | `npm run dev` |
| CATEGORIA_C_COMBO_MARCA | React + Vite | `npm run dev` |
| CATEGORIA_A_AUTOR | React + Vite | `npm run dev` |

**Nota:** Los proyectos de React requieren Node.js instalado. Las dependencias se instalan automáticamente la primera vez.

---

## Datos de Contacto del Restaurante

| Campo | Valor |
|-------|-------|
| Nombre | Fusión Culinaria |
| WhatsApp | +506 8729-2124 |
| Ubicación | Sabanilla, Alajuela, Costa Rica |
| Horario | Lunes a Domingo, 11:00 a.m. a 8:00 p.m. |
