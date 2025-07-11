
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { TestimonialsSection } from '@/components/TestimonialsSection';
import { ProductCard } from '@/components/ProductCard';
import { Shield, Award, Users, Truck, Clock, Star, CheckCircle, TrendingUp, Package, Building, Globe } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

export default function Brands() {
  const { data: products = [] } = useQuery({
    queryKey: ['brand-products'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('is_active', true)
        .limit(24);
      
      if (error) throw error;
      return data;
    }
  });

  const { data: categories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('is_active', true);
      
      if (error) throw error;
      return data;
    }
  });

  // Calculate dynamic brand stats based on actual data
  const totalProducts = products.length;
  const activeCategories = categories.length;
  const featuredProducts = products.filter(p => p.featured).length;
  const inStockProducts = products.filter(p => p.stock > 0).length;

  const brandStats = [
    { name: 'Total Products', count: totalProducts, icon: Package },
    { name: 'Categories', count: activeCategories, icon: Building },
    { name: 'Featured Items', count: featuredProducts, icon: Star },
    { name: 'In Stock', count: inStockProducts, icon: CheckCircle }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Trusted Brands
            </h1>
            <p className="text-xl mb-8 max-w-3xl mx-auto">
              We partner with the world's leading technology brands to bring you authentic, high-quality products with full warranty coverage
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-12">
              {brandStats.map((stat) => (
                <div key={stat.name} className="text-center">
                  <stat.icon className="h-8 w-8 mx-auto mb-2" />
                  <div className="text-3xl font-bold">{stat.count}</div>
                  <div className="text-sm opacity-90">{stat.name}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Brand Partnership Overview */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">Why Choose Our Brands?</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Every product in our store comes from verified, authorized partnerships with leading technology companies
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="text-center hover:shadow-xl transition-shadow duration-300">
              <CardContent className="p-8">
                <div className="bg-blue-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
                  <Shield className="h-10 w-10 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold mb-3">100% Authentic</h3>
                <p className="text-gray-600">All products are genuine and sourced directly from authorized distributors</p>
              </CardContent>
            </Card>
            
            <Card className="text-center hover:shadow-xl transition-shadow duration-300">
              <CardContent className="p-8">
                <div className="bg-green-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
                  <Award className="h-10 w-10 text-green-600" />
                </div>
                <h3 className="text-xl font-bold mb-3">Full Warranty</h3>
                <p className="text-gray-600">Complete manufacturer warranty coverage on every single product</p>
              </CardContent>
            </Card>
            
            <Card className="text-center hover:shadow-xl transition-shadow duration-300">
              <CardContent className="p-8">
                <div className="bg-purple-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
                  <Users className="h-10 w-10 text-purple-600" />
                </div>
                <h3 className="text-xl font-bold mb-3">Expert Support</h3>
                <p className="text-gray-600">Technical support from certified professionals and brand specialists</p>
              </CardContent>
            </Card>
            
            <Card className="text-center hover:shadow-xl transition-shadow duration-300">
              <CardContent className="p-8">
                <div className="bg-orange-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
                  <Globe className="h-10 w-10 text-orange-600" />
                </div>
                <h3 className="text-xl font-bold mb-3">Global Standards</h3>
                <p className="text-gray-600">International quality standards and compliance certifications</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Featured Products by Category */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Featured Brand Products</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Discover top-rated products from our trusted brand partners
            </p>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6">
            {products.slice(0, 12).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Premium Partnership Benefits */}
      <section className="py-16 bg-gradient-to-r from-gray-900 to-gray-800 text-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <div className="inline-flex items-center px-6 py-3 bg-green-500 rounded-full mb-6">
              <CheckCircle className="h-6 w-6 mr-2" />
              <span className="font-semibold">Authorized Premium Partner</span>
            </div>
            <h2 className="text-4xl font-bold mb-6">Partnership Excellence</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Our premium partnerships ensure you get the best products, prices, and service in the industry
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-blue-500 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
                <Shield className="h-10 w-10" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Verified Authenticity</h3>
              <p className="text-gray-300">Every product verified through official channels with authenticity certificates</p>
            </div>
            
            <div className="text-center">
              <div className="bg-green-500 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
                <Award className="h-10 w-10" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Extended Warranty</h3>
              <p className="text-gray-300">Enhanced warranty coverage beyond standard manufacturer terms</p>
            </div>
            
            <div className="text-center">
              <div className="bg-purple-500 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
                <Truck className="h-10 w-10" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Priority Shipping</h3>
              <p className="text-gray-300">Expedited processing and delivery with tracking and insurance included</p>
            </div>
            
            <div className="text-center">
              <div className="bg-red-500 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
                <Clock className="h-10 w-10" />
              </div>
              <h3 className="text-xl font-semibold mb-3">24/7 Support</h3>
              <p className="text-gray-300">Round-the-clock technical support from certified brand specialists</p>
            </div>
          </div>
        </div>
      </section>

      {/* Latest Arrivals */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center">
              <TrendingUp className="h-8 w-8 text-green-500 mr-3" />
              <h2 className="text-3xl font-bold text-gray-900">Latest Arrivals</h2>
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6">
            {products.slice(12, 18).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <TestimonialsSection />

      {/* CTA Section */}
      <section className="py-16 bg-blue-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Shop Premium Brands?</h2>
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            Join thousands of satisfied customers who trust us for authentic, high-quality technology products
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-colors text-lg">
              Shop All Products
            </button>
            <button className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors text-lg">
              View Categories
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
