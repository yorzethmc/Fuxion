# Pendientes y mejoras

## Pendientes criticos antes de produccion

1. [COMPLETADO] Centralizar datos repetidos.

   Los datos han sido centralizados con éxito en el archivo `menu-data-clean.json` que actúa como la Única Fuente de Verdad (SSOT).

2. Validar builds de todas las demos React.

   Antes de entregar o desplegar, conviene correr:

   ```bash
   npm install
   npm run build
   ```

   en cada carpeta React.

3. Revisar enlaces reales de ubicacion.

   Los enlaces actuales usan busquedas por texto. Para un negocio real, seria mejor usar coordenadas, perfil de Google Maps o enlaces oficiales.

4. Sustituir imagenes genericas.

   La demo premium usa imagenes externas de Unsplash. Para venta real, conviene usar fotos propias del restaurante o imagenes aprobadas por el cliente.

5. Confirmar informacion comercial.

   Validar precios, horario, pagos, cobertura express y disponibilidad de productos.

## Mejoras tecnicas recomendadas

- Crear un archivo comun de datos, por ejemplo `menu.json` o `business.json`, y reutilizarlo en las categorias que lo permitan.
- Crear variables de configuracion para WhatsApp, ubicacion, horario y nombre comercial.
- Agregar README individual a cada categoria.
- Agregar capturas de pantalla por demo.
- Agregar pruebas basicas de build para proyectos React.
- Usar Tailwind instalado en el build para produccion en vez de CDN.
- Agregar favicon, imagen Open Graph y manifest web.
- Mejorar accesibilidad de botones, formularios y textos alternativos.

## Mejoras de producto

- Panel visual simple para editar menu sin tocar JSON.
- Control de disponibilidad por producto.
- Horarios dinamicos: abierto/cerrado segun hora local.
- Costos de envio por zona.
- Seleccion de extras o modificadores.
- Confirmacion del pedido antes de abrir WhatsApp.
- Plantillas por tipo de restaurante.
- QR descargable para imprimir.

## Mejoras comerciales

- Documentar cada rango como paquete vendible.
- Definir entregables por paquete.
- Crear comparativa de precios y beneficios.
- Preparar demos publicas desplegadas.
- Agregar una galeria de ejemplos.
- Crear checklist de informacion que se pide al cliente antes de construir su sitio.

## Riesgos actuales

- Si cambia el numero de WhatsApp, debe actualizarse en multiples archivos.
- Si cambia un precio, puede quedar inconsistente entre demos.
- Las apps con carrito no tienen backend, por lo que no registran pedidos.
- El usuario puede modificar el mensaje antes de enviarlo por WhatsApp.
- No hay integracion real de pagos.
- No hay analitica configurada.

## Siguiente paso recomendado

El siguiente paso mas valioso seria centralizar los datos del negocio y del menu en un archivo comun, y luego hacer que las categorias React consuman esos datos para evitar duplicacion.
