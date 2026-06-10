import json
import os

with open(r'c:\Users\yorze\OneDrive\Documentos\Fuxion\docs\menu-data-clean.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

restaurant = data['restaurant']
categories = data['categories']
items = data['items']

# Helper to format price
def format_price(price):
    return f"₡{price:,}".replace(',', '.')

def generate_header(cat_type):
    # cat_type determines if we show Waze/Maps buttons
    base_header = f"""<!doctype html>
<html lang="es-CR">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>{restaurant['name']} | Menú Digital</title>
    <meta name="description" content="Menú digital de {restaurant['name']}." />
    <script src="https://cdn.tailwindcss.com"></script>
    <script>
      tailwind.config = {{
        theme: {{
          extend: {{
            colors: {{
              fusion: {{
                black: "#0a0a0a",
                coal: "#171717",
                yellow: "#f59e0b",
                orange: "#ea580c",
              }},
            }},
            fontFamily: {{
              sans: ['Inter', 'sans-serif'],
            }}
          }},
        }},
      }};
    </script>
    <style>
      @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;900&display=swap');
    </style>
  </head>
  <body class="text-gray-200 antialiased font-sans min-h-screen" style="background-color: #2c1e16; background-image: url('https://www.transparenttextures.com/patterns/wood-pattern.png');">
    <main class="min-h-screen px-4 pb-28 pt-8 max-w-md mx-auto">
      
      <header class="flex flex-col items-center text-center space-y-4 mb-10">
        <img src="../../docs/logo_fusion.png" alt="{restaurant['name']} Logo" class="w-24 h-24 object-contain" onerror="this.style.display='none'">
        <div>
          <h1 class="text-3xl font-black tracking-tight text-white">{restaurant['name']}</h1>
          <p class="text-sm font-semibold tracking-widest text-fusion-yellow uppercase mt-1">{restaurant['location']}</p>
        </div>
        <p class="text-sm text-gray-400">Nuestro menú digital de solo lectura. Revisa nuestros platillos y contáctanos para ordenar.</p>
        
        <div class="w-full bg-black/40 backdrop-blur-sm rounded-xl p-4 border border-white/10 mt-4 text-left shadow-xl">
          <p class="text-xs text-gray-500 uppercase font-bold tracking-wider mb-1">Horarios de Atención</p>
          <p class="text-sm text-gray-200 font-semibold">{restaurant['hours']}</p>
        </div>
"""
    if cat_type == "B":
        base_header += """
        <div class="flex gap-2 w-full mt-4">
          <a href="https://waze.com/ul?q=Fusion+Culinaria+Sabanilla" target="_blank" class="flex-1 flex items-center justify-center gap-2 bg-[#33ccff]/10 text-[#33ccff] border border-[#33ccff]/30 py-2 rounded-lg text-sm font-bold active:scale-95 transition-transform">
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 512 512"><path d="M502.2 216c-3.7-27.1-13-53.1-27.4-76.4-14.7-23.8-33.8-44.5-56-60.8-22.6-16.7-48.4-28.7-75.7-35.3-27.7-6.7-56.7-8-84.9-3.7-27.7 4.2-54.3 13.9-78.1 28.5-23.4 14.4-44.1 33.3-60.6 55.4-16.7 22.4-28.9 47.9-35.6 74.9-6.8 27.4-8.2 56.1-4 84.1 4.3 27.6 14.2 54 28.9 77.5 14.5 23.2 33.4 43.4 55.4 59.4 22.4 16.4 47.9 28.4 75 35 27.5 6.7 56.3 8.1 84.4 3.9 27.5-4.1 53.9-13.8 77.5-28.3 23.3-14.3 43.8-33.1 60.3-55 16.5-22.2 28.6-47.5 35.3-74.4 6.8-27.3 8.1-56 3.9-84M255 140.2c59.8 0 108.3 48.6 108.3 108.3 0 59.8-48.6 108.3-108.3 108.3-59.8 0-108.3-48.6-108.3-108.3 0-59.8 48.6-108.3 108.3-108.3m0 167c32.4 0 58.7-26.3 58.7-58.7 0-32.4-26.3-58.7-58.7-58.7-32.4 0-58.7 26.3-58.7 58.7 0 32.4 26.3 58.7 58.7 58.7M160 216c0-11 9-20 20-20s20 9 20 20-9 20-20 20-20-9-20-20m150-20c11 0 20 9 20 20s-9 20-20 20-20-9-20-20 9-20 20-20z"/></svg>
            Waze
          </a>
          <a href="https://www.google.com/maps/search/?api=1&query=Fusion+Culinaria+Sabanilla" target="_blank" class="flex-1 flex items-center justify-center gap-2 bg-[#ea4335]/10 text-[#ea4335] border border-[#ea4335]/30 py-2 rounded-lg text-sm font-bold active:scale-95 transition-transform">
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-4.97 0-9 4.03-9 9 0 5.25 9 15 9 15s9-9.75 9-15c0-4.97-4.03-9-9-9zm0 12.5c-1.93 0-3.5-1.57-3.5-3.5s1.57-3.5 3.5-3.5 3.5 1.57 3.5 3.5-1.57 3.5-3.5 3.5z"/></svg>
            Google Maps
          </a>
        </div>
"""
    base_header += """      </header>
      <section id="menu" class="space-y-8">
"""
    return base_header

def generate_footer():
    return f"""      </section>
    </main>

    <!-- Botón Global Único -->
    <a
      href="https://wa.me/{restaurant['whatsapp']}?text=Hola%20Fusi%C3%B3n%20Culinaria%2C%20quisiera%20hacer%20una%20consulta%20sobre%20el%20men%C3%BA."
      aria-label="Contactar por WhatsApp"
      class="fixed bottom-6 left-1/2 -translate-x-1/2 w-[calc(100%-3rem)] max-w-sm flex items-center justify-center gap-2 rounded-2xl bg-fusion-orange px-6 py-4 text-sm font-black uppercase tracking-wider text-white shadow-2xl shadow-fusion-orange/20 transition-transform active:scale-95"
    >
      <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/></svg>
      Consultar por WhatsApp
    </a>
  </body>
</html>
"""

# HTML generation logic
def generate_html(cat_type):
    html = generate_header(cat_type)
    
    for category in categories:
        cat_items = [i for i in items if i['category'] == category['id']]
        if not cat_items:
            continue
            
        html += f"""        <section class="bg-black/60 backdrop-blur-md rounded-xl border border-white/10 overflow-hidden shadow-2xl">
          <div class="bg-white/[0.02] px-4 py-3 border-b border-white/5">
            <h2 class="text-sm font-black uppercase tracking-widest text-white">{category['name']}</h2>
          </div>
          <div class="px-4">
"""
        for item in cat_items:
            badge_html = ""
            if cat_type == "B":
                if item.get("isNew"):
                    badge_html = f'<span class="ml-2 rounded-md bg-fusion-orange/20 px-2 py-0.5 text-[10px] font-black uppercase tracking-widest text-fusion-orange border border-fusion-orange/30">NUEVO</span>'
                elif item.get("isRecommended"):
                    badge_html = f'<span class="ml-2 rounded-md bg-fusion-yellow/10 px-2 py-0.5 text-[10px] font-black uppercase tracking-widest text-fusion-yellow border border-fusion-yellow/20">RECOMENDADO</span>'
            
            html += f"""            <article class="py-4 border-b border-white/5 last:border-0 flex justify-between gap-4">
              <div>
                <h3 class="font-bold text-gray-100 flex items-center">{item['name']}{badge_html}</h3>
                <p class="mt-1 text-xs leading-relaxed text-gray-500">{item['description']}</p>
              </div>
              <strong class="shrink-0 text-sm font-black text-fusion-yellow">{format_price(item['price'])}</strong>
            </article>
"""
        html += """          </div>
        </section>
"""
    html += generate_footer()
    return html

# Write Cat A
cat_a_path = r'c:\Users\yorze\OneDrive\Documentos\Fuxion\RANGO_1_ECONOMICO\CATEGORIA_A_BASICO\index.html'
with open(cat_a_path, 'w', encoding='utf-8') as f:
    f.write(generate_html("A"))

# Write Cat B
cat_b_path = r'c:\Users\yorze\OneDrive\Documentos\Fuxion\RANGO_1_ECONOMICO\CATEGORIA_B_QR_PRO\index.html'
with open(cat_b_path, 'w', encoding='utf-8') as f:
    f.write(generate_html("B"))

# Write Cat C HTML
cat_c_html = f"""<!doctype html>
<html lang="es-CR">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>{restaurant['name']} | Menú Digital</title>
    <meta name="description" content="Menú digital de {restaurant['name']}." />
    <script src="https://cdn.tailwindcss.com"></script>
    <script>
      tailwind.config = {{
        theme: {{
          extend: {{
            colors: {{
              fusion: {{
                black: "#0a0a0a",
                coal: "#171717",
                yellow: "#f59e0b",
                orange: "#ea580c",
              }},
            }},
            fontFamily: {{
              sans: ['Inter', 'sans-serif'],
            }}
          }},
        }},
      }};
    </script>
    <style>
      @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;900&display=swap');
    </style>
  </head>
  <body class="text-gray-200 antialiased font-sans min-h-screen" style="background-color: #2c1e16; background-image: url('https://www.transparenttextures.com/patterns/wood-pattern.png');">
    <main class="min-h-screen px-4 pb-28 pt-8 max-w-md mx-auto">
      
      <header id="restaurant-header" class="flex flex-col items-center text-center space-y-4 mb-10 hidden">
        <img src="../../docs/logo_fusion.png" alt="Logo" class="w-24 h-24 object-contain" onerror="this.style.display='none'">
        <div>
          <h1 id="restaurant-name" class="text-3xl font-black tracking-tight text-white"></h1>
          <p id="restaurant-location" class="text-sm font-semibold tracking-widest text-fusion-yellow uppercase mt-1"></p>
        </div>
        <p class="text-sm text-gray-400">Nuestro menú digital de solo lectura. Revisa nuestros platillos y contáctanos para ordenar.</p>
        
        <div class="w-full bg-black/40 backdrop-blur-sm rounded-xl p-4 border border-white/10 mt-4 text-left shadow-xl">
          <p class="text-xs text-gray-500 uppercase font-bold tracking-wider mb-1">Horarios de Atención</p>
          <p id="restaurant-hours" class="text-sm text-gray-200 font-semibold"></p>
        </div>
      </header>

      <section id="menu-container" class="space-y-8">
        <p class="text-center text-gray-500">Cargando menú...</p>
      </section>
    </main>

    <!-- Botón Global Único -->
    <a
      id="whatsapp-btn"
      href="#"
      aria-label="Contactar por WhatsApp"
      class="fixed bottom-6 left-1/2 -translate-x-1/2 w-[calc(100%-3rem)] max-w-sm flex items-center justify-center gap-2 rounded-2xl bg-fusion-orange px-6 py-4 text-sm font-black uppercase tracking-wider text-white shadow-2xl shadow-fusion-orange/20 transition-transform active:scale-95 hidden"
    >
      <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/></svg>
      Consultar por WhatsApp
    </a>
    
    <script src="app.js"></script>
  </body>
</html>
"""

cat_c_path = r'c:\Users\yorze\OneDrive\Documentos\Fuxion\RANGO_1_ECONOMICO\CATEGORIA_C_AUTOADMINISTRABLE_MANUAL\index.html'
with open(cat_c_path, 'w', encoding='utf-8') as f:
    f.write(cat_c_html)

# Write Cat C JS
cat_c_js = """
document.addEventListener("DOMContentLoaded", async () => {
  try {
    // Fetch data from SSOT (Single Source of Truth)
    const response = await fetch('../../docs/menu-data-clean.json');
    if (!response.ok) throw new Error('No se pudo cargar el menú');
    const data = await response.json();
    
    // Fill Restaurant Data
    document.getElementById('restaurant-name').textContent = data.restaurant.name;
    document.getElementById('restaurant-location').textContent = data.restaurant.location;
    document.getElementById('restaurant-hours').textContent = data.restaurant.hours;
    document.title = `${data.restaurant.name} | Menú Digital`;
    
    document.getElementById('restaurant-header').classList.remove('hidden');
    
    // Config WhatsApp Button
    const waBtn = document.getElementById('whatsapp-btn');
    const waMessage = encodeURIComponent(`Hola ${data.restaurant.name}, quisiera hacer una consulta sobre el menú.`);
    waBtn.href = `https://wa.me/${data.restaurant.whatsapp}?text=${waMessage}`;
    waBtn.classList.remove('hidden');
    
    // Render Menu
    const menuContainer = document.getElementById('menu-container');
    menuContainer.innerHTML = '';
    
    const currencyFormatter = new Intl.NumberFormat("es-CR", { style: "currency", currency: "CRC", maximumFractionDigits: 0 });
    const formatPrice = (price) => currencyFormatter.format(price).replace("CRC", "₡").trim();
    
    data.categories.forEach(category => {
      const catItems = data.items.filter(item => item.category === category.id);
      if (catItems.length === 0) return;
      
      const section = document.createElement('section');
      section.className = "bg-black/60 backdrop-blur-md rounded-xl border border-white/10 overflow-hidden shadow-2xl";
      
      let html = `
        <div class="bg-white/[0.02] px-4 py-3 border-b border-white/5">
          <h2 class="text-sm font-black uppercase tracking-widest text-white">${category.name}</h2>
        </div>
        <div class="px-4">
      `;
      
      catItems.forEach(item => {
        html += `
          <article class="py-4 border-b border-white/5 last:border-0 flex justify-between gap-4">
            <div>
              <h3 class="font-bold text-gray-100 flex items-center">${item.name}</h3>
              <p class="mt-1 text-xs leading-relaxed text-gray-500">${item.description}</p>
            </div>
            <strong class="shrink-0 text-sm font-black text-fusion-yellow">${formatPrice(item.price)}</strong>
          </article>
        `;
      });
      
      html += `</div>`;
      section.innerHTML = html;
      menuContainer.appendChild(section);
    });
    
  } catch (error) {
    console.error(error);
    document.getElementById('menu-container').innerHTML = '<p class="text-center text-red-500">Error al cargar el menú. Por favor, intenta de nuevo más tarde.</p>';
  }
});
"""

cat_c_js_path = r'c:\Users\yorze\OneDrive\Documentos\Fuxion\RANGO_1_ECONOMICO\CATEGORIA_C_AUTOADMINISTRABLE_MANUAL\app.js'
with open(cat_c_js_path, 'w', encoding='utf-8') as f:
    f.write(cat_c_js)

print("HTML and JS generated successfully.")
