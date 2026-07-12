"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { AppUser } from "@/types";

interface AuthContextType {
  user: any | null;
  appUser: AppUser | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  logOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  appUser: null,
  loading: true,
  signIn: async () => {},
  logOut: async () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<any | null>(null);
  const [appUser, setAppUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading session from local storage or just default to logged out
    const savedUser = localStorage.getItem("amigo_user");
    if (savedUser) {
      const parsed = JSON.parse(savedUser);
      setUser(parsed);
      setAppUser(parsed);
    }
    setLoading(false);
  }, []);

  const signIn = async (email: string, password: string) => {
    // Mock authentication for development
    if (email && password) {
      const mockUser = {
        uid: "mock-uid-123",
        email: email,
        role: "admin",
        firstName: "Admin",
        lastName: "User"
      } as unknown as AppUser;
      
      setUser(mockUser);
      setAppUser(mockUser);
      localStorage.setItem("amigo_user", JSON.stringify(mockUser));
    }
  };

  const logOut = async () => {
    setUser(null);
    setAppUser(null);
    localStorage.removeItem("amigo_user");
  };

  return (
    <AuthContext.Provider value={{ user, appUser, loading, signIn, logOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
