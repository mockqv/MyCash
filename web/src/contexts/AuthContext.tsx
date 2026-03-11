import { createContext, useContext, useEffect, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "../lib/supabase";
import type { User } from "../types/user";

type AuthContextType = {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  function mapUser(session: Session | null): User | null {
    if (!session) return null;
    return {
      id: session.user.id,
      email: session.user.email ?? "",
      name: session.user.user_metadata?.name ?? "",
    };
  }

  const isAuthRoute = () =>
    window.location.pathname.includes("/login") ||
    window.location.pathname.includes("/register");

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) {
        setUser(null);
        setSession(null);
        setIsLoading(false);
        if (!isAuthRoute()) window.location.href = "/login";
        return;
      }

      supabase.auth.getUser().then(({ data: userData, error }) => {
        if (error || !userData.user) {
          setUser(null);
          setSession(null);
          setIsLoading(false);
          if (!isAuthRoute()) window.location.href = "/login";
          return;
        }
        setSession(data.session);
        setUser(mapUser(data.session));
        setIsLoading(false);
      });
    });

    const { data: listener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === "SIGNED_OUT" || session === null) {
          setUser(null);
          setSession(null);
          setIsLoading(false);
          if (!isAuthRoute()) window.location.href = "/login";
          return;
        }
        setSession(session);
        setUser(mapUser(session));
        setIsLoading(false);
      },
    );

    return () => listener.subscription.unsubscribe();
  }, []);

  async function signOut() {
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
    window.location.href = "/login";
  }

  return (
    <AuthContext.Provider value={{ user, session, isLoading, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context)
    throw new Error("useAuth deve ser usado dentro de AuthProvider");
  return context;
}
