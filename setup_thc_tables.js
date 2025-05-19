import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Error: SUPABASE_URL and SUPABASE_SERVICE_KEY must be set in .env file');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function setupTHCTables() {
  try {
    console.log('Starting THC tables setup...');

    // Read the schema file
    const schemaSQL = fs.readFileSync('./thc_schema.sql', 'utf8');

    // Split the SQL into individual statements and clean them
    const statements = schemaSQL
      .split(';')
      .map(statement => statement.trim())
      .filter(statement => statement.length > 0 && !statement.startsWith('--'));

    // Execute each statement
    for (const statement of statements) {
      console.log(`Executing: ${statement.substring(0, 50)}...`);
      
      const { error } = await supabase.from('_exec_sql').select('*').execute(statement);

      if (error) {
        console.error('Error executing statement:', error);
        console.error('Failed statement:', statement);
        throw error;
      }

      // Add a small delay between statements to prevent overwhelming the database
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    console.log('THC tables setup completed successfully!');
  } catch (error) {
    console.error('Error setting up THC tables:', error);
    process.exit(1);
  }
}

// Main execution
async function main() {
  try {
    await setupTHCTables();
  } catch (error) {
    console.error('Setup failed:', error);
    process.exit(1);
  }
}

main(); 