
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { ProductCard } from '@/components/ProductCard';
import { Clock, Zap, Gift } from 'lucide-react';

export default function Deals() {
  const { data: products = [], isLoading } = useQuery({
    queryKey: ['deals-products'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('is_active', true)
        .not('compare_price', 'is', null)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    }
  });

  const featuredDeals = products.slice(0, 4);
  const flashDeals = products.slice(4, 8);
  const weeklyDeals = products.slice(8, 12);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-red-500 to-pink-500 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Amazing Deals & Offers
            </h1>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Save big on premium computer and printer accessories with our exclusive deals
            </p>
            <div className="flex items-center justify-center gap-8 text-sm">
              <div className="flex items-center">
                <Clock className="h-5 w-5 mr-2" />
                <span>Limited Time Offers</span>
              </div>
              <div className="flex items-center">
                <Zap className="h-5 w-5 mr-2" />
                <span>Flash Sales</span>
              </div>
              <div className="flex items-center">
                <Gift className="h-5 w-5 mr-2" />
                <span>Special Discounts</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Deals */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Featured Deals</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Don't miss out on these incredible offers - limited time only!
            </p>
          </div>

          {isLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading deals...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredDeals.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Flash Deals */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <div className="inline-flex items-center px-4 py-2 bg-red-100 text-red-600 rounded-full mb-4">
              <Zap className="h-4 w-4 mr-2" />
              <span className="font-medium">Flash Deals</span>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Lightning Fast Savings</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Grab these deals before they're gone - extremely limited quantities!
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {flashDeals.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Weekly Deals */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Weekly Specials</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              New deals every week - check back regularly for fresh savings
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {weeklyDeals.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Signup */}
      <section className="py-16 bg-gray-900 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Never Miss a Deal</h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Subscribe to our newsletter and be the first to know about exclusive offers and flash sales
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-md text-gray-900"
            />
            <button className="px-6 py-3 bg-red-500 hover:bg-red-600 transition-colors rounded-md font-medium">
              Subscribe
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
