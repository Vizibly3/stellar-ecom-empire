
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Mail, Phone, MapPin } from 'lucide-react';
import { useSiteSettings } from '@/hooks/useSiteSettings';

const Footer = () => {
  const { settings } = useSiteSettings();

  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-md flex items-center justify-center">
                <span className="text-white font-bold text-sm">BK</span>
              </div>
              <span className="text-xl font-bold">
                {settings?.site_name || 'ByteKart'}
              </span>
            </div>
            <p className="text-gray-400 text-sm">
              {settings?.site_description || 'Your one-stop shop for computer and printer accessories'}
            </p>
            <div className="flex space-x-4">
              {settings?.facebook_handle && (
                <a href={`https://facebook.com/${settings.facebook_handle}`} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-blue-600">
                  <Facebook className="h-5 w-5" />
                </a>
              )}
              {settings?.twitter_handle && (
                <a href={`https://twitter.com/${settings.twitter_handle}`} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-blue-600">
                  <Twitter className="h-5 w-5" />
                </a>
              )}
              {settings?.instagram_handle && (
                <a href={`https://instagram.com/${settings.instagram_handle}`} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-blue-600">
                  <Instagram className="h-5 w-5" />
                </a>
              )}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/products" className="text-gray-400 hover:text-white">Products</Link></li>
              <li><Link to="/categories" className="text-gray-400 hover:text-white">Categories</Link></li>
              <li><Link to="/brands" className="text-gray-400 hover:text-white">Brands</Link></li>
              <li><Link to="/deals" className="text-gray-400 hover:text-white">Deals</Link></li>
              <li><Link to="/about" className="text-gray-400 hover:text-white">About Us</Link></li>
              <li><Link to="/contact" className="text-gray-400 hover:text-white">Contact</Link></li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Customer Service</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/shipping" className="text-gray-400 hover:text-white">Shipping Info</Link></li>
              <li><Link to="/returns" className="text-gray-400 hover:text-white">Returns & Exchanges</Link></li>
              <li><Link to="/terms" className="text-gray-400 hover:text-white">Terms & Conditions</Link></li>
              <li><Link to="/privacy" className="text-gray-400 hover:text-white">Privacy Policy</Link></li>
              <li><Link to="/disclaimer" className="text-gray-400 hover:text-white">Disclaimer</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Info</h3>
            <div className="space-y-3 text-sm">
              {settings?.email && (
                <div className="flex items-center space-x-2">
                  <Mail className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-400">{settings.email}</span>
                </div>
              )}
              {settings?.phone && (
                <div className="flex items-center space-x-2">
                  <Phone className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-400">{settings.phone}</span>
                </div>
              )}
              {settings?.address && (
                <div className="flex items-start space-x-2">
                  <MapPin className="h-4 w-4 text-gray-400 mt-0.5" />
                  <span className="text-gray-400">{settings.address}</span>
                </div>
              )}
              {settings?.business_hours && (
                <div className="text-gray-400">
                  <strong>Hours:</strong> {settings.business_hours}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
          <p>&copy; 2025 {settings?.site_name || 'ByteKart'}. All rights reserved.</p>
          <p className="mt-2">
            {settings?.shipping_info || 'Free shipping on orders over $50'} • {settings?.returns_policy || '30-day return policy'}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
