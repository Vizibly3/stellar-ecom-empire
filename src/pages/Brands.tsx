
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { ProductCard } from '@/components/ProductCard';
import { Input } from '@/components/ui/input';
import { Search, Award, Star, TrendingUp } from 'lucide-react';

export default function Brands() {
  const [searchTerm, setSearchTerm] = useState('');

  const { data: products = [], isLoading } = useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('is_active', true);
      
      if (error) throw error;
      return data;
    }
  });

  // Extract brands from product titles (simplified approach)
  const brands = ['HP', 'Canon', 'Epson', 'Brother', 'Dell', 'Logitech', 'Microsoft', 'Apple'];
  
  const filteredBrands = brands.filter(brand => 
    brand.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getProductsByBrand = (brand: string) => {
    return products.filter(product => 
      product.title.toLowerCase().includes(brand.toLowerCase())
    ).slice(0, 4);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-white py-16">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Top Brands
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
              Shop from the world's leading technology brands
            </p>
            
            {/* Search */}
            <div className="max-w-md mx-auto relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search brands..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Brand Stats */}
      <section className="py-12 bg-white border-b">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="flex flex-col items-center">
              <Award className="h-12 w-12 text-blue-500 mb-4" />
              <h3 className="text-2xl font-bold text-gray-900">50+</h3>
              <p className="text-gray-600">Trusted Brands</p>
            </div>
            <div className="flex flex-col items-center">
              <Star className="h-12 w-12 text-yellow-500 mb-4" />
              <h3 className="text-2xl font-bold text-gray-900">4.8/5</h3>
              <p className="text-gray-600">Average Rating</p>
            </div>
            <div className="flex flex-col items-center">
              <TrendingUp className="h-12 w-12 text-green-500 mb-4" />
              <h3 className="text-2xl font-bold text-gray-900">1000+</h3>
              <p className="text-gray-600">Products Available</p>
            </div>
          </div>
        </div>
      </section>

      {/* Brands Grid */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          {isLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading brands...</p>
            </div>
          ) : (
            <div className="space-y-16">
              {filteredBrands.map((brand) => {
                const brandProducts = getProductsByBrand(brand);
                if (brandProducts.length === 0) return null;

                return (
                  <div key={brand} className="bg-white rounded-lg p-8 shadow-sm">
                    <div className="flex items-center justify-between mb-8">
                      <div>
                        <h2 className="text-3xl font-bold text-gray-900 mb-2">{brand}</h2>
                        <p className="text-gray-600">
                          Discover premium {brand} products for all your tech needs
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-blue-600">
                          {brandProducts.length}+
                        </div>
                        <div className="text-sm text-gray-500">Products</div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                      {brandProducts.map((product) => (
                        <ProductCard key={product.id} product={product} />
                      ))}
                    </div>

                    {brandProducts.length >= 4 && (
                      <div className="text-center mt-8">
                        <button className="px-6 py-3 bg-transparent border border-black text-black hover:bg-black hover:text-white transition-all duration-300 rounded-md font-medium">
                          View All {brand} Products
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Partnership Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">
            Authorized Retailer
          </h2>
          <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto">
            We are proud to be an authorized retailer for all major brands, ensuring 
            you receive genuine products with full manufacturer warranty
          </p>
          
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-8 items-center opacity-60">
            {brands.map((brand) => (
              <div key={brand} className="text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                  <span className="font-bold text-gray-600">{brand.slice(0, 2)}</span>
                </div>
                <p className="text-sm text-gray-500">{brand}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
