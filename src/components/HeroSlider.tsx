
import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const slides = [
  {
    id: 1,
    title: "Premium Gaming Keyboards",
    subtitle: "Mechanical RGB Gaming Collection",
    description: "Discover our latest collection of mechanical gaming keyboards with customizable RGB lighting and premium switches.",
    image: "https://images.unsplash.com/photo-1541140532154-b024d705b90a?w=800&h=400&fit=crop",
    buttonText: "Shop Keyboards",
    link: "/category/keyboards-mice"
  },
  {
    id: 2,
    title: "Professional Audio Equipment",
    subtitle: "Noise-Cancelling Headphones",
    description: "Experience crystal-clear audio with our premium headphones featuring active noise cancellation technology.",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&h=400&fit=crop",
    buttonText: "Shop Audio",
    link: "/category/audio-video"
  },
  {
    id: 3,
    title: "High-Speed Storage Solutions",
    subtitle: "External SSDs & Flash Drives",
    description: "Upgrade your storage with our high-speed external SSDs and USB drives for lightning-fast data transfer.",
    image: "https://images.unsplash.com/photo-1597852074816-d933c7d2b988?w=800&h=400&fit=crop",
    buttonText: "Shop Storage",
    link: "/category/storage-solutions"
  }
];

export function HeroSlider() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <div className="relative h-[500px] overflow-hidden rounded-lg">
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-transform duration-500 ease-in-out ${
            index === currentSlide ? 'translate-x-0' : 'translate-x-full'
          }`}
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
            <div className="absolute inset-0 flex items-center">
              <div className="container mx-auto px-4">
                <div className="max-w-2xl text-white">
                  <p className="text-sm font-medium mb-2 opacity-90">{slide.subtitle}</p>
                  <h1 className="text-4xl lg:text-5xl font-bold mb-4">{slide.title}</h1>
                  <p className="text-lg mb-8 opacity-90">{slide.description}</p>
                  <div className="flex gap-4">
                    <Link to={slide.link}>
                      <Button className="btn-primary px-8 py-3 text-lg">
                        {slide.buttonText}
                      </Button>
                    </Link>
                    <Button className="btn-secondary px-8 py-3 text-lg">
                      <ShoppingCart className="mr-2 h-5 w-5" />
                      Add to Cart
                    </Button>
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
              index === currentSlide ? 'bg-white' : 'bg-white/50'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
