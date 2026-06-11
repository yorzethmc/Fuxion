import React, { useState } from 'react';
import data from '../../../docs/menu-data-clean.json';

const formatPrice = (price) => new Intl.NumberFormat('es-CR', { style: 'currency', currency: 'CRC', maximumFractionDigits: 0 }).format(price).replace('CRC', '₡').trim();

export default function App() {
  const { restaurant, categories, items } = data;
  const [activeTab, setActiveTab] = useState(categories[0].id);
  const [cart, setCart] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [itemOptions, setItemOptions] = useState({});
  const [itemNotes, setItemNotes] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [orderType, setOrderType] = useState('recoger');
  const [paymentMethod, setPaymentMethod] = useState('sinpe');
  const [cashAmount, setCashAmount] = useState('');
  const [customerInfo, setCustomerInfo] = useState({ name: '', phone: '', address: '' });

  const activeItems = items.filter(i => i.category === activeTab);
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
    if (missingRequired) {
      alert(`Por favor selecciona una opción para: ${missingRequired.name}`);
      return;
    }

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
    if (orderType === 'domicilio' && !customerInfo.address.trim()) return alert('Por favor ingresa la dirección de entrega.');

    let msg = `Hola *${restaurant.name}*, me gustaría ordenar:\n\n`;
    msg += `Cliente: ${customerInfo.name.trim()}\n`;
    if (customerInfo.phone.trim()) msg += `Teléfono: ${customerInfo.phone.trim()}\n`;
    msg += `Modalidad: ${orderType.toUpperCase()}\n`;
    if (orderType === 'domicilio') msg += `Dirección: ${customerInfo.address.trim()}\n`;
    msg += `Pago: ${paymentMethod.toUpperCase()}\n`;
    if (paymentMethod === 'efectivo' && cashAmount) {
      const change = Math.max(0, Number(cashAmount) - cartTotal);
      msg += `Paga con: ${formatPrice(Number(cashAmount))}\n`;
      msg += `Cambio aproximado: ${formatPrice(change)}\n`;
    }
    msg += '\nPedido:\n';

    cart.forEach(item => {
      msg += `- ${item.quantity}x ${item.product.name} - ${formatPrice(item.totalPrice)}\n`;
      Object.keys(item.options).forEach(optId => {
        const optDef = item.product.options.find(o => o.id === optId);
        if (optDef) {
          const choices = item.options[optId].map(c => c.name).join(', ');
          msg += `  ${optDef.name}: ${choices}\n`;
        }
      });
      if (item.notes) msg += `  Nota: ${item.notes}\n`;
    });

    msg += `\n*Total: ${formatPrice(cartTotal)}*`;
    window.open(`https://wa.me/${restaurant.whatsapp}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-gray-100 font-sans pb-32">
      <header className="p-6 pt-10 text-center border-b border-white/10 bg-zinc-900">
        <h1 className="text-3xl font-black text-white">{restaurant.name}</h1>
        <p className="text-orange-500 font-semibold text-sm uppercase mt-1">Menú & Pedidos</p>
        <div className="flex justify-center gap-3 mt-4">
          <a href="https://waze.com/ul?q=Fusion+Culinaria+Sabanilla" target="_blank" rel="noreferrer" className="bg-[#33ccff]/10 text-[#33ccff] border border-[#33ccff]/30 px-3 py-1.5 rounded-lg text-xs font-bold">Waze</a>
          <a href="https://www.google.com/maps/search/?api=1&query=Fusion+Culinaria+Sabanilla" target="_blank" rel="noreferrer" className="bg-[#ea4335]/10 text-[#ea4335] border border-[#ea4335]/30 px-3 py-1.5 rounded-lg text-xs font-bold">Google Maps</a>
        </div>
      </header>

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

      <main className="p-4 max-w-lg mx-auto space-y-4">
        {activeItems.map(item => (
          <article key={item.id} onClick={() => openItem(item)} className="bg-zinc-900 rounded-2xl p-4 border border-zinc-800 flex flex-col gap-2 cursor-pointer active:scale-[0.98] transition-transform">
            <div className="flex justify-between items-start gap-4">
              <h3 className="font-bold text-lg text-white">{item.name}</h3>
              <span className="font-black text-orange-400 bg-orange-400/10 px-2 py-1 rounded-lg">{formatPrice(item.price)}</span>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed line-clamp-2">{item.description}</p>
            <button className="mt-2 text-sm font-bold text-orange-500 flex items-center gap-1">+ Agregar al pedido</button>
          </article>
        ))}
      </main>

      {selectedItem && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex justify-center items-end sm:items-center">
          <div className="bg-zinc-900 w-full max-w-lg sm:rounded-2xl rounded-t-3xl h-[88vh] sm:h-[82vh] flex flex-col overflow-hidden animate-slide-up">
            <div className="p-4 flex justify-between items-center border-b border-zinc-800 bg-black/20">
              <h2 className="font-black text-xl">{selectedItem.name}</h2>
              <button onClick={() => setSelectedItem(null)} className="w-8 h-8 bg-zinc-800 rounded-full flex items-center justify-center font-bold text-gray-400">x</button>
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
                            <div className={`w-5 h-5 flex items-center justify-center border ${isMulti ? 'rounded-md' : 'rounded-full'} ${isSelected ? 'border-orange-500 bg-orange-500 text-white' : 'border-gray-500'}`}>
                              {isSelected && <span className="text-[10px]">OK</span>}
                            </div>
                            <span className="font-medium text-gray-200">{choice.name}</span>
                          </div>
                          {choice.priceDelta > 0 && <span className="text-sm font-bold text-gray-400">+{formatPrice(choice.priceDelta)}</span>}
                          <input
                            type={isMulti ? 'checkbox' : 'radio'}
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

              <div className="space-y-3">
                <h4 className="font-bold text-white text-lg">Notas del producto</h4>
                <textarea value={itemNotes} onChange={e => setItemNotes(e.target.value)} placeholder="Ej. sin cebolla, salsa aparte..." className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-sm text-white outline-none focus:border-orange-500 h-24 resize-none" />
              </div>
            </div>
            <div className="p-4 border-t border-zinc-800 bg-zinc-950 flex gap-3">
              <div className="flex items-center bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="px-4 h-full text-xl text-orange-400">-</button>
                <span className="w-8 text-center font-bold">{quantity}</span>
                <button onClick={() => setQuantity(quantity + 1)} className="px-4 h-full text-xl text-orange-400">+</button>
              </div>
              <button onClick={addToCart} className="flex-1 bg-orange-600 text-white font-black p-4 rounded-xl flex justify-between items-center active:scale-95 transition-transform">
                <span>Agregar</span>
                <span>{formatPrice(calculateItemTotal())}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {isCheckoutOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex justify-center items-end sm:items-center">
          <div className="bg-zinc-950 w-full max-w-lg sm:rounded-2xl rounded-t-3xl max-h-[90vh] overflow-y-auto p-5 border border-zinc-800">
            <div className="flex justify-between items-center mb-5">
              <h2 className="text-2xl font-black">Finalizar pedido</h2>
              <button onClick={() => setIsCheckoutOpen(false)} className="w-8 h-8 bg-zinc-800 rounded-full text-gray-300">x</button>
            </div>

            {cart.length === 0 ? (
              <p className="text-center text-gray-400 py-10">Tu pedido está vacío.</p>
            ) : (
              <div className="space-y-5">
                <div className="space-y-3">
                  {cart.map(item => (
                    <div key={item.id} className="border-b border-zinc-800 pb-3 flex justify-between gap-4">
                      <div>
                        <p className="font-bold"><span className="text-orange-400">{item.quantity}x</span> {item.product.name}</p>
                        {Object.values(item.options).flat().map(o => <p key={o.id} className="text-xs text-gray-500">+ {o.name}</p>)}
                        {item.notes && <p className="text-xs text-orange-300 mt-1">Nota: {item.notes}</p>}
                      </div>
                      <div className="text-right">
                        <p className="font-black text-orange-400">{formatPrice(item.totalPrice)}</p>
                        <button onClick={() => removeFromCart(item.id)} className="text-xs uppercase text-red-400 font-bold mt-2">Quitar</button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-2 gap-2">
                  {['recoger', 'domicilio'].map(type => (
                    <button key={type} onClick={() => setOrderType(type)} className={`py-3 rounded-xl text-xs uppercase font-black border ${orderType === type ? 'bg-orange-600 border-orange-600 text-white' : 'border-zinc-700 text-gray-300'}`}>{type}</button>
                  ))}
                </div>

                <div className="space-y-3">
                  <input type="text" placeholder="Nombre completo" value={customerInfo.name} onChange={e => setCustomerInfo({ ...customerInfo, name: e.target.value })} className="w-full bg-black border border-zinc-800 rounded-xl p-3 text-white outline-none focus:border-orange-500" />
                  <input type="tel" placeholder="Teléfono de contacto" value={customerInfo.phone} onChange={e => setCustomerInfo({ ...customerInfo, phone: e.target.value })} className="w-full bg-black border border-zinc-800 rounded-xl p-3 text-white outline-none focus:border-orange-500" />
                  {orderType === 'domicilio' && (
                    <input type="text" placeholder="Dirección exacta de entrega" value={customerInfo.address} onChange={e => setCustomerInfo({ ...customerInfo, address: e.target.value })} className="w-full bg-black border border-zinc-800 rounded-xl p-3 text-white outline-none focus:border-orange-500" />
                  )}
                </div>

                <div className="grid grid-cols-2 gap-2">
                  {['sinpe', 'efectivo'].map(method => (
                    <button key={method} onClick={() => setPaymentMethod(method)} className={`py-3 rounded-xl text-xs uppercase font-black border ${paymentMethod === method ? 'bg-green-600 border-green-600 text-white' : 'border-zinc-700 text-gray-300'}`}>{method}</button>
                  ))}
                </div>

                {paymentMethod === 'efectivo' && (
                  <input type="number" placeholder="Paga con (opcional)" value={cashAmount} onChange={e => setCashAmount(e.target.value)} className="w-full bg-black border border-zinc-800 rounded-xl p-3 text-white outline-none focus:border-green-500" />
                )}

                <div className="border-t border-zinc-800 pt-5">
                  <div className="flex justify-between items-end mb-4">
                    <span className="text-gray-400 uppercase text-xs font-bold">Total</span>
                    <span className="text-3xl font-black text-orange-400">{formatPrice(cartTotal)}</span>
                  </div>
                  <button onClick={sendOrder} className="w-full bg-green-600 text-white font-black p-4 rounded-2xl flex justify-between items-center shadow-[0_0_30px_rgba(22,163,74,0.3)] active:scale-95 transition-transform">
                    <span>Enviar a WhatsApp</span>
                    <span>{formatPrice(cartTotal)}</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {cart.length > 0 && (
        <div className="fixed bottom-0 left-0 w-full p-4 bg-gradient-to-t from-black via-black/90 to-transparent z-40">
          <button
            onClick={() => setIsCheckoutOpen(true)}
            className="w-full max-w-lg mx-auto bg-green-600 text-white font-black p-4 rounded-2xl flex justify-between items-center shadow-[0_0_30px_rgba(22,163,74,0.3)] active:scale-95 transition-transform"
          >
            <div className="flex items-center gap-3">
              <span className="bg-black/30 w-8 h-8 rounded-full flex items-center justify-center text-sm">{cart.length}</span>
              <span className="uppercase tracking-wider">Finalizar pedido</span>
            </div>
            <span className="text-lg">{formatPrice(cartTotal)}</span>
          </button>
        </div>
      )}
    </div>
  );
}
