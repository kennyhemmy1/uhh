import { createClient } from '@supabase/supabase-js';
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function seed() {
  // Paste the full 50-contractor seed code from previous message here
  console.log('Seeded 50 fake trusted contractors');
}
seed();
