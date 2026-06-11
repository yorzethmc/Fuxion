import React, { useState, useEffect } from 'react';
import { collection, query, orderBy, onSnapshot, updateDoc, doc } from 'firebase/firestore';
import { db } from '../firebase';

const formatPrice = (price) => new Intl.NumberFormat('es-CR', { style: 'currency', currency: 'CRC', maximumFractionDigits: 0 }).format(price).replace('CRC', '₡').trim();

export default function POS() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, "orders"), orderBy("createdAt", "asc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
        const fetchedOrders = snapshot.docs.map(d => ({
            id: d.id,
            ...d.data(),
            createdAt: d.data().createdAt?.toDate() || new Date()
        })).filter(o => o.status !== 'completed'); // Solo ordenes activas

        // Detección de orden nueva (sonido de campana)
        if(fetchedOrders.length > orders.length && !loading) {
            const audio = new Audio('https://www.soundjay.com/misc/sounds/bell-ringing-05.mp3');
            audio.play().catch(e => console.log("Auto-play prevented", e));
        }

        setOrders(fetchedOrders);
        setLoading(false);
    });

    return () => unsubscribe();
  }, [loading, orders.length]);

  const markAsCompleted = async (id) => {
    await updateDoc(doc(db, "orders", id), { status: 'completed' });
  };

  const handlePrint = (orderId) => {
    // Activa la impresión del navegador, el CSS @media print oculta todo excepto el ticket seleccionado
    const el = document.getElementById(`ticket-${orderId}`);
    if(el) {
        el.classList.add('printing-active');
        window.print();
        el.classList.remove('printing-active');
    }
  };

  if(loading) return <div className="min-h-screen bg-slate-900 text-white p-8">Conectando con Cocina...</div>;

  return (
    <div className="min-h-screen bg-slate-200 p-8 font-sans print-hidden-app">
      <style>{`
        @media print {
            body * { visibility: hidden; }
            .printing-active, .printing-active * { visibility: visible; }
            .printing-active { position: absolute; left: 0; top: 0; width: 80mm; margin: 0; padding: 0; }
            .print-hidden-app { background: white !important; padding: 0 !important; }
        }
      `}</style>
      
      <header className="mb-8 flex justify-between items-center">
        <h1 className="text-3xl font-black text-slate-800 uppercase tracking-widest">KDS (Kitchen Display)</h1>
        <div className="bg-green-500 text-white px-4 py-1 rounded-full text-xs font-bold animate-pulse">EN LÍNEA</div>
      </header>

      <div className="flex gap-6 overflow-x-auto pb-8 snap-x">
        {orders.length === 0 ? (
            <div className="w-full flex flex-col items-center justify-center py-32 text-slate-400">
                <svg className="w-16 h-16 mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
                <p className="text-xl font-bold uppercase tracking-widest">Esperando órdenes...</p>
            </div>
        ) : (
            orders.map(order => (
                <div key={order.id} className="snap-center shrink-0 w-80 bg-white border-t-8 border-orange-500 shadow-xl rounded-b-xl flex flex-col h-[70vh]">
                    
                    {/* Visual Ticket (Also used for printing) */}
                    <div id={`ticket-${order.id}`} className="flex-1 overflow-y-auto p-6 font-mono text-sm bg-white text-black relative">
                        <div className="text-center mb-6 border-b-2 border-black border-dashed pb-4">
                            <h2 className="font-bold text-xl uppercase">ORDEN #{order.id.slice(0,4)}</h2>
                            <p className="text-xs mt-1">{order.createdAt.toLocaleTimeString()}</p>
                            <div className="mt-2 text-lg font-black bg-black text-white py-1">{order.type.toUpperCase()}</div>
                        </div>

                        <div className="mb-4">
                            <p><strong>Cliente:</strong> {order.customer.name}</p>
                            {order.type === 'express' && <p><strong>Dir:</strong> {order.customer.address}</p>}
                            <p><strong>Pago:</strong> {order.payment.toUpperCase()}</p>
                            {order.cashTendered && <p><strong>Paga con:</strong> {formatPrice(order.cashTendered)} (Cambio: {formatPrice(order.cashTendered - order.total)})</p>}
                        </div>

                        <div className="border-t-2 border-black border-dashed pt-4 mb-4">
                            {order.items.map(item => (
                                <div key={item.id} className="mb-4">
                                    <div className="flex justify-between font-bold">
                                        <span>{item.quantity}x {item.product.name}</span>
                                        <span>{formatPrice(item.totalPrice)}</span>
                                    </div>
                                    <div className="pl-4 text-xs mt-1">
                                        {Object.values(item.options).flat().map(o => <div key={o.id}>+ {o.name}</div>)}
                                        {item.notes && <div className="font-bold border border-black p-1 mt-1 uppercase">NOTA: {item.notes}</div>}
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="border-t-2 border-black border-dashed pt-4 flex justify-between items-end">
                            <span className="font-bold">TOTAL:</span>
                            <span className="text-xl font-black">{formatPrice(order.total)}</span>
                        </div>
                    </div>

                    {/* Actions (Not printed) */}
                    <div className="p-4 bg-slate-100 flex gap-2 rounded-b-xl">
                        <button onClick={() => handlePrint(order.id)} className="flex-1 bg-slate-800 text-white font-bold uppercase py-3 rounded text-xs hover:bg-slate-700">Imprimir</button>
                        <button onClick={() => markAsCompleted(order.id)} className="flex-1 bg-green-600 text-white font-bold uppercase py-3 rounded text-xs hover:bg-green-500">Completar</button>
                    </div>
                </div>
            ))
        )}
      </div>
    </div>
  );
}
