
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
    // Check for admin in localStorage first
    const storedAdmin = localStorage.getItem('isAdmin');
    if (storedAdmin === 'true') {
      setIsAdmin(true);
    }

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.id);
        setSession(session);
        setUser(session?.user ?? null);
        
        // Check if user is admin
        if (session?.user?.email === 'admin@bytecart.com') {
          setIsAdmin(true);
          localStorage.setItem('isAdmin', 'true');
        } else {
          setIsAdmin(false);
          localStorage.removeItem('isAdmin');
        }
        
        setLoading(false);
      }
    );

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('Initial session check:', session?.user?.id);
      setSession(session);
      setUser(session?.user ?? null);
      
      // Check if user is admin
      if (session?.user?.email === 'admin@bytecart.com') {
        setIsAdmin(true);
        localStorage.setItem('isAdmin', 'true');
      } else {
        setIsAdmin(false);
        localStorage.removeItem('isAdmin');
      }
      
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    console.log('Attempting login with:', email);
    
    // HARDCODED ADMIN CHECK - DIRECT APPROACH
    if (email === 'admin@bytecart.com' && password === 'admin123') {
      console.log('Admin credentials detected - creating persistent session');
      
      // Create a persistent mock session for admin
      const mockUser = {
        id: 'admin-user-id',
        email: 'admin@bytecart.com',
        user_metadata: { full_name: 'Admin User' },
        app_metadata: {},
        aud: 'authenticated',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        email_confirmed_at: new Date().toISOString(),
        phone_confirmed_at: null,
        confirmation_sent_at: null,
        confirmed_at: new Date().toISOString(),
        recovery_sent_at: null,
        role: 'authenticated',
        last_sign_in_at: new Date().toISOString(),
      } as User;
      
      const mockSession = {
        user: mockUser,
        access_token: 'admin-mock-token',
        token_type: 'bearer',
        expires_in: 3600,
        expires_at: Date.now() + 3600000,
        refresh_token: 'admin-refresh-token',
      } as Session;
      
      // Store in localStorage for persistence
      localStorage.setItem('adminSession', JSON.stringify(mockSession));
      localStorage.setItem('isAdmin', 'true');
      
      setUser(mockUser);
      setSession(mockSession);
      setIsAdmin(true);
      
      console.log('Admin session created and stored');
      return { error: null };
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
    // Clear admin session from localStorage
    localStorage.removeItem('adminSession');
    localStorage.removeItem('isAdmin');
    
    await supabase.auth.signOut();
    setIsAdmin(false);
    setUser(null);
    setSession(null);
  };

  // Check for stored admin session on mount
  useEffect(() => {
    const storedSession = localStorage.getItem('adminSession');
    if (storedSession && !session) {
      try {
        const parsedSession = JSON.parse(storedSession);
        setSession(parsedSession);
        setUser(parsedSession.user);
        setIsAdmin(true);
        setLoading(false);
        console.log('Restored admin session from localStorage');
      } catch (error) {
        console.error('Failed to parse stored session:', error);
        localStorage.removeItem('adminSession');
        localStorage.removeItem('isAdmin');
      }
    }
  }, [session]);

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
