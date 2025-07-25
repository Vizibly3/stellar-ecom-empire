
-- Create site_settings table
CREATE TABLE public.site_settings (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  site_name text NOT NULL DEFAULT 'ByteKart',
  site_description text NOT NULL DEFAULT 'Your one-stop shop for computer and printer accessories',
  site_url text NOT NULL DEFAULT 'https://bytekart.shop',
  email text NOT NULL DEFAULT 'support@bytekart.shop',
  phone text NOT NULL DEFAULT '+1 (888) 365-7610',
  address text NOT NULL DEFAULT '123 Tech Street, Silicon Valley, CA 94000',
  business_hours text NOT NULL DEFAULT 'Mon-Fri: 9AM-6PM PST',
  shipping_info text NOT NULL DEFAULT 'Free shipping on orders over $50',
  returns_policy text NOT NULL DEFAULT '30-day return policy',
  twitter_handle text DEFAULT '@bytecart',
  facebook_handle text DEFAULT 'bytecart',
  instagram_handle text DEFAULT 'bytecart',
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Everyone can read site settings" 
  ON public.site_settings 
  FOR SELECT 
  USING (true);

CREATE POLICY "Only admins can manage site settings" 
  ON public.site_settings 
  FOR ALL 
  USING (EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role = 'admin'
  ));

-- Insert default settings
INSERT INTO public.site_settings (
  site_name, site_description, site_url, email, phone, address,
  business_hours, shipping_info, returns_policy, twitter_handle, facebook_handle, instagram_handle
) VALUES (
  'ByteKart',
  'Your one-stop shop for computer and printer accessories',
  'https://bytekart.shop',
  'support@bytekart.shop',
  '+1 (888) 365-7610',
  '123 Tech Street, Silicon Valley, CA 94000',
  'Mon-Fri: 9AM-6PM PST',
  'Free shipping on orders over $50',
  '30-day return policy',
  '@bytecart',
  'bytecart',
  'bytecart'
);

-- Create trigger for updated_at
CREATE OR REPLACE FUNCTION update_site_settings_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_site_settings_updated_at
    BEFORE UPDATE ON public.site_settings
    FOR EACH ROW
    EXECUTE FUNCTION update_site_settings_updated_at();
