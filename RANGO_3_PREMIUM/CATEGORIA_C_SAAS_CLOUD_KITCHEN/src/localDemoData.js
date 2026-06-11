import seedData from '../../../docs/menu-data-clean.json';

const ITEMS_KEY = 'fusion-cloud-items';
const ORDERS_KEY = 'fusion-cloud-orders';

const defaultImage = 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?q=80&w=600&auto=format&fit=crop';

export const withTimeout = (promise, ms = 4500, label = 'operacion') => (
  Promise.race([
    promise,
    new Promise((_, reject) => {
      window.setTimeout(() => reject(new Error(`Timeout en ${label}`)), ms);
    })
  ])
);

export const enrichCategories = (categories = seedData.categories) => (
  categories.map((cat, index) => ({ ...cat, order: cat.order ?? index + 1 }))
);

export const enrichItems = (items = seedData.items) => (
  items.map(item => ({
    ...item,
    active: item.active !== false,
    image: item.image || defaultImage
  }))
);

export const getSeedMenuData = () => ({
  restaurant: seedData.restaurant,
  categories: enrichCategories(),
  items: enrichItems()
});

const readJson = (key, fallback) => {
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
};

const writeJson = (key, value) => {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Demo persistence is best-effort only.
  }
};

export const buildSampleOrders = () => {
  const items = enrichItems();
  const burger = items.find(item => item.id === 'hamburguesa-fusion') || items[0];
  const wings = items.find(item => item.id === 'alitas-fusion') || items[1];

  return [
    {
      id: 'demo-1001',
      customer: { name: 'Mesa 4 - Demo', phone: '8729-2124', address: '' },
      type: 'local',
      payment: 'sinpe',
      cashTendered: null,
      total: burger.price,
      status: 'pending',
      createdAt: new Date(Date.now() - 1000 * 60 * 12).toISOString(),
      items: [
        {
          id: 'demo-line-1',
          product: burger,
          options: {},
          notes: 'Sin cebolla, termino medio',
          quantity: 1,
          totalPrice: burger.price
        }
      ]
    },
    {
      id: 'demo-1002',
      customer: { name: 'Pedido Express - Demo', phone: '8729-2124', address: 'Sabanilla, 300m norte de la plaza' },
      type: 'express',
      payment: 'efectivo',
      cashTendered: 10000,
      total: wings.price,
      status: 'pending',
      createdAt: new Date(Date.now() - 1000 * 60 * 4).toISOString(),
      items: [
        {
          id: 'demo-line-2',
          product: wings,
          options: {},
          notes: 'Salsa aparte',
          quantity: 1,
          totalPrice: wings.price
        }
      ]
    }
  ];
};

export const ensureLocalDemoData = () => {
  const items = readJson(ITEMS_KEY, null);
  if (!items || items.length === 0) writeJson(ITEMS_KEY, enrichItems());

  const orders = readJson(ORDERS_KEY, null);
  if (!orders || orders.length === 0) writeJson(ORDERS_KEY, buildSampleOrders());
};

export const getLocalItems = () => {
  ensureLocalDemoData();
  return readJson(ITEMS_KEY, enrichItems());
};

export const saveLocalItems = (items) => {
  writeJson(ITEMS_KEY, enrichItems(items));
};

export const getLocalOrders = () => {
  ensureLocalDemoData();
  return readJson(ORDERS_KEY, buildSampleOrders());
};

export const saveLocalOrders = (orders) => {
  writeJson(ORDERS_KEY, orders);
};

export const saveLocalOrder = (order) => {
  const orders = getLocalOrders();
  const localOrder = {
    ...order,
    id: `demo-${Date.now()}`,
    createdAt: new Date().toISOString(),
    status: 'pending'
  };
  saveLocalOrders([...orders, localOrder]);
  return localOrder;
};

export const completeLocalOrder = (id) => {
  const orders = getLocalOrders().map(order => (
    order.id === id ? { ...order, status: 'completed' } : order
  ));
  saveLocalOrders(orders);
};

export const getLocalMenuData = () => {
  ensureLocalDemoData();
  return {
    restaurant: seedData.restaurant,
    categories: enrichCategories(),
    items: getLocalItems().filter(item => item.active !== false)
  };
};
