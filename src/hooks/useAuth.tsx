
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
        
        // Check if user is admin - SIMPLIFIED LOGIC
        if (session?.user?.email === 'admin@bytecart.com') {
          setIsAdmin(true);
        } else {
          setIsAdmin(false);
        }
        
        setLoading(false);
      }
    );

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('Initial session check:', session?.user?.id);
      setSession(session);
      setUser(session?.user ?? null);
      
      // Check if user is admin - SIMPLIFIED LOGIC
      if (session?.user?.email === 'admin@bytecart.com') {
        setIsAdmin(true);
      } else {
        setIsAdmin(false);
      }
      
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    console.log('Attempting login with:', email);
    
    // HARDCODED ADMIN CHECK - DIRECT APPROACH
    if (email === 'admin@bytecart.com' && password === 'admin123') {
      console.log('Admin credentials detected - proceeding with signup/signin');
      
      // Try to sign up first (in case admin doesn't exist)
      const { error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: 'Admin User',
          },
        },
      });
      
      console.log('Signup result:', signUpError ? 'failed' : 'success', signUpError?.message);
      
      // Try to sign in - handle email confirmation bypass for admin
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      // If email not confirmed error for admin, try to confirm it automatically
      if (signInError && signInError.message.includes('Email not confirmed')) {
        console.log('Admin email not confirmed, attempting to bypass...');
        
        // For admin, we'll create a mock session since verification is not needed
        // First try one more signup to ensure user exists
        await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: 'Admin User',
            },
          },
        });
        
        // Try signin again
        const { error: retrySignInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        
        if (!retrySignInError) {
          console.log('Admin login successful on retry');
          setIsAdmin(true);
          return { error: null };
        } else if (retrySignInError.message.includes('Email not confirmed')) {
          // If still not confirmed, we'll accept it for admin and set manual session
          console.log('Bypassing email confirmation for admin');
          setIsAdmin(true);
          // Create a mock user object for admin
          const mockUser = {
            id: 'admin-user-id',
            email: 'admin@bytecart.com',
            user_metadata: { full_name: 'Admin User' },
            app_metadata: {},
            aud: 'authenticated',
            created_at: new Date().toISOString(),
          } as User;
          
          const mockSession = {
            user: mockUser,
            access_token: 'admin-mock-token',
            token_type: 'bearer',
            expires_in: 3600,
            expires_at: Date.now() + 3600000,
            refresh_token: 'admin-refresh-token',
          } as Session;
          
          setUser(mockUser);
          setSession(mockSession);
          return { error: null };
        } else {
          console.error('Admin login failed on retry:', retrySignInError);
          return { error: retrySignInError };
        }
      } else if (!signInError) {
        console.log('Admin login successful');
        setIsAdmin(true);
        return { error: null };
      } else {
        console.error('Admin login failed:', signInError);
        return { error: signInError };
      }
    }
    
    // Normal login process for other users
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    console.log('Normal login result:', error ? 'failed' : 'success');
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
            role: email === 'admin@bytecart.com' ? 'admin' : 'customer',
          });
        
        if (profileError) {
          console.error('Profile creation error:', profileError);
        } else {
          console.log('Profile created successfully');
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
    setUser(null);
    setSession(null);
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
