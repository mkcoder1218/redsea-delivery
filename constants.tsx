
import React from 'react';

export const COLORS = {
  primary: '#10b981', // RedSea Mart Emerald
  secondary: '#3b82f6',
  accent: '#f59e0b',
  danger: '#ef4444',
  neutral: '#64748b',
};

export const TRANSLATIONS = {
  en: {
    brand: "RedSea Mart",
    login: "Login",
    logout: "Logout",
    phone: "Phone Number",
    password: "Password",
    latitude: "Latitude",
    longitude: "Longitude",
    radius: "Radius (km)",
    search: "Search",
    nearbyProducts: "Nearby Products",
    price: "Price",
    distance: "Distance",
    loading: "Loading...",
    noProducts: "No products found",
    error: "An error occurred, please try again",
    detectLocation: "Use Current Location",
    currency: "ETB",
    km: "km",
    marketplace: "Ethio Digital Marketplace",
    syncing: "Syncing Logistics Core"
  },
  am: {
    brand: "ሬድሲ ማርት",
    login: "ግባ",
    logout: "ውጣ",
    phone: "ስልክ ቁጥር",
    password: "የይለፍ ቃል",
    latitude: "ላቲቲዩድ",
    longitude: "ሎንግቲዩድ",
    radius: "ራዲየስ (ኪ.ሜ)",
    search: "ፈልግ",
    nearbyProducts: "በአቅራቢያ ያሉ ምርቶች",
    price: "ዋጋ",
    distance: "ርቀት",
    loading: "በመጫን ላይ...",
    noProducts: "ምንም ምርት አልተገኘም",
    error: "ስህተት ተከስቷል፣ እባክዎ እንደገና ይሞክሩ",
    detectLocation: "የአሁኑን ቦታ ተጠቀም",
    currency: "ብር",
    km: "ኪ.ሜ",
    marketplace: "የኢትዮጵያ ዲጂታል ገበያ",
    syncing: "የሎጂስቲክስ መረጃን በማመሳሰል ላይ"
  }
};

export type Language = 'en' | 'am';

export const ICONS = {
  Cart: (props: any) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="9" cy="21" r="1" />
      <circle cx="20" cy="21" r="1" />
      <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
    </svg>
  ),
  Location: (props: any) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  ),
  Globe: (props: any) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="12" cy="12" r="10" />
      <line x1="2" y1="12" x2="22" y2="12" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  )
};
