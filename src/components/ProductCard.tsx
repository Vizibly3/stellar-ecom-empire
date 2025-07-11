
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, ArrowUpRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/hooks/useCart';
import { toast } from 'sonner';

interface Product {
  id: string;
  title: string;
  price: number;
  compare_price?: number;
  image_url?: string;
  slug: string;
  stock: number;
}

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();
  const [isLoading, setIsLoading] = useState(false);

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (product.stock <= 0) {
      toast.error('Sorry, this product is currently out of stock');
      return;
    }

    setIsLoading(true);
    try {
      await addToCart(product.id, 1);
      toast.success(`${product.title} added to cart!`);
    } catch (error) {
      toast.error('Failed to add item to cart. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const discountPercentage = product.compare_price 
    ? Math.round(((product.compare_price - product.price) / product.compare_price) * 100)
    : 0;

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300 group relative overflow-hidden">
      {/* Arrow Icon */}
      <div className="absolute top-3 right-3 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <ArrowUpRight className="h-5 w-5 text-gray-600" />
      </div>

      {/* Discount Badge */}
      {discountPercentage > 0 && (
        <div className="absolute top-3 left-3 z-10 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-medium">
          {discountPercentage}% OFF
        </div>
      )}

      <Link to={`/products/${product.slug}`} className="block">
        {/* Image Container with Padding */}
        <div className="p-4 pb-2">
          <div className="aspect-square overflow-hidden rounded-lg bg-gray-50">
            <img
              src={product.image_url || '/placeholder.svg'}
              alt={product.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>
        </div>

        {/* Content */}
        <div className="p-4 pt-2">
          <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-primary transition-colors">
            {product.title}
          </h3>

          {/* Price */}
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xl font-bold text-gray-900">
              ${product.price.toFixed(2)}
            </span>
            {product.compare_price && (
              <span className="text-sm text-gray-500 line-through">
                ${product.compare_price.toFixed(2)}
              </span>
            )}
          </div>

          {/* Stock Status */}
          <div className="mb-3">
            {product.stock > 0 ? (
              <span className="text-sm text-green-600 font-medium">
                In Stock ({product.stock} available)
              </span>
            ) : (
              <span className="text-sm text-red-600 font-medium">
                Out of Stock
              </span>
            )}
          </div>

          {/* Add to Cart Button */}
          <Button
            onClick={handleAddToCart}
            disabled={isLoading || product.stock <= 0}
            className="w-full bg-transparent border border-black text-black hover:bg-black hover:text-white transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ShoppingCart className="h-4 w-4 mr-2" />
            {isLoading ? 'Adding...' : 'Add to Cart'}
          </Button>
        </div>
      </Link>
    </div>
  );
}
