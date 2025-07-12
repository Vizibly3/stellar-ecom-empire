
import { useQuery } from '@tanstack/react-query';
import { useParams, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useCart } from '@/hooks/useCart';
import { toast } from 'sonner';
import { 
  ShoppingCart, 
  Truck, 
  Shield, 
  RefreshCw, 
  CheckCircle,
  ArrowLeft,
  Plus,
  Minus
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { TestimonialsSection } from '@/components/TestimonialsSection';
import { ProductCard } from '@/components/ProductCard';

export default function ProductDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  const { data: product, isLoading } = useQuery({
    queryKey: ['product', slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          categories (
            name,
            slug
          )
        `)
        .eq('slug', slug)
        .eq('is_active', true)
        .single();
      
      if (error) throw error;
      return data;
    }
  });

  const { data: relatedProducts = [] } = useQuery({
    queryKey: ['related-products', product?.category_id],
    queryFn: async () => {
      if (!product?.category_id) return [];
      
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('category_id', product.category_id)
        .eq('is_active', true)
        .neq('id', product.id)
        .limit(4);
      
      if (error) throw error;
      return data;
    },
    enabled: !!product?.category_id
  });

  const { data: topDeals = [] } = useQuery({
    queryKey: ['top-deals-product-detail'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .not('compare_price', 'is', null)
        .eq('is_active', true)
        .limit(4);

      if (error) throw error;
      return data;
    }
  });

  const { data: featuredProducts = [] } = useQuery({
    queryKey: ['featured-products-product-detail'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('featured', true)
        .eq('is_active', true)
        .limit(4);
      
      if (error) throw error;
      return data;
    }
  });

  const handleAddToCart = async () => {
    if (!product) return;
    
    if (product.stock <= 0) {
      toast.error('Sorry, this product is currently out of stock');
      return;
    }

    setIsAddingToCart(true);
    try {
      await addToCart(product.id, quantity);
      toast.success(`${product.title} added to cart!`);
    } catch (error) {
      toast.error('Failed to add item to cart. Please try again.');
    } finally {
      setIsAddingToCart(false);
    }
  };

  const increaseQuantity = () => {
    if (product && quantity < product.stock) {
      setQuantity(prev => prev + 1);
    }
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };

  const handleNavigation = (path: string) => {
    navigate(path);
    window.scrollTo(0, 0);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">Product Not Found</h2>
          <p className="text-gray-600 mb-4">The product you're looking for doesn't exist.</p>
          <Button onClick={() => handleNavigation('/products')}>
            Browse All Products
          </Button>
        </div>
      </div>
    );
  }

  const discountPercentage = product.compare_price 
    ? Math.round(((product.compare_price - product.price) / product.compare_price) * 100)
    : 0;

  const productImages = product.images && product.images.length > 0 
    ? product.images 
    : [product.image_url || '/placeholder.svg'];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <button onClick={() => handleNavigation('/')} className="hover:text-primary">
              Home
            </button>
            <span>/</span>
            <button onClick={() => handleNavigation('/products')} className="hover:text-primary">
              Products
            </button>
            {product.categories && (
              <>
                <span>/</span>
                <button onClick={() => handleNavigation(`/categories/${product.categories.slug}`)} className="hover:text-primary">
                  {product.categories.name}
                </button>
              </>
            )}
            <span>/</span>
            <span className="text-gray-900">{product.title}</span>
          </div>
        </div>
      </div>

      {/* Back Button */}
      <div className="container mx-auto px-4 py-4">
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="flex items-center space-x-2"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back</span>
        </Button>
      </div>

      {/* Product Details */}
      <div className="container mx-auto px-4 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="aspect-square bg-white rounded-lg overflow-hidden border">
              <img
                src={productImages[selectedImage]}
                alt={product.title}
                className="w-full h-full object-cover"
              />
            </div>
            {productImages.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {productImages.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`aspect-square bg-white rounded-lg overflow-hidden border-2 ${
                      selectedImage === index ? 'border-primary' : 'border-gray-200'
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${product.title} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.title}</h1>
              {product.categories && (
                <Badge variant="secondary" className="mb-4">
                  {product.categories.name}
                </Badge>
              )}

              {/* Price */}
              <div className="flex items-center space-x-4 mb-6">
                <span className="text-3xl font-bold text-gray-900">
                  ${product.price.toFixed(2)}
                </span>
                {product.compare_price && (
                  <>
                    <span className="text-xl text-gray-500 line-through">
                      ${product.compare_price.toFixed(2)}
                    </span>
                    <Badge className="bg-red-500 text-white">
                      {discountPercentage}% OFF
                    </Badge>
                  </>
                )}
              </div>
            </div>

            {/* Stock Status */}
            <div className="flex items-center space-x-2">
              {product.stock > 0 ? (
                <>
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span className="text-green-600 font-medium">
                    In Stock ({product.stock} available)
                  </span>
                </>
              ) : (
                <>
                  <span className="text-red-600 font-medium">Out of Stock</span>
                </>
              )}
            </div>

            {/* Quantity Selector */}
            <div className="flex items-center space-x-4">
              <span className="font-medium">Quantity:</span>
              <div className="flex items-center border rounded-lg">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={decreaseQuantity}
                  disabled={quantity <= 1}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="px-4 py-2 min-w-[3rem] text-center">{quantity}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={increaseQuantity}
                  disabled={!product.stock || quantity >= product.stock}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-4">
              <Button
                onClick={handleAddToCart}
                disabled={isAddingToCart || product.stock <= 0}
                className="w-full h-12 text-lg font-semibold"
              >
                <ShoppingCart className="h-5 w-5 mr-2" />
                {isAddingToCart ? 'Adding...' : 'Add to Cart'}
              </Button>
            </div>

            {/* Features */}
            <div className="space-y-3 pt-6 border-t">
              <div className="flex items-center space-x-3">
                <Truck className="h-5 w-5 text-green-500" />
                <span className="text-sm">Free shipping on orders over $50</span>
              </div>
              <div className="flex items-center space-x-3">
                <Shield className="h-5 w-5 text-blue-500" />
                <span className="text-sm">1 year warranty included</span>
              </div>
              <div className="flex items-center space-x-3">
                <RefreshCw className="h-5 w-5 text-orange-500" />
                <span className="text-sm">30-day return policy</span>
              </div>
            </div>
          </div>
        </div>

        {/* Product Description */}
        {product.description && (
          <div className="mt-16">
            <Card>
              <CardContent className="p-8">
                <h2 className="text-2xl font-semibold mb-6">Product Description</h2>
                <div className="prose max-w-none text-gray-700">
                  <p>{product.description}</p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-semibold mb-8">Related Products</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {relatedProducts.map((relatedProduct) => (
                <ProductCard key={relatedProduct.id} product={relatedProduct} />
              ))}
            </div>
          </div>
        )}

        {/* Top Deals Section */}
        {topDeals.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-semibold mb-8">Top Deals</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {topDeals.map((deal) => (
                <ProductCard key={deal.id} product={deal} />
              ))}
            </div>
          </div>
        )}

        {/* Featured Products */}
        {featuredProducts.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-semibold mb-8">Featured Products</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {featuredProducts.map((featured) => (
                <ProductCard key={featured.id} product={featured} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Testimonials Section */}
      <TestimonialsSection />
    </div>
  );
}
