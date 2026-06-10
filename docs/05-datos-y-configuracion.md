# Datos y configuracion

## Datos del negocio

Datos usados en las demos:

```txt
Nombre: Fusion Culinaria
Ubicacion: Sabanilla, Alajuela
Horario: Lunes a domingo de 11:00 a.m. a 8:00 p.m.
WhatsApp: 50660224371
```

## Numero de WhatsApp

El numero `50660224371` esta repetido en varias categorias.

Lugares importantes:

```txt
RANGO_1_ECONOMICO/CATEGORIA_A_BASICO/index.html
RANGO_1_ECONOMICO/CATEGORIA_B_QR_PRO/index.html
RANGO_1_ECONOMICO/CATEGORIA_C_AUTOADMINISTRABLE_MANUAL/menu.json
RANGO_2_PROFESIONAL/CATEGORIA_A_ESTETICO/src/App.jsx
RANGO_2_PROFESIONAL/CATEGORIA_B_PRE_PEDIDO_WHATSAPP/src/App.jsx
RANGO_2_PROFESIONAL/CATEGORIA_C_COMBO_MARCA/src/App.jsx
RANGO_3_PREMIUM/CATEGORIA_A_AUTOR/src/App.jsx
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
    "whatsapp": "50660224371"
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

La categoria QR Pro incluye enlaces a:

- Waze.
- Google Maps.

Actualmente los enlaces buscan por texto:

```txt
Fusion Culinaria Sabanilla Alajuela
```

Para mayor precision conviene usar coordenadas exactas o una ficha verificada de Google Business Profile.

## SEO

La categoria con SEO mas completo es:

```txt
RANGO_2_PROFESIONAL/CATEGORIA_C_COMBO_MARCA/index.html
```

Incluye:

- `lang="es-CR"`
- `meta description`
- `meta keywords`
- `robots`
- Open Graph basico
- `theme-color`

Otras categorias tienen SEO mas simple.
