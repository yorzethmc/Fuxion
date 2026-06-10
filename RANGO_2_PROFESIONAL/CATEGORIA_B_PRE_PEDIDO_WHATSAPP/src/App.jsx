import React, { useState } from 'react';
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
    let msg = `Hola *${restaurant.name}*, me gustaría ordenar:\n\n`;
    cart.forEach(item => {
      msg += `▪️ 1x ${item.product.name} - ${formatPrice(item.totalPrice)}\n`;
      Object.keys(item.options).forEach(optId => {
        const optDef = item.product.options.find(o => o.id === optId);
        if (optDef) {
          const choices = item.options[optId].map(c => c.name).join(', ');
          msg += `   └ ${optDef.name}: ${choices}\n`;
        }
      });
    });
    msg += `\n*Total: ${formatPrice(cartTotal)}*`;
    
    window.open(`https://wa.me/${restaurant.whatsapp}?text=${encodeURIComponent(msg)}`, "_blank");
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
