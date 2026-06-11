import React, { useState, useEffect } from 'react';
import data from '../../../docs/menu-data-clean.json';

const formatPrice = (price) => new Intl.NumberFormat('es-CR', { style: 'currency', currency: 'CRC', maximumFractionDigits: 0 }).format(price).replace('CRC', '₡').trim();

export default function App() {
  const { restaurant, categories, items } = data;
  const [activeTab, setActiveTab] = useState(categories[0].id);
  const [animKey, setAnimKey] = useState(0);

  // Cart State
  const [cart, setCart] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [itemOptions, setItemOptions] = useState({});
  const [itemNotes, setItemNotes] = useState("");
  const [quantity, setQuantity] = useState(1);

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
    return total * quantity;
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
      quantity: quantity,
      totalPrice: calculateItemTotal()
    }]);
    setSelectedItem(null);
    setItemOptions({});
    setItemNotes("");
    setQuantity(1);
  };

  const removeFromCart = (cartId) => {
    setCart(prev => prev.filter(item => item.id !== cartId));
  };

  const generateCommand = () => {
    if(cart.length === 0) return alert("Tu carrito está vacío.");
    if(orderType === 'express' && !customerInfo.address) return alert("Por favor ingresa tu dirección de entrega.");

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

    const itemsByCategory = {};
    cart.forEach(item => {
      const cat = categories.find(c => c.id === item.product.category)?.name || 'OTROS';
      if(!itemsByCategory[cat]) itemsByCategory[cat] = [];
      itemsByCategory[cat].push(item);
    });

    Object.keys(itemsByCategory).forEach(cat => {
      ticket += `[ ${cat.toUpperCase()} ]\n`;
      itemsByCategory[cat].forEach(item => {
        ticket += `${item.quantity}x ${item.product.name} - ${formatPrice(item.totalPrice)}\n`;
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
    <div className="relative min-h-screen bg-luxury-dark text-luxury-light font-sans bg-noise overflow-x-hidden">
      
      {/* Header Mobile & Desktop */}
      <header className="fixed top-0 w-full z-40 bg-black/90 backdrop-blur-md border-b border-white/10 px-6 py-4 flex flex-col md:flex-row justify-between items-center gap-4">
        <h1 className="font-serif text-2xl md:text-3xl tracking-widest uppercase text-luxury-gold drop-shadow-md text-center">
          {restaurant.name}
        </h1>
        
        {/* Mobile Navigation (Scrollable) */}
        <nav className="w-full md:w-auto flex overflow-x-auto pb-2 md:pb-0 gap-6 no-scrollbar snap-x">
          {categories.map(cat => (
            <button 
              key={cat.id} 
              onClick={() => setActiveTab(cat.id)}
              className={`snap-center shrink-0 text-xs uppercase tracking-[0.2em] font-bold pb-1 border-b-2 transition-all ${activeTab === cat.id ? 'text-luxury-gold border-luxury-gold' : 'text-luxury-muted border-transparent hover:text-white'}`}
            >
              {cat.name}
            </button>
          ))}
        </nav>

        {/* Cart Button */}
        <button onClick={() => setIsCheckoutOpen(true)} className="fixed md:static bottom-6 right-6 md:bottom-auto md:right-auto z-50 bg-luxury-gold text-black shadow-[0_10px_30px_rgba(212,175,55,0.3)] md:shadow-none md:bg-transparent md:border md:border-luxury-gold md:text-luxury-gold px-6 py-3 rounded-full flex items-center gap-3 hover:bg-white hover:text-black hover:border-white transition-all font-bold">
            <span className="uppercase text-xs tracking-widest">Orden ({cart.length})</span>
            <span className="font-serif text-lg">{formatPrice(cartTotal)}</span>
        </button>
      </header>

      <main className="max-w-4xl mx-auto px-6 pt-40 pb-32 relative z-10" key={animKey}>
        <div className="space-y-12">
            <h2 className="font-serif text-4xl md:text-5xl text-white opacity-90 animate-fade-in-up border-b border-white/10 pb-4 mb-8">
              {categories.find(c => c.id === activeTab)?.name}
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {activeItems.map((item, index) => (
                <article key={item.id} className="group animate-fade-in-up bg-white/5 border border-white/10 rounded-xl p-6 hover:border-luxury-gold transition-all duration-300 flex flex-col justify-between" style={{ animationDelay: `${(index + 1) * 0.1}s` }}>
                    <div>
                      <div className="flex justify-between items-start mb-3">
                          <h3 className="font-serif text-xl md:text-2xl text-white group-hover:text-luxury-gold transition-colors pr-4">
                              {item.name}
                          </h3>
                          <span className="font-sans text-luxury-gold font-bold whitespace-nowrap">{formatPrice(item.price)}</span>
                      </div>
                      <p className="text-luxury-muted font-light leading-relaxed text-sm tracking-wide mb-6">{item.description}</p>
                    </div>
                    
                    <button onClick={() => { setSelectedItem(item); setItemOptions({}); setItemNotes(""); setQuantity(1); }} className="w-full py-3 border border-luxury-gold/30 text-luxury-gold uppercase text-xs tracking-widest font-bold hover:bg-luxury-gold hover:text-black transition-colors rounded-md">
                      Seleccionar
                    </button>
                </article>
                ))}
            </div>
        </div>
      </main>

      {/* Modal de Personalización de Platillo */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex justify-center items-end md:items-center p-0 md:p-4">
          <div className="bg-[#0a0a0a] border border-white/10 w-full md:max-w-2xl md:rounded-2xl rounded-t-3xl p-6 md:p-8 max-h-[90vh] overflow-y-auto animate-fade-in-up relative shadow-2xl">
            <button onClick={() => setSelectedItem(null)} className="absolute top-6 right-6 text-luxury-muted hover:text-white text-2xl font-light bg-white/10 w-10 h-10 rounded-full flex items-center justify-center">✕</button>
            <h2 className="font-serif text-3xl md:text-4xl text-luxury-gold mb-2 pr-12">{selectedItem.name}</h2>
            <p className="text-luxury-muted mb-8 text-sm">{selectedItem.description}</p>

            {/* Opciones del Item */}
            {selectedItem.options?.map(opt => (
                <div key={opt.id} className="mb-8">
                  <div className="flex justify-between items-baseline mb-4 border-b border-white/10 pb-2">
                    <h4 className="font-sans font-bold text-sm tracking-widest uppercase text-white">{opt.name}</h4>
                    {opt.required && <span className="text-[10px] tracking-widest text-red-400 uppercase bg-red-400/10 px-2 py-1 rounded-full">Requerido</span>}
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {opt.choices.map(choice => {
                      const isMulti = opt.type === 'multi';
                      const isSelected = itemOptions[opt.id]?.some(c => c.id === choice.id);
                      return (
                        <label key={choice.id} className={`flex items-center justify-between p-4 border rounded-xl transition-all cursor-pointer ${isSelected ? 'border-luxury-gold bg-luxury-gold/10 text-white shadow-[0_0_15px_rgba(212,175,55,0.15)]' : 'border-white/10 text-luxury-muted hover:border-white/30 hover:bg-white/5'}`}>
                          <div className="flex items-center gap-3">
                            <div className={`w-5 h-5 flex items-center justify-center border ${isMulti ? 'rounded-md' : 'rounded-full'} ${isSelected ? 'border-luxury-gold bg-luxury-gold' : 'border-white/30'}`}>
                              {isSelected && <div className="w-2.5 h-2.5 bg-black rounded-sm"></div>}
                            </div>
                            <span className="text-sm font-semibold">{choice.name}</span>
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
            <div className="mb-8 border-t border-white/10 pt-6">
                <h4 className="font-sans font-bold text-sm tracking-widest uppercase text-white mb-4">Instrucciones Especiales</h4>
                <textarea 
                    value={itemNotes} 
                    onChange={e => setItemNotes(e.target.value)}
                    placeholder="Ej. Sin cebolla, aderezo aparte, bien cocido..."
                    className="w-full bg-black/50 border border-white/10 rounded-xl text-white p-4 text-sm focus:outline-none focus:border-luxury-gold resize-none h-24 transition-colors"
                ></textarea>
            </div>

            {/* Controles de Cantidad y Botón de Agregar */}
            <div className="flex gap-4 items-center mt-8">
              <div className="flex items-center bg-white/5 border border-white/10 rounded-xl overflow-hidden h-14">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="px-5 text-xl hover:bg-white/10 text-luxury-gold transition-colors h-full">-</button>
                <span className="w-8 text-center font-bold text-white">{quantity}</span>
                <button onClick={() => setQuantity(quantity + 1)} className="px-5 text-xl hover:bg-white/10 text-luxury-gold transition-colors h-full">+</button>
              </div>
              <button onClick={addToCart} className="flex-1 h-14 bg-luxury-gold text-black font-bold uppercase tracking-widest rounded-xl flex justify-between items-center px-6 hover:bg-white transition-colors shadow-lg shadow-luxury-gold/20">
                  <span>Agregar</span>
                  <span>{formatPrice(calculateItemTotal())}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Checkout */}
      {isCheckoutOpen && (
        <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-lg flex justify-center items-end md:items-center p-0 md:p-4">
          <div className="bg-[#0a0a0a] border border-white/10 w-full md:max-w-2xl md:rounded-2xl rounded-t-3xl p-6 md:p-8 max-h-[90vh] overflow-y-auto relative animate-fade-in-up shadow-2xl">
            <button onClick={() => setIsCheckoutOpen(false)} className="absolute top-6 right-6 text-luxury-muted hover:text-white text-2xl font-light bg-white/10 w-10 h-10 rounded-full flex items-center justify-center">✕</button>
            <h2 className="font-serif text-3xl text-luxury-gold mb-8 uppercase tracking-widest text-center">Tu Orden</h2>
            
            {cart.length === 0 ? (
                <div className="text-center py-16">
                  <p className="text-luxury-muted mb-6">No has agregado nada aún.</p>
                  <button onClick={() => setIsCheckoutOpen(false)} className="border border-luxury-gold text-luxury-gold px-8 py-3 rounded-full uppercase text-xs tracking-widest font-bold hover:bg-luxury-gold hover:text-black transition-colors">Volver al Menú</button>
                </div>
            ) : (
                <div className="space-y-8">
                    {/* Lista de Items */}
                    <div className="space-y-4 max-h-64 overflow-y-auto pr-2 no-scrollbar">
                        {cart.map(item => (
                            <div key={item.id} className="flex justify-between items-start border-b border-white/5 pb-4">
                                <div className="flex-1 pr-4">
                                    <h4 className="font-bold text-white text-sm"><span className="text-luxury-gold mr-2">{item.quantity}x</span>{item.product.name}</h4>
                                    {Object.values(item.options).flat().map(o => <p key={o.id} className="text-xs text-luxury-muted ml-6">+ {o.name}</p>)}
                                    {item.notes && <p className="text-xs text-red-400 mt-1 italic ml-6">Nota: {item.notes}</p>}
                                </div>
                                <div className="flex flex-col items-end gap-2">
                                  <span className="text-luxury-gold text-sm font-bold whitespace-nowrap">{formatPrice(item.totalPrice)}</span>
                                  <button onClick={() => removeFromCart(item.id)} className="text-xs text-red-500/70 hover:text-red-500 uppercase tracking-widest font-bold">Quitar</button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Tipo de Orden */}
                    <div>
                        <h4 className="text-[10px] uppercase tracking-[0.2em] text-luxury-muted mb-3 font-bold border-b border-white/10 pb-2">1. Modalidad de Entrega</h4>
                        <div className="grid grid-cols-3 gap-2">
                            {['local', 'llevar', 'express'].map(t => (
                                <button key={t} onClick={() => setOrderType(t)} className={`py-4 rounded-xl text-xs uppercase tracking-widest font-bold border transition-all ${orderType === t ? 'bg-luxury-gold text-black border-luxury-gold shadow-lg shadow-luxury-gold/20' : 'bg-white/5 border-white/10 text-white hover:border-luxury-gold/50'}`}>{t}</button>
                            ))}
                        </div>
                    </div>

                    {/* Datos del Cliente */}
                    <div className="space-y-3">
                        <h4 className="text-[10px] uppercase tracking-[0.2em] text-luxury-muted mb-3 font-bold border-b border-white/10 pb-2">2. Tus Datos</h4>
                        <input type="text" placeholder="Nombre completo" value={customerInfo.name} onChange={e => setCustomerInfo({...customerInfo, name: e.target.value})} className="w-full bg-black/50 border border-white/10 rounded-xl p-4 text-sm text-white outline-none focus:border-luxury-gold transition-colors" />
                        {orderType === 'express' && (
                            <input type="text" placeholder="Dirección Exacta de Envío" value={customerInfo.address} onChange={e => setCustomerInfo({...customerInfo, address: e.target.value})} className="w-full bg-black/50 border border-white/10 rounded-xl p-4 text-sm text-white outline-none focus:border-luxury-gold transition-colors" />
                        )}
                    </div>

                    {/* Método de Pago */}
                    <div>
                        <h4 className="text-[10px] uppercase tracking-[0.2em] text-luxury-muted mb-3 font-bold border-b border-white/10 pb-2">3. Método de Pago</h4>
                        <div className="grid grid-cols-2 gap-3">
                            {['sinpe', 'efectivo'].map(t => (
                                <button key={t} onClick={() => setPaymentMethod(t)} className={`py-4 rounded-xl text-xs uppercase tracking-widest font-bold border transition-all ${paymentMethod === t ? 'bg-luxury-gold text-black border-luxury-gold shadow-lg shadow-luxury-gold/20' : 'bg-white/5 border-white/10 text-white hover:border-luxury-gold/50'}`}>{t}</button>
                            ))}
                        </div>
                    </div>

                    {/* Lógica de Efectivo + Express */}
                    {paymentMethod === 'efectivo' && orderType === 'express' && (
                        <div className="bg-white/5 p-5 rounded-xl border border-luxury-gold/30">
                            <label className="text-[10px] uppercase tracking-[0.2em] text-luxury-gold font-bold block mb-3">¿Con qué billete vas a pagar?</label>
                            <input type="number" placeholder="Ej. 20000" value={cashAmount} onChange={e => setCashAmount(e.target.value)} className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-sm text-white outline-none focus:border-luxury-gold transition-colors" />
                            <p className="text-[10px] text-luxury-muted mt-2 italic">Esto es para enviarte el vuelto exacto.</p>
                        </div>
                    )}

                    {/* Totales y Botón Final */}
                    <div className="pt-6 border-t border-white/20 mt-8">
                        <div className="flex justify-between items-end mb-6">
                            <span className="text-sm uppercase tracking-widest text-luxury-muted font-bold">Total Final</span>
                            <span className="text-4xl font-serif text-luxury-gold">{formatPrice(cartTotal)}</span>
                        </div>
                        <button onClick={generateCommand} className="w-full bg-white hover:bg-luxury-gold text-black font-black uppercase tracking-[0.2em] py-5 rounded-xl transition-colors shadow-[0_0_30px_rgba(255,255,255,0.2)]">
                            Enviar Pedido por WhatsApp
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
