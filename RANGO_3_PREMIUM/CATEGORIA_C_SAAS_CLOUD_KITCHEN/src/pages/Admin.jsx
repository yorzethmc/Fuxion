import React, { useState, useEffect } from 'react';
import { collection, getDocs, doc, setDoc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import seedDataJSON from '../../../../docs/menu-data-clean.json';
import { enrichItems, getLocalItems, saveLocalItems, withTimeout } from '../localDemoData';

const formatPrice = (price) => new Intl.NumberFormat('es-CR', { style: 'currency', currency: 'CRC', maximumFractionDigits: 0 }).format(price).replace('CRC', '₡').trim();

export default function Admin() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dataMode, setDataMode] = useState('firebase');

  const loadData = async () => {
    setLoading(true);
    try {
      const itemSnap = await withTimeout(getDocs(collection(db, "items")), 4500, 'carga de inventario');
      const remoteItems = itemSnap.docs.map(d => ({ id: d.id, ...d.data() }));
      if (remoteItems.length === 0) throw new Error('Inventario remoto vacio');
      setItems(remoteItems);
      setDataMode('firebase');
    } catch (e) {
      console.warn('Usando inventario demo local:', e);
      setItems(getLocalItems());
      setDataMode('demo');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  const handleSeed = async () => {
    if(!window.confirm("¿Seguro que quieres sembrar la base de datos con menu-data-clean.json? Esto sobreescribirá datos.")) return;
    setLoading(true);
    const seededItems = enrichItems(seedDataJSON.items);
    saveLocalItems(seededItems);
    try {
        await withTimeout(Promise.all([
          setDoc(doc(db, "settings", "restaurant"), seedDataJSON.restaurant),
          ...seedDataJSON.categories.map((cat, index) => setDoc(doc(db, "categories", cat.id), { ...cat, order: cat.order ?? index + 1 })),
          ...seededItems.map(item => setDoc(doc(db, "items", item.id), item))
        ]), 10000, 'siembra de base de datos');
        alert("Base de datos remota y demo local sembradas con éxito.");
        setDataMode('firebase');
    } catch (e) {
        console.error(e);
        alert("Firebase no respondió; los datos quedaron sembrados en modo demo local.");
        setDataMode('demo');
    }
    setItems(seededItems);
    setLoading(false);
  };

  const toggleActive = async (id, currentStatus) => {
    const nextItems = items.map(i => i.id === id ? { ...i, active: !currentStatus } : i);
    setItems(nextItems);
    saveLocalItems(nextItems);
    if (dataMode === 'firebase') {
      try {
        await withTimeout(updateDoc(doc(db, "items", id), { active: !currentStatus }), 3500, 'actualizar estado');
      } catch (e) {
        console.warn('Estado guardado solo en demo local:', e);
        setDataMode('demo');
      }
    }
  };

  const updatePrice = async (id, newPrice) => {
    const price = parseFloat(newPrice);
    if(isNaN(price)) return;
    const nextItems = items.map(i => i.id === id ? { ...i, price } : i);
    setItems(nextItems);
    saveLocalItems(nextItems);
    if (dataMode === 'firebase') {
      try {
        await withTimeout(updateDoc(doc(db, "items", id), { price }), 3500, 'actualizar precio');
      } catch (e) {
        console.warn('Precio guardado solo en demo local:', e);
        setDataMode('demo');
      }
    }
  };

  if(loading) return <div className="min-h-screen bg-black text-white p-8">Cargando Admin...</div>;

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-300 font-sans p-8">
      <div className="max-w-6xl mx-auto">
        <header className="flex justify-between items-center mb-8">
            <div>
                <h1 className="text-3xl font-bold text-white">Back-office: Inventario</h1>
                <p className="text-xs uppercase tracking-widest text-slate-500 mt-2">{dataMode === 'firebase' ? 'Conectado a Firebase' : 'Modo demo local'}</p>
            </div>
            <button onClick={handleSeed} className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-500">Sembrar BD Inicial</button>
        </header>

        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-2xl">
            <table className="w-full text-left border-collapse">
                <thead>
                    <tr className="bg-slate-800 text-slate-400 text-xs uppercase tracking-wider">
                        <th className="p-4 border-b border-slate-700">Producto</th>
                        <th className="p-4 border-b border-slate-700">Categoría</th>
                        <th className="p-4 border-b border-slate-700">Precio (₡)</th>
                        <th className="p-4 border-b border-slate-700 text-center">Estado</th>
                        <th className="p-4 border-b border-slate-700 text-center">Acciones</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                    {items.map(item => (
                        <tr key={item.id} className="hover:bg-slate-800/50 transition-colors">
                            <td className="p-4 font-medium text-white">{item.name}</td>
                            <td className="p-4 text-sm text-slate-500">{item.category}</td>
                            <td className="p-4">
                                <input 
                                    type="number" 
                                    defaultValue={item.price}
                                    onBlur={(e) => updatePrice(item.id, e.target.value)}
                                    className="bg-black border border-slate-700 rounded px-3 py-1 w-24 text-white focus:border-blue-500 outline-none"
                                />
                            </td>
                            <td className="p-4 text-center">
                                <span className={`px-2 py-1 rounded-full text-xs font-bold ${item.active !== false ? 'bg-green-900 text-green-300' : 'bg-red-900 text-red-300'}`}>
                                    {item.active !== false ? 'ACTIVO' : 'AGOTADO'}
                                </span>
                            </td>
                            <td className="p-4 text-center">
                                <button 
                                    onClick={() => toggleActive(item.id, item.active !== false)}
                                    className={`px-4 py-1 rounded text-xs font-bold uppercase transition-colors ${item.active !== false ? 'border border-red-500/50 text-red-400 hover:bg-red-500/10' : 'border border-green-500/50 text-green-400 hover:bg-green-500/10'}`}
                                >
                                    {item.active !== false ? 'Desactivar' : 'Activar'}
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {items.length === 0 && (
                <div className="p-12 text-center text-slate-500">
                    No hay productos en la base de datos. Usa el botón "Sembrar BD Inicial".
                </div>
            )}
        </div>
      </div>
    </div>
  );
}
