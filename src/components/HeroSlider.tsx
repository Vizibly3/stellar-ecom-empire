import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, ShoppingCart, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useCart } from "@/hooks/useCart";
import { toast } from "sonner";
import { siteConfig } from "@/config/site";

interface SlideProduct {
  id: string;
  title: string;
  price: number;
  image_url: string;
  slug: string;
}

interface Slide {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  image: string;
  buttonText: string;
  link: string;
  badge: string;
  badgeColor: string;
  product?: SlideProduct;
}

export function HeroSlider() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [slides, setSlides] = useState<Slide[]>([]);
  const { addToCart } = useCart();

  useEffect(() => {
    fetchSlideProducts();
  }, []);

  useEffect(() => {
    if (slides.length > 0) {
      const timer = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
      }, 5000);

      return () => clearInterval(timer);
    }
  }, [slides.length]);

  const fetchSlideProducts = async () => {
    try {
      // Fetch most popular product (highest stock or featured)
      const { data: popularProduct } = await supabase
        .from("products")
        .select("*")
        .eq("is_active", true)
        .eq("featured", true)
        .order("stock", { ascending: false })
        .limit(1)
        .single();

      // Fetch lowest price product
      const { data: cheapestProduct } = await supabase
        .from("products")
        .select("*")
        .eq("is_active", true)
        .order("price", { ascending: true })
        .limit(1)
        .single();

      // Fetch latest product
      const { data: latestProduct } = await supabase
        .from("products")
        .select("*")
        .eq("is_active", true)
        .order("created_at", { ascending: false })
        .limit(1)
        .single();

      const newSlides: Slide[] = [];

      if (popularProduct) {
        newSlides.push({
          id: 1,
          title: popularProduct.title,
          subtitle: "Most Popular Product",
          description:
            popularProduct.description ||
            "Our customers' favorite choice with excellent reviews and proven quality.",
          image:
            popularProduct.image_url ||
            "https://images.unsplash.com/photo-1541140532154-b024d705b90a?w=800&h=400&fit=crop",
          buttonText: "Shop Now",
          link: `/products/${popularProduct.slug}`,
          badge: "Most Popular",
          badgeColor: "bg-green-500",
          product: {
            id: popularProduct.id,
            title: popularProduct.title,
            price: popularProduct.price,
            image_url: popularProduct.image_url || "",
            slug: popularProduct.slug,
          },
        });
      }

      if (cheapestProduct) {
        newSlides.push({
          id: 2,
          title: cheapestProduct.title,
          subtitle: "Unbeatable Price",
          description:
            cheapestProduct.description ||
            "Get the best value for your money with this amazing deal that won't last long.",
          image:
            cheapestProduct.image_url ||
            "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&h=400&fit=crop",
          buttonText: "Grab Deal",
          link: `/products/${cheapestProduct.slug}`,
          badge: "Price Crash",
          badgeColor: "bg-red-500",
          product: {
            id: cheapestProduct.id,
            title: cheapestProduct.title,
            price: cheapestProduct.price,
            image_url: cheapestProduct.image_url || "",
            slug: cheapestProduct.slug,
          },
        });
      }

      if (latestProduct) {
        newSlides.push({
          id: 3,
          title: latestProduct.title,
          subtitle: "Just Arrived",
          description:
            latestProduct.description ||
            "Be among the first to experience our newest addition to the collection.",
          image:
            latestProduct.image_url ||
            "https://images.unsplash.com/photo-1597852074816-d933c7d2b988?w=800&h=400&fit=crop",
          buttonText: "Explore New",
          link: `/products/${latestProduct.slug}`,
          badge: "Latest Arrival",
          badgeColor: "bg-blue-500",
          product: {
            id: latestProduct.id,
            title: latestProduct.title,
            price: latestProduct.price,
            image_url: latestProduct.image_url || "",
            slug: latestProduct.slug,
          },
        });
      }

      setSlides(newSlides);
    } catch (error) {
      console.error("Error fetching slide products:", error);
      // Fallback slides
      setSlides([
        {
          id: 1,
          title: "Premium Gaming Keyboards",
          subtitle: "Mechanical RGB Gaming Collection",
          description:
            "Discover our latest collection of mechanical gaming keyboards with customizable RGB lighting and premium switches.",
          image:
            "https://images.unsplash.com/photo-1541140532154-b024d705b90a?w=800&h=400&fit=crop",
          buttonText: "Shop Keyboards",
          link: "/products",
          badge: "Most Popular",
          badgeColor: "bg-green-500",
        },
      ]);
    }
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const handleAddToCart = async (product: SlideProduct) => {
    try {
      await addToCart(product.id, 1);
      toast.success(`${product.title} added to cart!`);
    } catch (error) {
      toast.error("Failed to add item to cart. Please try again.");
    }
  };

  if (slides.length === 0) {
    return (
      <div className="h-[500px] bg-gray-200 animate-pulse rounded-lg"></div>
    );
  }

  return (
    <div className="relative h-[500px] overflow-hidden rounded-lg">
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-transform duration-500 ease-in-out`}
          style={{
            transform: `translateX(${(index - currentSlide) * 100}%)`,
          }}
        >
          <div className="relative h-full">
            <img
              src={slide.image}
              alt={slide.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/40"></div>

            {/* Badge */}
            <div
              className={`absolute top-6 left-6 ${slide.badgeColor} text-white px-4 py-2 rounded-full font-semibold text-sm`}
            >
              {slide.badge}
            </div>

            <div className="absolute inset-0 flex items-center">
              <div className="container mx-auto px-4">
                <div className="max-w-2xl text-white">
                  <p className="text-sm font-medium mb-2 opacity-90">
                    {slide.subtitle}
                  </p>
                  <h1 className="text-4xl lg:text-5xl font-bold mb-4">
                    {slide.title}
                  </h1>
                  <p className="text-lg mb-6 opacity-90">{slide.description}</p>

                  {slide.product && (
                    <div className="mb-8">
                      <p className="text-2xl font-bold text-yellow-400">
                        ${slide.product.price.toFixed(2)}
                      </p>
                    </div>
                  )}

                  <div className="flex gap-4">
                    <a href={`tel:${siteConfig.phone}`}>
                      <Button className="bg-green-500 text-white hover:bg-green-600 px-8 py-3 text-lg font-semibold flex items-center gap-2">
                        <Phone className="h-5 w-5" />
                        <span>Call Now: {siteConfig.phone}</span>
                      </Button>
                    </a>
                    {slide.product && (
                      <Button
                        onClick={() => handleAddToCart(slide.product!)}
                        className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-black px-8 py-3 text-lg font-semibold transition-colors"
                      >
                        <ShoppingCart className="mr-2 h-5 w-5" />
                        Add to Cart
                      </Button>
                    )}
                    {!slide.product && (
                      <Link to={slide.link}>
                        <Button className="bg-white text-black hover:bg-gray-100 px-8 py-3 text-lg font-semibold">
                          {slide.buttonText}
                        </Button>
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-3 rounded-full transition-colors"
      >
        <ChevronLeft className="h-6 w-6" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-3 rounded-full transition-colors"
      >
        <ChevronRight className="h-6 w-6" />
      </button>

      {/* Dots Indicator */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-3 h-3 rounded-full transition-colors ${
              index === currentSlide ? "bg-white" : "bg-white/50"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
