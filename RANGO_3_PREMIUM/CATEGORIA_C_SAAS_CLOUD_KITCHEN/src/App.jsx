import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Menu from './pages/Menu';
import Admin from './pages/Admin';
import POS from './pages/POS';

export default function App() {
  return (
    <BrowserRouter>
      {/* Navegacion discreta para revisar los tres flujos de la demo SaaS. */}
      <div className="fixed bottom-2 left-2 z-[999] flex gap-2 opacity-30 hover:opacity-100 transition-opacity">
        <Link to="/" className="bg-black text-white text-[10px] px-2 py-1 rounded border border-white/20">Menu Cliente</Link>
        <Link to="/admin" className="bg-black text-white text-[10px] px-2 py-1 rounded border border-white/20">Admin</Link>
        <Link to="/pos" className="bg-black text-white text-[10px] px-2 py-1 rounded border border-white/20">POS Cocina</Link>
      </div>
      <Routes>
        <Route path="/" element={<Menu />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/pos" element={<POS />} />
      </Routes>
    </BrowserRouter>
  );
}
