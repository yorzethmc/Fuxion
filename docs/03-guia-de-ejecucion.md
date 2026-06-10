# Guia de ejecucion

## Requisitos

Para las demos HTML estaticas no se requiere instalar nada.

Para las demos React se necesita:

- Node.js
- npm

## Abrir demos HTML

Estas categorias pueden abrirse directamente desde su `index.html`:

- `RANGO_1_ECONOMICO/CATEGORIA_A_BASICO/index.html`
- `RANGO_1_ECONOMICO/CATEGORIA_B_QR_PRO/index.html`

La categoria autoadministrable usa `fetch("./menu.json")`, por lo que puede requerir un servidor local para funcionar correctamente en algunos navegadores:

- `RANGO_1_ECONOMICO/CATEGORIA_C_AUTOADMINISTRABLE_MANUAL/index.html`

Ejemplo con un servidor simple, ejecutado dentro de esa carpeta:

```bash
python -m http.server 8000
```

Luego abrir:

```txt
http://localhost:8000
```

## Correr demos React

Entrar a la carpeta de la demo deseada:

```bash
cd RANGO_2_PROFESIONAL/CATEGORIA_A_ESTETICO
npm install
npm run dev
```

El mismo flujo aplica para:

```txt
RANGO_2_PROFESIONAL/CATEGORIA_A_ESTETICO
RANGO_2_PROFESIONAL/CATEGORIA_B_PRE_PEDIDO_WHATSAPP
RANGO_2_PROFESIONAL/CATEGORIA_C_COMBO_MARCA
RANGO_3_PREMIUM/CATEGORIA_A_AUTOR
```

## Comandos disponibles en React

Cada proyecto React tiene estos scripts:

```bash
npm run dev
npm run build
npm run preview
```

Uso:

- `npm run dev`: levanta servidor local de desarrollo.
- `npm run build`: genera version lista para produccion en `dist`.
- `npm run preview`: previsualiza la version construida.

## Build de produccion

Para validar que una demo React compila:

```bash
npm install
npm run build
```

El resultado queda en:

```txt
dist/
```

Esa carpeta esta ignorada por Git mediante `.gitignore`.

## Despliegue

La categoria `RANGO_2_PROFESIONAL/CATEGORIA_C_COMBO_MARCA` ya incluye archivos pensados para despliegue:

- `_redirects`: fallback para Netlify.
- `vercel.json`: configuracion basica para Vercel.

Las demas categorias React tambien se pueden desplegar como sitios estaticos despues de ejecutar `npm run build`.
