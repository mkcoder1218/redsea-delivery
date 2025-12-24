
import React from 'react';
import { RadiusOption } from '../types';

interface RadiusControlProps {
  currentRadius: number;
  onRadiusChange: (radius: RadiusOption) => void;
}

const RADIUS_OPTIONS: RadiusOption[] = [1, 3, 5, 10, 20];

const RadiusControl: React.FC<RadiusControlProps> = ({ currentRadius, onRadiusChange }) => {
  return (
    <div className="flex flex-col gap-3 p-1 rounded-2xl">
      <div className="flex justify-between items-center px-1 mb-1">
        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Scanning Radius</span>
        <span className="text-xs font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-100">{currentRadius} km</span>
      </div>
      <div className="flex justify-between gap-1.5">
        {RADIUS_OPTIONS.map((val) => (
          <button
            key={val}
            onClick={() => onRadiusChange(val)}
            className={`flex-1 py-2.5 rounded-xl text-xs font-black transition-all duration-300 ${
              currentRadius === val 
              ? 'bg-slate-800 text-white shadow-lg shadow-slate-200 scale-[1.02]' 
              : 'bg-white text-slate-400 border border-slate-100 hover:bg-slate-50 hover:text-slate-600'
            }`}
          >
            {val}k
          </button>
        ))}
      </div>
    </div>
  );
};

export default RadiusControl;
