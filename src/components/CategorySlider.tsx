
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export function CategorySlider() {
  const [currentTransform, setCurrentTransform] = useState(0);

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

  useEffect(() => {
    if (categories.length === 0) return;

    const interval = setInterval(() => {
      setCurrentTransform(prev => {
        const cardWidth = 280; // 256px + 24px gap
        const totalWidth = categories.length * cardWidth;
        const nextPosition = prev - 1;
        
        // Reset to start when we've moved past all cards
        if (Math.abs(nextPosition) >= totalWidth) {
          return 0;
        }
        
        return nextPosition;
      });
    }, 30); // Slower animation (was 20ms)

    return () => clearInterval(interval);
  }, [categories.length]);

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Shop by Category</h2>
        <div className="overflow-hidden">
          <div 
            className="flex gap-6 transition-transform duration-100 ease-linear"
            style={{ 
              transform: `translateX(${currentTransform}px)`,
              width: `${(categories.length * 2) * 280}px` // Double width for seamless loop
            }}
          >
            {/* First set of categories */}
            {categories.map((category) => (
              <Link
                key={category.id}
                to={`/categories/${category.slug}`}
                className="flex-shrink-0 w-64 bg-white rounded-lg shadow-md overflow-hidden group hover:shadow-xl transition-all duration-300 hover:scale-105 hover:bg-gray-50"
              >
                <div className="aspect-square overflow-hidden">
                  <img
                    src={category.image_url}
                    alt={category.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
                <div className="p-4 text-center">
                  <h3 className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors">
                    {category.name}
                  </h3>
                  <p className="text-gray-600 text-sm">{category.description}</p>
                </div>
              </Link>
            ))}
            {/* Duplicate set for seamless loop */}
            {categories.map((category) => (
              <Link
                key={`${category.id}-duplicate`}
                to={`/categories/${category.slug}`}
                className="flex-shrink-0 w-64 bg-white rounded-lg shadow-md overflow-hidden group hover:shadow-xl transition-all duration-300 hover:scale-105 hover:bg-gray-50"
              >
                <div className="aspect-square overflow-hidden">
                  <img
                    src={category.image_url}
                    alt={category.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
                <div className="p-4 text-center">
                  <h3 className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors">
                    {category.name}
                  </h3>
                  <p className="text-gray-600 text-sm">{category.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
