import { initializeApp } from "firebase/app";
import { getFirestore, collection, doc, setDoc } from "firebase/firestore";
import fs from 'fs';

// Usa las mismas llaves del cliente
const firebaseConfig = {
  apiKey: "AIzaSyDucTyhuPipb9mZDEL55GkfveOlHyG_yDc",
  authDomain: "fusion-culinaria.firebaseapp.com",
  projectId: "fusion-culinaria",
  storageBucket: "fusion-culinaria.firebasestorage.app",
  messagingSenderId: "1044943908073",
  appId: "1:1044943908073:web:b03d8f0aba5c3cdb739478"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const seedData = async () => {
    try {
        console.log("Iniciando migración a Firebase...");
        const rawData = fs.readFileSync('../../../docs/menu-data-clean.json');
        const data = JSON.parse(rawData);

        // 1. Guardar info del restaurante
        await setDoc(doc(db, "settings", "restaurant"), data.restaurant);
        console.log("Restaurante guardado.");

        // 2. Guardar categorías
        for (const cat of data.categories) {
            await setDoc(doc(db, "categories", cat.id), cat);
        }
        console.log(`Guardadas ${data.categories.length} categorías.`);

        // 3. Guardar items
        for (const item of data.items) {
            // Añadir campos por defecto para SaaS
            const enrichedItem = {
                ...item,
                active: true,
                image: "https://images.unsplash.com/photo-1514933651103-005eec06c04b?q=80&w=600&auto=format&fit=crop"
            };
            await setDoc(doc(db, "items", item.id), enrichedItem);
        }
        console.log(`Guardados ${data.items.length} items.`);

        console.log("¡Migración completada exitosamente!");
        process.exit(0);
    } catch (e) {
        console.error("Error migrando a Firebase: ", e);
        process.exit(1);
    }
};

seedData();
