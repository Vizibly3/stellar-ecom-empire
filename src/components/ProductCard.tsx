
import { useState } from 'react';
import { ShoppingCart, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useCart } from '@/hooks/useCart';
import { toast } from 'sonner';

interface Product {
  id: string;
  title: string;
  price: number;
  compare_price?: number;
  image_url?: string;
}

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { addToCart } = useCart();

  const handleAddToCart = async () => {
    setIsLoading(true);
    try {
      await addToCart(product.id);
      toast.success(`${product.title} added to cart!`);
    } catch (error) {
      toast.error('Failed to add item to cart. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const calculateDiscount = (price: number, comparePrice: number) => {
    return Math.round(((comparePrice - price) / comparePrice) * 100);
  };

  return (
    <Card className="group hover:shadow-xl transition-all duration-300 bg-white relative overflow-hidden border border-gray-200 hover:border-gray-300 w-64">
      <div className="absolute top-3 right-3 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        <div className="bg-white rounded-full p-1 shadow-md">
          <ArrowRight className="h-4 w-4 text-gray-600" />
        </div>
      </div>
      
      <CardContent className="p-4">
        <div className="relative aspect-square overflow-hidden rounded-lg mb-4 bg-gray-50 p-3">
          <img
            src={product.image_url || 'https://images.unsplash.com/photo-1518717758536-85ae29035b6d?w=400'}
            alt={product.title}
            className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
          />
          {product.compare_price && (
            <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded text-xs font-bold">
              -{calculateDiscount(product.price, product.compare_price)}%
            </div>
          )}
        </div>
        
        <div className="space-y-3">
          <h3 className="font-semibold text-gray-900 text-sm leading-tight line-clamp-2 group-hover:text-primary transition-colors duration-200">
            {product.title}
          </h3>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-lg font-bold text-gray-900">${product.price}</span>
              {product.compare_price && (
                <span className="text-sm text-gray-500 line-through">
                  ${product.compare_price}
                </span>
              )}
            </div>
          </div>
          
          <Button
            onClick={handleAddToCart}
            disabled={isLoading}
            className="w-full btn-primary text-sm py-2 h-10"
          >
            <ShoppingCart className="h-4 w-4 mr-2" />
            {isLoading ? 'Adding...' : 'Add to Cart'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
