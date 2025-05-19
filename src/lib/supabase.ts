import { createClient } from '@supabase/supabase-js';

// Carrega as variáveis de ambiente do Supabase
const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY || '';

// Verifica se as configurações estão definidas
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Erro: Variáveis de ambiente do Supabase não configuradas corretamente');
}

// Cliente para operações públicas (se necessário)
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Cliente com chave de serviço para operações restritas
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

// Função auxiliar para buscar insights
export async function getInsights({
  limit = 10,
  page = 1,
  isRead = null,
  priority = null,
  insightType = null,
  accountId = null,
} = {}) {
  let query = supabase
    .from('agent_insights')
    .select('*')
    .order('timestamp', { ascending: false })
    .limit(limit)
    .range((page - 1) * limit, page * limit - 1);

  // Filtros opcionais
  if (isRead !== null) query = query.eq('is_read', isRead);
  if (priority) query = query.eq('priority', priority);
  if (insightType) query = query.eq('insight_type', insightType);
  if (accountId) query = query.eq('account_id', accountId);

  const { data, error } = await query;

  if (error) {
    console.error('Erro ao buscar insights:', error);
    throw new Error(`Erro ao buscar insights: ${error.message}`);
  }

  return data;
}

// Marcar insight como lido
export async function markInsightAsRead(insightId: number, isRead = true) {
  const { error } = await supabase
    .from('agent_insights')
    .update({ is_read: isRead })
    .eq('id', insightId);

  if (error) {
    console.error('Erro ao atualizar status do insight:', error);
    throw new Error(`Erro ao atualizar status do insight: ${error.message}`);
  }

  return true;
}

// Marcar insight como implementado
export async function markInsightAsImplemented(insightId: number, isImplemented = true) {
  const { error } = await supabase
    .from('agent_insights')
    .update({ is_implemented: isImplemented })
    .eq('id', insightId);

  if (error) {
    console.error('Erro ao atualizar status de implementação do insight:', error);
    throw new Error(`Erro ao atualizar status de implementação: ${error.message}`);
  }

  return true;
}

// Obter contagem de insights não lidos
export async function getUnreadInsightsCount(accountId: string | null = null) {
  let query = supabase
    .from('agent_insights')
    .select('id', { count: 'exact' })
    .eq('is_read', false);

  if (accountId) query = query.eq('account_id', accountId);

  const { count, error } = await query;

  if (error) {
    console.error('Erro ao contar insights não lidos:', error);
    throw new Error(`Erro ao contar insights não lidos: ${error.message}`);
  }

  return count || 0;
} 