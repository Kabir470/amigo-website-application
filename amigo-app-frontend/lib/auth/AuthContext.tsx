"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { supabase } from "@/lib/supabase";
import type { Session, User } from "@supabase/supabase-js";

// This context provides authentication state to the ENTIRE app.
// Any component can call useAuth() to get the current user, session, or trigger login/logout.
interface AuthContextType {
  user: User | null;           // The Supabase user object (contains email, id, etc.)
  session: Session | null;     // The Supabase session (contains the access_token JWT)
  loading: boolean;            // True while we check if user is already logged in
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signUp: (email: string, password: string) => Promise<{ data: any; error: string | null }>;
  signInWithGoogle: () => Promise<{ error: string | null }>;
  logOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  loading: true,
  signIn: async () => ({ error: null }),
  signUp: async () => ({ data: null, error: null }),
  signInWithGoogle: async () => ({ error: null }),
  logOut: async () => {},
});

const getURL = () => {
  let url =
    process.env.NEXT_PUBLIC_SITE_URL ??
    (typeof window !== "undefined" ? window.location.origin : "http://localhost:3000");
  url = url.startsWith("http") ? url : `https://${url}`;
  url = url.endsWith("/") ? url.slice(0, -1) : url;
  return url;
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error: error?.message ?? null };
  };

  const signUp = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${getURL()}/dashboard`,
      },
    });
    return { data, error: error?.message ?? null };
  };

  const signInWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${getURL()}/dashboard`,
      },
    });
    return { error: error?.message ?? null };
  };

  // Sign out the user — clears the session from localStorage
  const logOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
  };

  return (
    <AuthContext.Provider value={{ user, session, loading, signIn, signUp, signInWithGoogle, logOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
