# Raw Data y Fuentes de Informacion

Este documento define que archivos se deben usar como fuente de verdad al revisar, actualizar o reconstruir las demos.

## Fuente Principal

La fuente mas completa y actual del negocio es:

```txt
docs/menu-data-clean.json
```

Contiene:

- Restaurante, ubicacion, horario y WhatsApp oficial.
- Categorias.
- Productos, descripciones y precios.
- Opciones de personalizacion.
- Flags comerciales como `isNew` e `isRecommended`.

## Fuentes Secundarias

### Menu Economico Editable

```txt
RANGO_1_ECONOMICO/CATEGORIA_C_AUTOADMINISTRABLE_MANUAL/menu.json
```

Se mantiene para que la version economica C funcione de forma independiente. Si hay diferencias con `docs/menu-data-clean.json`, la fuente maestra es `docs/menu-data-clean.json`.

### README Principal

```txt
README.md
```

Resume la estructura comercial, los rangos y la forma de ejecutar cada demo.

### Apps React

```txt
RANGO_2_PROFESIONAL/CATEGORIA_A_ESTETICO/src/App.jsx
RANGO_2_PROFESIONAL/CATEGORIA_B_PRE_PEDIDO_WHATSAPP/src/App.jsx
RANGO_2_PROFESIONAL/CATEGORIA_C_COMBO_MARCA/src/App.jsx
RANGO_3_PREMIUM/CATEGORIA_A_AUTOR/src/App.jsx
RANGO_3_PREMIUM/CATEGORIA_B_ECOMMERCE_GOURMET/src/App.jsx
RANGO_3_PREMIUM/CATEGORIA_C_SAAS_CLOUD_KITCHEN/src/pages/Menu.jsx
RANGO_3_PREMIUM/CATEGORIA_C_SAAS_CLOUD_KITCHEN/src/pages/Admin.jsx
RANGO_3_PREMIUM/CATEGORIA_C_SAAS_CLOUD_KITCHEN/src/pages/POS.jsx
```

Sirven para validar retencion funcional, flujos de carrito, checkout, WhatsApp, administracion y POS.

## Datos Base Actuales

```txt
Nombre: Fusion Culinaria
Ubicacion: Sabanilla, Alajuela
Horario: Lunes a domingo de 11:00 a.m. a 8:00 p.m.
WhatsApp: 50687292124
```

## Orden Recomendado de Revision

1. `docs/menu-data-clean.json`
2. `README.md`
3. `RANGO_3_PREMIUM/CATEGORIA_C_SAAS_CLOUD_KITCHEN/src/localDemoData.js`
4. `RANGO_3_PREMIUM/*/src/App.jsx` y `src/pages/*.jsx`
5. `RANGO_2_PROFESIONAL/*/src/App.jsx`
6. `RANGO_1_ECONOMICO/*/index.html`

## Reglas de Actualizacion

- Si cambia un precio, producto u opcion, actualizar primero `docs/menu-data-clean.json`.
- Si cambia el WhatsApp, buscar el numero en todo el proyecto y actualizar todas las apariciones.
- Si cambia una demo premium, verificar que conserve ubicacion, WhatsApp, menu, carrito y checkout cuando aplique.
- Si cambia Cloud Kitchen/POS, validar `Menu`, `Admin`, `POS`, fallback local y `npm run seed`.
- Si se crea una nueva pagina HTML o React, agregar `title`, `meta description`, datos del negocio y enlaces externos seguros.

## Inconsistencias a Vigilar

El proyecto mantiene demos independientes por nivel comercial. Esa independencia es util para ventas, pero obliga a auditar que los datos y funciones no se queden atras cuando se mejora una categoria premium.
