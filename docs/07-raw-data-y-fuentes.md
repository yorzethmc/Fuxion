# Raw data y fuentes de informacion

Este documento define cuales archivos del proyecto se deben tomar como fuente de informacion cuando se quiera revisar, actualizar o reconstruir la documentacion.

## Fuente principal recomendada

La fuente mas ordenada del menu y datos del negocio es:

```txt
RANGO_1_ECONOMICO/CATEGORIA_C_AUTOADMINISTRABLE_MANUAL/menu.json
```

Este archivo contiene datos estructurados en JSON:

- Nombre del restaurante.
- Ubicacion.
- Horario.
- Numero de WhatsApp.
- Categorias del menu.
- Productos.
- Descripciones.
- Precios.
- Marcador de productos destacados.

Cuando haya dudas sobre productos, precios o datos base del negocio, este archivo deberia revisarse primero.

## Indicacion para todos los documentos HTML

Cada vez que se cree o edite una pagina HTML en cualquier rango, categoria o proyecto, se debe revisar este raw data y agregar la informacion correspondiente al documento HTML.

Esta regla aplica a todos los archivos:

```txt
index.html
```

y a cualquier otra pagina HTML que se agregue en el futuro.

Como minimo, cada documento HTML debe validar o incluir:

- Nombre correcto del negocio.
- Ubicacion del negocio.
- Horario actualizado.
- Numero oficial de WhatsApp.
- Productos, categorias, precios y descripciones segun la fuente de raw data.
- Textos SEO basicos: `title`, `meta description` y, cuando aplique, `meta keywords`.
- Idioma correcto del sitio, preferiblemente `lang="es-CR"` para paginas finales.
- Enlaces correctos de WhatsApp, Waze o Google Maps si la pagina los usa.
- Coherencia entre lo visible en la pagina y los datos documentados en esta fuente.

Si una pagina HTML no muestra todo el menu completo, debe tomar de este raw data solo la informacion que corresponda a esa demo, pero sin inventar precios, nombres, productos ni descripciones diferentes.

## Fuentes secundarias

### README principal

Archivo:

```txt
README.md
```

Sirve como resumen general del proyecto. Incluye:

- Descripcion del catalogo.
- Explicacion de rangos.
- Numero de WhatsApp.
- Comandos generales.
- Lista de productos base.

Usarlo para entender la intencion comercial y la estructura general.

### Archivos HTML del rango economico

Archivos:

```txt
RANGO_1_ECONOMICO/CATEGORIA_A_BASICO/index.html
RANGO_1_ECONOMICO/CATEGORIA_B_QR_PRO/index.html
RANGO_1_ECONOMICO/CATEGORIA_C_AUTOADMINISTRABLE_MANUAL/index.html
```

Sirven para validar:

- Textos visibles en demos economicas.
- Botones de WhatsApp.
- Informacion de ubicacion.
- Horarios.
- Links de Waze y Google Maps.
- Estructura visual mobile-first.

### Apps React

Archivos principales:

```txt
RANGO_2_PROFESIONAL/CATEGORIA_A_ESTETICO/src/App.jsx
RANGO_2_PROFESIONAL/CATEGORIA_B_PRE_PEDIDO_WHATSAPP/src/App.jsx
RANGO_2_PROFESIONAL/CATEGORIA_C_COMBO_MARCA/src/App.jsx
RANGO_3_PREMIUM/CATEGORIA_A_AUTOR/src/App.jsx
```

Sirven para validar:

- Productos usados por cada demo.
- Flujo de carrito.
- Mensajes generados para WhatsApp.
- Secciones de marca.
- Textos comerciales.
- Comportamiento de formularios.

## Datos base actuales

### Negocio

```txt
Nombre: Fusion Culinaria
Ubicacion: Sabanilla, Alajuela
Horario: Lunes a domingo de 11:00 a.m. a 8:00 p.m.
WhatsApp: 50660224371
```

### Menu base

```txt
Gallito de pescado - ₡1,350
Papitas fusion - ₡1,000
Salchi papitas - ₡1,000
Nachitos - ₡1,000
Hot dog - ₡1,000
Hamburguesa - ₡1,000
Taco tico regular - ₡1,000
Promo jueves - ₡5,500
Cantones + chop suey - ₡6,500
Combo familiar - ₡10,800
```

## Orden recomendado para buscar informacion

Cuando se necesite documentar o verificar algo, buscar en este orden:

1. `RANGO_1_ECONOMICO/CATEGORIA_C_AUTOADMINISTRABLE_MANUAL/menu.json`
2. `README.md`
3. `RANGO_2_PROFESIONAL/*/src/App.jsx`
4. `RANGO_3_PREMIUM/*/src/App.jsx`
5. `RANGO_1_ECONOMICO/*/index.html`

## Reglas para actualizar documentacion

- Si cambia un precio, revisar primero `menu.json`.
- Si cambia el WhatsApp, buscar el numero en todo el proyecto y actualizar todas las apariciones.
- Si cambia una demo React, revisar su `src/App.jsx`.
- Si cambia el posicionamiento comercial de los rangos, actualizar `README.md` y los documentos de `docs`.
- Si hay diferencia entre `menu.json` y una demo, anotar la diferencia como inconsistencia pendiente.
- Si se crea o modifica una pagina HTML en cualquier proyecto, revisar esta fuente y actualizar el HTML con los datos correctos que correspondan.

## Inconsistencias conocidas

Actualmente los productos y datos estan repetidos en varios archivos. Por eso puede haber diferencias entre demos si una se actualiza y otra no.

La recomendacion tecnica es convertir `menu.json` o un nuevo archivo `business-data.json` en la fuente unica de verdad para todo el proyecto.
Actúa como un desarrollador Frontend Senior. A continuación te proporciono el menú completo y detallado del restaurante "Fusión Culinaria" (Costa Rica). 

Tu tarea es transformar toda esta información en un formato de datos limpio para desarrollo web (un objeto JSON o un array estructurado de objetos en JavaScript/React). Cada platillo debe tener obligatoriamente los siguientes atributos bien definidos:
- id: único (ej: "burg-fusion")
- name: nombre exacto del plato
- description: ingredientes, detalles y acompañamientos incluidos
- price: número entero que representa el valor en colones (₡)
- category: categoría a la que pertenece
- options: (si aplica) array de objetos con opciones de personalización (ej: extras con su precio respectivo, término de la carne, etc.)

Adicionalmente, identifica los platos marcados como "NUEVO" o "RECOMENDADO" y agrégales un atributo booleano (ej: "isNew: true" o "isRecommended: true") para poder destacarlos visualmente en la interfaz web del menú express.

DATOS DEL MENÚ ACTUAL DE FUSIÓN CULINARIA:

===============================================================================
1. CATEGORÍA: ENTRADAS Y ENTRADAS PARA COMPARTIR
===============================================================================
• Chicharrones de la Casa
  - Descripción: Deliciosos chicharrones acompañados de yuca frita, pico de gallo, limón y nuestra salsa especial.
  - Precio: ₡6,500
• Patacones con Todo
  - Descripción: Canastas de patacones crujientes rellenos de frijoles molidos arreglados, guacamole fresco, pico de gallo y queso rallado.
  - Precio: ₡4,800
• Dedos de Queso Crujientes
  - Descripción: Dedos de queso mozzarella empanizados, acompañados de salsa marinara artesanal de la casa. (6 unidades)
  - Precio: ₡4,200
• Alitas Fusión (6 unidades o 12 unidades)
  - Descripción: Alitas de pollo sumamente crujientes bañadas en la salsa de tu elección (BBQ Ahumada, Búfalo Picante, o Maracuyá Agridulce). Acompañadas de aderezo ranch y bastones de apio.
  - Precios: 6 unidades por ₡4,500 / 12 unidades por ₡8,200
• Nachos Fusión (Grande / Para Compartir)
  - Descripción: Totopos de maíz crujientes cubiertos con frijoles arreglados, mezcla de quesos fundidos, carne mechada premium, guacamole, natilla y pico de gallo.
  - Precio: ₡7,200

===============================================================================
2. CATEGORÍA: HAMBURGUESAS ARTESANALES
*(Nota para el código: Todas las hamburguesas incluyen una porción de papas fritas rústicas o aros de cebolla, y se debe permitir al cliente elegir el término de la carne: Término Medio, Tres Cuartos, Bien Cocida).*
===============================================================================
• Hamburguesa Fusión (La Especialidad de la Casa - RECOMENDADA)
  - Descripción: 200g de carne artesanal de res seleccionada, queso cheddar fundido, tocineta ahumada crujiente, cebolla caramelizada al vino tinto, lechuga fresca, tomate y aderezo especial Fusión en pan brioche sellado con mantequilla.
  - Precio: ₡5,800
• La Parrillera
  - Descripción: 200g de carne de res a la parrilla, chorizo parrillero artesanal, queso madurado, chimichurri de la casa, lechuga y tomate.
  - Precio: ₡6,200
• Crispy Chicken Burger
  - Descripción: Pechuga de pollo extra crujiente empanizada con receta secreta, queso suizo, ensalada coleslaw de la casa, pepinillos y mayonesa chipotle.
  - Precio: ₡5,200
• La Monster Burger (NUEVA)
  - Descripción: Para los amantes de la carne. Doble torta de carne artesanal (400g en total), doble queso cheddar, doble tocineta, huevo frito, aros de cebolla crujientes dentro de la hamburguesa, salsa BBQ y aderezo de la casa.
  - Precio: ₡8,500
• Veggie Fusión
  - Descripción: Torta artesanal a base de garbanzo y quinoa bien sazonada, queso blanco a la plancha, hongos salteados, lechuga, tomate y aderezo de aguacate.
  - Precio: ₡4,900

===============================================================================
3. CATEGORÍA: PLATOS FUERTES Y ESPECIALIDADES
===============================================================================
• Casado Fusión (Tradicional con un toque Gourmet)
  - Descripción: Arroz, frijoles caseros, plátano maduro, ensalada fresca, huevo frito y picadillo del día. Opción de proteína a elegir: Carne en salsa, Pechuga de pollo a la plancha o Chuleta de cerdo.
  - Precio: ₡4,500
• Costillas BBQ Ahumadas (Media Costillar / Costillar Entero)
  - Descripción: Tiernas costillas de cerdo cocinadas lentamente que se desprenden del hueso, bañadas en salsa BBQ artesanal. Acompañadas de papas fritas y ensalada coleslaw.
  - Precios: Media Costillar por ₡8,500 / Costillar Entero por ₡14,900
• Fajitas Mixtas (Res y Pollo)
  - Descripción: Tiras de carne de res y pechuga de pollo salteadas con chile dulce, cebolla y un toque de lizano gourmet. Acompañadas de arroz, frijoles, tortillas de harina y guacamole.
  - Precio: ₡7,800
• Salmón en Salsa de Maracuyá
  - Descripción: Filet de salmón fresco sellado a la perfección, bañado en una reducción cremosa de maracuyá. Acompañado de puré de papa rústico y vegetales salteados al wok.
  - Precio: ₡11,500

===============================================================================
4. CATEGORÍA: COMBOS EXPRESS Y PROMOCIONES (Venta Impulsiva Superior)
===============================================================================
• Combo Pareja Fusión
  - Descripción: 2 Hamburguesas Fusión + 2 Porciones de Papas Fritas Rústicas + 2 Bebidas de 500ml a elegir.
  - Precio: ₡12,500
• Combo Familiar Parrillero
  - Descripción: Una orden grande de Chicharrones de la Casa + 12 Alitas Fusión (salsa a elegir) + 1 Orden de Patacones con Todo + 1 Refresco Familiar de 2 Litros.
  - Precio: ₡18,900
• Combo Alitas Express
  - Descripción: 6 Alitas de pollo con papas fritas y un refresco natural o gaseosa de 500ml.
  - Precio: ₡5,500

===============================================================================
5. CATEGORÍA: BEBIDAS
===============================================================================
• Refrescos Naturales (500ml)
  - Sabores disponibles: Cas, Maracuyá, Guanábana, Fresa. (A elegir en agua o en leche).
  - Precio: ₡1,500 (En agua) / ₡1,800 (En leche)
• Gaseosas / Refrescos embotellados (500ml)
  - Opciones: Coca-Cola, Coca-Cola Sin Azúcar, Tropical Té Frío Limón, Tropical Té Frío Melocotón, Agua en botella.
  - Precio: ₡1,200
• Cervezas Nacionales (Solo para llevar o consumo local si aplica)
  - Opciones: Imperial, Imperial Light, Pilsen.
  - Precio: ₡1,800

===============================================================================
6. OPCIONES GENERALES DE EXTRAS (Modificadores del Carrito)
===============================================================================
Permite mapear estos extras con sus respectivos costos adicionales agregados al total:
- Extra de Tocineta: +₡800
- Extra de Queso Cheddar: +₡500
- Extra de Carne de Res (200g): +₡1,800
- Extra de Aguacate / Guacamole: +₡700
- Cambiar papas normales por Papas Supremas (con queso y tocineta): +₡1,200

Genera el código de manera limpia utilizando las mejores prácticas, estructurando los datos de forma idónea para consumirse desde la aplicación frontend.
