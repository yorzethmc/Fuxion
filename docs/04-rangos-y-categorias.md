# Rangos y categorias

## RANGO_1_ECONOMICO

Este rango contiene soluciones simples, rapidas y de bajo costo. Estan hechas principalmente con HTML estatico y Tailwind por CDN.

### CATEGORIA_A_BASICO

Archivo principal:

```txt
RANGO_1_ECONOMICO/CATEGORIA_A_BASICO/index.html
```

Incluye:

- Encabezado con marca `FC`.
- Ubicacion: Sabanilla, Alajuela.
- Lista de productos y precios.
- Horario.
- Informacion de pagos.
- Boton fijo para ordenar por WhatsApp.

Uso ideal:

- Menu simple para compartir por link.
- Primera presencia digital para un restaurante.

Limitaciones:

- El menu esta escrito directo en el HTML.
- Para cambiar productos hay que editar codigo.

### CATEGORIA_B_QR_PRO

Archivo principal:

```txt
RANGO_1_ECONOMICO/CATEGORIA_B_QR_PRO/index.html
```

Incluye:

- Cabecera sticky.
- Bloque de promocion principal.
- Combos destacados.
- Botones para Waze y Google Maps.
- Botones que generan mensajes de pedido por WhatsApp.

Uso ideal:

- Menu QR para mesas, mostrador o redes sociales.
- Restaurante que necesita ubicacion y pedidos rapidos.

Limitaciones:

- Productos y promociones estan escritos en el HTML.
- La ubicacion usa busqueda por texto, no coordenadas exactas.

### CATEGORIA_C_AUTOADMINISTRABLE_MANUAL

Archivos principales:

```txt
RANGO_1_ECONOMICO/CATEGORIA_C_AUTOADMINISTRABLE_MANUAL/index.html
RANGO_1_ECONOMICO/CATEGORIA_C_AUTOADMINISTRABLE_MANUAL/app.js
RANGO_1_ECONOMICO/CATEGORIA_C_AUTOADMINISTRABLE_MANUAL/menu.json
```

Incluye:

- Menu cargado desde `menu.json`.
- Categorias e items renderizados con JavaScript.
- Precios formateados en colones.
- Botones por producto para pedir por WhatsApp.
- Estado de carga y mensaje de error si no se puede leer el JSON.

Uso ideal:

- Menu editable manualmente sin tocar el HTML.
- Cliente que puede actualizar productos en un archivo JSON.

Limitaciones:

- No tiene panel visual de administracion.
- Puede requerir servidor local o hosting para que `fetch` funcione.

## RANGO_2_PROFESIONAL

Este rango usa React + Vite y ofrece experiencias mas completas.

### CATEGORIA_A_ESTETICO

Archivos principales:

```txt
RANGO_2_PROFESIONAL/CATEGORIA_A_ESTETICO/src/App.jsx
RANGO_2_PROFESIONAL/CATEGORIA_A_ESTETICO/src/index.css
```

Incluye:

- Header con navegacion interna.
- Seccion de inicio.
- Menu con tabs: promos, favoritos y combos.
- Seccion nosotros.
- Seccion contacto.
- Enlaces a WhatsApp.

Uso ideal:

- Sitio profesional basico para marca local.
- Presencia web con secciones completas.

Limitaciones:

- No tiene carrito.
- Los productos estan en constantes dentro de `App.jsx`.

### CATEGORIA_B_PRE_PEDIDO_WHATSAPP

Archivo principal:

```txt
RANGO_2_PROFESIONAL/CATEGORIA_B_PRE_PEDIDO_WHATSAPP/src/App.jsx
```

Incluye:

- Lista de productos.
- Carrito con cantidades.
- Total automatico.
- Formulario con nombre, direccion, tipo de pedido, metodo de pago y notas.
- Generacion de mensaje completo para WhatsApp.
- Barra inferior fija con total y boton de envio.

Uso ideal:

- Restaurante que quiere recibir pedidos mas ordenados por WhatsApp.
- Flujo sin pasarela de pago ni backend.

Limitaciones:

- No guarda pedidos.
- No valida disponibilidad, horarios ni stock.
- No calcula costo de envio.
- No integra SINPE, tarjeta ni comprobantes.

### CATEGORIA_C_COMBO_MARCA

Archivos principales:

```txt
RANGO_2_PROFESIONAL/CATEGORIA_C_COMBO_MARCA/src/App.jsx
RANGO_2_PROFESIONAL/CATEGORIA_C_COMBO_MARCA/vercel.json
RANGO_2_PROFESIONAL/CATEGORIA_C_COMBO_MARCA/_redirects
```

Incluye:

- Presentacion de marca.
- Productos con etiquetas comerciales.
- Carrito basico.
- Formulario de finalizacion.
- SEO base en `index.html`.
- Configuracion de despliegue para Vercel y Netlify.

Uso ideal:

- Paquete comercial mas completo.
- Sitio listo para campanas, SEO local y despliegue estatico.

Limitaciones:

- Productos duplicados en codigo.
- Configuracion de despliegue solo existe en esta categoria.

## RANGO_3_PREMIUM

### CATEGORIA_A_AUTOR

Archivo principal:

```txt
RANGO_3_PREMIUM/CATEGORIA_A_AUTOR/src/App.jsx
```

Incluye:

- Hero visual con imagenes externas de Unsplash.
- Menu completo por categorias.
- Modal de producto con opciones.
- Carrito.
- Checkout con datos de cliente, servicio y pago.
- Enlaces de Waze, Google Maps y WhatsApp.
- Seccion de experiencia: horario, domicilio y ubicacion.
- Footer con contacto.
- Estilo mas editorial y premium.

Uso ideal:

- Demo visual de mayor valor.
- Presentacion de marca para cliente que quiere imagen mas cuidada.

Limitaciones:

- Usa imagenes externas genericas, no fotos reales del negocio.
- No guarda pedidos en backend.

### CATEGORIA_B_ECOMMERCE_GOURMET

Archivo principal:

```txt
RANGO_3_PREMIUM/CATEGORIA_B_ECOMMERCE_GOURMET/src/App.jsx
```

Incluye:

- Experiencia gourmet con carrito avanzado.
- Checkout modal con nombre, telefono, direccion condicional y metodo de pago.
- Validacion de efectivo.
- Ticket de pedido estructurado.
- SEO y Open Graph en `index.html`.
- Enlaces de Waze, Google Maps y WhatsApp.

Uso ideal:

- Demo premium orientada a compra directa y ticket operativo.

Limitaciones:

- No tiene pasarela de pago.
- No guarda historial en backend.

### CATEGORIA_C_SAAS_CLOUD_KITCHEN

Archivos principales:

```txt
RANGO_3_PREMIUM/CATEGORIA_C_SAAS_CLOUD_KITCHEN/src/pages/Menu.jsx
RANGO_3_PREMIUM/CATEGORIA_C_SAAS_CLOUD_KITCHEN/src/pages/Admin.jsx
RANGO_3_PREMIUM/CATEGORIA_C_SAAS_CLOUD_KITCHEN/src/pages/POS.jsx
RANGO_3_PREMIUM/CATEGORIA_C_SAAS_CLOUD_KITCHEN/src/localDemoData.js
```

Incluye:

- Menu cliente con carrito y creacion de ordenes.
- Admin para disponibilidad y precios.
- POS/KDS con ordenes pendientes, impresion y completar orden.
- Firebase/Firestore.
- Fallback local con datos demo.
- Script de seed para menu y ordenes iniciales.
- Configuracion SPA para Vercel y Netlify.

Uso ideal:

- Paquete premium operativo para Cloud Kitchen, cocina fantasma o restaurante que necesita flujo interno de ordenes.

Limitaciones:

- No tiene autenticacion, roles ni pagos integrados.
