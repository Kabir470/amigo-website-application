import { createClient } from "@supabase/supabase-js";

// These are PUBLIC keys — safe to use in frontend code.
// The Supabase URL identifies YOUR project.
// The Anon Key gives the frontend permission to call Supabase Auth (login/signup only).
// It does NOT give access to your database directly.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
