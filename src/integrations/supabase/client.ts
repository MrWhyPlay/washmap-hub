// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://xwupuyulqmuqouegtiak.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh3dXB1eXVscW11cW91ZWd0aWFrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzY0NTU4MjMsImV4cCI6MjA1MjAzMTgyM30.fZE2m2MMkX0qhaYL2WN02OiFTQWuj1ETT_K2d1bz6NE";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);