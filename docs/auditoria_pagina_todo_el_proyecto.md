# Auditoria Pagina por Pagina

Auditoria ejecutada el 2026-06-11 sobre toda la carpeta `Fuxion`.

## Estado General

Se corrigieron los hallazgos criticos de retencion funcional entre niveles:

- Rango 1 mantiene enlaces externos seguros y la categoria autoadministrable recupera ubicacion y badges.
- Rango 2B y Rango 2C ahora tienen checkout real antes de enviar WhatsApp.
- Rango 3A recupera carrito, opciones, cantidades, notas, checkout y WhatsApp estructurado.
- Rango 3B conserva checkout premium y suma telefono, ubicacion, SEO y validacion de efectivo.
- Rango 3C Cloud Kitchen/POS ya no depende exclusivamente de Firebase: tiene fallback local, datos demo, seed y rutas SPA.

## Matriz de Retencion Actual

| Pagina | Menu | WhatsApp | Maps | Tabs | Carrito/opciones | Checkout datos/pago | Admin/POS | Estado |
|---|---:|---:|---:|---:|---:|---:|---:|---|
| Visor general | N/A | N/A | N/A | Selector | N/A | N/A | N/A | Pendiente health checks |
| R1A Basico | Si | Si | No | No | No | No | No | Aceptable |
| R1B QR Pro | Si | Si | Si | No | No | No | No | Corregido |
| R1C Autoadmin | Si | Si | Si | No | No | No | No | Corregido |
| R2A Estetico | Si | Si | Si | Si | No | No | No | Corregido |
| R2B Pre Pedido | Si | Si | Si | Si | Si | Si | No | Corregido |
| R2C Combo Marca | Si | Si | Si | Si | Si | Si | No | Corregido |
| R3A Autor | Si | Si | Si | Si | Si | Si | No | Corregido |
| R3B E-commerce | Si | Si | Si | Si | Si | Si | No | Corregido |
| R3C SaaS | Si | Si | No | Si | Si | Si | Si | Corregido con fallback |

## /docs/auditoria_pagina_visor_general.md

Pagina: `visor.html` + `iniciar_visor.js`.

Funciona:

- Selector con 9 modelos.
- Iframe de showroom.
- Boton para pantalla completa.

Pendiente:

- Puertos hardcodeados `8081` a `8089`.
- Loader fijo sin health check real.
- No muestra estado por app: listo, caido, puerto ocupado o error.

## /docs/auditoria_pagina_rango_1_categoria_a_basico.md

Ruta: `RANGO_1_ECONOMICO/CATEGORIA_A_BASICO`.

Estado: aceptable para nivel economico base. Mantiene menu, WhatsApp, horario, logo y ubicacion textual.

## /docs/auditoria_pagina_rango_1_categoria_b_qr_pro.md

Ruta: `RANGO_1_ECONOMICO/CATEGORIA_B_QR_PRO`.

Corregido:

- WhatsApp, Waze y Google Maps abren en nueva pestaña con `rel="noreferrer"`.

Pendiente menor:

- La seccion de especiales del dia no esta claramente diferenciada como bloque propio.

## /docs/auditoria_pagina_rango_1_categoria_c_autoadministrable.md

Ruta: `RANGO_1_ECONOMICO/CATEGORIA_C_AUTOADMINISTRABLE_MANUAL`.

Corregido:

- Recupera Waze y Google Maps del nivel QR Pro.
- Renderiza badges `RECOMENDADO` y `NUEVO` desde JSON.

Pendiente:

- No muestra opciones/extras del JSON; aceptable para el nivel economico si se documenta como menu editable simple.

## /docs/auditoria_pagina_rango_2_categoria_a_estetico.md

Ruta: `RANGO_2_PROFESIONAL/CATEGORIA_A_ESTETICO`.

Corregido:

- CTA WhatsApp ahora abre fuera del iframe con `target="_blank"` y `rel="noreferrer"`.

## /docs/auditoria_pagina_rango_2_categoria_b_pre_pedido_whatsapp.md

Ruta: `RANGO_2_PROFESIONAL/CATEGORIA_B_PRE_PEDIDO_WHATSAPP`.

Corregido:

- Importa el menu maestro `docs/menu-data-clean.json`.
- Mantiene tabs, opciones requeridas y carrito.
- Agrega Waze/Maps.
- Agrega checkout con nombre, telefono, tipo de servicio, direccion condicional, metodo de pago y monto de efectivo.
- Permite notas, cantidad y quitar items.
- Genera WhatsApp estructurado.

## /docs/auditoria_pagina_rango_2_categoria_c_combo_marca.md

Ruta: `RANGO_2_PROFESIONAL/CATEGORIA_C_COMBO_MARCA`.

Corregido:

- Conserva todo R2B.
- Mantiene posicionamiento de marca, SEO y despliegue.
- Agrega el mismo checkout completo para no perder funciones.

## /docs/auditoria_pagina_rango_3_categoria_a_autor.md

Ruta: `RANGO_3_PREMIUM/CATEGORIA_A_AUTOR`.

Corregido:

- Mantiene experiencia editorial.
- Recupera menu completo, tabs, opciones, cantidad, notas, carrito, checkout, Waze/Maps y WhatsApp estructurado.

Pendiente:

- No guarda pedidos en backend; eso queda reservado para la version SaaS.

## /docs/auditoria_pagina_rango_3_categoria_b_ecommerce_gourmet.md

Ruta: `RANGO_3_PREMIUM/CATEGORIA_B_ECOMMERCE_GOURMET`.

Corregido:

- Titulo, meta description y Open Graph propios.
- Waze y Google Maps visibles.
- Checkout pide telefono.
- Nombre obligatorio.
- Validacion de efectivo menor al total.

## /docs/auditoria_pagina_rango_3_categoria_c_saas_cloud_kitchen.md

Ruta: `RANGO_3_PREMIUM/CATEGORIA_C_SAAS_CLOUD_KITCHEN`.

Corregido:

- Menu, Admin y POS usan timeout de Firebase.
- Fallback local con `localStorage` y datos demo.
- Seed local y seed Firestore con menu completo y ordenes demo.
- POS muestra ordenes demo, permite completar e imprimir.
- Admin permite activar/desactivar productos y cambiar precios en modo local si Firebase falla.
- Rutas SPA preparadas con `vercel.json` y `public/_redirects`.

Riesgo remanente:

- Admin y POS siguen sin autenticacion ni reglas Firestore versionadas.

## Backlog Recomendado

1. Agregar health checks al visor y deteccion de puerto ocupado.
2. Agregar autenticacion, roles y reglas Firestore para Admin/POS.
3. Evaluar code splitting en Cloud Kitchen/POS.
4. Eliminar o regenerar `menuData.js` no usados desde `docs/menu-data-clean.json`.
5. Crear pruebas automaticas de retencion por nivel.
