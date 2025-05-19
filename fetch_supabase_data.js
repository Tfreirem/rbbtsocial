import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Carregar variáveis de ambiente
dotenv.config();

// Configuração do Supabase
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY;

console.log('URL do Supabase:', supabaseUrl);
console.log('Chave de serviço disponível:', !!supabaseKey);

// Inicializar cliente Supabase
const supabase = createClient(supabaseUrl, supabaseKey);

async function fetchData() {
  try {
    console.log('\nConsultando tabelas disponíveis...');
    
    // Listar tabelas disponíveis através de uma consulta simples ao PostgreSQL
    const { data: tables, error: tablesError } = await supabase
      .rpc('get_schema_info');
    
    if (tablesError) {
      console.error('Erro ao consultar schema:', tablesError);
      
      // Tenta obter as tabelas diretamente
      console.log('\nTentando abordagem alternativa para listar tabelas...');
      
      // Consultar tabela insights_campanha (mencionada no DATABASE_URL)
      console.log('\nConsultando insights_campanha:');
      const { data: insights, error: insightsError } = await supabase
        .from('insights_campanha')
        .select('*')
        .limit(10);
        
      if (insightsError) {
        console.error('Erro ao consultar insights_campanha:', insightsError);
      } else {
        console.log(`Encontrados ${insights?.length || 0} registros:`);
        if (insights && insights.length > 0) {
          console.table(insights);
        }
      }
    } else {
      console.log('Tabelas encontradas:');
      console.table(tables);
      
      // Com base nas tabelas encontradas, consulta cada uma delas
      if (tables && tables.length > 0) {
        for (const table of tables) {
          const tableName = table.table_name || table.tablename || table.name;
          console.log(`\nConsultando dados da tabela ${tableName}:`);
          
          const { data, error } = await supabase
            .from(tableName)
            .select('*')
            .limit(10);
            
          if (error) {
            console.error(`Erro ao consultar ${tableName}:`, error);
          } else {
            console.log(`Encontrados ${data?.length || 0} registros`);
            if (data && data.length > 0) {
              console.table(data);
            }
          }
        }
      }
    }
    
  } catch (err) {
    console.error('Erro inesperado:', err);
  }
}

fetchData(); 