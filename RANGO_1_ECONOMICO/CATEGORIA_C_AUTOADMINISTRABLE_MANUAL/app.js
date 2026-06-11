
document.addEventListener("DOMContentLoaded", async () => {
  try {
    // Fetch data from SSOT (Single Source of Truth)
    const response = await fetch('./menu.json');
    if (!response.ok) throw new Error('No se pudo cargar el menú');
    const data = await response.json();
    
    // Fill Restaurant Data
    document.getElementById('restaurant-name').textContent = data.restaurant.name;
    document.getElementById('restaurant-location').textContent = data.restaurant.location;
    document.getElementById('restaurant-hours').textContent = data.restaurant.hours;
    document.title = `${data.restaurant.name} | Menú Digital`;
    
    document.getElementById('restaurant-header').classList.remove('hidden');
    
    // Config WhatsApp Button
    const waBtn = document.getElementById('whatsapp-btn');
    const waMessage = encodeURIComponent(`Hola ${data.restaurant.name}, quisiera hacer una consulta sobre el menú.`);
    waBtn.href = `https://wa.me/${data.restaurant.whatsapp}?text=${waMessage}`;
    waBtn.target = '_blank';
    waBtn.rel = 'noreferrer';
    waBtn.classList.remove('hidden');
    
    // Render Menu
    const menuContainer = document.getElementById('menu-container');
    menuContainer.innerHTML = '';
    
    const currencyFormatter = new Intl.NumberFormat("es-CR", { style: "currency", currency: "CRC", maximumFractionDigits: 0 });
    const formatPrice = (price) => currencyFormatter.format(price).replace("CRC", "₡").trim();
    
    data.categories.forEach(category => {
      const catItems = data.items.filter(item => item.category === category.id);
      if (catItems.length === 0) return;
      
      const section = document.createElement('section');
      section.className = "bg-black/60 backdrop-blur-md rounded-xl border border-white/10 overflow-hidden shadow-2xl";
      
      let html = `
        <div class="bg-white/[0.02] px-4 py-3 border-b border-white/5">
          <h2 class="text-sm font-black uppercase tracking-widest text-white">${category.name}</h2>
        </div>
        <div class="px-4">
      `;
      
      catItems.forEach(item => {
        html += `
          <article class="py-4 border-b border-white/5 last:border-0 flex justify-between gap-4">
            <div>
              <h3 class="font-bold text-gray-100 flex items-center">${item.name}</h3>
              <p class="mt-1 text-xs leading-relaxed text-gray-500">${item.description}</p>
            </div>
            <strong class="shrink-0 text-sm font-black text-fusion-yellow">${formatPrice(item.price)}</strong>
          </article>
        `;
      });
      
      html += `</div>`;
      section.innerHTML = html;
      menuContainer.appendChild(section);
    });
    
  } catch (error) {
    console.error(error);
    document.getElementById('menu-container').innerHTML = '<p class="text-center text-red-500">Error al cargar el menú. Por favor, intenta de nuevo más tarde.</p>';
  }
});
