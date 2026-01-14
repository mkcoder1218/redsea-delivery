
import { Order, Location } from '../types';

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
 * Generates random orders within a 25km radius of center
 * In a real app, this would be a backend API call.
 */
export const fetchNearbyProducts = (center: Location): Order[] => {
  return Array.from({ length: 40 }).map((_, i) => {
    const angle = Math.random() * Math.PI * 2;
    // Distribute randomly up to 20km
    const dist = Math.sqrt(Math.random()) * 0.2; // roughly 20-25km max spread
    const lat = center.lat + (dist * Math.cos(angle));
    const lng = center.lng + (dist * Math.sin(angle));

    const productLoc = { lat, lng };
    const distance = calculateDistance(center, productLoc);

    // Create a mock order matching the API structure
    return {
      id: `order-${i}`,
      user_id: `user-${Math.floor(Math.random() * 10)}`,
      order_number: `${1000000 + i}`,
      payment_status: ['pending', 'paid'][Math.floor(Math.random() * 2)],
      status: ['processing', 'delivered', 'pending', 'shipped'][Math.floor(Math.random() * 4)],
      address_id: `addr-${i}`,
      payment_method_id: null,
      subtotal: "0.00",
      shipping_fee: "0.00",
      tax: "0.00",
      total: (Math.random() * 1000 + 50).toFixed(2),
      estimated_delivery: null,
      promo_code_id: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      deletedAt: null,
      address: {
        id: `addr-${i}`,
        user_id: `user-${Math.floor(Math.random() * 10)}`,
        name: "Home",
        address_line1: `${Math.floor(Math.random() * 999)} Addis St`,
        address_line2: null,
        city: "Addis Ababa",
        state: "Addis Ababa",
        postal_code: "1000",
        country: "Ethiopia",
        lat,
        lng,
        is_default: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        deletedAt: null,
        distance
      },
      items: [
        {
          id: `item-${i}`,
          order_id: `order-${i}`,
          product_id: `p-${i}`,
          quantity: Math.floor(Math.random() * 5) + 1,
          price: (Math.random() * 100 + 10).toFixed(2),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          deletedAt: null,
          product: {
            isFavorited: false,
            id: `p-${i}`,
            name: PRODUCT_NAMES[Math.floor(Math.random() * PRODUCT_NAMES.length)],
            description: "Mock product description",
            price: (Math.random() * 100 + 10).toFixed(2),
            stock: 10,
            rating: "4.5",
            review_count: 0,
            featured: false,
            trending: false,
            category_id: `cat-${Math.floor(Math.random() * 5)}`,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            deletedAt: null,
            product_images: [
              {
                id: `img-${i}`,
                product_id: `p-${i}`,
                file_id: `file-${i}`,
                is_primary: true,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                deletedAt: null,
                file: {
                  id: `file-${i}`,
                  path: `products/seed-${i}.jpg`
                }
              }
            ]
          }
        }
      ],
      payment_method: null
    };
  });
};
