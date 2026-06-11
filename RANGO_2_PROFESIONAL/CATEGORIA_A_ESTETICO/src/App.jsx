import React, { useState } from 'react';
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
        target="_blank"
        rel="noreferrer"
        className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[calc(100%-2rem)] max-w-sm bg-orange-600 text-white font-black uppercase tracking-wider p-4 rounded-2xl text-center shadow-[0_0_20px_rgba(234,88,12,0.3)] active:scale-95 transition-transform z-50"
      >
        Contactar por WhatsApp
      </a>
    </div>
  );
}
