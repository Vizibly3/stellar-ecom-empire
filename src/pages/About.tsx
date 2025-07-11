
import { Users, Award, Shield, Truck, Heart, Target } from 'lucide-react';

export default function About() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-white py-16">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              About ByteCart
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Your trusted partner for premium computer and printer accessories since 2020. 
              We're passionate about providing quality products that enhance your digital experience.
            </p>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Story</h2>
              <p className="text-gray-600 mb-4">
                ByteCart was founded with a simple mission: to make high-quality computer and printer 
                accessories accessible to everyone. What started as a small online store has grown into 
                a trusted destination for tech enthusiasts, professionals, and businesses.
              </p>
              <p className="text-gray-600 mb-4">
                We understand that the right accessories can make all the difference in your productivity 
                and creativity. That's why we carefully curate our product selection, partnering with 
                leading brands to bring you the latest innovations at competitive prices.
              </p>
              <p className="text-gray-600">
                Today, we serve thousands of customers worldwide, and we're committed to continuing 
                our growth while maintaining the personal touch and quality service that sets us apart.
              </p>
            </div>
            <div className="bg-gray-200 rounded-lg h-96 flex items-center justify-center">
              <img 
                src="https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=600&h=400&fit=crop" 
                alt="Our team"
                className="rounded-lg w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Values</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              These core values guide everything we do and shape our relationship with customers, 
              partners, and the community
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Quality First</h3>
              <p className="text-gray-600">
                We never compromise on quality. Every product we sell meets our high standards 
                for performance and reliability.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Customer Care</h3>
              <p className="text-gray-600">
                Your satisfaction is our priority. We provide exceptional support before, 
                during, and after your purchase.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Innovation</h3>
              <p className="text-gray-600">
                We stay ahead of technology trends to bring you the latest and most 
                innovative products in the market.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose ByteCart?</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              We're more than just an online store - we're your technology partner
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-sm text-center">
              <Shield className="h-12 w-12 text-blue-500 mx-auto mb-4" />
              <h3 className="font-bold text-gray-900 mb-2">Warranty Protection</h3>
              <p className="text-gray-600 text-sm">
                All products come with manufacturer warranty and our additional protection
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm text-center">
              <Truck className="h-12 w-12 text-green-500 mx-auto mb-4" />
              <h3 className="font-bold text-gray-900 mb-2">Fast Shipping</h3>
              <p className="text-gray-600 text-sm">
                Free shipping on orders over $50 with fast delivery options
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm text-center">
              <Users className="h-12 w-12 text-purple-500 mx-auto mb-4" />
              <h3 className="font-bold text-gray-900 mb-2">Expert Support</h3>
              <p className="text-gray-600 text-sm">
                Our knowledgeable team is here to help you find the right products
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm text-center">
              <Award className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
              <h3 className="font-bold text-gray-900 mb-2">Best Prices</h3>
              <p className="text-gray-600 text-sm">
                Competitive pricing with regular deals and exclusive offers
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Meet Our Team</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              The passionate people behind ByteCart who work every day to serve you better
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-32 h-32 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                <Users className="h-16 w-16 text-gray-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-1">Sarah Johnson</h3>
              <p className="text-blue-600 mb-2">CEO & Founder</p>
              <p className="text-gray-600 text-sm">
                Leading ByteCart's vision and strategy with 15+ years in tech retail
              </p>
            </div>

            <div className="text-center">
              <div className="w-32 h-32 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                <Users className="h-16 w-16 text-gray-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-1">Mike Chen</h3>
              <p className="text-blue-600 mb-2">Head of Product</p>
              <p className="text-gray-600 text-sm">
                Ensuring we stock the latest and greatest tech accessories
              </p>
            </div>

            <div className="text-center">
              <div className="w-32 h-32 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                <Users className="h-16 w-16 text-gray-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-1">Lisa Rodriguez</h3>
              <p className="text-blue-600 mb-2">Customer Success</p>
              <p className="text-gray-600 text-sm">
                Making sure every customer has an amazing experience with us
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gray-900 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Join thousands of satisfied customers who trust ByteCart for their tech needs
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-8 py-3 bg-white text-gray-900 hover:bg-gray-100 transition-colors rounded-md font-medium">
              Shop Now
            </button>
            <button className="px-8 py-3 bg-transparent border border-white text-white hover:bg-white hover:text-gray-900 transition-all duration-300 rounded-md font-medium">
              Contact Us
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
