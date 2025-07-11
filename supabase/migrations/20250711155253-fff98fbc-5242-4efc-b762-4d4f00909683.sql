
-- Remove the problematic trigger and function that's blocking signups
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

-- We'll handle profile creation via code instead
