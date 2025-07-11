
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';

type Category = Database['public']['Tables']['categories']['Row'];

export function CategorySlider() {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const { data } = await supabase
        .from('categories')
        .select('*')
        .eq('is_active', true)
        .limit(8);
      
      if (data) {
        // Triple the categories for seamless infinite loop
        setCategories([...data, ...data, ...data]);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  if (categories.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading categories...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-hidden">
      <div className="flex category-slider-slow space-x-6" style={{ width: `calc(220px * ${categories.length} + ${(categories.length - 1) * 24}px)` }}>
        {categories.map((category, index) => (
          <Link key={`${category.id}-${index}`} to={`/category/${category.slug}`} className="flex-shrink-0">
            <Card className="group hover:shadow-lg hover:scale-105 hover:border-gray-300 transition-all duration-300 cursor-pointer w-52 bg-white border border-gray-200">
              <CardContent className="p-4 text-center">
                <div className="aspect-square overflow-hidden rounded-lg mb-3 bg-gray-50">
                  <img
                    src={category.image_url || 'https://images.unsplash.com/photo-1518717758536-85ae29035b6d?w=200'}
                    alt={category.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
                <h3 className="font-medium text-sm text-gray-900 group-hover:text-primary transition-colors duration-200">
                  {category.name}
                </h3>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
