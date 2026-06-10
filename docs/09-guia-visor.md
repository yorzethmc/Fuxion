# Guía Comercial del Visor Único (Escalabilidad de Funciones)

Este documento es tu **guión de ventas y guía definitiva** para usar el Visor Único (`visor.html`) frente a un cliente. El visor te permite aplicar la técnica de *Feature Escalation*: comienzas mostrando la versión más simple y económica, y vas subiendo el nivel para demostrar el valor añadido de cada categoría superior.

---

## 🚀 Rango 1: Económico (Pizarra Estática)
**Concepto:** Un menú digital de solo lectura. Funciona como un "PDF interactivo" o una pizarra digital. No hay carrito de compras.

### Categoría A - Básico
* **¿Qué ve el cliente?** Una lista estática de platillos por categoría.
* **Funciones Disponibles:**
  * Diseño limpio y moderno (Tailwind CSS).
  * Botón flotante único: "Consultar por WhatsApp" que envía un mensaje genérico.
* **Ideal para:** Negocios con presupuesto muy bajo que solo necesitan abandonar el menú en papel/PDF.
* **Limitación a destacar al cliente:** El usuario debe leer el menú y luego tipear a mano su pedido en WhatsApp.

### Categoría B - QR Pro
* **¿Qué ve el cliente?** Igual al básico, pero con elementos de conversión local.
* **Funciones Disponibles (Añadidas):**
  * Botones funcionales de **Waze** y **Google Maps** para atraer tráfico al local.
  * Insignias visuales (`NUEVO`, `RECOMENDADO`) para destacar platillos estrella.
* **Ideal para:** Food trucks o locales físicos donde la ubicación es clave.

### Categoría C - Autoadministrable
* **¿Qué ve el cliente?** Visualmente idéntico a la Categoría B.
* **Funciones Disponibles (Añadidas):**
  * Lógica interna de JavaScript (Fetch API).
  * Consumo centralizado desde un archivo `menu-data-clean.json`.
* **Ideal para:** Negocios que cambian precios o añaden platos todas las semanas. Se les vende la facilidad de modificar un solo archivo (JSON) para actualizar todo el menú al instante.

---

## 💼 Rango 2: Profesional (Aplicaciones React / SPA)
**Concepto:** Transición de una "página estática" a una "aplicación web" (Single Page Application). La experiencia es instantánea, sin recargas de página.

### Categoría A - Estético
* **¿Qué ve el cliente?** Una interfaz con Pestañas (Tabs) navegables.
* **Funciones Disponibles:**
  * Navegación por categorías sin recargar la página.
  * Retiene el concepto de Rango 1 (sin carrito, solo un botón genérico de contacto).
* **Ideal para:** Menús extremadamente largos donde hacer *scroll* infinito es molesto.

### Categoría B - Pre Pedido WhatsApp (🔥 El Best-Seller)
* **¿Qué ve el cliente?** Una experiencia de E-commerce completa.
* **Funciones Disponibles:**
  * **Carrito de compras** activo.
  * **Opciones Complejas:** El usuario puede elegir el término de la carne, extras que suman al precio total, e ingredientes obligatorios vs. opcionales.
  * **Cálculo en tiempo real** del total a pagar.
  * **Checkout Inteligente:** Al presionar "Enviar a WhatsApp", el sistema formatea el pedido perfecto (Cantidades, Nombres, Opciones, Total) y lo envía listo al restaurante.
* **Ideal para:** Restaurantes con alto volumen de delivery. *Argumento de venta:* "Evita errores humanos, ahorra 5 minutos de chat por cliente y evita pedidos equivocados".

### Categoría C - Combo Marca
* **¿Qué ve el cliente?** Igual al Pre-Pedido, pero optimizado para Marketing.
* **Funciones Disponibles (Añadidas):**
  * Metadatos SEO dinámicos (Open Graph, Twitter Cards).
  * Archivos de despliegue (`vercel.json`, `_redirects`).
* **Ideal para:** Marcas que invierten en Facebook Ads o Google Ads. Al compartir el enlace por WhatsApp o Redes Sociales, aparecerá una tarjeta visual profesional con el logo y descripción atractiva.

---

## 💎 Rango 3: Premium (High-End Experience)
**Concepto:** Vender estatus, experiencia y lujo. No es solo un menú, es una carta de presentación de alta gama.

### Categoría A - Autor
* **¿Qué ve el cliente?** Un diseño editorial inmersivo.
* **Funciones Disponibles:**
  * **Tipografía de Lujo:** Fuentes con serifa (Cormorant Garamond) combinadas con palo seco elegante (Montserrat).
  * **Micro-animaciones y Asimetría:** Elementos que flotan suavemente (`fade-in-up`), imágenes de alta resolución con paneo lento (`slow-pan`) y texturas de cristal (`glassmorphism`).
  * Layout dividido donde las imágenes evocan emociones.
* **Ideal para:** Restaurantes fine-dining, gastrobares, chefs de autor o mixólogos. *Argumento de venta:* "Un menú que justifica tus precios. Si tu platillo cuesta $30, la presentación digital debe verse de $100".

---

## 🛠️ Notas Técnicas de Demostración (Visor)

1. **Protección Anti-Rotura de Enlaces (Iframe Safe):** El Visor carga estas 7 páginas dentro de un marco (`iframe`). Plataformas como WhatsApp o Google Maps bloquean por seguridad que sus sitios se abran dentro de marcos. **Esto ya fue solucionado**: Todo enlace de acción en los 7 modelos está forzado a abrirse en una pestaña nueva (`target="_blank"` y `window.open()`). Puedes hacer clic en los botones frente al cliente con total confianza; el visor nunca se romperá.
2. **Recomendación de Flujo:** 
   - Muestra el **Rango 1 Básico** -> *Demuestra el problema del WhatsApp vacío.*
   - Salta al **Rango 2 Pre-Pedido** -> *Muestra la magia del carrito y las opciones.*
   - Termina en el **Rango 3 Premium** -> *Deslumbra con el diseño.*
