# Arquitectura auditada

Auditoria ejecutada el 2026-06-11 sobre la carpeta completa del proyecto.

## Componentes del sistema

El repositorio contiene un showroom de demos independientes para Fusión Culinaria. La arquitectura real en disco esta compuesta por 9 experiencias:

- `visor.html` + `iniciar_visor.js`: showroom central con iframes y puertos fijos.
- `RANGO_1_ECONOMICO/CATEGORIA_A_BASICO`: HTML estatico de solo lectura.
- `RANGO_1_ECONOMICO/CATEGORIA_B_QR_PRO`: HTML estatico con enlaces Waze/Google Maps.
- `RANGO_1_ECONOMICO/CATEGORIA_C_AUTOADMINISTRABLE_MANUAL`: HTML + `app.js` + `menu.json`.
- `RANGO_2_PROFESIONAL/CATEGORIA_A_ESTETICO`: React/Vite con tabs y CTA.
- `RANGO_2_PROFESIONAL/CATEGORIA_B_PRE_PEDIDO_WHATSAPP`: React/Vite con carrito basico y WhatsApp.
- `RANGO_2_PROFESIONAL/CATEGORIA_C_COMBO_MARCA`: React/Vite, funcionalmente igual a R2B, con metadatos SEO.
- `RANGO_3_PREMIUM/CATEGORIA_A_AUTOR`: React/Vite editorial premium.
- `RANGO_3_PREMIUM/CATEGORIA_B_ECOMMERCE_GOURMET`: React/Vite con carrito avanzado y checkout.
- `RANGO_3_PREMIUM/CATEGORIA_C_SAAS_CLOUD_KITCHEN`: React/Vite + Firebase + rutas `Menu`, `Admin` y `POS`.

## Fuente de datos

La fuente maestra debe ser `docs/menu-data-clean.json`. Contiene:

- 5 categorias.
- 20 productos.
- WhatsApp oficial `50687292124`.

`RANGO_1_ECONOMICO/CATEGORIA_C_AUTOADMINISTRABLE_MANUAL/menu.json` coincide exactamente con el JSON maestro. Las apps React importan directamente `docs/menu-data-clean.json`, por lo que los archivos `src/menuData.js` que aun existen en varias carpetas son deuda muerta y pueden confundir mantenimiento.

## Logica esperada por niveles

La jerarquia comercial esperada es acumulativa:

- Economico: menu legible, contacto y datos basicos.
- Intermedio/Profesional: conserva lo economico, agrega tabs, experiencia visual y luego carrito/prepedido.
- Premium/Lujo: conserva lo profesional y agrega estetica de lujo, checkout avanzado, administracion o POS.

La regla critica es que un nivel superior no debe perder funciones vendidas en niveles inferiores. La arquitectura actual incumple esto en varias transiciones, especialmente en Rango 3.

## Resultado tecnico de build

Se ejecuto `npm run build` en las 6 apps React despues de las correcciones. Todas compilaron.

Hallazgo tecnico:

- `RANGO_3_PREMIUM/CATEGORIA_C_SAAS_CLOUD_KITCHEN` genera un bundle de `531.00 kB` minificado y Vite recomienda code splitting.
- `npm run seed` esta implementado, pero Firebase respondio que Cloud Firestore API no esta habilitada para el proyecto `fusion-culinaria`; la app queda protegida por fallback local hasta que se active esa API.

## Estado tras correcciones

1. **SaaS premium desbloqueado**  
   `CATEGORIA_C_SAAS_CLOUD_KITCHEN` ahora tiene timeout, fallback local con `localStorage`, datos demo y rutas de despliegue SPA. Menu, Admin y POS pueden operar aun si Firestore no responde.

2. **Retencion premium restaurada**  
   `CATEGORIA_A_AUTOR` conserva estetica editorial y recupera menu completo, opciones, cantidad, notas, carrito, checkout y WhatsApp estructurado.

3. **Checkout profesional implementado**  
   R2B y R2C ahora incluyen modal de cierre con nombre, telefono, tipo de servicio, direccion condicional, pago, notas y envio ordenado a WhatsApp.

4. **Documentacion alineada**  
   README y docs principales ya documentan 9 versiones, WhatsApp oficial `50687292124`, e-commerce gourmet y Cloud Kitchen/POS.

## Riesgos remanentes

1. **Showroom fragil por puertos fijos**  
   `visor.html` e `iniciar_visor.js` dependen de puertos hardcodeados. En auditoria, puertos estandar ocupados sirvieron contenido equivocado; esto puede mostrar al cliente una demo incorrecta.

2. **Admin Firebase sin capa de seguridad visible**  
   El panel Admin escribe precios, stock y seed desde el cliente. No hay autenticacion, proteccion de rutas, App Check ni reglas Firestore versionadas en el repo.

3. **Bundle SaaS grande**  
   `RANGO_3_PREMIUM/CATEGORIA_C_SAAS_CLOUD_KITCHEN` debe evaluarse con code splitting si se convierte en producto real.

## Recomendacion de arquitectura

Centralizar el producto como una sola fuente de datos y una sola matriz de features:

- Mantener `docs/menu-data-clean.json` como SSOT.
- Eliminar o generar automaticamente los `menuData.js` no usados.
- Crear `features.json` o una tabla de capacidades por rango/categoria.
- Agregar tests de retencion que fallen si una categoria premium pierde funciones requeridas.
- Para SaaS, separar rutas con `React.lazy`, agregar autenticacion real, reglas Firestore versionadas y proteccion de Admin/POS.
