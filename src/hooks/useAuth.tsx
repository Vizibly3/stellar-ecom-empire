
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string, fullName?: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  loading: boolean;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.id);
        setSession(session);
        setUser(session?.user ?? null);
        
        // Check if user is admin
        const adminCheck = session?.user?.email === 'admin@bytecart.site';
        setIsAdmin(adminCheck);
        
        setLoading(false);
      }
    );

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('Initial session check:', session?.user?.id);
      setSession(session);
      setUser(session?.user ?? null);
      
      // Check if user is admin
      const adminCheck = session?.user?.email === 'admin@bytecart.site';
      setIsAdmin(adminCheck);
      
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    // Check for hardcoded admin credentials
    if (email === 'admin@bytecart.site' && password === 'admin123') {
      try {
        // First try to sign in normally
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        
        if (error) {
          // If normal signin fails, try to sign up the admin user
          const { error: signUpError } = await supabase.auth.signUp({
            email,
            password,
            options: {
              data: {
                full_name: 'Admin User',
              },
            },
          });
          
          if (signUpError) {
            return { error: signUpError };
          }
          
          // Now try to sign in again
          const { error: retryError } = await supabase.auth.signInWithPassword({
            email,
            password,
          });
          
          return { error: retryError };
        }
        
        return { error: null };
      } catch (error) {
        return { error };
      }
    }
    
    // Normal login process
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { error };
  };

  const signUp = async (email: string, password: string, fullName?: string) => {
    const redirectUrl = `${window.location.origin}/`;
    
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl,
        data: {
          full_name: fullName,
        },
      },
    });

    // If signup successful, create profile
    if (!error && data.user) {
      try {
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            id: data.user.id,
            email: email,
            full_name: fullName || '',
            role: email === 'admin@bytecart.site' ? 'admin' : 'customer',
          });
        
        if (profileError) {
          console.error('Profile creation error:', profileError);
        }
      } catch (profileError) {
        console.error('Profile creation failed:', profileError);
      }
    }
    
    return { error };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setIsAdmin(false);
  };

  return (
    <AuthContext.Provider value={{
      user,
      session,
      signIn,
      signUp,
      signOut,
      loading,
      isAdmin,
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
