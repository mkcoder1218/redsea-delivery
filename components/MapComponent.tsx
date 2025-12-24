
import React, { useEffect, useRef, useState } from 'react';
import { Location, Order, OrderState } from '../types';

declare const L: any;

interface MapComponentProps {
  userLocation: Location;
  radiusKm: number;
  products: Order[];
  selectedProductId: string | null;
  onProductClick: (id: string) => void;
  orderState: OrderState;
}

const MapComponent: React.FC<MapComponentProps> = ({ 
  userLocation, 
  radiusKm, 
  products, 
  selectedProductId,
  onProductClick,
  orderState
}) => {
  const mapRef = useRef<any>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const markersRef = useRef<{ [key: string]: any }>({});
  const radiusCircleRef = useRef<any>(null);
  const userMarkerRef = useRef<any>(null);
  const routeLayerRef = useRef<any>(null);
  const destinationMarkerRef = useRef<any>(null);
  const [leafletLoaded, setLeafletLoaded] = useState(false);

  useEffect(() => {
    const checkL = () => {
      if (typeof L !== 'undefined') {
        setLeafletLoaded(true);
      } else {
        setTimeout(checkL, 100);
      }
    };
    checkL();
  }, []);

  useEffect(() => {
    if (!leafletLoaded || !mapContainerRef.current || mapRef.current) return;

    try {
      mapRef.current = L.map(mapContainerRef.current, {
        zoomControl: false,
        attributionControl: false,
        zoomSnap: 0.1
      }).setView([userLocation.lat, userLocation.lng], 13);

      L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        maxZoom: 19,
      }).addTo(mapRef.current);

      L.control.zoom({ position: 'bottomright' }).addTo(mapRef.current);
    } catch (e) {
      console.error("Leaflet initialization failed", e);
    }

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [leafletLoaded]);

  useEffect(() => {
    if (!leafletLoaded || !mapRef.current) return;

    if (!userMarkerRef.current) {
      const driverIcon = L.divIcon({
        className: 'custom-div-icon',
        html: `<div class="relative flex items-center justify-center">
                <div class="absolute w-12 h-12 bg-blue-500/20 rounded-full animate-pulse"></div>
                <div class="w-8 h-8 bg-blue-600 rounded-full border-4 border-white shadow-xl flex items-center justify-center text-white">
                  <svg viewBox="0 0 24 24" class="w-4 h-4" fill="currentColor">
                    <path d="M12 2L4.5 20.29l.71.71L12 18l6.79 3 .71-.71z" />
                  </svg>
                </div>
              </div>`,
        iconSize: [48, 48],
        iconAnchor: [24, 24]
      });
      userMarkerRef.current = L.marker([userLocation.lat, userLocation.lng], { icon: driverIcon, zIndexOffset: 1000 }).addTo(mapRef.current);
    } else {
      userMarkerRef.current.setLatLng([userLocation.lat, userLocation.lng]);
    }

    if (orderState === 'idle') {
      if (radiusCircleRef.current) {
        radiusCircleRef.current.setLatLng([userLocation.lat, userLocation.lng]);
        radiusCircleRef.current.setRadius(radiusKm * 1000);
        radiusCircleRef.current.setStyle({ opacity: 1, fillOpacity: 0.1 });
      } else {
        radiusCircleRef.current = L.circle([userLocation.lat, userLocation.lng], {
          radius: radiusKm * 1000,
          color: '#10b981',
          fillColor: '#10b981',
          fillOpacity: 0.1,
          weight: 2,
          dashArray: '5, 5'
        }).addTo(mapRef.current);
      }
      
      const bounds = radiusCircleRef.current.getBounds();
      mapRef.current.fitBounds(bounds, { padding: [40, 40], animate: true });
    } else {
      if (radiusCircleRef.current) {
        radiusCircleRef.current.setStyle({ opacity: 0, fillOpacity: 0 });
      }
    }
  }, [leafletLoaded, userLocation, radiusKm, orderState]);

  useEffect(() => {
    if (!leafletLoaded || !mapRef.current) return;

    const safeProducts = Array.isArray(products) ? products : [];
    const activeProduct = safeProducts.find(p => p.id === selectedProductId);

    if (routeLayerRef.current) {
      mapRef.current.removeLayer(routeLayerRef.current);
      routeLayerRef.current = null;
    }
    if (destinationMarkerRef.current) {
      mapRef.current.removeLayer(destinationMarkerRef.current);
      destinationMarkerRef.current = null;
    }

    if (orderState === 'shipping' && activeProduct) {
      const latlngs = [
        [userLocation.lat, userLocation.lng],
        [activeProduct.address.lat, activeProduct.address.lng]
      ];

      const routeGroup = L.layerGroup().addTo(mapRef.current);

      L.polyline(latlngs, {
        color: '#1a73e8',
        weight: 12,
        opacity: 0.3,
        lineCap: 'round',
        lineJoin: 'round'
      }).addTo(routeGroup);

      L.polyline(latlngs, {
        color: '#4285F4',
        weight: 8,
        opacity: 1,
        lineCap: 'round',
        lineJoin: 'round'
      }).addTo(routeGroup);

      routeLayerRef.current = routeGroup;

      const pinIcon = L.divIcon({
        className: 'destination-pin',
        html: `<div class="relative flex flex-col items-center">
                 <div class="w-8 h-8 bg-rose-600 rounded-full border-2 border-white shadow-2xl flex items-center justify-center text-white">
                    <svg viewBox="0 0 24 24" class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="3">
                      <path d="M12 21s-8-4.5-8-11.8A8 8 0 0 1 12 2a8 8 0 0 1 8 7.2c0 7.3-8 11.8-8 11.8z"/>
                      <circle cx="12" cy="9" r="3" fill="white"/>
                    </svg>
                 </div>
                 <div class="w-1 h-3 bg-rose-600 -mt-0.5 shadow-sm rounded-b-full"></div>
                 <div class="absolute -top-10 bg-white px-3 py-1 rounded-lg shadow-lg border border-slate-100 whitespace-nowrap">
                    <span class="text-[10px] font-black text-slate-800 uppercase tracking-tighter">Destination</span>
                 </div>
               </div>`,
        iconSize: [32, 48],
        iconAnchor: [16, 45]
      });

      destinationMarkerRef.current = L.marker([activeProduct.address.lat, activeProduct.address.lng], { 
        icon: pinIcon,
        zIndexOffset: 1100 
      }).addTo(mapRef.current);

      const bounds = L.latLngBounds(latlngs);
      mapRef.current.fitBounds(bounds, { 
        padding: [100, 100], 
        animate: true
      });
    }
  }, [leafletLoaded, orderState, selectedProductId, userLocation, products]);

  useEffect(() => {
    if (!leafletLoaded || !mapRef.current) return;

    const safeProducts = Array.isArray(products) ? products : [];
    const visibleProducts = orderState === 'shipping' ? [] : safeProducts;

    Object.keys(markersRef.current).forEach(id => {
      if (!visibleProducts.find(p => p.id === id)) {
        mapRef.current.removeLayer(markersRef.current[id]);
        delete markersRef.current[id];
      }
    });

    visibleProducts.forEach(product => {
      const isSelected = selectedProductId === product.id;
      if (!markersRef.current[product.id]) {
        const productIcon = L.divIcon({
          className: 'product-icon',
          html: `<div class="marker-container transition-all duration-300 ${isSelected ? 'scale-125 z-50' : 'scale-100 z-10'}">
                   <div class="w-6 h-6 ${isSelected ? 'bg-blue-600' : 'bg-slate-800'} rounded-full border-2 border-white shadow-md flex items-center justify-center text-white">
                     <svg viewBox="0 0 24 24" class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="3">
                       <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
                     </svg>
                   </div>
                 </div>`,
          iconSize: [24, 24],
          iconAnchor: [12, 12]
        });
        const marker = L.marker([product.address.lat, product.address.lng], { icon: productIcon })
          .addTo(mapRef.current)
          .on('click', () => onProductClick(product.id));
        markersRef.current[product.id] = marker;
      } else {
        const icon = L.divIcon({
          className: 'product-icon',
          html: `<div class="marker-container transition-all duration-300 ${isSelected ? 'scale-125 z-50' : 'scale-100 z-10'}">
                   <div class="w-6 h-6 ${isSelected ? 'bg-blue-600' : 'bg-slate-800'} rounded-full border-2 border-white shadow-md flex items-center justify-center text-white">
                     <svg viewBox="0 0 24 24" class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="3">
                       <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
                     </svg>
                   </div>
                 </div>`,
          iconSize: [24, 24],
          iconAnchor: [12, 12]
        });
        markersRef.current[product.id].setIcon(icon);
        if (isSelected) markersRef.current[product.id].setZIndexOffset(1000);
      }
    });
  }, [leafletLoaded, products, selectedProductId, orderState]);

  useEffect(() => {
    if (leafletLoaded && orderState === 'idle' && selectedProductId && markersRef.current[selectedProductId] && mapRef.current) {
      const marker = markersRef.current[selectedProductId];
      mapRef.current.panTo(marker.getLatLng(), { animate: true });
    }
  }, [leafletLoaded, selectedProductId, orderState]);

  return <div ref={mapContainerRef} className="w-full h-full" />;
};

export default MapComponent;
