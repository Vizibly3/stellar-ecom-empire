
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Truck, Shield, Headphones, Flame, TrendingUp, Crown, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useCart } from '@/hooks/useCart';
import { Database } from '@/integrations/supabase/types';
import { toast } from 'sonner';
import { HeroSlider } from '@/components/HeroSlider';
import { CategorySlider } from '@/components/CategorySlider';
import { ProductCard } from '@/components/ProductCard';
import { TestimonialsSection } from '@/components/TestimonialsSection';

type Product = Database['public']['Tables']['products']['Row'];
type Category = Database['public']['Tables']['categories']['Row'];

interface CategoryWithProducts extends Category {
  products: Product[];
}

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [topDeals, setTopDeals] = useState<Product[]>([]);
  const [categoriesWithProducts, setCategoriesWithProducts] = useState<CategoryWithProducts[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Move useCart hook to the top level, after other hooks
  const { addToCart } = useCart();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Fetch featured products
      const { data: products, error: productsError } = await supabase
        .from('products')
        .select('*')
        .eq('featured', true)
        .eq('is_active', true)
        .limit(8);
      
      if (productsError) {
        console.error('Error fetching featured products:', productsError);
        toast.error('Failed to load featured products');
      }
      
      // Fetch categories
      const { data: categoriesData, error: categoriesError } = await supabase
        .from('categories')
        .select('*')
        .eq('is_active', true)
        .limit(8);
      
      if (categoriesError) {
        console.error('Error fetching categories:', categoriesError);
        toast.error('Failed to load categories');
      }
      
      // Fetch top deals (products with compare_price)
      const { data: dealsData, error: dealsError } = await supabase
        .from('products')
        .select('*')
        .not('compare_price', 'is', null)
        .eq('is_active', true)
        .limit(6);

      if (dealsError) {
        console.error('Error fetching deals:', dealsError);
        toast.error('Failed to load deals');
      }

      // Fetch categories with their products for trending sections
      const { data: categoryProducts, error: categoryProductsError } = await supabase
        .from('categories')
        .select(`
          *,
          products:products(*)
        `)
        .eq('is_active', true)
        .limit(3);
      
      if (categoryProductsError) {
        console.error('Error fetching category products:', categoryProductsError);
        toast.error('Failed to load category products');
      }
      
      if (products) setFeaturedProducts(products);
      if (categoriesData) setCategories(categoriesData);
      if (dealsData) setTopDeals(dealsData);
      if (categoryProducts) setCategoriesWithProducts(categoryProducts as CategoryWithProducts[]);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to load page data');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async (productId: string, productTitle: string) => {
    try {
      await addToCart(productId);
      toast.success(`${productTitle} added to cart!`);
    } catch (error) {
      toast.error('Failed to add item to cart. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Slider */}
      <section className="container mx-auto px-4 py-8">
        <HeroSlider />
      </section>

      {/* Categories Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Shop by Category</h2>
            <Link to="/categories" className="text-primary hover:underline">
              View All Categories
            </Link>
          </div>
          <CategorySlider />
        </div>
      </section>

      {/* Top Deals Section */}
      {topDeals.length > 0 && (
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center">
                <Flame className="h-8 w-8 text-red-500 mr-3" />
                <h2 className="text-3xl font-bold text-gray-900">Top Deals</h2>
              </div>
              <Link to="/deals" className="text-primary hover:underline">
                View All Deals
              </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
              {topDeals.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Featured Products */}
      {featuredProducts.length > 0 && (
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900">Featured Products</h2>
              <Link to="/products" className="text-primary hover:underline">
                View All Products
              </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Category-specific trending sections */}
      {categoriesWithProducts.map((category, index) => (
        category.products && category.products.length > 0 && (
          <section key={category.id} className={`py-16 ${index % 2 === 0 ? 'bg-gray-50' : ''}`}>
            <div className="container mx-auto px-4">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center">
                  {index === 0 && <TrendingUp className="h-8 w-8 text-green-500 mr-3" />}
                  {index === 1 && <Crown className="h-8 w-8 text-yellow-500 mr-3" />}
                  {index === 2 && <Zap className="h-8 w-8 text-blue-500 mr-3" />}
                  <h2 className="text-3xl font-bold text-gray-900">
                    {index === 0 && `Trending in ${category.name}`}
                    {index === 1 && `Bestsellers in ${category.name}`}
                    {index === 2 && `Price Crash on ${category.name}`}
                  </h2>
                </div>
                <Link to={`/category/${category.slug}`} className="text-primary hover:underline">
                  View All
                </Link>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                {category.products.slice(0, 6).map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </div>
          </section>
        )
      ))}

      {/* Features */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-gray-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Truck className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Free Shipping</h3>
              <p className="text-gray-600">Free shipping on all orders over $50</p>
            </div>
            <div className="text-center">
              <div className="bg-gray-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Secure Payment</h3>
              <p className="text-gray-600">100% secure payment processing</p>
            </div>
            <div className="text-center">
              <div className="bg-gray-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Headphones className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">24/7 Support</h3>
              <p className="text-gray-600">Round-the-clock customer support</p>
            </div>
          </div>
        </div>
      </section>

      {/* Customer Testimonials */}
      <TestimonialsSection />

      {/* Newsletter */}
      <section className="py-16 bg-gray-900 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">Stay Updated</h2>
            <p className="text-gray-300 mb-8">
              Get the latest deals and product updates delivered to your inbox
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-lg text-gray-900"
              />
              <Button className="btn-primary px-6 py-3 bg-white text-black border-white hover:bg-gray-100">
                Subscribe
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
