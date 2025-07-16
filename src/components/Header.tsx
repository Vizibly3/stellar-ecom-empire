import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ShoppingCart,
  User,
  Search,
  Menu,
  X,
  Shield,
  Phone,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useCart } from "@/hooks/useCart";
import { siteConfig } from "@/config/site";
import { AuthModal } from "./AuthModal";
import { SearchBar } from "./SearchBar";
import { toast } from "sonner";

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const { user, signOut, isAdmin } = useAuth();
  const { totalItems } = useCart();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success("Signed out successfully");
    } catch (error) {
      toast.error("Failed to sign out");
    }
  };

  const handleNavigation = (path: string) => {
    navigate(path);
    window.scrollTo(0, 0);
    setIsMenuOpen(false);
  };

  const handleCallNow = () => {
    window.open(`tel:${siteConfig.phone}`, "_self");
  };

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
                <a
                  href={`tel:${siteConfig.phone}`}
                  className="flex items-center space-x-2 text-green-600 font-semibold hover:underline"
                >
                  <Phone className="h-4 w-4" />
                  <span>Call Now: {siteConfig.phone}</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Main header */}
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <button
              onClick={() => handleNavigation("/")}
              className="flex items-center space-x-2"
            >
              <div className="h-8 w-8 bg-black rounded flex items-center justify-center">
                <span className="text-white font-bold text-sm">BC</span>
              </div>
              <span className="text-xl font-bold text-black">
                {siteConfig.name}
              </span>
            </button>

            {/* Search Bar - Desktop */}
            <div className="hidden md:flex items-center flex-1 max-w-2xl mx-8">
              <SearchBar className="w-full" />
            </div>

            {/* Right Section */}
            <div className="flex items-center space-x-4">
              {/* Cart */}
              <button onClick={() => handleNavigation("/cart")}>
                <Button
                  variant="ghost"
                  size="sm"
                  className="relative btn-secondary"
                >
                  <ShoppingCart className="h-5 w-5" />
                  {totalItems > 0 && (
                    <span className="absolute -top-2 -right-2 bg-black text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {totalItems}
                    </span>
                  )}
                </Button>
              </button>

              {/* User Menu */}
              <div className="flex items-center space-x-2">
                {user ? (
                  <div className="flex items-center space-x-2">
                    {isAdmin && (
                      <button onClick={() => handleNavigation("/admin")}>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="btn-secondary"
                        >
                          <Shield className="h-5 w-5" />
                          <span className="ml-1 hidden sm:inline">Admin</span>
                        </Button>
                      </button>
                    )}
                    <button onClick={() => handleNavigation("/profile")}>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="btn-secondary"
                      >
                        <User className="h-5 w-5" />
                        <span className="ml-1 hidden sm:inline">Profile</span>
                      </Button>
                    </button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleSignOut}
                      className="btn-secondary"
                    >
                      Sign Out
                    </Button>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
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

              {/* Call Now Button */}
              <Button
                onClick={handleCallNow}
                variant="ghost"
                size="sm"
                className="hidden sm:flex items-center space-x-2 bg-green-500 text-white hover:bg-green-600"
              >
                <Phone className="h-4 w-4" />
                <span>Call Now</span>
              </Button>

              {/* Mobile Menu Button */}
              <Button
                variant="ghost"
                size="sm"
                className="md:hidden btn-secondary"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </Button>
            </div>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8 py-3 border-t">
            <button
              onClick={() => handleNavigation("/")}
              className="text-gray-700 hover:text-primary font-medium"
            >
              Home
            </button>
            <button
              onClick={() => handleNavigation("/categories")}
              className="text-gray-700 hover:text-primary font-medium"
            >
              All Categories
            </button>
            <button
              onClick={() => handleNavigation("/products")}
              className="text-gray-700 hover:text-primary"
            >
              Products
            </button>
            <button
              onClick={() => handleNavigation("/deals")}
              className="text-gray-700 hover:text-primary"
            >
              Deals
            </button>
            <button
              onClick={() => handleNavigation("/brands")}
              className="text-gray-700 hover:text-primary"
            >
              Brands
            </button>
            <button
              onClick={() => handleNavigation("/about")}
              className="text-gray-700 hover:text-primary"
            >
              About
            </button>
            <button
              onClick={() => handleNavigation("/contact")}
              className="text-gray-700 hover:text-primary"
            >
              Contact
            </button>
          </nav>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="md:hidden border-t py-4">
              <div className="mb-4">
                <SearchBar className="w-full" />
              </div>

              {/* Mobile Call Button */}
              <div className="mb-4">
                <Button
                  onClick={handleCallNow}
                  className="w-full bg-green-500 text-white hover:bg-green-600"
                >
                  <Phone className="h-4 w-4 mr-2" />
                  Call Now
                </Button>
              </div>

              <nav className="flex flex-col space-y-4">
                <button
                  onClick={() => handleNavigation("/")}
                  className="text-gray-700 hover:text-primary text-left"
                >
                  Home
                </button>
                <button
                  onClick={() => handleNavigation("/categories")}
                  className="text-gray-700 hover:text-primary text-left"
                >
                  All Categories
                </button>
                <button
                  onClick={() => handleNavigation("/products")}
                  className="text-gray-700 hover:text-primary text-left"
                >
                  Products
                </button>
                <button
                  onClick={() => handleNavigation("/deals")}
                  className="text-gray-700 hover:text-primary text-left"
                >
                  Deals
                </button>
                <button
                  onClick={() => handleNavigation("/brands")}
                  className="text-gray-700 hover:text-primary text-left"
                >
                  Brands
                </button>
                {user && (
                  <button
                    onClick={() => handleNavigation("/profile")}
                    className="text-gray-700 hover:text-primary text-left"
                  >
                    My Profile
                  </button>
                )}
                {isAdmin && (
                  <button
                    onClick={() => handleNavigation("/admin")}
                    className="text-gray-700 hover:text-primary text-left"
                  >
                    Admin Panel
                  </button>
                )}
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
