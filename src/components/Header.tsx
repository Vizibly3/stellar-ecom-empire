
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, User, Search, Menu, X, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/hooks/useAuth';
import { useCart } from '@/hooks/useCart';
import { siteConfig } from '@/config/site';
import { AuthModal } from './AuthModal';

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const { user, signOut } = useAuth();
  const { totalItems } = useCart();

  return (
    <>
      <header className="border-b bg-white sticky top-0 z-50">
        {/* Top bar */}
        <div className="bg-gray-50 text-sm py-2">
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-center">
              <div className="text-gray-600">
                Free shipping on orders over $50
              </div>
              <div className="flex items-center space-x-6 text-gray-600">
                <span>Help & Support</span>
                <span>|</span>
                <span>Track Your Order</span>
              </div>
            </div>
          </div>
        </div>

        {/* Main header */}
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2">
              <div className="h-8 w-8 bg-black rounded flex items-center justify-center">
                <span className="text-white font-bold text-sm">TG</span>
              </div>
              <span className="text-xl font-bold text-black">
                {siteConfig.name}
              </span>
            </Link>

            {/* Search Bar - Desktop */}
            <div className="hidden md:flex items-center flex-1 max-w-2xl mx-8">
              <div className="relative w-full">
                <Input
                  placeholder="Search for products..."
                  className="pl-4 pr-12 h-12 rounded-lg border-2 border-gray-200 focus:border-primary"
                />
                <Button size="sm" className="absolute right-1 top-1 h-10 btn-primary">
                  <Search className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Right Section */}
            <div className="flex items-center space-x-4">
              {/* Wishlist */}
              <Button variant="ghost" size="sm" className="hidden md:flex">
                <Heart className="h-5 w-5" />
              </Button>

              {/* Cart */}
              <Link to="/cart">
                <Button variant="ghost" size="sm" className="relative">
                  <ShoppingCart className="h-5 w-5" />
                  {totalItems > 0 && (
                    <span className="absolute -top-2 -right-2 bg-primary text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {totalItems}
                    </span>
                  )}
                </Button>
              </Link>

              {/* User Menu */}
              <div className="flex items-center space-x-2">
                {user ? (
                  <div className="flex items-center space-x-2">
                    <Link to="/profile">
                      <Button variant="ghost" size="sm">
                        <User className="h-5 w-5" />
                      </Button>
                    </Link>
                    <Button variant="ghost" size="sm" onClick={signOut}>
                      Sign Out
                    </Button>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => setIsAuthModalOpen(true)}
                    >
                      Sign In
                    </Button>
                    <Button 
                      size="sm" 
                      className="btn-primary"
                      onClick={() => setIsAuthModalOpen(true)}
                    >
                      Sign Up
                    </Button>
                  </div>
                )}
              </div>

              {/* Mobile Menu Button */}
              <Button
                variant="ghost"
                size="sm"
                className="md:hidden"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </div>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8 py-3 border-t">
            <Link to="/categories" className="text-gray-700 hover:text-primary font-medium">
              All Categories
            </Link>
            <Link to="/products" className="text-gray-700 hover:text-primary">
              Products
            </Link>
            <Link to="/deals" className="text-gray-700 hover:text-primary">
              Deals
            </Link>
            <Link to="/brands" className="text-gray-700 hover:text-primary">
              Brands
            </Link>
            <Link to="/about" className="text-gray-700 hover:text-primary">
              About
            </Link>
            <Link to="/contact" className="text-gray-700 hover:text-primary">
              Contact
            </Link>
          </nav>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="md:hidden border-t py-4">
              <div className="mb-4">
                <div className="relative">
                  <Input
                    placeholder="Search products..."
                    className="pl-4 pr-12 h-10"
                  />
                  <Search className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
                </div>
              </div>
              <nav className="flex flex-col space-y-4">
                <Link
                  to="/categories"
                  className="text-gray-700 hover:text-primary"
                  onClick={() => setIsMenuOpen(false)}
                >
                  All Categories
                </Link>
                <Link
                  to="/products"
                  className="text-gray-700 hover:text-primary"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Products
                </Link>
                <Link
                  to="/deals"
                  className="text-gray-700 hover:text-primary"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Deals
                </Link>
                <Link
                  to="/brands"
                  className="text-gray-700 hover:text-primary"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Brands
                </Link>
              </nav>
            </div>
          )}
        </div>
      </header>

      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
      />
    </>
  );
}
