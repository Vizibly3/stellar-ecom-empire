
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

export const useSiteSettings = () => {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('site_settings')
        .select('*')
        .single();

      if (error) {
        console.error('Error fetching site settings:', error);
        toast.error('Failed to load site settings');
        return;
      }

      setSettings(data);
    } catch (error) {
      console.error('Error fetching site settings:', error);
      toast.error('Failed to load site settings');
    } finally {
      setLoading(false);
    }
  };

  const updateSettings = async (updatedSettings: Partial<SiteSettings>) => {
    try {
      const { error } = await supabase
        .from('site_settings')
        .update(updatedSettings)
        .eq('id', settings?.id);

      if (error) {
        console.error('Error updating site settings:', error);
        toast.error('Failed to update site settings');
        return false;
      }

      toast.success('Site settings updated successfully');
      fetchSettings(); // Refresh the settings
      return true;
    } catch (error) {
      console.error('Error updating site settings:', error);
      toast.error('Failed to update site settings');
      return false;
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  return {
    settings,
    loading,
    updateSettings,
    refetch: fetchSettings
  };
};
