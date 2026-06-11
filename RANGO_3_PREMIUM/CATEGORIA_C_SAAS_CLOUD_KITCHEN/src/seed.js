import fs from 'fs';
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';

// Usa las mismas llaves del cliente
const firebaseConfig = {
  apiKey: "AIzaSyDucTyhuPipb9mZDEL55GkfveOlHyG_yDc",
  authDomain: "fusion-culinaria.firebaseapp.com",
  projectId: "fusion-culinaria",
  storageBucket: "fusion-culinaria.firebasestorage.app",
  messagingSenderId: "1044943908073",
  appId: "1:1044943908073:web:b03d8f0aba5c3cdb739478"
};

const __dirname = dirname(fileURLToPath(import.meta.url));
const menuDataPath = resolve(__dirname, '../../../docs/menu-data-clean.json');
const defaultImage = 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?q=80&w=600&auto=format&fit=crop';
const FIREBASE_TIMEOUT_MS = 10000;

const withTimeout = (promise, ms, label) => {
    let timeoutId;
    const timeout = new Promise((_, reject) => {
        timeoutId = setTimeout(() => reject(new Error(`Timeout en ${label} despues de ${ms}ms`)), ms);
    });

    return Promise.race([promise, timeout]).finally(() => clearTimeout(timeoutId));
};

const enrichCategories = (categories = []) => (
    categories.map((cat, index) => ({ ...cat, order: cat.order ?? index + 1 }))
);

const enrichItems = (items = []) => (
    items.map(item => ({
        ...item,
        active: item.active !== false,
        image: item.image || defaultImage
    }))
);

const buildSampleOrders = (items) => {
    const burger = items.find(item => item.id === 'hamburguesa-fusion') || items[0];
    const wings = items.find(item => item.id === 'alitas-fusion') || items[1] || items[0];

    return [
        {
            id: 'demo-1001',
            customer: { name: 'Mesa 4 - Demo', phone: '8729-2124', address: '' },
            type: 'local',
            payment: 'sinpe',
            cashTendered: null,
            total: burger.price,
            status: 'pending',
            createdAt: new Date(Date.now() - 1000 * 60 * 12),
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
            createdAt: new Date(Date.now() - 1000 * 60 * 4),
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

const seedData = async () => {
    try {
        console.log("Iniciando migración a Firebase...");
        const [{ initializeApp }, { getFirestore, doc, setDoc }] = await withTimeout(
            Promise.all([
                import("firebase/app"),
                import("firebase/firestore/lite")
            ]),
            FIREBASE_TIMEOUT_MS,
            'carga de SDK Firebase'
        );
        const app = initializeApp(firebaseConfig);
        const db = getFirestore(app);

        const rawData = fs.readFileSync(menuDataPath, 'utf-8');
        const data = JSON.parse(rawData);
        const categories = enrichCategories(data.categories);
        const items = enrichItems(data.items);
        const writeDoc = (path, id, payload) => withTimeout(
            setDoc(doc(db, path, id), payload),
            FIREBASE_TIMEOUT_MS,
            `escritura ${path}/${id}`
        );

        // 1. Guardar info del restaurante
        await writeDoc("settings", "restaurant", data.restaurant);
        console.log("Restaurante guardado.");

        // 2. Guardar categorías
        for (const cat of categories) {
            await writeDoc("categories", cat.id, cat);
        }
        console.log(`Guardadas ${categories.length} categorías.`);

        // 3. Guardar items
        for (const item of items) {
            await writeDoc("items", item.id, item);
        }
        console.log(`Guardados ${items.length} items.`);

        // 4. Guardar ordenes demo para probar POS/KDS
        const orders = buildSampleOrders(items);
        for (const order of orders) {
            await writeDoc("orders", order.id, order);
        }
        console.log(`Guardadas ${orders.length} órdenes demo.`);

        console.log("¡Migración completada exitosamente!");
        process.exit(0);
    } catch (e) {
        console.error("Error migrando a Firebase: ", e);
        process.exit(1);
    }
};

seedData();
