
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface SiteSettings {
  id: string;
  site_name: string;
  site_description: string;
  site_url: string;
  email: string;
  phone: string;
  address: string;
  business_hours: string;
  shipping_info: string;
  returns_policy: string;
  twitter_handle: string;
  facebook_handle: string;
  instagram_handle: string;
  created_at: string;
  updated_at: string;
}

export function useSiteSettings() {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchSettings = async () => {
    try {
      const { data, error } = await (supabase as any)
        .from('site_settings')
        .select('*')
        .limit(1)
        .single();

      if (error) {
        console.error('Error fetching settings:', error);
        return;
      }

      setSettings(data as SiteSettings);
    } catch (error) {
      console.error('Error fetching settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateSettings = async (updates: Partial<SiteSettings>) => {
    try {
      const { data, error } = await (supabase as any)
        .from('site_settings')
        .update(updates)
        .eq('id', settings?.id)
        .select()
        .single();

      if (error) throw error;

      setSettings(data as SiteSettings);
      toast.success('Settings updated successfully');
      return data;
    } catch (error) {
      console.error('Error updating settings:', error);
      toast.error('Failed to update settings');
      throw error;
    }
  };

  useEffect(() => {
    fetchSettings();

    // Set up real-time subscription to listen for changes
    const channel = supabase
      .channel('site-settings-realtime')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'site_settings'
        },
        (payload) => {
          console.log('Site settings updated via realtime:', payload);
          if (payload.new) {
            setSettings(payload.new as SiteSettings);
          }
        }
      )
      .subscribe((status) => {
        console.log('Realtime subscription status:', status);
      });

    // Cleanup subscription on unmount
    return () => {
      console.log('Cleaning up realtime subscription');
      supabase.removeChannel(channel);
    };
  }, []);

  return {
    settings,
    loading,
    updateSettings,
    refetch: fetchSettings
  };
}
