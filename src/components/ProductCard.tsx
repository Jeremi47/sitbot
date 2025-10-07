import { useNavigate } from 'react-router-dom';
import { Star, Download, Heart } from 'lucide-react';
import Card from './ui/Card';
import type { Product } from '../lib/supabase';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const navigate = useNavigate();

  const categoryColors = {
    discord: 'bg-[#4A66F0] text-white',
    chrome: 'bg-[#34A853] text-white',
    twitch: 'bg-[#9D00E8] text-white'
  };

  const categoryLabels = {
    discord: 'Discord',
    chrome: 'Chrome',
    twitch: 'Twitch'
  };

  return (
    <Card hover className="group cursor-pointer relative overflow-hidden" onClick={() => navigate(`/product/${product.id}`)}>
      <div className="absolute top-3 right-3 z-10">
        <button className="p-2 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-colors shadow-sm">
          <Heart className="w-4 h-4 text-[#4A4A4A] hover:fill-[#EF4444] hover:text-[#EF4444] transition-colors" />
        </button>
      </div>

      <div className="absolute top-3 left-3 z-10">
        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${categoryColors[product.category]}`}>
          {categoryLabels[product.category]}
        </span>
      </div>

      <div className="aspect-video bg-gradient-to-br from-[#F9FAFB] to-[#E5E7EB] rounded-lg mb-4 overflow-hidden">
        {product.image_url ? (
          <img
            src={product.image_url}
            alt={product.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-4xl">🤖</span>
          </div>
        )}
      </div>

      <div className="space-y-2">
        <h3 className="font-semibold text-lg text-[#1A1A1A] line-clamp-2 min-h-[3.5rem]">
          {product.title}
        </h3>

        {product.subtitle && (
          <p className="text-sm text-[#9CA3AF] line-clamp-2">{product.subtitle}</p>
        )}

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 fill-[#F59E0B] text-[#F59E0B]" />
            <span className="text-sm font-medium text-[#1A1A1A]">
              {product.rating_avg.toFixed(1)}
            </span>
          </div>
          <span className="text-sm text-[#9CA3AF]">({product.rating_count})</span>
          <div className="flex items-center gap-1 ml-auto">
            <Download className="w-4 h-4 text-[#9CA3AF]" />
            <span className="text-sm text-[#9CA3AF]">{product.sales}</span>
          </div>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-[#E5E7EB]">
          <span className="text-2xl font-bold text-[#0066FF]">{product.price}€</span>
          <button
            className="px-4 py-2 bg-[#0066FF] text-white text-sm font-semibold rounded-lg hover:bg-[#0052CC] transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/product/${product.id}`);
            }}
          >
            Acheter
          </button>
        </div>
      </div>
    </Card>
  );
}
