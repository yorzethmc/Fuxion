# Arquitectura y tecnologias

## Estructura general

El repositorio esta organizado por rangos comerciales:

```txt
RANGO_1_ECONOMICO/
RANGO_2_PROFESIONAL/
RANGO_3_PREMIUM/
```

Cada rango contiene categorias que representan demos o paquetes distintos.

## Tecnologias usadas

### HTML estatico

Usado en:

- `RANGO_1_ECONOMICO/CATEGORIA_A_BASICO`
- `RANGO_1_ECONOMICO/CATEGORIA_B_QR_PRO`
- `RANGO_1_ECONOMICO/CATEGORIA_C_AUTOADMINISTRABLE_MANUAL`

Estas demos usan archivos `index.html` directamente y Tailwind por CDN.

### JavaScript navegador

Usado en:

- `RANGO_1_ECONOMICO/CATEGORIA_B_QR_PRO/index.html`
- `RANGO_1_ECONOMICO/CATEGORIA_C_AUTOADMINISTRABLE_MANUAL/app.js`

Sirve para generar enlaces de WhatsApp y, en la categoria autoadministrable, cargar el menu desde `menu.json`.

### Vite + React

Usado en:

- `RANGO_2_PROFESIONAL/CATEGORIA_A_ESTETICO`
- `RANGO_2_PROFESIONAL/CATEGORIA_B_PRE_PEDIDO_WHATSAPP`
- `RANGO_2_PROFESIONAL/CATEGORIA_C_COMBO_MARCA`
- `RANGO_3_PREMIUM/CATEGORIA_A_AUTOR`
- `RANGO_3_PREMIUM/CATEGORIA_B_ECOMMERCE_GOURMET`
- `RANGO_3_PREMIUM/CATEGORIA_C_SAAS_CLOUD_KITCHEN`

Todos estos proyectos tienen:

- `package.json`
- `index.html`
- `src/main.jsx`
- `src/App.jsx`
- `src/index.css`

### Firebase / Firestore

Usado en:

- `RANGO_3_PREMIUM/CATEGORIA_C_SAAS_CLOUD_KITCHEN`

La demo SaaS usa Firestore para cargar menu, crear ordenes, mostrar POS/KDS y administrar disponibilidad/precios. Tambien incluye fallback local en `localStorage` para que la demo siga usable si Firebase tarda, falla o no tiene datos.

### Tailwind CSS por CDN

Las demos usan Tailwind mediante:

```html
<script src="https://cdn.tailwindcss.com"></script>
```

Esto facilita demos rapidas, pero no es lo ideal para produccion si se busca optimizacion fina.

## Dependencias principales

Los proyectos React declaran:

- `react`
- `react-dom`
- `vite`
- `@vitejs/plugin-react`
- `firebase` en la demo Cloud Kitchen/POS.
- `react-router-dom` en la demo Cloud Kitchen/POS.

Versiones declaradas en los `package.json`:

- React `^19.0.0`
- Vite `^7.0.0`
- Plugin React para Vite `^5.0.0`

## Patron de construccion

El proyecto no usa una aplicacion unica. En vez de eso, cada categoria es una mini aplicacion independiente.

Ventajas:

- Facil de vender como paquetes separados.
- Facil de desplegar demos individuales.
- Menor riesgo de que un cambio en una categoria rompa otra.

Desventajas:

- Hay datos repetidos en varios archivos.
- El numero de WhatsApp se repite.
- Los productos y precios se duplican entre categorias.
- La fuente mas completa del menu ya esta centralizada en `docs/menu-data-clean.json`, aunque algunas demos economicas mantienen datos propios por independencia comercial.

## Flujo principal de usuario

El flujo comun de las demos es:

1. El usuario entra desde celular o QR.
2. Ve menu, promociones o presentacion del restaurante.
3. Toca un boton de WhatsApp.
4. Se abre un mensaje prellenado para hacer el pedido.

En las categorias con carrito, el usuario primero arma un pedido y luego se genera un mensaje mas completo para WhatsApp.
