import { useState, useEffect } from "react";
import { supabase } from "../lib/supabaseClient";

// Handles sign-in state only. What to DO with that state (pulling/pushing
// the person's data) lives in useCloudSync, kept separate on purpose.
export default function useAuth() {
  const [session, setSession] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    if (!supabase) {
      setAuthLoading(false);
      return;
    }
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setAuthLoading(false);
    });
    const { data: listener } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
    });
    return () => listener.subscription.unsubscribe();
  }, []);

  const signInWithEmail = async (email) => {
    if (!supabase) throw new Error("Sync isn't set up yet.");
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: window.location.origin },
    });
    if (error) throw error;
  };

  const signOut = async () => {
    if (!supabase) return;
    await supabase.auth.signOut();
  };

  return {
    session,
    authLoading,
    signInWithEmail,
    signOut,
    syncEnabled: !!supabase,
  };
}
