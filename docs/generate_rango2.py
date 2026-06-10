import os
import json

base_path = r'c:\Users\yorze\OneDrive\Documentos\Fuxion\RANGO_2_PROFESIONAL'
docs_json_path = r'c:\Users\yorze\OneDrive\Documentos\Fuxion\docs\menu-data-clean.json'

with open(docs_json_path, 'r', encoding='utf-8') as f:
    data = json.load(f)

wa_number = data['restaurant']['whatsapp']
restaurant_name = data['restaurant']['name']

# ==========================================
# CATEGORY A: ESTÉTICO
# ==========================================
cat_a_app_jsx = """import React, { useState } from 'react';
import data from '../../../docs/menu-data-clean.json';

const formatPrice = (price) => new Intl.NumberFormat('es-CR', { style: 'currency', currency: 'CRC', maximumFractionDigits: 0 }).format(price).replace('CRC', '₡').trim();

export default function App() {
  const { restaurant, categories, items } = data;
  const [activeTab, setActiveTab] = useState(categories[0].id);

  const activeItems = items.filter(i => i.category === activeTab);

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-gray-100 font-sans pb-24">
      {/* Header */}
      <header className="relative w-full h-64 bg-zinc-900 flex flex-col justify-end p-6 border-b border-white/10" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=2000&auto=format&fit=crop')", backgroundSize: 'cover', backgroundPosition: 'center' }}>
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent"></div>
        <div className="relative z-10">
          <h1 className="text-4xl font-black text-white mb-1">{restaurant.name}</h1>
          <p className="text-orange-400 font-semibold tracking-wide uppercase text-sm">{restaurant.location}</p>
          <div className="flex gap-3 mt-4">
            <a href="https://waze.com/ul?q=Fusion+Culinaria+Sabanilla" target="_blank" rel="noreferrer" className="bg-[#33ccff]/10 text-[#33ccff] border border-[#33ccff]/30 px-3 py-1.5 rounded-lg text-xs font-bold active:scale-95 transition-transform">Waze</a>
            <a href="https://www.google.com/maps/search/?api=1&query=Fusion+Culinaria+Sabanilla" target="_blank" rel="noreferrer" className="bg-[#ea4335]/10 text-[#ea4335] border border-[#ea4335]/30 px-3 py-1.5 rounded-lg text-xs font-bold active:scale-95 transition-transform">Google Maps</a>
          </div>
        </div>
      </header>

      {/* Tabs */}
      <nav className="sticky top-0 z-20 bg-black/80 backdrop-blur-md border-b border-white/10 p-4 overflow-x-auto no-scrollbar">
        <div className="flex gap-2">
          {categories.map(cat => (
            <button 
              key={cat.id} 
              onClick={() => setActiveTab(cat.id)}
              className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-bold transition-colors ${activeTab === cat.id ? 'bg-orange-600 text-white' : 'bg-white/5 text-gray-400 hover:text-white'}`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </nav>

      {/* Menu List */}
      <main className="p-4 max-w-3xl mx-auto space-y-4">
        {activeItems.map(item => (
          <article key={item.id} className="bg-white/5 rounded-2xl p-4 border border-white/5 flex flex-col gap-2">
            <div className="flex justify-between items-start gap-4">
              <h3 className="font-bold text-lg text-white">
                {item.name}
                {item.isNew && <span className="ml-2 bg-orange-500/20 text-orange-400 text-[10px] px-2 py-0.5 rounded uppercase border border-orange-500/30">Nuevo</span>}
              </h3>
              <span className="font-black text-orange-400">{formatPrice(item.price)}</span>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed">{item.description}</p>
          </article>
        ))}
      </main>

      {/* Global CTA */}
      <a 
        href={`https://wa.me/${restaurant.whatsapp}?text=${encodeURIComponent('Hola ' + restaurant.name + ', quisiera consultar sobre el menú.')}`} 
        className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[calc(100%-2rem)] max-w-sm bg-orange-600 text-white font-black uppercase tracking-wider p-4 rounded-2xl text-center shadow-[0_0_20px_rgba(234,88,12,0.3)] active:scale-95 transition-transform z-50"
      >
        Contactar por WhatsApp
      </a>
    </div>
  );
}
"""

# ==========================================
# CATEGORY B: PRE-PEDIDO WHATSAPP
# ==========================================
cat_b_app_jsx = """import React, { useState } from 'react';
import data from '../../../docs/menu-data-clean.json';

const formatPrice = (price) => new Intl.NumberFormat('es-CR', { style: 'currency', currency: 'CRC', maximumFractionDigits: 0 }).format(price).replace('CRC', '₡').trim();

export default function App() {
  const { restaurant, categories, items } = data;
  const [activeTab, setActiveTab] = useState(categories[0].id);
  const [cart, setCart] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [itemOptions, setItemOptions] = useState({});

  const activeItems = items.filter(i => i.category === activeTab);
  const cartTotal = cart.reduce((sum, item) => sum + item.totalPrice, 0);

  const handleOptionChange = (optionId, choice, isMulti) => {
    setItemOptions(prev => {
      const current = { ...prev };
      if (isMulti) {
        const currentChoices = current[optionId] || [];
        if (currentChoices.some(c => c.id === choice.id)) {
          current[optionId] = currentChoices.filter(c => c.id !== choice.id);
        } else {
          current[optionId] = [...currentChoices, choice];
        }
      } else {
        current[optionId] = [choice];
      }
      return current;
    });
  };

  const calculateItemTotal = () => {
    if (!selectedItem) return 0;
    let total = selectedItem.price;
    Object.values(itemOptions).forEach(choices => {
      choices.forEach(c => total += (c.priceDelta || 0));
    });
    return total;
  };

  const addToCart = () => {
    if (!selectedItem) return;
    
    // Quick validation for required fields
    const missingRequired = selectedItem.options?.find(opt => opt.required && (!itemOptions[opt.id] || itemOptions[opt.id].length === 0));
    if (missingRequired) {
      alert(`Por favor selecciona una opción para: ${missingRequired.name}`);
      return;
    }

    setCart(prev => [...prev, {
      id: Math.random().toString(36).substr(2, 9),
      product: selectedItem,
      options: itemOptions,
      totalPrice: calculateItemTotal()
    }]);
    setSelectedItem(null);
    setItemOptions({});
  };

  const sendOrder = () => {
    let msg = `Hola *${restaurant.name}*, me gustaría ordenar:\\n\\n`;
    cart.forEach(item => {
      msg += `▪️ 1x ${item.product.name} - ${formatPrice(item.totalPrice)}\\n`;
      Object.keys(item.options).forEach(optId => {
        const optDef = item.product.options.find(o => o.id === optId);
        if (optDef) {
          const choices = item.options[optId].map(c => c.name).join(', ');
          msg += `   └ ${optDef.name}: ${choices}\\n`;
        }
      });
    });
    msg += `\\n*Total: ${formatPrice(cartTotal)}*`;
    
    window.location.href = `https://wa.me/${restaurant.whatsapp}?text=${encodeURIComponent(msg)}`;
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-gray-100 font-sans pb-32">
      {/* Header */}
      <header className="p-6 pt-10 text-center border-b border-white/10 bg-zinc-900">
        <h1 className="text-3xl font-black text-white">{restaurant.name}</h1>
        <p className="text-orange-500 font-semibold text-sm uppercase mt-1">Menú & Pedidos</p>
      </header>

      {/* Tabs */}
      <nav className="sticky top-0 z-20 bg-black/90 backdrop-blur-md border-b border-white/10 p-3 overflow-x-auto no-scrollbar">
        <div className="flex gap-2">
          {categories.map(cat => (
            <button 
              key={cat.id} 
              onClick={() => setActiveTab(cat.id)}
              className={`whitespace-nowrap px-4 py-2 rounded-xl text-sm font-bold transition-all ${activeTab === cat.id ? 'bg-orange-600 text-white shadow-lg shadow-orange-600/20' : 'bg-zinc-800 text-gray-400'}`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </nav>

      {/* Menu List */}
      <main className="p-4 max-w-lg mx-auto space-y-4">
        {activeItems.map(item => (
          <article key={item.id} onClick={() => { setSelectedItem(item); setItemOptions({}); }} className="bg-zinc-900 rounded-2xl p-4 border border-zinc-800 flex flex-col gap-2 cursor-pointer active:scale-[0.98] transition-transform">
            <div className="flex justify-between items-start gap-4">
              <h3 className="font-bold text-lg text-white">{item.name}</h3>
              <span className="font-black text-orange-400 bg-orange-400/10 px-2 py-1 rounded-lg">{formatPrice(item.price)}</span>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed line-clamp-2">{item.description}</p>
            <button className="mt-2 text-sm font-bold text-orange-500 flex items-center gap-1">+ Agregar al pedido</button>
          </article>
        ))}
      </main>

      {/* Options Modal */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex justify-center items-end sm:items-center">
          <div className="bg-zinc-900 w-full max-w-lg sm:rounded-2xl rounded-t-3xl h-[85vh] sm:h-[80vh] flex flex-col overflow-hidden animate-slide-up">
            <div className="p-4 flex justify-between items-center border-b border-zinc-800 bg-black/20">
              <h2 className="font-black text-xl">{selectedItem.name}</h2>
              <button onClick={() => setSelectedItem(null)} className="w-8 h-8 bg-zinc-800 rounded-full flex items-center justify-center font-bold text-gray-400">✕</button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-6">
              <p className="text-gray-400">{selectedItem.description}</p>
              
              {selectedItem.options?.map(opt => (
                <div key={opt.id} className="space-y-3">
                  <div className="flex justify-between items-end">
                    <h4 className="font-bold text-white text-lg">{opt.name}</h4>
                    {opt.required && <span className="text-xs bg-orange-500/20 text-orange-400 px-2 py-0.5 rounded font-bold uppercase tracking-wider">Obligatorio</span>}
                  </div>
                  <div className="space-y-2">
                    {opt.choices.map(choice => {
                      const isMulti = opt.type === 'multi';
                      const isSelected = itemOptions[opt.id]?.some(c => c.id === choice.id);
                      return (
                        <label key={choice.id} className={`flex items-center justify-between p-3 rounded-xl border ${isSelected ? 'border-orange-500 bg-orange-500/10' : 'border-zinc-800 bg-zinc-800/50'} cursor-pointer transition-colors`}>
                          <div className="flex items-center gap-3">
                            <div className={`w-5 h-5 flex items-center justify-center border rounded ${isMulti ? 'rounded-md' : 'rounded-full'} ${isSelected ? 'border-orange-500 bg-orange-500 text-white' : 'border-gray-500'}`}>
                              {isSelected && <span className="text-[10px]">✔</span>}
                            </div>
                            <span className="font-medium text-gray-200">{choice.name}</span>
                          </div>
                          {choice.priceDelta > 0 && <span className="text-sm font-bold text-gray-400">+{formatPrice(choice.priceDelta)}</span>}
                          <input 
                            type={isMulti ? "checkbox" : "radio"} 
                            name={opt.id} 
                            className="hidden" 
                            checked={!!isSelected}
                            onChange={() => handleOptionChange(opt.id, choice, isMulti)}
                          />
                        </label>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
            <div className="p-4 border-t border-zinc-800 bg-zinc-950">
              <button onClick={addToCart} className="w-full bg-orange-600 text-white font-black p-4 rounded-xl flex justify-between items-center active:scale-95 transition-transform">
                <span>Agregar al pedido</span>
                <span>{formatPrice(calculateItemTotal())}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Cart Global CTA */}
      {cart.length > 0 && (
        <div className="fixed bottom-0 left-0 w-full p-4 bg-gradient-to-t from-black via-black/90 to-transparent z-40">
          <button 
            onClick={sendOrder}
            className="w-full max-w-lg mx-auto bg-green-600 text-white font-black p-4 rounded-2xl flex justify-between items-center shadow-[0_0_30px_rgba(22,163,74,0.3)] active:scale-95 transition-transform"
          >
            <div className="flex items-center gap-3">
              <span className="bg-black/30 w-8 h-8 rounded-full flex items-center justify-center text-sm">{cart.length}</span>
              <span className="uppercase tracking-wider">Enviar a WhatsApp</span>
            </div>
            <span className="text-lg">{formatPrice(cartTotal)}</span>
          </button>
        </div>
      )}
    </div>
  );
}
"""

# ==========================================
# CATEGORY C: COMBO MARCA
# ==========================================
cat_c_app_jsx = cat_b_app_jsx  # Functionality is the same as B

cat_c_index_html = f"""<!doctype html>
<html lang="es-CR">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <!-- SEO METADATA COMPLETA -->
    <title>{restaurant_name} | Pedidos Online</title>
    <meta name="description" content="Haz tu pedido online en {restaurant_name}. Disfruta de las mejores hamburguesas y combos express en Sabanilla." />
    <meta name="keywords" content="hamburguesas, restaurante, {restaurant_name}, comida rápida, delivery, Sabanilla, Costa Rica" />
    <meta name="author" content="{restaurant_name}" />
    
    <!-- Open Graph / Facebook -->
    <meta property="og:type" content="website" />
    <meta property="og:title" content="{restaurant_name} | Pedidos Online" />
    <meta property="og:description" content="Haz tu pedido online en {restaurant_name}. Disfruta de las mejores hamburguesas y combos express en Sabanilla." />
    <meta property="og:image" content="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=1200&auto=format&fit=crop" />
    
    <!-- Twitter -->
    <meta property="twitter:card" content="summary_large_image" />
    <meta property="twitter:title" content="{restaurant_name} | Pedidos Online" />
    <meta property="twitter:description" content="Haz tu pedido online en {restaurant_name}. Disfruta de las mejores hamburguesas." />
    
    <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet">
    <script src="https://cdn.tailwindcss.com"></script>
    <script>
      tailwind.config = {{
        theme: {{
          extend: {{
            fontFamily: {{
              sans: ['Outfit', 'sans-serif'],
            }}
          }}
        }}
      }}
    </script>
    <style>
      .no-scrollbar::-webkit-scrollbar {{ display: none; }}
      .no-scrollbar {{ -ms-overflow-style: none; scrollbar-width: none; }}
      @keyframes slideUp {{ from {{ transform: translateY(100%); }} to {{ transform: translateY(0); }} }}
      .animate-slide-up {{ animation: slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1); }}
    </style>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
"""

# Common dependencies and styles for Category A and B
common_index_html = f"""<!doctype html>
<html lang="es-CR">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>{restaurant_name} | Menú</title>
    <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet">
    <script src="https://cdn.tailwindcss.com"></script>
    <script>
      tailwind.config = {{ theme: {{ extend: {{ fontFamily: {{ sans: ['Outfit', 'sans-serif'] }} }} }} }}
    </script>
    <style>
      .no-scrollbar::-webkit-scrollbar {{ display: none; }}
      .no-scrollbar {{ -ms-overflow-style: none; scrollbar-width: none; }}
      @keyframes slideUp {{ from {{ transform: translateY(100%); }} to {{ transform: translateY(0); }} }}
      .animate-slide-up {{ animation: slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1); }}
    </style>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
"""

vercel_json = """{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}"""

redirects_content = "/*    /index.html   200\n"

# Writing Cat A
with open(os.path.join(base_path, 'CATEGORIA_A_ESTETICO', 'src', 'App.jsx'), 'w', encoding='utf-8') as f:
    f.write(cat_a_app_jsx)
with open(os.path.join(base_path, 'CATEGORIA_A_ESTETICO', 'index.html'), 'w', encoding='utf-8') as f:
    f.write(common_index_html)

# Writing Cat B
with open(os.path.join(base_path, 'CATEGORIA_B_PRE_PEDIDO_WHATSAPP', 'src', 'App.jsx'), 'w', encoding='utf-8') as f:
    f.write(cat_b_app_jsx)
with open(os.path.join(base_path, 'CATEGORIA_B_PRE_PEDIDO_WHATSAPP', 'index.html'), 'w', encoding='utf-8') as f:
    f.write(common_index_html)

# Writing Cat C
with open(os.path.join(base_path, 'CATEGORIA_C_COMBO_MARCA', 'src', 'App.jsx'), 'w', encoding='utf-8') as f:
    f.write(cat_c_app_jsx)
with open(os.path.join(base_path, 'CATEGORIA_C_COMBO_MARCA', 'index.html'), 'w', encoding='utf-8') as f:
    f.write(cat_c_index_html)
with open(os.path.join(base_path, 'CATEGORIA_C_COMBO_MARCA', 'vercel.json'), 'w', encoding='utf-8') as f:
    f.write(vercel_json)
with open(os.path.join(base_path, 'CATEGORIA_C_COMBO_MARCA', 'public', '_redirects'), 'w', encoding='utf-8') as f:
    f.write(redirects_content)

print("Phase 2 generated successfully.")
