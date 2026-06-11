import React, { useState, useEffect } from 'react';
import data from '../../../docs/menu-data-clean.json';

const formatPrice = (price) => new Intl.NumberFormat('es-CR', { style: 'currency', currency: 'CRC', maximumFractionDigits: 0 }).format(price).replace('CRC', '₡').trim();

// Imágenes curadas para la experiencia editorial
const categoryImages = {
  "entradas": "https://images.unsplash.com/photo-1541544741938-0af808871cc0?q=80&w=2000&auto=format&fit=crop",
  "hamburguesas": "https://images.unsplash.com/photo-1550547660-d9450f859349?q=80&w=2000&auto=format&fit=crop",
  "cortes-de-carne": "https://images.unsplash.com/photo-1558030006-450675393462?q=80&w=2000&auto=format&fit=crop",
  "bebidas": "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?q=80&w=2000&auto=format&fit=crop",
  "postres": "https://images.unsplash.com/photo-1551024506-0cb4a169289a?q=80&w=2000&auto=format&fit=crop"
};
const defaultImage = "https://images.unsplash.com/photo-1514933651103-005eec06c04b?q=80&w=2000&auto=format&fit=crop";

export default function App() {
  const { restaurant, categories, items } = data;
  const [activeTab, setActiveTab] = useState(categories[0].id);
  const [animKey, setAnimKey] = useState(0);

  // Cart State
  const [cart, setCart] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [itemOptions, setItemOptions] = useState({});
  const [itemNotes, setItemNotes] = useState("");

  // Checkout State
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [orderType, setOrderType] = useState('local'); // local, llevar, express
  const [paymentMethod, setPaymentMethod] = useState('sinpe'); // sinpe, efectivo
  const [cashAmount, setCashAmount] = useState('');
  const [customerInfo, setCustomerInfo] = useState({ name: '', phone: '', address: '' });

  const activeItems = items.filter(i => i.category === activeTab);
  const cartTotal = cart.reduce((sum, item) => sum + item.totalPrice, 0);

  useEffect(() => { setAnimKey(prev => prev + 1); }, [activeTab]);

  const handleOptionChange = (optionId, choice, isMulti) => {
    setItemOptions(prev => {
      const current = { ...prev };
      if (isMulti) {
        const currentChoices = current[optionId] || [];
        if (currentChoices.some(c => c.id === choice.id)) current[optionId] = currentChoices.filter(c => c.id !== choice.id);
        else current[optionId] = [...currentChoices, choice];
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
    const missingRequired = selectedItem.options?.find(opt => opt.required && (!itemOptions[opt.id] || itemOptions[opt.id].length === 0));
    if (missingRequired) return alert(`Por favor selecciona una opción para: ${missingRequired.name}`);

    setCart(prev => [...prev, {
      id: Math.random().toString(36).substr(2, 9),
      product: selectedItem,
      options: itemOptions,
      notes: itemNotes,
      totalPrice: calculateItemTotal()
    }]);
    setSelectedItem(null);
    setItemOptions({});
    setItemNotes("");
  };

  const generateCommand = () => {
    // Ticket Formatting (No Emojis, professional POS layout)
    let ticket = `=================================\n`;
    ticket += `       ${restaurant.name.toUpperCase()}       \n`;
    ticket += `        NUEVA ORDEN        \n`;
    ticket += `=================================\n\n`;

    ticket += `CLIENTE: ${customerInfo.name || 'No especificado'}\n`;
    ticket += `TIPO: ${orderType.toUpperCase()}\n`;
    if(orderType === 'express') ticket += `DIRECCION: ${customerInfo.address || 'No especificada'}\n`;
    ticket += `PAGO: ${paymentMethod.toUpperCase()}\n`;
    if(paymentMethod === 'efectivo' && orderType === 'express') {
      ticket += `PAGA CON: ${formatPrice(cashAmount || cartTotal)}\n`;
      ticket += `CAMBIO: ${formatPrice(Math.max(0, (parseFloat(cashAmount) || cartTotal) - cartTotal))}\n`;
    }
    ticket += `\n---------------------------------\n`;

    // Group by category
    const itemsByCategory = {};
    cart.forEach(item => {
      const cat = categories.find(c => c.id === item.product.category)?.name || 'OTROS';
      if(!itemsByCategory[cat]) itemsByCategory[cat] = [];
      itemsByCategory[cat].push(item);
    });

    Object.keys(itemsByCategory).forEach(cat => {
      ticket += `[ ${cat.toUpperCase()} ]\n`;
      itemsByCategory[cat].forEach(item => {
        ticket += `1x ${item.product.name} - ${formatPrice(item.totalPrice)}\n`;
        
        Object.keys(item.options).forEach(optId => {
          const optDef = item.product.options.find(o => o.id === optId);
          if (optDef) {
            const choices = item.options[optId].map(c => c.name).join(', ');
            ticket += `   -> ${optDef.name}: ${choices}\n`;
          }
        });

        if(item.notes && item.notes.trim() !== "") {
          ticket += `   ** NOTA: ${item.notes.trim()} **\n`;
        }
      });
      ticket += `\n`;
    });

    ticket += `---------------------------------\n`;
    ticket += `TOTAL A PAGAR: ${formatPrice(cartTotal)}\n`;
    ticket += `=================================\n`;

    window.open(`https://wa.me/${restaurant.whatsapp}?text=${encodeURIComponent(ticket)}`, '_blank');
  };

  return (
    <div className="relative min-h-screen bg-luxury-dark text-luxury-light font-sans bg-noise overflow-x-hidden selection:bg-luxury-gold selection:text-black">
      
      {/* Header Fijo */}
      <header className="fixed top-0 w-full z-40 glass-card px-8 py-6 flex justify-between items-center transition-all duration-500">
        <h1 className="font-serif text-3xl md:text-4xl tracking-wide uppercase text-white drop-shadow-md">
          {restaurant.name}
        </h1>
        <div className="flex gap-4">
            <button onClick={() => setIsCheckoutOpen(true)} className="flex items-center gap-3 text-luxury-gold border border-luxury-gold/30 px-6 py-2 rounded-full hover:bg-luxury-gold hover:text-black transition-all">
                <span className="text-xs font-bold tracking-widest uppercase">Ver Orden ({cart.length})</span>
                <span className="font-serif font-bold">{formatPrice(cartTotal)}</span>
            </button>
        </div>
      </header>

      {/* Navegación por Categorías */}
      <nav className="fixed left-8 top-1/2 -translate-y-1/2 z-30 hidden lg:flex flex-col gap-6">
        {categories.map(cat => (
          <button 
            key={cat.id} 
            onClick={() => setActiveTab(cat.id)}
            className={`text-xs uppercase tracking-[0.3em] transition-all duration-500 ${activeTab === cat.id ? 'text-luxury-gold scale-110 translate-x-4' : 'text-luxury-muted hover:text-white'}`}
          >
            {cat.name}
          </button>
        ))}
      </nav>

      <main className="max-w-7xl mx-auto px-6 pt-32 pb-32 lg:pl-48 lg:grid-cols-12 gap-16 relative z-10" key={animKey}>
        <div className="lg:col-span-7 space-y-16">
            <h2 className="font-serif text-6xl text-luxury-gold opacity-90 animate-fade-in-up">{categories.find(c => c.id === activeTab)?.name}</h2>
            
            <div className="space-y-12">
                {activeItems.map((item, index) => (
                <article key={item.id} className="group animate-fade-in-up cursor-pointer" style={{ animationDelay: `${(index + 1) * 0.1}s` }} onClick={() => { setSelectedItem(item); setItemOptions({}); setItemNotes(""); }}>
                    <div className="flex justify-between items-baseline mb-3">
                        <h3 className="font-serif text-2xl md:text-3xl text-luxury-light group-hover:text-luxury-gold transition-colors duration-300">
                            {item.name}
                        </h3>
                        <div className="flex-1 border-b border-luxury-muted/20 mx-4 border-dashed relative top-[-6px]"></div>
                        <span className="font-sans text-luxury-gold text-lg tracking-wider">{formatPrice(item.price)}</span>
                    </div>
                    <p className="text-luxury-muted font-light leading-relaxed max-w-2xl text-sm tracking-wide">{item.description}</p>
                </article>
                ))}
            </div>
        </div>
      </main>

      {/* Modal de Personalización de Platillo */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex justify-center items-center p-4">
          <div className="bg-[#111] border border-white/10 w-full max-w-2xl rounded-sm p-8 max-h-[90vh] overflow-y-auto animate-fade-in-up relative">
            <button onClick={() => setSelectedItem(null)} className="absolute top-6 right-6 text-luxury-muted hover:text-white text-2xl font-light">✕</button>
            <h2 className="font-serif text-4xl text-luxury-gold mb-2">{selectedItem.name}</h2>
            <p className="text-luxury-muted mb-8">{selectedItem.description}</p>

            {/* Opciones del Item */}
            {selectedItem.options?.map(opt => (
                <div key={opt.id} className="mb-8">
                  <div className="flex justify-between items-baseline mb-4">
                    <h4 className="font-serif text-xl tracking-wide uppercase text-white">{opt.name}</h4>
                    {opt.required && <span className="text-[10px] tracking-widest text-luxury-gold uppercase border border-luxury-gold/30 px-2 py-1">Requerido</span>}
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {opt.choices.map(choice => {
                      const isMulti = opt.type === 'multi';
                      const isSelected = itemOptions[opt.id]?.some(c => c.id === choice.id);
                      return (
                        <label key={choice.id} className={`flex items-center justify-between p-4 border transition-all cursor-pointer ${isSelected ? 'border-luxury-gold bg-luxury-gold/10 text-white' : 'border-white/10 text-luxury-muted hover:border-white/30'}`}>
                          <div className="flex items-center gap-3">
                            <div className={`w-4 h-4 flex items-center justify-center border ${isMulti ? 'rounded-sm' : 'rounded-full'} ${isSelected ? 'border-luxury-gold bg-luxury-gold' : 'border-luxury-muted'}`}></div>
                            <span className="text-sm uppercase tracking-wider">{choice.name}</span>
                          </div>
                          {choice.priceDelta > 0 && <span className="text-xs text-luxury-gold font-bold">+{formatPrice(choice.priceDelta)}</span>}
                          <input type={isMulti ? "checkbox" : "radio"} className="hidden" checked={!!isSelected} onChange={() => handleOptionChange(opt.id, choice, isMulti)} />
                        </label>
                      );
                    })}
                  </div>
                </div>
            ))}

            {/* Exclusiones / Notas de Ingredientes */}
            <div className="mb-10">
                <h4 className="font-serif text-xl tracking-wide uppercase text-white mb-4">Instrucciones Especiales</h4>
                <textarea 
                    value={itemNotes} 
                    onChange={e => setItemNotes(e.target.value)}
                    placeholder="Ej. Sin cebolla, aderezo aparte, bien cocido..."
                    className="w-full bg-black/50 border border-white/10 text-white p-4 text-sm focus:outline-none focus:border-luxury-gold resize-none h-24"
                ></textarea>
            </div>

            <button onClick={addToCart} className="w-full bg-luxury-gold text-black font-bold uppercase tracking-widest py-5 flex justify-between px-8 hover:bg-white transition-colors">
                <span>Agregar a la Orden</span>
                <span>{formatPrice(calculateItemTotal())}</span>
            </button>
          </div>
        </div>
      )}

      {/* Modal de Checkout */}
      {isCheckoutOpen && (
        <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-lg flex justify-center items-center p-4">
          <div className="bg-[#111] border border-white/10 w-full max-w-xl p-8 max-h-[90vh] overflow-y-auto relative animate-fade-in-up">
            <button onClick={() => setIsCheckoutOpen(false)} className="absolute top-6 right-6 text-luxury-muted hover:text-white text-2xl font-light">✕</button>
            <h2 className="font-serif text-3xl text-luxury-gold mb-8 uppercase tracking-widest text-center">Checkout</h2>
            
            {cart.length === 0 ? (
                <p className="text-center text-luxury-muted py-12">Tu orden está vacía.</p>
            ) : (
                <div className="space-y-8">
                    {/* Lista de Items */}
                    <div className="space-y-4">
                        {cart.map(item => (
                            <div key={item.id} className="flex justify-between items-start border-b border-white/5 pb-4">
                                <div>
                                    <h4 className="font-bold text-white text-sm">{item.product.name}</h4>
                                    {Object.values(item.options).flat().map(o => <p key={o.id} className="text-xs text-luxury-muted">+ {o.name}</p>)}
                                    {item.notes && <p className="text-xs text-red-400 mt-1 italic">Nota: {item.notes}</p>}
                                </div>
                                <span className="text-luxury-gold text-sm font-bold">{formatPrice(item.totalPrice)}</span>
                            </div>
                        ))}
                    </div>

                    {/* Tipo de Orden */}
                    <div>
                        <h4 className="text-xs uppercase tracking-widest text-luxury-muted mb-3">Tipo de Orden</h4>
                        <div className="grid grid-cols-3 gap-2">
                            {['local', 'llevar', 'express'].map(t => (
                                <button key={t} onClick={() => setOrderType(t)} className={`py-3 text-xs uppercase tracking-widest font-bold border transition-colors ${orderType === t ? 'bg-white text-black border-white' : 'border-white/20 text-white hover:border-luxury-gold'}`}>{t}</button>
                            ))}
                        </div>
                    </div>

                    {/* Datos del Cliente */}
                    <div className="space-y-3">
                        <input type="text" placeholder="Tu Nombre" value={customerInfo.name} onChange={e => setCustomerInfo({...customerInfo, name: e.target.value})} className="w-full bg-black border border-white/10 p-3 text-sm text-white outline-none focus:border-luxury-gold" />
                        {orderType === 'express' && (
                            <input type="text" placeholder="Dirección Exacta de Envío" value={customerInfo.address} onChange={e => setCustomerInfo({...customerInfo, address: e.target.value})} className="w-full bg-black border border-white/10 p-3 text-sm text-white outline-none focus:border-luxury-gold" />
                        )}
                    </div>

                    {/* Método de Pago */}
                    <div>
                        <h4 className="text-xs uppercase tracking-widest text-luxury-muted mb-3">Método de Pago</h4>
                        <div className="grid grid-cols-2 gap-2">
                            {['sinpe', 'efectivo'].map(t => (
                                <button key={t} onClick={() => setPaymentMethod(t)} className={`py-3 text-xs uppercase tracking-widest font-bold border transition-colors ${paymentMethod === t ? 'bg-luxury-gold text-black border-luxury-gold' : 'border-white/20 text-white hover:border-luxury-gold'}`}>{t}</button>
                            ))}
                        </div>
                    </div>

                    {/* Lógica de Efectivo + Express */}
                    {paymentMethod === 'efectivo' && orderType === 'express' && (
                        <div className="bg-white/5 p-4 border border-white/10">
                            <label className="text-xs uppercase tracking-widest text-luxury-muted block mb-2">¿Con cuánto efectivo pagas?</label>
                            <input type="number" placeholder="Ej. 20000" value={cashAmount} onChange={e => setCashAmount(e.target.value)} className="w-full bg-black border border-white/10 p-3 text-sm text-white outline-none focus:border-luxury-gold" />
                            <p className="text-xs text-luxury-gold mt-2">Calcularemos tu vuelto exacto para el repartidor.</p>
                        </div>
                    )}

                    {/* Totales y Botón Final */}
                    <div className="pt-6 border-t border-white/20">
                        <div className="flex justify-between items-end mb-6">
                            <span className="text-sm uppercase tracking-widest text-luxury-muted">Total a Pagar</span>
                            <span className="text-3xl font-serif text-luxury-gold">{formatPrice(cartTotal)}</span>
                        </div>
                        <button onClick={generateCommand} className="w-full bg-green-600 hover:bg-green-500 text-white font-bold uppercase tracking-[0.2em] py-5 transition-colors shadow-[0_0_20px_rgba(22,163,74,0.3)]">
                            Confirmar y Enviar Pedido
                        </button>
                    </div>
                </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
