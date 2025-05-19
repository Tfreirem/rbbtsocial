import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
dotenv.config();

// Load Supabase environment variables
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_ANON_KEY;

// Create Supabase client
const supabase = createClient(supabaseUrl, supabaseKey);

async function checkTable(tableName) {
  console.log(`\n--- Checking table: ${tableName} ---`);
  
  // Get table structure
  const { data: tableInfo, error: tableError } = await supabase.rpc('get_table_info', { table_name: tableName });
  
  if (tableError) {
    console.error(`Error fetching structure for table ${tableName}:`, tableError);
    
    // Try to list a few rows to verify table exists
    const { data, error } = await supabase
      .from(tableName)
      .select('*')
      .limit(10);
    
    if (error) {
      console.error(`Error querying table ${tableName}:`, error);
      console.log(`Table ${tableName} might not exist or you don't have access to it.`);
    } else {
      console.log(`Table ${tableName} exists. Here are up to 10 rows:`);
      console.log(JSON.stringify(data, null, 2));
    }
  } else {
    console.log('Table structure:');
    console.log(JSON.stringify(tableInfo, null, 2));
    
    // Get a sample of data
    const { data, error } = await supabase
      .from(tableName)
      .select('*')
      .limit(5);
    
    if (error) {
      console.error(`Error querying table ${tableName}:`, error);
    } else {
      console.log(`\nSample data (up to 5 rows):`);
      console.log(JSON.stringify(data, null, 2));
    }
  }
}

async function main() {
  console.log('Connecting to Supabase at:', supabaseUrl);
  
  // List all tables
  console.log('\n--- Listing all available tables ---');
  try {
    // Tente usar a consulta SQL direta
    const { data, error } = await supabase.rpc('get_tables');
    
    if (error) {
      console.error('Error listing tables with RPC:', error);
    } else {
      console.log('Available tables:');
      console.log(data);
    }
  } catch (e) {
    console.log('Falling back to direct queries...');
  }
  
  // Check the requested table
  await checkTable('view_metrics_organicas');
}

main().catch(e => {
  console.error('Script error:', e);
  process.exit(1);
}); 