import { createClient, SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "./types";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

let supabase: SupabaseClient<Database>;

if (supabaseUrl && supabaseUrl.startsWith("http")) {
  supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);
} else {
  // During build or when env vars are not set, create a dummy client
  // that will be replaced at runtime
  supabase = createClient<Database>(
    "https://placeholder.supabase.co",
    "placeholder-key",
  );
}

export { supabase };
