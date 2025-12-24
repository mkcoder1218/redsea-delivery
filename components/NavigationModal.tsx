
import React from 'react';
import { Location } from '../types';

interface NavigationOverlayProps {
  origin: Location;
  destination: Location;
  onClose: () => void;
  mode?: 'integrated' | 'external' | null;
}

/**
 * A persistent UI overlay that appears while navigation is active.
 * Handles both Integrated (OSM) and External (Google Maps) feedback.
 */
export const NavigationOverlay: React.FC<NavigationOverlayProps> = ({ origin, destination, onClose, mode }) => {
  const realDirectionsUrl = `https://www.google.com/maps/dir/?api=1&origin=${origin.lat},${origin.lng}&destination=${destination.lat},${destination.lng}&travelmode=driving`;

  return (
    <div className="fixed bottom-0 md:bottom-8 left-0 md:left-auto md:right-8 w-full md:w-[360px] z-[200] p-4 md:p-0 animate-in slide-in-from-bottom-10 duration-500">
      <div className="bg-slate-900 rounded-[28px] shadow-2xl border border-white/10 overflow-hidden flex flex-col ring-1 ring-white/10">
        
        <div className="px-5 py-5 flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 ${mode === 'external' ? 'bg-blue-600' : 'bg-emerald-600'} rounded-xl flex items-center justify-center shadow-lg`}>
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2L4.5 20.29l.71.71L12 18l6.79 3 .71-.71z" />
                </svg>
              </div>
              <div>
                <h3 className="text-sm font-black text-white leading-none">
                  {mode === 'external' ? 'External Navigation' : 'Active Routing'}
                </h3>
                <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest mt-1">
                  {mode === 'external' ? 'Using Google Maps' : 'Using Internal System'}
                </p>
              </div>
            </div>
            <button 
              onClick={onClose} 
              className="w-8 h-8 flex items-center justify-center bg-white/5 hover:bg-white/10 rounded-full transition-colors text-white/30"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Status Indicators */}
          <div className="bg-white/5 rounded-2xl p-4 mb-4 border border-white/5">
            <div className="flex items-center gap-3 mb-3">
               <div className={`w-2 h-2 ${mode === 'external' ? 'bg-blue-500' : 'bg-emerald-500'} rounded-full animate-pulse`} />
               <span className="text-[10px] font-bold text-slate-300">
                 Proximity Guard Active
               </span>
            </div>
            <div className="h-0.5 w-full bg-white/5 rounded-full overflow-hidden">
               <div className={`h-full ${mode === 'external' ? 'bg-blue-500' : 'bg-emerald-500'} w-2/3 rounded-full animate-[progress_2s_infinite_linear]`} />
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-2">
            {mode === 'external' && (
              <a 
                href={realDirectionsUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-full py-3.5 bg-blue-600 rounded-xl flex items-center justify-center gap-3 text-[10px] font-black text-white hover:bg-blue-500 transition-all shadow-xl shadow-blue-900/40 uppercase tracking-widest"
              >
                Launch Google Maps
              </a>
            )}
            
            <p className="text-[8px] text-center font-bold text-slate-500 uppercase tracking-widest pt-1 italic">
              Move within 10m to finalize job
            </p>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes progress {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(200%); }
        }
      `}</style>
    </div>
  );
};

export const NavigationModal: React.FC<any> = () => null;
