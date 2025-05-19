import fs from 'fs';
import dotenv from 'dotenv';
import fetch from 'node-fetch';

// Load environment variables
dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Error: SUPABASE_URL and SUPABASE_SERVICE_KEY must be set in .env file');
  process.exit(1);
}

async function executeSQL(sql) {
  const response = await fetch(`${supabaseUrl}/rest/v1/rpc/exec_sql`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'apikey': supabaseServiceKey,
      'Authorization': `Bearer ${supabaseServiceKey}`
    },
    body: JSON.stringify({ sql_query: sql })
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`SQL execution failed: ${JSON.stringify(error)}`);
  }

  return await response.json();
}

async function setupRBBTTables() {
  try {
    console.log('Starting RBBT tables setup...');

    // Read the schema file
    const schemaSQL = fs.readFileSync('./rbbt_schema.sql', 'utf8');

    // Split the SQL into individual statements and clean them
    const statements = schemaSQL
      .split(';')
      .map(statement => statement.trim())
      .filter(statement => statement.length > 0 && !statement.startsWith('--'));

    // Create the exec_sql function first
    const createFunctionSQL = `
      CREATE OR REPLACE FUNCTION exec_sql(sql_query text)
      RETURNS void
      LANGUAGE plpgsql
      SECURITY DEFINER
      AS $$
      BEGIN
        EXECUTE sql_query;
      END;
      $$;
    `;

    console.log('Creating exec_sql function...');
    await executeSQL(createFunctionSQL);

    // Execute each statement
    for (const statement of statements) {
      console.log(`Executing: ${statement.substring(0, 50)}...`);
      
      try {
        await executeSQL(statement);
        console.log('✓ Statement executed successfully');
      } catch (error) {
        console.error('Error executing statement:', error);
        console.error('Failed statement:', statement);
        throw error;
      }

      // Add a small delay between statements to prevent overwhelming the database
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    console.log('RBBT tables setup completed successfully!');
  } catch (error) {
    console.error('Error setting up RBBT tables:', error);
    process.exit(1);
  }
}

// Main execution
async function main() {
  try {
    await setupRBBTTables();
  } catch (error) {
    console.error('Setup failed:', error);
    process.exit(1);
  }
}

main(); 