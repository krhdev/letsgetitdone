import { createClient } from "@supabase/supabase-js";

// If the env vars aren't set (e.g. running somewhere that hasn't been
// configured for sync yet), `supabase` is null and every sync feature
// quietly disables itself. The app is local-first, so this is never a
// hard requirement, just an optional layer on top.
const url = import.meta.env.VITE_SUPABASE_URL;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = url && anonKey ? createClient(url, anonKey) : null;
