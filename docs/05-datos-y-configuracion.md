# Datos y configuracion

## Datos del negocio

Datos usados en las demos:

```txt
Nombre: Fusion Culinaria
Ubicacion: Sabanilla, Alajuela
Horario: Lunes a domingo de 11:00 a.m. a 8:00 p.m.
WhatsApp: 50687292124
```

## Numero de WhatsApp

El numero oficial es `50687292124`. La fuente recomendada para nuevas integraciones es `docs/menu-data-clean.json`.

Lugares importantes:

```txt
RANGO_1_ECONOMICO/CATEGORIA_A_BASICO/index.html
RANGO_1_ECONOMICO/CATEGORIA_B_QR_PRO/index.html
RANGO_1_ECONOMICO/CATEGORIA_C_AUTOADMINISTRABLE_MANUAL/menu.json
RANGO_2_PROFESIONAL/CATEGORIA_A_ESTETICO/src/App.jsx
RANGO_2_PROFESIONAL/CATEGORIA_B_PRE_PEDIDO_WHATSAPP/src/App.jsx
RANGO_2_PROFESIONAL/CATEGORIA_C_COMBO_MARCA/src/App.jsx
RANGO_3_PREMIUM/CATEGORIA_A_AUTOR/src/App.jsx
RANGO_3_PREMIUM/CATEGORIA_B_ECOMMERCE_GOURMET/src/App.jsx
RANGO_3_PREMIUM/CATEGORIA_C_SAAS_CLOUD_KITCHEN/src/pages/Menu.jsx
```

Si cambia el numero, hay que actualizarlo en todos esos lugares.

## Menu editable

La categoria mas facil de editar manualmente es:

```txt
RANGO_1_ECONOMICO/CATEGORIA_C_AUTOADMINISTRABLE_MANUAL/menu.json
```

Estructura:

```json
{
  "restaurant": {
    "name": "Fusion Culinaria",
    "location": "Sabanilla, Alajuela",
    "hours": "Lunes a domingo de 11:00 a.m. a 8:00 p.m.",
    "whatsapp": "50687292124"
  },
  "categories": []
}
```

Cada categoria tiene:

- `name`
- `items`

Cada item tiene:

- `name`
- `description`
- `price`
- `featured`

## Formato de precios

Las demos JavaScript y React usan `Intl.NumberFormat` con configuracion de Costa Rica:

```js
new Intl.NumberFormat("es-CR", {
  style: "currency",
  currency: "CRC",
  maximumFractionDigits: 0
})
```

Luego reemplazan `CRC` por `₡` para mostrar precios como:

```txt
₡1,000
```

## Mensajes de WhatsApp

Los enlaces usan el formato:

```txt
https://wa.me/NUMERO?text=MENSAJE
```

Las demos con carrito construyen mensajes con:

- Productos.
- Cantidad.
- Subtotal por item.
- Total.
- Nombre.
- Tipo de pedido.
- Direccion.
- Metodo de pago.
- Notas, cuando aplica.

## Ubicacion

Las categorias QR Pro, Autoadministrable Manual y las versiones con checkout incluyen enlaces a:

- Waze.
- Google Maps.

Actualmente los enlaces buscan por texto:

```txt
Fusion Culinaria Sabanilla Alajuela
```

Para mayor precision conviene usar coordenadas exactas o una ficha verificada de Google Business Profile.

## SEO

Las categorias con SEO mas completo son:

```txt
RANGO_2_PROFESIONAL/CATEGORIA_C_COMBO_MARCA/index.html
RANGO_3_PREMIUM/CATEGORIA_B_ECOMMERCE_GOURMET/index.html
RANGO_3_PREMIUM/CATEGORIA_C_SAAS_CLOUD_KITCHEN/index.html
```

Incluye:

- `lang="es-CR"`
- `meta description`
- `meta keywords`
- `robots`
- Open Graph basico
- `theme-color`

Otras categorias tienen SEO mas simple.
