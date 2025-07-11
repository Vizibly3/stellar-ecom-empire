
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: any;
  isAdmin: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string, fullName?: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  loading: boolean;
  updateProfile: (updates: any) => Promise<{ error: any }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const isAdmin = profile?.role === 'admin';

  useEffect(() => {
    let mounted = true;

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!mounted) return;
      
      console.log('Initial session check:', session?.user?.id);
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        fetchOrCreateProfile(session.user).finally(() => {
          if (mounted) setLoading(false);
        });
      } else {
        if (mounted) setLoading(false);
      }
    });

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mounted) return;
        
        console.log('Auth state changed:', event, session?.user?.id);
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          await fetchOrCreateProfile(session.user);
        } else {
          setProfile(null);
        }
      }
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const fetchOrCreateProfile = async (user: User) => {
    try {
      // First try to fetch existing profile
      const { data: existingProfile, error: fetchError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (existingProfile) {
        setProfile(existingProfile);
        return;
      }

      // Only create profile if fetch failed due to no data
      if (fetchError && fetchError.code === 'PGRST116') {
        const roleToAssign: "admin" | "customer" = user.email === 'admin@bytecart.site' ? 'admin' : 'customer';
        
        const newProfile = {
          id: user.id,
          email: user.email!,
          full_name: user.user_metadata?.full_name || '',
          role: roleToAssign
        };

        const { data: createdProfile, error: createError } = await supabase
          .from('profiles')
          .insert(newProfile)
          .select()
          .single();

        if (createError) {
          console.error('Error creating profile:', createError);
          // Set basic profile data even if insert fails
          setProfile({ id: user.id, email: user.email, role: roleToAssign });
        } else {
          setProfile(createdProfile);
        }
      } else {
        console.error('Error fetching profile:', fetchError);
        // Set basic profile data if fetch fails for other reasons
        const roleToAssign: "admin" | "customer" = user.email === 'admin@bytecart.site' ? 'admin' : 'customer';
        setProfile({ id: user.id, email: user.email, role: roleToAssign });
      }
    } catch (error) {
      console.error('Error in fetchOrCreateProfile:', error);
      // Always set some profile data to prevent blocking
      const roleToAssign: "admin" | "customer" = user.email === 'admin@bytecart.site' ? 'admin' : 'customer';
      setProfile({ id: user.id, email: user.email, role: roleToAssign });
    }
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { error };
  };

  const signUp = async (email: string, password: string, fullName?: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    });
    return { error };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setProfile(null);
  };

  const updateProfile = async (updates: any) => {
    if (!user) return { error: 'Not authenticated' };

    const { error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', user.id);

    if (!error) {
      setProfile({ ...profile, ...updates });
    }

    return { error };
  };

  return (
    <AuthContext.Provider value={{
      user,
      session,
      profile,
      isAdmin,
      signIn,
      signUp,
      signOut,
      loading,
      updateProfile,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
