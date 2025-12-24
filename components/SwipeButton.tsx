
import React, { useState, useRef, useEffect } from 'react';

interface SwipeButtonProps {
  onComplete: () => void;
  text: string;
  colorClass: string;
  disabled?: boolean;
}

const SwipeButton: React.FC<SwipeButtonProps> = ({ onComplete, text, colorClass, disabled = false }) => {
  const [isSwiping, setIsSwiping] = useState(false);
  const [startX, setStartX] = useState(0);
  const [translateX, setTranslateX] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  // Reset slider ONLY when NOT in a loading/disabled state
  useEffect(() => {
    if (!disabled) {
      setTranslateX(0);
      setIsSwiping(false);
    }
  }, [text, colorClass, disabled]);

  const handleStart = (e: React.MouseEvent | React.TouchEvent) => {
    if (disabled) return;
    setIsSwiping(true);
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    setStartX(clientX - translateX); 
  };

  const handleMove = (e: MouseEvent | TouchEvent) => {
    if (!isSwiping || !containerRef.current || disabled) return;
    
    const clientX = 'touches' in e ? (e as TouchEvent).touches[0].clientX : (e as MouseEvent).clientX;
    const deltaX = clientX - startX;
    
    const maxDelta = containerRef.current.clientWidth - 64; 

    if (deltaX >= 0 && deltaX <= maxDelta) {
      setTranslateX(deltaX);
    } else if (deltaX > maxDelta) {
      setTranslateX(maxDelta);
    } else {
      setTranslateX(0);
    }
  };

  const handleEnd = () => {
    if (!isSwiping || !containerRef.current || disabled) return;
    setIsSwiping(false);
    
    const maxDelta = containerRef.current.clientWidth - 64;
    if (translateX >= maxDelta * 0.8) {
      setTranslateX(maxDelta);
      onComplete();
    } else {
      setTranslateX(0);
    }
  };

  useEffect(() => {
    if (isSwiping && !disabled) {
      window.addEventListener('mousemove', handleMove);
      window.addEventListener('mouseup', handleEnd);
      window.addEventListener('touchmove', handleMove, { passive: false });
      window.addEventListener('touchend', handleEnd);
    }
    return () => {
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('mouseup', handleEnd);
      window.removeEventListener('touchmove', handleMove);
      window.removeEventListener('touchend', handleEnd);
    };
  }, [isSwiping, startX, translateX, disabled]);

  const maxDeltaCalculated = containerRef.current ? containerRef.current.clientWidth - 64 : 0;

  return (
    <div 
      ref={containerRef}
      className={`relative w-full h-16 rounded-[28px] p-1 flex items-center select-none overflow-hidden border transition-all duration-300 ${
        disabled 
        ? 'bg-white/5 border-white/20 ring-1 ring-white/10' 
        : 'bg-white/5 border-white/10 active:border-white/20'
      }`}
    >
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none px-16 text-center">
        <span className={`text-[10px] font-black uppercase tracking-[0.25em] transition-opacity duration-300 ${
          disabled ? 'text-white/20' : (translateX > 20 ? 'opacity-20' : 'text-white/40 animate-pulse')
        }`}>
          {text}
        </span>
      </div>
      
      <div 
        className={`absolute left-0 top-0 bottom-0 pointer-events-none transition-all duration-700 ${colorClass} ${disabled ? 'opacity-30' : 'opacity-10'}`}
        style={{ width: `${translateX + 64}px` }}
      />
      
      <div 
        className={`absolute left-1 h-14 w-14 rounded-[22px] flex items-center justify-center text-white shadow-2xl transition-all duration-300 z-10 touch-none ${
          disabled ? `${colorClass} cursor-not-allowed opacity-100` : `cursor-grab active:cursor-grabbing ${colorClass}`
        }`}
        style={{ 
          transform: `translateX(${disabled && maxDeltaCalculated ? maxDeltaCalculated : translateX}px)`,
          transition: isSwiping ? 'none' : 'transform 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
        }}
        onMouseDown={handleStart}
        onTouchStart={handleStart}
      >
        <div className="relative">
          {disabled ? (
            <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
          ) : (
            <svg className={`w-6 h-6 transition-transform duration-300 ${isSwiping ? 'scale-110' : 'scale-100'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3.5" d="M13 5l7 7-7 7M5 5l7 7-7 7" />
            </svg>
          )}
        </div>
      </div>
    </div>
  );
};

export default SwipeButton;
