import os
import json

base_path = r'c:\Users\yorze\OneDrive\Documentos\Fuxion\RANGO_3_PREMIUM\CATEGORIA_A_AUTOR'
docs_json_path = r'c:\Users\yorze\OneDrive\Documentos\Fuxion\docs\menu-data-clean.json'

with open(docs_json_path, 'r', encoding='utf-8') as f:
    data = json.load(f)

restaurant_name = data['restaurant']['name']

index_html = f"""<!doctype html>
<html lang="es-CR">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>{restaurant_name} | Menú de Autor</title>
    <!-- Fonts for Luxury Editorial Look -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;0,700;1,400&family=Montserrat:wght@300;400;500;600&display=swap" rel="stylesheet">
    
    <script src="https://cdn.tailwindcss.com"></script>
    <script>
      tailwind.config = {{
        theme: {{
          extend: {{
            fontFamily: {{
              serif: ['Cormorant Garamond', 'serif'],
              sans: ['Montserrat', 'sans-serif'],
            }},
            colors: {{
              luxury: {{
                dark: '#0c0c0c',
                gold: '#d4af37',
                light: '#f9f9f9',
                muted: '#8c8c8c'
              }}
            }},
            animation: {{
              'fade-in-up': 'fadeInUp 1s ease-out forwards',
              'slow-pan': 'slowPan 30s linear infinite',
            }},
            keyframes: {{
              fadeInUp: {{
                '0%': {{ opacity: '0', transform: 'translateY(30px)' }},
                '100%': {{ opacity: '1', transform: 'translateY(0)' }},
              }},
              slowPan: {{
                '0%': {{ transform: 'scale(1.05) translate(0, 0)' }},
                '50%': {{ transform: 'scale(1.1) translate(-2%, 2%)' }},
                '100%': {{ transform: 'scale(1.05) translate(0, 0)' }},
              }}
            }}
          }}
        }}
      }}
    </script>
    <style>
      .no-scrollbar::-webkit-scrollbar {{ display: none; }}
      .no-scrollbar {{ -ms-overflow-style: none; scrollbar-width: none; }}
      
      .stagger-1 {{ animation-delay: 0.1s; opacity: 0; }}
      .stagger-2 {{ animation-delay: 0.3s; opacity: 0; }}
      .stagger-3 {{ animation-delay: 0.5s; opacity: 0; }}
      .stagger-4 {{ animation-delay: 0.7s; opacity: 0; }}
      
      /* Subtle noise texture for luxury feel */
      .bg-noise {{
        position: relative;
      }}
      .bg-noise::before {{
        content: "";
        position: absolute;
        top: 0; left: 0; width: 100%; height: 100%;
        background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
        opacity: 0.03;
        pointer-events: none;
        z-index: 50;
      }}
      
      .glass-card {{
        background: rgba(12, 12, 12, 0.4);
        backdrop-filter: blur(16px);
        -webkit-backdrop-filter: blur(16px);
        border: 1px solid rgba(212, 175, 55, 0.15);
      }}
    </style>
  </head>
  <body class="bg-luxury-dark text-luxury-light font-sans bg-noise selection:bg-luxury-gold selection:text-black">
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
"""

app_jsx = """import React, { useState, useEffect } from 'react';
import data from '../../../docs/menu-data-clean.json';

const formatPrice = (price) => new Intl.NumberFormat('es-CR', { style: 'currency', currency: 'CRC', maximumFractionDigits: 0 }).format(price).replace('CRC', '₡').trim();

// High quality placeholders mapped to categories for editorial feel
const categoryImages = {
  "entradas": "https://images.unsplash.com/photo-1541544741938-0af808871cc0?q=80&w=1000&auto=format&fit=crop",
  "hamburguesas": "https://images.unsplash.com/photo-1550547660-d9450f859349?q=80&w=1000&auto=format&fit=crop",
  "platos-fuertes": "https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=1000&auto=format&fit=crop",
  "combos-express": "https://images.unsplash.com/photo-1610440042657-612c34d95e9f?q=80&w=1000&auto=format&fit=crop",
  "bebidas": "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?q=80&w=1000&auto=format&fit=crop"
};

export default function App() {
  const { restaurant, categories, items } = data;
  const [activeCat, setActiveCat] = useState(categories[0].id);
  const [scrolled, setScrolled] = useState(false);
  const [animKey, setAnimKey] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Re-trigger animation on tab change
  const handleTabChange = (id) => {
    setActiveCat(id);
    setAnimKey(prev => prev + 1);
  };

  const currentItems = items.filter(i => i.category === activeCat);
  const currentImage = categoryImages[activeCat] || "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?q=80&w=1000&auto=format&fit=crop";

  return (
    <div className="relative min-h-screen">
      
      {/* Editorial Hero Banner */}
      <section className="relative h-[85vh] w-full overflow-hidden flex items-center justify-center">
        <div className="absolute inset-0 z-0 overflow-hidden">
          <img 
            src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?q=80&w=2000&auto=format&fit=crop" 
            className="w-full h-full object-cover animate-slow-pan opacity-60"
            alt="Hero Background"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-luxury-dark/40 via-luxury-dark/60 to-luxury-dark"></div>
        </div>
        
        <div className="relative z-10 text-center flex flex-col items-center px-6">
          <p className="text-luxury-gold uppercase tracking-[0.3em] text-xs mb-4 font-semibold animate-fade-in-up stagger-1">Menú de Autor</p>
          <h1 className="font-serif text-6xl md:text-8xl font-medium tracking-tight mb-6 animate-fade-in-up stagger-2">
            {restaurant.name}
          </h1>
          <div className="w-12 h-px bg-luxury-gold/50 mb-6 animate-fade-in-up stagger-3"></div>
          <p className="text-luxury-light/70 font-light max-w-md text-sm leading-relaxed mb-8 animate-fade-in-up stagger-3">
            Una experiencia gastronómica que fusiona la tradición con la innovación culinaria, diseñada para cautivar todos los sentidos.
          </p>
          <div className="flex gap-4 animate-fade-in-up stagger-4">
            <a href="https://waze.com/ul?q=Fusion+Culinaria+Sabanilla" target="_blank" rel="noreferrer" className="text-xs tracking-widest uppercase border border-luxury-gold/30 hover:border-luxury-gold hover:bg-luxury-gold hover:text-luxury-dark text-luxury-gold px-6 py-3 transition-all duration-500">
              Ubicación Waze
            </a>
            <a href="https://www.google.com/maps/search/?api=1&query=Fusion+Culinaria+Sabanilla" target="_blank" rel="noreferrer" className="text-xs tracking-widest uppercase border border-luxury-gold/30 hover:border-luxury-gold hover:bg-luxury-gold hover:text-luxury-dark text-luxury-gold px-6 py-3 transition-all duration-500">
              Google Maps
            </a>
          </div>
        </div>
      </section>

      {/* Sticky Navigation */}
      <nav className={`sticky top-0 z-40 transition-all duration-500 ${scrolled ? 'bg-luxury-dark/95 backdrop-blur-xl border-b border-luxury-gold/10 py-4 shadow-2xl' : 'bg-transparent py-6'}`}>
        <div className="max-w-6xl mx-auto px-6 overflow-x-auto no-scrollbar">
          <ul className="flex space-x-12 justify-start md:justify-center min-w-max">
            {categories.map(cat => (
              <li key={cat.id}>
                <button 
                  onClick={() => handleTabChange(cat.id)}
                  className={`uppercase tracking-[0.2em] text-[10px] sm:text-xs font-semibold transition-all duration-300 relative ${activeCat === cat.id ? 'text-luxury-gold' : 'text-luxury-muted hover:text-luxury-light'}`}
                >
                  {cat.name}
                  <span className={`absolute -bottom-2 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-luxury-gold transition-all duration-300 ${activeCat === cat.id ? 'opacity-100 scale-100' : 'opacity-0 scale-0'}`}></span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      {/* Editorial Content Layout */}
      <main className="max-w-7xl mx-auto px-6 py-20 lg:py-32 grid lg:grid-cols-12 gap-16 items-start relative z-10" key={animKey}>
        
        {/* Left: Sticky Image Showcase */}
        <div className="hidden lg:block lg:col-span-5 sticky top-32 animate-fade-in-up">
          <div className="relative rounded-t-[100px] rounded-b-sm overflow-hidden aspect-[3/4] p-2 border border-luxury-gold/20">
            <img 
              src={currentImage} 
              alt={categories.find(c => c.id === activeCat)?.name} 
              className="w-full h-full object-cover rounded-t-[90px] rounded-b-sm filter brightness-90 contrast-125 transition-all duration-1000"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-luxury-dark via-transparent to-transparent opacity-60"></div>
          </div>
        </div>

        {/* Right: Menu Items List */}
        <div className="lg:col-span-7 space-y-16 mt-8 lg:mt-0">
          <div className="animate-fade-in-up stagger-1">
            <h2 className="font-serif text-4xl md:text-5xl text-luxury-light mb-2">{categories.find(c => c.id === activeCat)?.name}</h2>
            <div className="w-8 h-px bg-luxury-gold"></div>
          </div>

          <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-1">
            {currentItems.map((item, index) => (
              <article key={item.id} className={`group animate-fade-in-up`} style={{ animationDelay: `${(index + 2) * 0.15}s` }}>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-3">
                  <h3 className="font-serif text-xl md:text-2xl text-luxury-light group-hover:text-luxury-gold transition-colors flex items-center gap-3">
                    {item.name}
                    {item.isRecommended && <span className="text-[9px] font-sans tracking-[0.2em] uppercase text-luxury-dark bg-luxury-gold px-2 py-1 rounded-sm">Chef</span>}
                  </h3>
                  <div className="hidden sm:block flex-1 border-b border-dashed border-luxury-muted/30 mx-4 relative top-[-6px]"></div>
                  <span className="font-sans font-light tracking-wider text-luxury-gold whitespace-nowrap text-lg">
                    {formatPrice(item.price)}
                  </span>
                </div>
                <p className="text-sm font-light text-luxury-muted leading-relaxed max-w-xl">
                  {item.description}
                </p>
                
                {/* Visual indicator for interactive items (Carrito not active, but hints at depth) */}
                {item.options && item.options.length > 0 && (
                  <p className="mt-4 text-[10px] uppercase tracking-widest text-luxury-gold/50 font-semibold flex items-center gap-2">
                    <span className="w-3 h-px bg-luxury-gold/50"></span>
                    Opciones Disponibles
                  </p>
                )}
              </article>
            ))}
          </div>
        </div>

      </main>

      {/* Floating CTA with Glassmorphism */}
      <div className="fixed bottom-8 right-8 z-50 animate-fade-in-up" style={{ animationDelay: '1s' }}>
        <a 
          href={`https://wa.me/${restaurant.whatsapp}?text=${encodeURIComponent('Hola ' + restaurant.name + ', quisiera reservar una mesa o consultar el menú de autor.')}`} 
          className="glass-card flex items-center gap-4 px-6 py-4 rounded-full text-luxury-gold hover:bg-luxury-gold hover:text-luxury-dark transition-all duration-500 shadow-[0_10px_40px_rgba(212,175,55,0.15)] hover:shadow-[0_10px_40px_rgba(212,175,55,0.3)] hover:-translate-y-1"
        >
          <span className="text-xs uppercase tracking-widest font-semibold">Reservar / Consultar</span>
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/></svg>
        </a>
      </div>
    </div>
  );
}
"""

with open(os.path.join(base_path, 'index.html'), 'w', encoding='utf-8') as f:
    f.write(index_html)
with open(os.path.join(base_path, 'src', 'App.jsx'), 'w', encoding='utf-8') as f:
    f.write(app_jsx)

print("Phase 3 generated successfully.")
