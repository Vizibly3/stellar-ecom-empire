
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
        .limit(12);
      
      if (data) {
        // Duplicate categories for seamless loop
        setCategories([...data, ...data]);
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
      <div className="flex category-slider space-x-4" style={{ width: 'calc(200px * 24 + 96px)' }}>
        {categories.map((category, index) => (
          <Link key={`${category.id}-${index}`} to={`/category/${category.slug}`} className="flex-shrink-0">
            <Card className="group hover:shadow-md transition-shadow cursor-pointer w-48">
              <CardContent className="p-4 text-center">
                <div className="aspect-square overflow-hidden rounded-lg mb-3">
                  <img
                    src={category.image_url || 'https://images.unsplash.com/photo-1518717758536-85ae29035b6d?w=200'}
                    alt={category.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                  />
                </div>
                <h3 className="font-medium text-sm text-gray-900">{category.name}</h3>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
