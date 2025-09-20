// Test Supabase connection and professionals query
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://kgcetehylqjnoemjbdnx.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtnY2V0ZWh5bHFqbm9lbWpiZG54Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzY2NDQ5MjAsImV4cCI6MjA1MjIyMDkyMH0.8QZqZqZqZqZqZqZqZqZqZqZqZqZqZqZqZqZqZqZq';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testProfessionalsQuery() {
  console.log('Testing Supabase connection...');
  
  try {
    // Test 1: Get all profiles
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });
    
    console.log('Profiles query result:', { profiles, profilesError });
    console.log('Number of profiles:', profiles?.length || 0);
    
    // Test 2: Get all user roles
    const { data: roles, error: rolesError } = await supabase
      .from('user_roles')
      .select('*')
      .order('created_at', { ascending: false });
    
    console.log('User roles query result:', { roles, rolesError });
    console.log('Number of roles:', roles?.length || 0);
    
    // Test 3: Join query (like the app uses)
    const { data: professionals, error: professionalsError } = await supabase
      .from('profiles')
      .select(`
        *,
        user_roles!inner(role)
      `)
      .eq('user_roles.role', 'professional')
      .order('created_at', { ascending: false });
    
    console.log('Professionals join query result:', { professionals, professionalsError });
    console.log('Number of professionals:', professionals?.length || 0);
    
    if (professionals && professionals.length > 0) {
      console.log('First professional:', professionals[0]);
    }
    
  } catch (error) {
    console.error('Error testing Supabase:', error);
  }
}

testProfessionalsQuery();
