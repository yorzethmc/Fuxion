import React, { useState, useEffect } from 'react';
import data from '../../../docs/menu-data-clean.json';

const formatPrice = (price) => new Intl.NumberFormat('es-CR', { style: 'currency', currency: 'CRC', maximumFractionDigits: 0 }).format(price).replace('CRC', '₡').trim();

const categoryImages = {
  entradas: 'https://images.unsplash.com/photo-1541544741938-0af808871cc0?q=80&w=1000&auto=format&fit=crop',
  hamburguesas: 'https://images.unsplash.com/photo-1550547660-d9450f859349?q=80&w=1000&auto=format&fit=crop',
  'platos-fuertes': 'https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=1000&auto=format&fit=crop',
  'combos-express': 'https://images.unsplash.com/photo-1610440042657-612c34d95e9f?q=80&w=1000&auto=format&fit=crop',
  bebidas: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?q=80&w=1000&auto=format&fit=crop'
};

export default function App() {
  const { restaurant, categories, items } = data;
  const [activeCat, setActiveCat] = useState(categories[0].id);
  const [scrolled, setScrolled] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [itemOptions, setItemOptions] = useState({});
  const [itemNotes, setItemNotes] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [cart, setCart] = useState([]);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [orderType, setOrderType] = useState('local');
  const [paymentMethod, setPaymentMethod] = useState('sinpe');
  const [cashAmount, setCashAmount] = useState('');
  const [customerInfo, setCustomerInfo] = useState({ name: '', phone: '', address: '' });

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const currentItems = items.filter(i => i.category === activeCat);
  const currentImage = categoryImages[activeCat] || 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?q=80&w=1000&auto=format&fit=crop';
  const cartTotal = cart.reduce((sum, item) => sum + item.totalPrice, 0);

  const handleOptionChange = (optionId, choice, isMulti) => {
    setItemOptions(prev => {
      const current = { ...prev };
      if (isMulti) {
        const currentChoices = current[optionId] || [];
        current[optionId] = currentChoices.some(c => c.id === choice.id)
          ? currentChoices.filter(c => c.id !== choice.id)
          : [...currentChoices, choice];
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
      choices.forEach(c => { total += c.priceDelta || 0; });
    });
    return total * quantity;
  };

  const openItem = (item) => {
    setSelectedItem(item);
    setItemOptions({});
    setItemNotes('');
    setQuantity(1);
  };

  const addToCart = () => {
    if (!selectedItem) return;
    const missingRequired = selectedItem.options?.find(opt => opt.required && (!itemOptions[opt.id] || itemOptions[opt.id].length === 0));
    if (missingRequired) return alert(`Por favor selecciona una opción para: ${missingRequired.name}`);

    setCart(prev => [...prev, {
      id: Math.random().toString(36).slice(2, 11),
      product: selectedItem,
      options: itemOptions,
      notes: itemNotes.trim(),
      quantity,
      totalPrice: calculateItemTotal()
    }]);
    setSelectedItem(null);
    setItemOptions({});
    setItemNotes('');
    setQuantity(1);
  };

  const removeFromCart = (cartId) => {
    setCart(prev => prev.filter(item => item.id !== cartId));
  };

  const sendOrder = () => {
    if (cart.length === 0) return alert('Tu carrito está vacío.');
    if (!customerInfo.name.trim()) return alert('Por favor ingresa tu nombre.');
    if (orderType === 'express' && !customerInfo.address.trim()) return alert('Por favor ingresa tu dirección de entrega.');

    let ticket = `=================================\n`;
    ticket += `       ${restaurant.name.toUpperCase()}\n`;
    ticket += `       ORDEN MENU DE AUTOR\n`;
    ticket += `=================================\n\n`;
    ticket += `CLIENTE: ${customerInfo.name.trim()}\n`;
    if (customerInfo.phone.trim()) ticket += `TELEFONO: ${customerInfo.phone.trim()}\n`;
    ticket += `TIPO: ${orderType.toUpperCase()}\n`;
    if (orderType === 'express') ticket += `DIRECCION: ${customerInfo.address.trim()}\n`;
    ticket += `PAGO: ${paymentMethod.toUpperCase()}\n`;
    if (paymentMethod === 'efectivo' && cashAmount) {
      const change = Math.max(0, Number(cashAmount) - cartTotal);
      ticket += `PAGA CON: ${formatPrice(Number(cashAmount))}\n`;
      ticket += `CAMBIO: ${formatPrice(change)}\n`;
    }
    ticket += '\n---------------------------------\n';

    cart.forEach(item => {
      ticket += `${item.quantity}x ${item.product.name} - ${formatPrice(item.totalPrice)}\n`;
      Object.keys(item.options).forEach(optId => {
        const optDef = item.product.options.find(o => o.id === optId);
        if (optDef) ticket += `   ${optDef.name}: ${item.options[optId].map(c => c.name).join(', ')}\n`;
      });
      if (item.notes) ticket += `   NOTA: ${item.notes}\n`;
    });

    ticket += `---------------------------------\n`;
    ticket += `TOTAL A PAGAR: ${formatPrice(cartTotal)}\n`;
    ticket += `=================================`;
    window.open(`https://wa.me/${restaurant.whatsapp}?text=${encodeURIComponent(ticket)}`, '_blank');
  };

  return (
    <div className="relative min-h-screen bg-luxury-dark text-luxury-light font-sans bg-noise overflow-x-hidden">
      <section className="relative h-[82vh] w-full overflow-hidden flex items-center justify-center">
        <div className="absolute inset-0 z-0 overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?q=80&w=2000&auto=format&fit=crop"
            className="w-full h-full object-cover animate-slow-pan opacity-60"
            alt="Fusión Culinaria"
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
            Experiencia editorial con pedido estructurado, opciones personalizadas y checkout premium.
          </p>
          <div className="flex flex-wrap justify-center gap-4 animate-fade-in-up stagger-4">
            <a href="https://waze.com/ul?q=Fusion+Culinaria+Sabanilla" target="_blank" rel="noreferrer" className="text-xs tracking-widest uppercase border border-luxury-gold/30 hover:border-luxury-gold hover:bg-luxury-gold hover:text-luxury-dark text-luxury-gold px-6 py-3 transition-all duration-500">
              Ubicación Waze
            </a>
            <a href="https://www.google.com/maps/search/?api=1&query=Fusion+Culinaria+Sabanilla" target="_blank" rel="noreferrer" className="text-xs tracking-widest uppercase border border-luxury-gold/30 hover:border-luxury-gold hover:bg-luxury-gold hover:text-luxury-dark text-luxury-gold px-6 py-3 transition-all duration-500">
              Google Maps
            </a>
            <button onClick={() => setIsCheckoutOpen(true)} className="text-xs tracking-widest uppercase bg-luxury-gold text-luxury-dark px-6 py-3 font-bold transition-all duration-500 hover:bg-white">
              Orden ({cart.length}) {formatPrice(cartTotal)}
            </button>
          </div>
        </div>
      </section>

      <nav className={`sticky top-0 z-40 transition-all duration-500 ${scrolled ? 'bg-luxury-dark/95 backdrop-blur-xl border-b border-luxury-gold/10 py-4 shadow-2xl' : 'bg-luxury-dark/80 py-5'}`}>
        <div className="max-w-6xl mx-auto px-6 overflow-x-auto no-scrollbar">
          <ul className="flex space-x-10 justify-start md:justify-center min-w-max">
            {categories.map(cat => (
              <li key={cat.id}>
                <button
                  onClick={() => setActiveCat(cat.id)}
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

      <main className="max-w-7xl mx-auto px-6 py-20 lg:py-28 grid lg:grid-cols-12 gap-16 items-start relative z-10">
        <div className="hidden lg:block lg:col-span-5 sticky top-32 animate-fade-in-up">
          <div className="relative rounded-t-[100px] rounded-b-sm overflow-hidden aspect-[3/4] p-2 border border-luxury-gold/20">
            <img
              src={currentImage}
              alt={categories.find(c => c.id === activeCat)?.name}
              loading="lazy"
              className="w-full h-full object-cover rounded-t-[90px] rounded-b-sm filter brightness-90 contrast-125 transition-all duration-1000"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-luxury-dark via-transparent to-transparent opacity-60"></div>
          </div>
        </div>

        <div className="lg:col-span-7 space-y-12">
          <div>
            <h2 className="font-serif text-4xl md:text-5xl text-luxury-light mb-2">{categories.find(c => c.id === activeCat)?.name}</h2>
            <div className="w-8 h-px bg-luxury-gold"></div>
          </div>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-1">
            {currentItems.map((item, index) => (
              <article key={item.id} className="group border-b border-luxury-gold/10 pb-8 animate-fade-in-up" style={{ animationDelay: `${(index + 1) * 0.1}s` }}>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-3">
                  <h3 className="font-serif text-xl md:text-2xl text-luxury-light group-hover:text-luxury-gold transition-colors flex items-center gap-3">
                    {item.name}
                    {item.isRecommended && <span className="text-[9px] font-sans tracking-[0.2em] uppercase text-luxury-dark bg-luxury-gold px-2 py-1 rounded-sm">Chef</span>}
                    {item.isNew && <span className="text-[9px] font-sans tracking-[0.2em] uppercase text-luxury-gold border border-luxury-gold/40 px-2 py-1 rounded-sm">Nuevo</span>}
                  </h3>
                  <span className="font-sans font-light tracking-wider text-luxury-gold whitespace-nowrap text-lg">
                    {formatPrice(item.price)}
                  </span>
                </div>
                <p className="text-sm font-light text-luxury-muted leading-relaxed max-w-xl mb-5">
                  {item.description}
                </p>
                <button onClick={() => openItem(item)} className="border border-luxury-gold/30 text-luxury-gold hover:bg-luxury-gold hover:text-luxury-dark px-5 py-3 text-xs uppercase tracking-widest font-bold transition-colors">
                  Seleccionar
                </button>
              </article>
            ))}
          </div>
        </div>
      </main>

      <button onClick={() => setIsCheckoutOpen(true)} className="fixed bottom-6 right-6 z-50 bg-luxury-gold text-black px-5 py-4 rounded-full shadow-[0_10px_40px_rgba(212,175,55,0.3)] font-bold flex gap-3 items-center">
        <span className="text-xs uppercase tracking-widest">Orden ({cart.length})</span>
        <span className="font-serif text-lg">{formatPrice(cartTotal)}</span>
      </button>

      {selectedItem && (
        <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex justify-center items-end md:items-center p-0 md:p-4">
          <div className="bg-[#0a0a0a] border border-white/10 w-full md:max-w-2xl md:rounded-2xl rounded-t-3xl p-6 md:p-8 max-h-[90vh] overflow-y-auto animate-fade-in-up relative shadow-2xl">
            <button onClick={() => setSelectedItem(null)} className="absolute top-6 right-6 text-luxury-muted hover:text-white text-2xl font-light bg-white/10 w-10 h-10 rounded-full flex items-center justify-center">x</button>
            <h2 className="font-serif text-3xl md:text-4xl text-luxury-gold mb-2 pr-12">{selectedItem.name}</h2>
            <p className="text-luxury-muted mb-8 text-sm">{selectedItem.description}</p>

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
                        <input type={isMulti ? 'checkbox' : 'radio'} className="hidden" checked={!!isSelected} onChange={() => handleOptionChange(opt.id, choice, isMulti)} />
                      </label>
                    );
                  })}
                </div>
              </div>
            ))}

            <div className="mb-8 border-t border-white/10 pt-6">
              <h4 className="font-sans font-bold text-sm tracking-widest uppercase text-white mb-4">Instrucciones Especiales</h4>
              <textarea value={itemNotes} onChange={e => setItemNotes(e.target.value)} placeholder="Ej. Sin cebolla, aderezo aparte, bien cocido..." className="w-full bg-black/50 border border-white/10 rounded-xl text-white p-4 text-sm focus:outline-none focus:border-luxury-gold resize-none h-24 transition-colors" />
            </div>

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

      {isCheckoutOpen && (
        <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-lg flex justify-center items-end md:items-center p-0 md:p-4">
          <div className="bg-[#0a0a0a] border border-white/10 w-full md:max-w-2xl md:rounded-2xl rounded-t-3xl p-6 md:p-8 max-h-[90vh] overflow-y-auto relative animate-fade-in-up shadow-2xl">
            <button onClick={() => setIsCheckoutOpen(false)} className="absolute top-6 right-6 text-luxury-muted hover:text-white text-2xl font-light bg-white/10 w-10 h-10 rounded-full flex items-center justify-center">x</button>
            <h2 className="font-serif text-3xl text-luxury-gold mb-8 uppercase tracking-widest text-center">Tu Orden</h2>

            {cart.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-luxury-muted mb-6">No has agregado nada aún.</p>
                <button onClick={() => setIsCheckoutOpen(false)} className="border border-luxury-gold text-luxury-gold px-8 py-3 rounded-full uppercase text-xs tracking-widest font-bold hover:bg-luxury-gold hover:text-black transition-colors">Volver al Menú</button>
              </div>
            ) : (
              <div className="space-y-8">
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

                <div>
                  <h4 className="text-[10px] uppercase tracking-[0.2em] text-luxury-muted mb-3 font-bold border-b border-white/10 pb-2">1. Modalidad de Entrega</h4>
                  <div className="grid grid-cols-3 gap-2">
                    {['local', 'llevar', 'express'].map(t => (
                      <button key={t} onClick={() => setOrderType(t)} className={`py-4 rounded-xl text-xs uppercase tracking-widest font-bold border transition-all ${orderType === t ? 'bg-luxury-gold text-black border-luxury-gold shadow-lg shadow-luxury-gold/20' : 'bg-white/5 border-white/10 text-white hover:border-luxury-gold/50'}`}>{t}</button>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="text-[10px] uppercase tracking-[0.2em] text-luxury-muted mb-3 font-bold border-b border-white/10 pb-2">2. Tus Datos</h4>
                  <input type="text" placeholder="Nombre completo" value={customerInfo.name} onChange={e => setCustomerInfo({ ...customerInfo, name: e.target.value })} className="w-full bg-black/50 border border-white/10 rounded-xl p-4 text-sm text-white outline-none focus:border-luxury-gold transition-colors" />
                  <input type="tel" placeholder="Teléfono de contacto" value={customerInfo.phone} onChange={e => setCustomerInfo({ ...customerInfo, phone: e.target.value })} className="w-full bg-black/50 border border-white/10 rounded-xl p-4 text-sm text-white outline-none focus:border-luxury-gold transition-colors" />
                  {orderType === 'express' && (
                    <input type="text" placeholder="Dirección Exacta de Envío" value={customerInfo.address} onChange={e => setCustomerInfo({ ...customerInfo, address: e.target.value })} className="w-full bg-black/50 border border-white/10 rounded-xl p-4 text-sm text-white outline-none focus:border-luxury-gold transition-colors" />
                  )}
                </div>

                <div>
                  <h4 className="text-[10px] uppercase tracking-[0.2em] text-luxury-muted mb-3 font-bold border-b border-white/10 pb-2">3. Método de Pago</h4>
                  <div className="grid grid-cols-2 gap-3">
                    {['sinpe', 'efectivo'].map(t => (
                      <button key={t} onClick={() => setPaymentMethod(t)} className={`py-4 rounded-xl text-xs uppercase tracking-widest font-bold border transition-all ${paymentMethod === t ? 'bg-luxury-gold text-black border-luxury-gold shadow-lg shadow-luxury-gold/20' : 'bg-white/5 border-white/10 text-white hover:border-luxury-gold/50'}`}>{t}</button>
                    ))}
                  </div>
                </div>

                {paymentMethod === 'efectivo' && (
                  <div className="bg-white/5 p-5 rounded-xl border border-luxury-gold/30">
                    <label className="text-[10px] uppercase tracking-[0.2em] text-luxury-gold font-bold block mb-3">¿Con qué billete vas a pagar?</label>
                    <input type="number" placeholder="Ej. 20000" value={cashAmount} onChange={e => setCashAmount(e.target.value)} className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-sm text-white outline-none focus:border-luxury-gold transition-colors" />
                  </div>
                )}

                <div className="pt-6 border-t border-white/20 mt-8">
                  <div className="flex justify-between items-end mb-6">
                    <span className="text-sm uppercase tracking-widest text-luxury-muted font-bold">Total Final</span>
                    <span className="text-4xl font-serif text-luxury-gold">{formatPrice(cartTotal)}</span>
                  </div>
                  <button onClick={sendOrder} className="w-full bg-white hover:bg-luxury-gold text-black font-black uppercase tracking-[0.2em] py-5 rounded-xl transition-colors shadow-[0_0_30px_rgba(255,255,255,0.2)]">
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
