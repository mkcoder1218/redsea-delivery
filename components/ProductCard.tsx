
import React from 'react';
import { Order } from '../types';

interface ProductCardProps {
  product: Order; // renamed to keep generic but using Order type
  isSelected: boolean;
  onClick: () => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, isSelected, onClick }) => {
  const firstItem = product.order_items?.[0];
  const imagePath = firstItem?.product?.product_images?.[0]?.file?.path;
  const imageUrl = imagePath 
    ? `https://api.redseamart.et/${imagePath}` 
    : `https://picsum.photos/seed/${product.id}/200/200`;

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'processing': return 'bg-blue-500';
      case 'delivered': return 'bg-emerald-500';
      case 'cancelled': return 'bg-rose-500';
      case 'pending': return 'bg-amber-500';
      default: return 'bg-slate-400';
    }
  };

  return (
    <div 
      onClick={onClick}
      className={`group flex items-center gap-4 p-3 rounded-2xl transition-all duration-300 cursor-pointer border-2 ${
        isSelected 
        ? 'border-emerald-500 bg-emerald-50/50' 
        : 'border-transparent bg-white hover:bg-slate-50 hover:shadow-sm'
      }`}
    >
      <div className="relative flex-shrink-0 w-16 h-16 rounded-xl overflow-hidden bg-slate-100 shadow-inner">
        <img 
          src={imageUrl} 
          alt={product.order_number} 
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className={`absolute top-1 left-1 w-3 h-3 rounded-full border-2 border-white ${getStatusColor(product.status)}`} title={product.status} />
      </div>
      
      <div className="flex-grow min-w-0">
        <div className="flex justify-between items-start mb-0.5">
          <h3 className="text-sm font-black text-slate-800 truncate leading-tight uppercase tracking-tight">
            #{product.order_number}
          </h3>
          <span className="text-sm font-black text-emerald-600">{product.total} ETB</span>
        </div>
        
        <p className="text-[10px] font-bold text-slate-500 mb-1 truncate uppercase tracking-wider">
          {product.address?.address_line1 || 'No address'}, {product.address?.city || ''}
        </p>
        
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            <svg className="w-3 h-3 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span className="text-[10px] font-bold text-slate-400">{product.address?.distance?.toFixed(2) || '0'} km</span>
          </div>
          <div className="flex items-center gap-1">
             <div className="w-1.5 h-1.5 bg-slate-300 rounded-full" />
            <span className="text-[10px] font-bold text-slate-400">{product.order_items?.length} Items</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
