
import { Product, Location } from '../types';

/**
 * Calculates distance in KM between two coordinates using Haversine formula
 */
export const calculateDistance = (loc1: Location, loc2: Location): number => {
  const R = 6371; // Radius of the earth in km
  const dLat = (loc2.lat - loc1.lat) * (Math.PI / 180);
  const dLon = (loc2.lng - loc1.lng) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(loc1.lat * (Math.PI / 180)) * Math.cos(loc2.lat * (Math.PI / 180)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return parseFloat((R * c).toFixed(2));
};

const PRODUCT_NAMES = [
  "Premium Espresso Beans", "Artisan Sourdough", "Organic Avocados", 
  "Fresh Sushi Platter", "Hydration Multipack", "Gourmet Dog Food",
  "Smart Water 1L", "Tech Repair Kit", "Local Honey", "Fresh Flowers Bouquet",
  "Double Beef Burger", "Classic Margherita", "Cold Brew Coffee", 
  "Essential Vitamin Mix", "Wireless Earbuds"
];

const STORES = [
  "Whole Foods", "Local Bakery", "Tech Hub", "Flower Garden", 
  "Burger King", "Sushi Master", "Coffee House", "Pet Paradise"
];

/**
 * Generates random products within a 25km radius of center
 * In a real app, this would be a backend API call.
 */
export const fetchNearbyProducts = (center: Location): Product[] => {
  return Array.from({ length: 40 }).map((_, i) => {
    const angle = Math.random() * Math.PI * 2;
    // Distribute randomly up to 20km
    const dist = Math.sqrt(Math.random()) * 0.2; // roughly 20-25km max spread
    const lat = center.lat + (dist * Math.cos(angle));
    const lng = center.lng + (dist * Math.sin(angle));
    
    const productLoc = { lat, lng };
    const distance = calculateDistance(center, productLoc);
    
    // Fix: Ensure returned objects match the Product (Order) interface
    return {
      id: `prod-${i}`,
      order_number: `ORD-${1000 + i}`,
      status: ['processing', 'delivered', 'pending', 'cancelled'][Math.floor(Math.random() * 4)],
      total: (Math.random() * 1000 + 50).toFixed(2),
      address: {
        address_line1: `${Math.floor(Math.random() * 999)} Addis St`,
        city: "Addis Ababa",
        lat,
        lng,
        distance
      },
      order_items: [
        {
          id: `item-${i}`,
          quantity: Math.floor(Math.random() * 5) + 1,
          price: (Math.random() * 100 + 10).toFixed(2),
          product: {
            id: `p-${i}`,
            name: PRODUCT_NAMES[Math.floor(Math.random() * PRODUCT_NAMES.length)],
            price: (Math.random() * 100 + 10).toFixed(2),
            product_images: [
              {
                file: {
                  path: `products/seed-${i}.jpg`
                }
              }
            ]
          }
        }
      ]
    };
  });
};
