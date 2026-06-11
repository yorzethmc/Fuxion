import React, { useState, useEffect } from 'react';
import { collection, getDocs, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';
import { getLocalMenuData, saveLocalOrder, withTimeout } from '../localDemoData';

const formatPrice = (price) => new Intl.NumberFormat('es-CR', { style: 'currency', currency: 'CRC', maximumFractionDigits: 0 }).format(price).replace('CRC', '₡').trim();

export default function Menu() {
  const [categories, setCategories] = useState([]);
  const [items, setItems] = useState([]);
  const [restaurant, setRestaurant] = useState({ name: "Fusión Culinaria" });
  const [activeTab, setActiveTab] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dataMode, setDataMode] = useState('firebase');

  // Cart State
  const [cart, setCart] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [itemOptions, setItemOptions] = useState({});
  const [itemNotes, setItemNotes] = useState("");
  const [quantity, setQuantity] = useState(1);

  // Checkout State
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [orderType, setOrderType] = useState('local');
  const [paymentMethod, setPaymentMethod] = useState('sinpe');
  const [cashAmount, setCashAmount] = useState('');
  const [customerInfo, setCustomerInfo] = useState({ name: '', phone: '', address: '' });
  const [orderSuccess, setOrderSuccess] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catSnap, itemSnap, restSnap] = await withTimeout(Promise.all([
          getDocs(collection(db, "categories")),
          getDocs(collection(db, "items")),
          getDocs(collection(db, "settings"))
        ]), 4500, 'carga de menu');
        
        let loadedCats = catSnap.docs.map(d => d.data());
        let loadedItems = itemSnap.docs.map(d => d.data()).filter(i => i.active !== false); // Only active items

        if (loadedCats.length === 0 || loadedItems.length === 0) {
          throw new Error('Base remota vacia');
        }
        
        // Ordenar categorías por orden
        loadedCats.sort((a,b) => a.order - b.order);

        setCategories(loadedCats);
        setItems(loadedItems);
        
        restSnap.docs.forEach(d => {
            if(d.id === 'restaurant') setRestaurant(d.data());
        });

        if(loadedCats.length > 0) setActiveTab(loadedCats[0].id);
        setDataMode('firebase');
      } catch (e) {
        console.warn("Usando datos demo locales:", e);
        const localData = getLocalMenuData();
        setRestaurant(localData.restaurant);
        setCategories(localData.categories);
        setItems(localData.items);
        setActiveTab(localData.categories[0]?.id || null);
        setDataMode('demo');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const activeItems = items.filter(i => i.category === activeTab);
  const cartTotal = cart.reduce((sum, item) => sum + item.totalPrice, 0);

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

  const submitOrderToFirebase = async () => {
    if(cart.length === 0) return alert("Tu carrito está vacío.");
    if(orderType === 'express' && !customerInfo.address) return alert("Por favor ingresa tu dirección.");
    if(!customerInfo.name) return alert("Por favor ingresa tu nombre.");

    const localOrderData = {
        customer: customerInfo,
        type: orderType,
        payment: paymentMethod,
        cashTendered: paymentMethod === 'efectivo' && orderType === 'express' ? (parseFloat(cashAmount) || cartTotal) : null,
        items: cart,
        total: cartTotal,
        status: 'pending'
    };

    const remoteOrderData = {
        ...localOrderData,
        createdAt: serverTimestamp()
    };

    try {
        if (dataMode === 'firebase') {
          await withTimeout(addDoc(collection(db, "orders"), remoteOrderData), 4500, 'envio de orden');
        } else {
          saveLocalOrder(localOrderData);
        }
        setOrderSuccess(true);
        setCart([]);
    } catch (e) {
        console.warn("Guardando orden en modo demo local:", e);
        saveLocalOrder(localOrderData);
        setOrderSuccess(true);
        setCart([]);
    }
  };

  if(loading) return <div className="min-h-screen bg-luxury-dark text-white flex items-center justify-center font-serif text-2xl">Cargando Menú...</div>;

  if(categories.length === 0) return (
      <div className="min-h-screen bg-luxury-dark text-white flex flex-col items-center justify-center font-serif text-xl p-8 text-center">
          <p className="mb-4">El menú está vacío.</p>
          <a href="/admin" className="text-luxury-gold underline border border-luxury-gold px-6 py-3 rounded">Ir al Panel Admin para Sembrar Datos</a>
      </div>
  );

  return (
    <div className="relative min-h-screen bg-luxury-dark text-luxury-light font-sans bg-noise overflow-x-hidden">
      
      {/* Header Mobile & Desktop */}
      <header className="fixed top-0 w-full z-40 bg-black/90 backdrop-blur-md border-b border-white/10 px-6 py-4 flex flex-col md:flex-row justify-between items-center gap-4">
        <h1 className="font-serif text-2xl md:text-3xl tracking-widest uppercase text-luxury-gold drop-shadow-md text-center">
          {restaurant.name}
        </h1>
        {dataMode === 'demo' && (
          <span className="text-[10px] uppercase tracking-widest bg-luxury-gold/10 text-luxury-gold border border-luxury-gold/30 px-3 py-1 rounded-full">
            Modo demo local
          </span>
        )}
        
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

      <main className="max-w-4xl mx-auto px-6 pt-40 pb-32 relative z-10">
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

      {/* Modal de Personalización */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex justify-center items-end md:items-center p-0 md:p-4">
          <div className="bg-[#0a0a0a] border border-white/10 w-full md:max-w-2xl md:rounded-2xl rounded-t-3xl p-6 md:p-8 max-h-[90vh] overflow-y-auto relative shadow-2xl">
            <button onClick={() => setSelectedItem(null)} className="absolute top-6 right-6 text-luxury-muted hover:text-white text-2xl font-light bg-white/10 w-10 h-10 rounded-full flex items-center justify-center">✕</button>
            <h2 className="font-serif text-3xl md:text-4xl text-luxury-gold mb-2 pr-12">{selectedItem.name}</h2>
            
            {/* Opciones */}
            {selectedItem.options?.map(opt => (
                <div key={opt.id} className="mb-6 mt-6">
                  <div className="flex justify-between items-baseline mb-4 border-b border-white/10 pb-2">
                    <h4 className="font-sans font-bold text-sm tracking-widest uppercase text-white">{opt.name}</h4>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {opt.choices.map(choice => {
                      const isMulti = opt.type === 'multi';
                      const isSelected = itemOptions[opt.id]?.some(c => c.id === choice.id);
                      return (
                        <label key={choice.id} className={`flex items-center justify-between p-4 border rounded-xl transition-all cursor-pointer ${isSelected ? 'border-luxury-gold bg-luxury-gold/10 text-white' : 'border-white/10 text-luxury-muted'}`}>
                          <span className="text-sm font-semibold">{choice.name}</span>
                          <input type={isMulti ? "checkbox" : "radio"} className="hidden" checked={!!isSelected} onChange={() => handleOptionChange(opt.id, choice, isMulti)} />
                        </label>
                      );
                    })}
                  </div>
                </div>
            ))}

            <textarea value={itemNotes} onChange={e => setItemNotes(e.target.value)} placeholder="Instrucciones Especiales..." className="w-full mt-6 bg-black/50 border border-white/10 rounded-xl text-white p-4 h-24"></textarea>

            <div className="flex gap-4 items-center mt-8">
              <div className="flex items-center bg-white/5 border border-white/10 rounded-xl h-14">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="px-5 text-luxury-gold h-full">-</button>
                <span className="w-8 text-center text-white">{quantity}</span>
                <button onClick={() => setQuantity(quantity + 1)} className="px-5 text-luxury-gold h-full">+</button>
              </div>
              <button onClick={addToCart} className="flex-1 h-14 bg-luxury-gold text-black font-bold uppercase rounded-xl">Agregar {formatPrice(calculateItemTotal())}</button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Checkout */}
      {isCheckoutOpen && (
        <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-lg flex justify-center items-end md:items-center p-0 md:p-4">
          <div className="bg-[#0a0a0a] border border-white/10 w-full md:max-w-xl md:rounded-2xl rounded-t-3xl p-6 md:p-8 max-h-[90vh] overflow-y-auto relative shadow-2xl">
            {orderSuccess ? (
                <div className="text-center py-16">
                    <h2 className="text-4xl mb-6">🎉</h2>
                    <h2 className="font-serif text-3xl text-luxury-gold mb-4">Orden Recibida</h2>
                    <p className="text-luxury-muted mb-8">Nuestra cocina ya tiene tu orden en pantalla.</p>
                    <button onClick={() => { setOrderSuccess(false); setIsCheckoutOpen(false); }} className="bg-luxury-gold text-black px-8 py-3 rounded-full font-bold uppercase">Entendido</button>
                </div>
            ) : (
                <>
                <button onClick={() => setIsCheckoutOpen(false)} className="absolute top-6 right-6 text-white text-xl">✕</button>
                <h2 className="font-serif text-2xl text-luxury-gold mb-6 uppercase tracking-widest text-center">Tu Orden</h2>
                
                {cart.length === 0 ? <p className="text-center text-luxury-muted">Orden vacía.</p> : (
                    <div className="space-y-6">
                        <div className="space-y-3 max-h-48 overflow-y-auto no-scrollbar">
                            {cart.map(item => (
                                <div key={item.id} className="flex justify-between border-b border-white/5 pb-2">
                                    <div className="text-sm text-white"><span className="text-luxury-gold">{item.quantity}x</span> {item.product.name}</div>
                                    <div className="text-luxury-gold">{formatPrice(item.totalPrice)}</div>
                                </div>
                            ))}
                        </div>

                        <div>
                            <h4 className="text-[10px] uppercase text-luxury-muted mb-2">1. Entrega</h4>
                            <div className="grid grid-cols-3 gap-2">
                                {['local', 'llevar', 'express'].map(t => (
                                    <button key={t} onClick={() => setOrderType(t)} className={`py-2 text-xs uppercase border ${orderType === t ? 'bg-luxury-gold text-black border-luxury-gold' : 'text-white border-white/10'}`}>{t}</button>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <input type="text" placeholder="Tu Nombre" value={customerInfo.name} onChange={e => setCustomerInfo({...customerInfo, name: e.target.value})} className="w-full bg-black/50 border border-white/10 p-3 text-sm text-white" />
                            {orderType === 'express' && <input type="text" placeholder="Dirección Exacta" value={customerInfo.address} onChange={e => setCustomerInfo({...customerInfo, address: e.target.value})} className="w-full bg-black/50 border border-white/10 p-3 text-sm text-white" />}
                        </div>

                        <div>
                            <h4 className="text-[10px] uppercase text-luxury-muted mb-2">2. Pago</h4>
                            <div className="grid grid-cols-2 gap-2">
                                {['sinpe', 'efectivo'].map(t => (
                                    <button key={t} onClick={() => setPaymentMethod(t)} className={`py-2 text-xs uppercase border ${paymentMethod === t ? 'bg-luxury-gold text-black border-luxury-gold' : 'text-white border-white/10'}`}>{t}</button>
                                ))}
                            </div>
                        </div>

                        <button onClick={submitOrderToFirebase} className="w-full bg-white hover:bg-luxury-gold text-black font-black uppercase py-4 rounded-xl mt-4">Enviar a Cocina</button>
                    </div>
                )}
                </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
