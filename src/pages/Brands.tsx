
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { TestimonialsSection } from '@/components/TestimonialsSection';
import { Shield, Award, Users, Truck, Clock, Star, CheckCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

export default function Brands() {
  const { data: products = [] } = useQuery({
    queryKey: ['brand-products'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('is_active', true)
        .limit(12);
      
      if (error) throw error;
      return data;
    }
  });

  const brands = [
    { name: 'Dell', logo: '🖥️', description: 'Premium computer accessories', products: 45 },
    { name: 'HP', logo: '🖨️', description: 'Printer & computing solutions', products: 38 },
    { name: 'Canon', logo: '📷', description: 'Imaging & printing technology', products: 29 },
    { name: 'Logitech', logo: '🖱️', description: 'Computer peripherals', products: 52 },
    { name: 'Microsoft', logo: '💻', description: 'Software & hardware', products: 33 },
    { name: 'Epson', logo: '🖨️', description: 'Printing solutions', products: 27 }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Trusted Brands
            </h1>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              We partner with the world's leading technology brands to bring you the best products
            </p>
            <div className="flex items-center justify-center gap-8 text-sm">
              <div className="flex items-center">
                <Shield className="h-5 w-5 mr-2" />
                <span>Authorized Dealer</span>
              </div>
              <div className="flex items-center">
                <Award className="h-5 w-5 mr-2" />
                <span>Premium Quality</span>
              </div>
              <div className="flex items-center">
                <Users className="h-5 w-5 mr-2" />
                <span>Expert Support</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Brand Partners */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Brand Partners</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Discover products from industry-leading brands you trust
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {brands.map((brand) => (
              <Card key={brand.name} className="hover:shadow-lg transition-shadow duration-300 group">
                <CardContent className="p-8 text-center">
                  <div className="text-6xl mb-4 group-hover:scale-110 transition-transform duration-300">
                    {brand.logo}
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{brand.name}</h3>
                  <p className="text-gray-600 mb-4">{brand.description}</p>
                  <div className="bg-blue-50 rounded-full px-4 py-2 inline-block">
                    <span className="text-blue-600 font-medium">{brand.products} Products</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Authorized Retailer - Enhanced */}
      <section className="py-16 bg-gradient-to-r from-gray-900 to-gray-800 text-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <div className="inline-flex items-center px-6 py-3 bg-green-500 rounded-full mb-6">
              <CheckCircle className="h-6 w-6 mr-2" />
              <span className="font-semibold">Authorized Retailer</span>
            </div>
            <h2 className="text-4xl font-bold mb-4">Why Choose ByteCart?</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              As an authorized retailer, we guarantee authentic products, full warranty coverage, and exceptional service
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-blue-500 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Authentic Products</h3>
              <p className="text-gray-300">100% genuine products from authorized sources</p>
            </div>
            
            <div className="text-center">
              <div className="bg-green-500 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Award className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Full Warranty</h3>
              <p className="text-gray-300">Complete manufacturer warranty on all products</p>
            </div>
            
            <div className="text-center">
              <div className="bg-purple-500 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Truck className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Fast Shipping</h3>
              <p className="text-gray-300">Quick delivery with tracking and insurance</p>
            </div>
            
            <div className="text-center">
              <div className="bg-red-500 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Expert Support</h3>
              <p className="text-gray-300">Technical support from certified professionals</p>
            </div>
          </div>
        </div>
      </section>

      {/* Brand Certifications */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Certifications</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Certified and recognized by leading technology brands worldwide
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center">
              <CardContent className="p-8">
                <div className="bg-blue-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                  <Star className="h-10 w-10 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold mb-2">Premium Partner</h3>
                <p className="text-gray-600">Highest tier partnership with major brands</p>
              </CardContent>
            </Card>
            
            <Card className="text-center">
              <CardContent className="p-8">
                <div className="bg-green-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="h-10 w-10 text-green-600" />
                </div>
                <h3 className="text-xl font-bold mb-2">Quality Assured</h3>
                <p className="text-gray-600">ISO certified quality management systems</p>
              </CardContent>
            </Card>
            
            <Card className="text-center">
              <CardContent className="p-8">
                <div className="bg-purple-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                  <Clock className="h-10 w-10 text-purple-600" />
                </div>
                <h3 className="text-xl font-bold mb-2">Service Excellence</h3>
                <p className="text-gray-600">Award-winning customer service standards</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Featured Brand Products */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Featured Brand Products</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Discover the latest products from our trusted brand partners
            </p>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.slice(0, 8).map((product) => (
              <Card key={product.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-4">
                  <div className="aspect-square bg-gray-100 rounded-lg mb-4 flex items-center justify-center">
                    <span className="text-4xl">📱</span>
                  </div>
                  <h3 className="font-semibold text-sm mb-2 line-clamp-2">{product.title}</h3>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-primary">${product.price}</span>
                    {product.compare_price && (
                      <span className="text-sm text-gray-500 line-through">${product.compare_price}</span>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <TestimonialsSection />

      {/* CTA Section */}
      <section className="py-16 bg-blue-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Shop Premium Brands?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Explore our complete collection of authentic products from the world's leading technology brands
          </p>
          <button className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
            Shop All Products
          </button>
        </div>
      </section>
    </div>
  );
}
