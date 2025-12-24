
import React, { useState, useEffect, useCallback } from 'react';
import MapComponent from './components/MapComponent';
import LoginPage from './components/LoginPage';
import ProductCard from './components/ProductCard';
import SwipeButton from './components/SwipeButton';
import { NavigationOverlay } from './components/NavigationModal';
import { TRANSLATIONS, ICONS, Language } from './constants';
import { searchByCoordinates, updateOrderStatus } from './services/api';
import { calculateDistance } from './services/mockData';
import { Order, OrderState } from './types';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return !!localStorage.getItem('redseamart_token');
  });
  
  const [products, setProducts] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [error, setError] = useState('');
  const [orderPanelError, setOrderPanelError] = useState('');
  const [lang, setLang] = useState<Language>(() => {
    return (localStorage.getItem('redseamart_lang') as Language) || 'en';
  });
  
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [orderState, setOrderState] = useState<OrderState>('idle');
  const [navMode, setNavMode] = useState<'integrated' | 'external' | null>(null);
  
  const [lat, setLat] = useState<number>(9.03);
  const [lng, setLng] = useState<number>(38.74);
  const [radius, setRadius] = useState<number>(10);

  const t = TRANSLATIONS[lang];
  const selectedOrder = products.find(p => p.id === selectedProductId);

  const toggleLanguage = () => {
    const newLang = lang === 'en' ? 'am' : 'en';
    setLang(newLang);
    localStorage.setItem('redseamart_lang', newLang);
  };

  const handleLogin = (token: string) => {
    localStorage.setItem('redseamart_token', token);
    setIsAuthenticated(true);
    handleSearch(undefined, token);
  };

  const handleLogout = useCallback(() => {
    localStorage.removeItem('redseamart_token');
    setIsAuthenticated(false);
    setProducts([]);
    setOrderState('idle');
    setSelectedProductId(null);
    setNavMode(null);
  }, []);

  const handleSearch = async (e?: React.FormEvent, overrideToken?: string) => {
    if (e) e.preventDefault();
    if (orderState !== 'idle') return; 

    const token = overrideToken || localStorage.getItem('redseamart_token');
    if (!token) {
      handleLogout();
      return;
    }

    setError('');
    setIsLoading(true);
    
    try {
      const response = await searchByCoordinates(lat, lng, radius, token);
      let results: Order[] = [];
      if (response?.data?.rows) results = response.data.rows;
      else if (response?.data && Array.isArray(response.data)) results = response.data;
      else if (Array.isArray(response)) results = response;

      setProducts(results); 
      if (results.length === 0) setError(t.noProducts);
    } catch (err: any) {
      if (err.status === 401 || err.status === 403) handleLogout();
      else setError(err.message || t.error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStartDelivery = async () => {
    if (!selectedProductId) return;
    setIsUpdatingStatus(true);
    setOrderPanelError('');

    const token = localStorage.getItem('redseamart_token');
    try {
      await updateOrderStatus(selectedProductId, 'shipped', token);
      setOrderState('shipping');
      // No longer showing modal, user will choose in the panel
    } catch (err: any) {
      if (err.status === 401 || err.status === 403) handleLogout();
      else setOrderPanelError(err.message || 'Pickup sync failed');
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const selectNavigation = (mode: 'integrated' | 'external') => {
    setNavMode(mode);
    if (mode === 'external' && selectedOrder) {
      const url = `https://www.google.com/maps/dir/?api=1&origin=${lat},${lng}&destination=${selectedOrder.address.lat},${selectedOrder.address.lng}&travelmode=driving`;
      window.open(url, '_blank');
    }
  };

  const handleCompleteDelivery = async () => {
    if (!selectedProductId || !selectedOrder) return;
    setIsUpdatingStatus(true);
    setOrderPanelError('');

    const getCurrentPos = (): Promise<GeolocationPosition> => 
      new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, { 
          enableHighAccuracy: true,
          timeout: 10000 
        });
      });

    try {
      const pos = await getCurrentPos();
      const currentLoc = { lat: pos.coords.latitude, lng: pos.coords.longitude };
      const destLoc = { lat: selectedOrder.address.lat, lng: selectedOrder.address.lng };
      
      const distanceKm = calculateDistance(currentLoc, destLoc);
      const distanceMeters = Math.round(distanceKm * 1000);

      // PROXIMITY CHECK: 10 meters
      if (distanceMeters > 10) {
        throw new Error(`Out of Range: You are ${distanceMeters}m from the destination. Please move within 10m to finalize dropoff.`);
      }

      const token = localStorage.getItem('redseamart_token');
      await updateOrderStatus(selectedProductId, 'delivered', token);
      setOrderState('delivered');
      
      setTimeout(() => {
        setProducts(prev => prev.filter(p => p.id !== selectedProductId));
        setSelectedProductId(null);
        setOrderState('idle');
        setNavMode(null);
      }, 2500);
    } catch (err: any) {
      setOrderPanelError(err.message || 'Location verification failed.');
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const detectLocation = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setLat(pos.coords.latitude);
          setLng(pos.coords.longitude);
        },
        () => setError('Location permission denied')
      );
    }
  };

  useEffect(() => {
    if (isAuthenticated) handleSearch();
  }, []);

  if (!isAuthenticated) return (
    <LoginPage onLogin={handleLogin} currentLang={lang} onLangToggle={toggleLanguage} />
  );

  return (
    <div className="h-screen w-screen flex flex-col md:flex-row bg-slate-50 overflow-hidden relative">
      {/* Sidebar Task List */}
      <aside className={`w-full md:w-[400px] h-full bg-white border-r border-slate-200 flex flex-col z-[60] shadow-xl transition-all duration-500 ease-in-out ${orderState !== 'idle' ? 'md:-translate-x-full opacity-0 pointer-events-none' : 'opacity-100'}`}>
        <header className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
             <div className="bg-emerald-500 p-2 rounded-xl text-white shadow-lg shadow-emerald-500/20">
                <ICONS.Cart className="w-6 h-6" />
             </div>
             <div>
               <h1 className="text-xl font-black text-slate-800 uppercase tracking-tight leading-none">{t.brand}</h1>
               <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mt-1">Logistics Partner</p>
             </div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={toggleLanguage} className="p-2 bg-slate-50 hover:bg-slate-100 rounded-lg text-slate-600 border border-slate-100 transition-colors">
              <span className="text-[10px] font-black uppercase">{lang === 'en' ? 'AM' : 'EN'}</span>
            </button>
            <button onClick={handleLogout} className="p-2 text-slate-400 hover:text-rose-500 transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </button>
          </div>
        </header>

        <div className="p-6 space-y-4 bg-slate-50/50">
          <button type="button" onClick={detectLocation} className="w-full flex items-center justify-center gap-2 py-3 bg-white hover:bg-slate-50 rounded-xl text-[10px] font-black text-slate-600 border border-slate-200 shadow-sm transition-all uppercase tracking-widest">
            <ICONS.Location className="w-4 h-4 text-emerald-500" /> {t.detectLocation}
          </button>
          <div className="grid grid-cols-2 gap-3">
            <div className="relative">
              <span className="absolute top-2 left-3 text-[8px] font-black text-slate-400 uppercase">Lat</span>
              <input type="number" step="any" value={lat} onChange={e => setLat(Number(e.target.value))} className="w-full pt-5 pb-2 px-3 bg-white border border-slate-200 rounded-xl text-xs font-bold outline-none" />
            </div>
            <div className="relative">
              <span className="absolute top-2 left-3 text-[8px] font-black text-slate-400 uppercase">Lng</span>
              <input type="number" step="any" value={lng} onChange={e => setLng(Number(e.target.value))} className="w-full pt-5 pb-2 px-3 bg-white border border-slate-200 rounded-xl text-xs font-bold outline-none" />
            </div>
          </div>
          <button onClick={() => handleSearch()} disabled={isLoading} className="w-full py-4 bg-slate-900 hover:bg-black text-white font-black rounded-2xl shadow-xl shadow-slate-900/20 transition-all flex items-center justify-center gap-3">
            {isLoading ? <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" /> : <span className="uppercase tracking-widest text-xs">{t.search}</span>}
          </button>
        </div>

        <div className="flex-grow overflow-y-auto px-6 pb-6 scroll-smooth">
          <div className="flex items-center justify-between mb-4 sticky top-0 bg-white py-4 z-10 border-b border-slate-50">
            <h2 className="text-xs font-black text-slate-800 uppercase tracking-widest">{t.nearbyProducts}</h2>
            <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md">{products.length} found</span>
          </div>
          
          {products.length > 0 ? (
            <div className="space-y-4">
              {products.map(p => (
                <ProductCard key={p.id} product={p} isSelected={selectedProductId === p.id} onClick={() => setSelectedProductId(p.id)} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-center text-slate-400 font-bold text-xs uppercase tracking-widest">
               <ICONS.Cart className="w-8 h-8 text-slate-200 mb-4" />
               {isLoading ? "Syncing..." : t.noProducts}
            </div>
          )}
        </div>
      </aside>

      {/* Active Work Overlay - THE ORDER PANEL */}
      {selectedOrder && (
        <div className={`fixed inset-y-0 left-0 w-full md:w-[400px] bg-slate-900 text-white z-[110] shadow-2xl transition-all duration-700 ease-out-expo flex flex-col ${orderState === 'delivered' ? 'translate-x-[-100%]' : 'translate-x-0'}`}>
          <div className="p-8 flex-grow flex flex-col overflow-y-auto">
            <div className="flex justify-between items-start mb-10">
              <div className="animate-in fade-in slide-in-from-left-4 duration-500">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full mb-4">
                  <div className={`w-1.5 h-1.5 rounded-full animate-pulse ${orderState === 'shipping' ? 'bg-blue-400' : 'bg-emerald-500'}`} />
                  <span className={`text-[9px] font-black uppercase tracking-widest ${orderState === 'shipping' ? 'text-blue-400' : 'text-emerald-400'}`}>
                    {orderState === 'idle' ? 'Pickup Confirmation' : 'In Transit'}
                  </span>
                </div>
                <h2 className="text-3xl font-black tracking-tighter">#{selectedOrder.order_number}</h2>
                <div className="flex items-center gap-2 mt-2 text-slate-400">
                  <ICONS.Location className="w-3 h-3 text-rose-500" />
                  <p className="text-[10px] font-bold uppercase tracking-tight truncate max-w-[200px]">{selectedOrder.address.address_line1}</p>
                </div>
              </div>
              {orderState === 'idle' && (
                <button onClick={() => setSelectedProductId(null)} className="p-3 bg-white/5 hover:bg-white/10 rounded-2xl border border-white/5">
                  <svg className="w-5 h-5 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </button>
              )}
            </div>

            <div className="space-y-6 mb-12 flex-grow">
              {/* Order Selection Choice (Internal vs External) if state is shipping and no mode selected */}
              {orderState === 'shipping' && !navMode ? (
                <div className="p-6 bg-white/5 rounded-[32px] border border-white/10 animate-in zoom-in-95 duration-500">
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-center mb-6">Select Navigation Method</p>
                   <div className="space-y-3">
                     <button onClick={() => selectNavigation('integrated')} className="w-full py-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl flex flex-col items-center gap-0.5 transition-all">
                       <span className="text-xs font-black uppercase">Internal Map</span>
                       <span className="text-[8px] font-bold text-slate-500">Stay in RedSea Mart</span>
                     </button>
                     <button onClick={() => selectNavigation('external')} className="w-full py-4 bg-blue-600 hover:bg-blue-500 rounded-2xl flex flex-col items-center gap-0.5 transition-all">
                       <span className="text-xs font-black uppercase">Google Maps</span>
                       <span className="text-[8px] font-bold text-white/60">Open External App</span>
                     </button>
                   </div>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white/5 p-4 rounded-3xl border border-white/5">
                      <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Items</p>
                      <p className="text-xl font-black">{selectedOrder.order_items.length}</p>
                    </div>
                    <div className="bg-white/5 p-4 rounded-3xl border border-white/5">
                      <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Payout</p>
                      <p className="text-xl font-black text-emerald-400">{selectedOrder.total} ETB</p>
                    </div>
                  </div>

                  <div className="bg-white/5 rounded-3xl overflow-hidden border border-white/5">
                    <div className="p-4 border-b border-white/5 bg-white/2 flex justify-between items-center">
                       <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Manifest</p>
                       {navMode && (
                         <button onClick={() => setNavMode(null)} className="text-[8px] font-black text-blue-400 uppercase bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20 hover:bg-blue-500/20 transition-colors">Change Nav</button>
                       )}
                    </div>
                    <div className="divide-y divide-white/5">
                      {selectedOrder.order_items.map((item) => (
                        <div key={item.id} className="p-4 flex justify-between items-center">
                          <div className="min-w-0">
                            <p className="text-[11px] font-black truncate">{item.product.name}</p>
                            <p className="text-[9px] font-bold text-slate-500">QTY: {item.quantity}</p>
                          </div>
                          <p className="text-[10px] font-black text-slate-300">{item.price} ETB</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>

            <div className="mt-auto space-y-4">
              {orderPanelError && (
                <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl animate-in fade-in slide-in-from-bottom-2 duration-300">
                  <div className="flex gap-3">
                    <div className="flex-shrink-0 w-8 h-8 bg-rose-500 rounded-xl flex items-center justify-center text-white">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" strokeWidth="3"/></svg>
                    </div>
                    <div className="flex flex-col">
                      <p className="text-[10px] font-bold text-rose-400 leading-tight">{orderPanelError}</p>
                      <button onClick={() => setOrderPanelError('')} className="text-[8px] font-black text-rose-500 uppercase mt-2 w-fit">Dismiss</button>
                    </div>
                  </div>
                </div>
              )}

              {/* Only show Swipe if we are ready (either idle or shipping with a mode chosen) */}
              {(orderState === 'idle' || (orderState === 'shipping' && navMode)) && (
                <SwipeButton 
                  disabled={isUpdatingStatus}
                  onComplete={orderState === 'idle' ? handleStartDelivery : handleCompleteDelivery}
                  text={isUpdatingStatus ? "Syncing..." : (orderState === 'idle' ? "Swipe to Confirm Pickup" : "Swipe to Dropoff")}
                  colorClass={orderState === 'idle' ? "bg-emerald-500" : "bg-blue-600"}
                />
              )}
              
              {orderState === 'delivered' && (
                <div className="mt-6 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-center justify-center gap-3 animate-bounce">
                  <span className="text-emerald-400 font-black uppercase text-xs tracking-widest">Job Synchronized!</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <main className="flex-grow relative h-full bg-slate-100 overflow-hidden">
        <MapComponent 
          userLocation={{ lat, lng }}
          radiusKm={radius}
          products={products}
          selectedProductId={selectedProductId}
          onProductClick={(id) => { if (orderState === 'idle') setSelectedProductId(id); }}
          orderState={orderState}
        />
        
        {orderState === 'shipping' && navMode && selectedOrder && (
          <NavigationOverlay 
            origin={{ lat, lng }} 
            destination={selectedOrder.address} 
            onClose={() => {
              setOrderState('idle');
              setNavMode(null);
              setSelectedProductId(null);
            }} 
            mode={navMode}
          />
        )}

        {/* Global Notifications */}
        {error && (
          <div className="absolute top-6 left-1/2 -translate-x-1/2 z-[200] bg-slate-900 text-white px-6 py-4 rounded-3xl shadow-2xl flex items-center gap-4 animate-in slide-in-from-top-10 duration-300 border border-white/10">
             <div className="flex-shrink-0 w-8 h-8 bg-rose-500 rounded-full flex items-center justify-center text-white">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" strokeWidth="2.5"/></svg>
             </div>
             <span className="font-bold text-xs">{error}</span>
             <button onClick={() => setError('')} className="ml-auto p-2 hover:bg-white/10 rounded-xl"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12" strokeWidth="3"/></svg></button>
          </div>
        )}
      </main>

      <style>{`
        .ease-out-expo {
          transition-timing-function: cubic-bezier(0.19, 1, 0.22, 1);
        }
      `}</style>
    </div>
  );
};

export default App;
