/**
 * Model Context Protocol (MCP) para extração de dados brutos do Meta Ads
 * 
 * Esta função gera instruções para coletar dados estratificados e brutos
 * para armazenamento em banco de dados, sem análise ou processamento.
 */
function processMCP() {
  try {
    // Extrair solicitação do usuário ou usar default
    const userRequest = items[0]?.json?.query || 'extrair_dados_brutos';
    
    // Determinar quais dados extrair
    const extractionType = determineExtractionType(userRequest);
    
    // Gerar plano de extração de dados
    const extractionPlan = generateDataExtractionPlan(extractionType);
    
    // Gerar prompt para o agente 
    const prompt = buildRawDataExtractionPrompt(extractionPlan, userRequest);
    
    // Retornar prompt e metadados
    return [
      {
        json: {
          prompt: prompt,
          extraction_type: extractionType,
          extraction_plan: extractionPlan,
          original_query: userRequest
        }
      }
    ];
  } catch (error) {
    // Em caso de erro, retornar um prompt de fallback simples
    const fallbackPrompt = `EXECUTE ESTA INSTRUÇÃO TÉCNICA IMEDIATAMENTE:

FERRAMENTA A USAR: "Lista campanhas"

PARÂMETROS:
- fields: ["id", "name", "status", "objective", "start_time", "stop_time", "daily_budget", "lifetime_budget"]
- limit: 100

INSTRUÇÕES DE EXECUÇÃO:
1. Use EXATAMENTE a ferramenta "Lista campanhas"
2. Passe TODOS os parâmetros listados acima
3. Retorne os dados BRUTOS exatamente como recebidos da API
4. NÃO faça análises ou formatações dos dados
5. Garanta que TODAS as colunas e valores dos dados sejam preservados

Erro ocorrido: ${error.message || 'Erro desconhecido no processamento do MCP'}
`;

    return [
      {
        json: {
          prompt: fallbackPrompt,
          extraction_type: 'fallback',
          error: error.message || 'Erro desconhecido no processamento do MCP',
          original_query: items[0]?.json?.query || ''
        }
      }
    ];
  }
}

/**
 * Determina o tipo de extração com base na consulta
 */
function determineExtractionType(query) {
  const q = query.toLowerCase();
  
  if (q.includes('campanha') || q.includes('campaign')) {
    return 'campaigns_extraction';
  }
  else if (q.includes('conjunto') || q.includes('ad set') || q.includes('adset')) {
    return 'adsets_extraction';
  }
  else if (q.includes('anuncio') || q.includes('ad ') || q.includes('ads')) {
    return 'ads_extraction';
  }
  else if (q.includes('insight') || q.includes('desempenho') || q.includes('performance')) {
    return 'insights_extraction';
  }
  else if (q.includes('instagram') || q.includes('post') || q.includes('social')) {
    return 'social_extraction';
  }
  else {
    // Extração completa por padrão
    return 'full_extraction';
  }
}

/**
 * Gera um plano de extração de dados brutos
 */
function generateDataExtractionPlan(extractionType) {
  // Intervalo de tempo padrão para extração
  const timeRange = getDefaultTimeRange();
  
  // Estrutura básica para plano de extração
  const plan = {
    extraction_type: extractionType,
    date_range: timeRange,
    extractions: []
  };
  
  // Define as extrações específicas com base no tipo solicitado
  switch (extractionType) {
    case 'campaigns_extraction':
      plan.extractions = [
        {
          sequence: 1,
          tool: 'Lista campanhas',
          endpoint: 'lista_campanhas',
          table_name: 'meta_campaigns',
          params: {
            fields: ['id', 'name', 'status', 'objective', 'start_time', 'stop_time', 'daily_budget', 'lifetime_budget', 'budget_remaining', 'buying_type', 'special_ad_categories'],
            limit: 1000
          }
        }
      ];
      break;
      
    case 'adsets_extraction':
      plan.extractions = [
        {
          sequence: 1,
          tool: 'Lista Ad Sets',
          endpoint: 'lista_ad_sets',
          table_name: 'meta_ad_sets',
          params: {
            fields: ['id', 'name', 'status', 'campaign_id', 'daily_budget', 'lifetime_budget', 'targeting', 'optimization_goal', 'bid_strategy', 'billing_event', 'promoted_object'],
            limit: 1000
          }
        }
      ];
      break;
      
    case 'ads_extraction':
      plan.extractions = [
        {
          sequence: 1,
          tool: 'List Ads',
          endpoint: 'list_ads',
          table_name: 'meta_ads',
          params: {
            fields: ['id', 'name', 'status', 'adset_id', 'creative_id', 'preview_url', 'tracking_specs', 'created_time', 'updated_time', 'bid_amount'],
            limit: 1000
          }
        }
      ];
      break;
      
    case 'insights_extraction':
      plan.extractions = [
        {
          sequence: 1,
          tool: 'Get Campaign Insights',
          endpoint: 'get_campaign_insights',
          table_name: 'meta_campaign_insights',
          params: {
            time_range: timeRange,
            level: 'campaign',
            fields: ['campaign_id', 'campaign_name', 'account_id', 'account_name', 'date_start', 'date_stop', 'clicks', 'impressions', 'reach', 'frequency', 'spend', 'cpm', 'cpp', 'ctr', 'cpc', 'cost_per_unique_click', 'quality_ranking', 'engagement_rate_ranking', 'video_avg_time_watched_actions', 'cost_per_action_type', 'video_p25_watched_actions', 'video_p50_watched_actions', 'video_p75_watched_actions', 'video_p100_watched_actions'],
            breakdowns: []
          }
        },
        {
          sequence: 2,
          tool: 'Get Ad Set Insights',
          endpoint: 'get_ad_set_insights',
          table_name: 'meta_adset_insights',
          params: {
            time_range: timeRange,
            level: 'adset',
            fields: ['adset_id', 'adset_name', 'campaign_id', 'campaign_name', 'account_id', 'account_name', 'date_start', 'date_stop', 'clicks', 'impressions', 'reach', 'frequency', 'spend', 'cpm', 'cpp', 'ctr', 'cpc', 'cost_per_unique_click', 'quality_ranking', 'engagement_rate_ranking', 'video_avg_time_watched_actions', 'cost_per_action_type', 'video_p25_watched_actions', 'video_p50_watched_actions', 'video_p75_watched_actions', 'video_p100_watched_actions'],
            breakdowns: []
          }
        },
        {
          sequence: 3,
          tool: 'Get Ad Insights',
          endpoint: 'get_ad_insights',
          table_name: 'meta_ad_insights',
          params: {
            time_range: timeRange,
            level: 'ad',
            fields: ['ad_id', 'ad_name', 'adset_id', 'adset_name', 'campaign_id', 'campaign_name', 'account_id', 'account_name', 'date_start', 'date_stop', 'clicks', 'impressions', 'reach', 'frequency', 'spend', 'cpm', 'cpp', 'ctr', 'cpc', 'cost_per_unique_click', 'quality_ranking', 'engagement_rate_ranking', 'video_avg_time_watched_actions', 'cost_per_action_type', 'video_p25_watched_actions', 'video_p50_watched_actions', 'video_p75_watched_actions', 'video_p100_watched_actions'],
            breakdowns: []
          }
        },
        {
          sequence: 4,
          tool: 'Get Ad Insights',
          endpoint: 'get_ad_insights',
          table_name: 'meta_ad_insights_demographics',
          params: {
            time_range: timeRange,
            level: 'ad',
            fields: ['ad_id', 'ad_name', 'adset_id', 'adset_name', 'campaign_id', 'campaign_name', 'account_id', 'date_start', 'date_stop', 'clicks', 'impressions', 'reach', 'spend', 'ctr', 'cpc'],
            breakdowns: ['age', 'gender']
          }
        },
        {
          sequence: 5,
          tool: 'Get Ad Insights',
          endpoint: 'get_ad_insights',
          table_name: 'meta_ad_insights_platforms',
          params: {
            time_range: timeRange,
            level: 'ad',
            fields: ['ad_id', 'ad_name', 'adset_id', 'adset_name', 'campaign_id', 'campaign_name', 'account_id', 'date_start', 'date_stop', 'clicks', 'impressions', 'reach', 'spend', 'ctr', 'cpc'],
            breakdowns: ['publisher_platform', 'platform_position', 'device_platform']
          }
        }
      ];
      break;
      
    case 'social_extraction':
      plan.extractions = [
        {
          sequence: 1,
          tool: 'Get IG Posts',
          endpoint: 'get_ig_posts',
          table_name: 'meta_instagram_posts',
          params: {
            limit: 100,
            fields: ['id', 'permalink', 'caption', 'media_type', 'media_url', 'thumbnail_url', 'timestamp', 'username', 'comments_count', 'like_count', 'children', 'owner', 'is_shared_to_feed']
          }
        },
        {
          sequence: 2,
          tool: 'Get Media Insights',
          endpoint: 'get_media_insights',
          table_name: 'meta_instagram_media_insights',
          params: {
            metrics: ['engagement', 'impressions', 'reach', 'saved', 'video_views', 'plays', 'shares', 'total_interactions', 'follows', 'profile_visits', 'profile_activity']
          }
        },
        {
          sequence: 3,
          tool: 'Get Post Comments',
          endpoint: 'get_post_comments',
          table_name: 'meta_instagram_comments',
          params: {
            limit: 100,
            fields: ['id', 'text', 'username', 'timestamp', 'like_count', 'replies', 'user', 'media']
          }
        }
      ];
      break;
      
    case 'full_extraction':
    default:
      // Extração completa - combina todas as extrações
      plan.extractions = [
        {
          sequence: 1,
          tool: 'Lista campanhas',
          endpoint: 'lista_campanhas',
          table_name: 'meta_campaigns',
          params: {
            fields: ['id', 'name', 'status', 'objective', 'start_time', 'stop_time', 'daily_budget', 'lifetime_budget', 'budget_remaining', 'buying_type', 'special_ad_categories'],
            limit: 1000
          }
        },
        {
          sequence: 2,
          tool: 'Lista Ad Sets',
          endpoint: 'lista_ad_sets',
          table_name: 'meta_ad_sets',
          params: {
            fields: ['id', 'name', 'status', 'campaign_id', 'daily_budget', 'lifetime_budget', 'targeting', 'optimization_goal', 'bid_strategy', 'billing_event', 'promoted_object'],
            limit: 1000
          }
        },
        {
          sequence: 3,
          tool: 'List Ads',
          endpoint: 'list_ads',
          table_name: 'meta_ads',
          params: {
            fields: ['id', 'name', 'status', 'adset_id', 'creative_id', 'preview_url', 'tracking_specs', 'created_time', 'updated_time', 'bid_amount'],
            limit: 1000
          }
        },
        {
          sequence: 4,
          tool: 'Get Campaign Insights',
          endpoint: 'get_campaign_insights',
          table_name: 'meta_campaign_insights',
          params: {
            time_range: timeRange,
            level: 'campaign',
            fields: ['campaign_id', 'campaign_name', 'account_id', 'date_start', 'date_stop', 'clicks', 'impressions', 'reach', 'frequency', 'spend', 'cpm', 'cpp', 'ctr', 'cpc', 'cost_per_unique_click', 'quality_ranking', 'engagement_rate_ranking'],
            breakdowns: []
          }
        },
        {
          sequence: 5,
          tool: 'Get Ad Insights',
          endpoint: 'get_ad_insights',
          table_name: 'meta_ad_insights',
          params: {
            time_range: timeRange,
            level: 'ad',
            fields: ['ad_id', 'ad_name', 'adset_id', 'adset_name', 'campaign_id', 'campaign_name', 'account_id', 'date_start', 'date_stop', 'clicks', 'impressions', 'reach', 'frequency', 'spend', 'cpm', 'cpp', 'ctr', 'cpc'],
            breakdowns: []
          }
        },
        {
          sequence: 6,
          tool: 'Get Ad Insights',
          endpoint: 'get_ad_insights',
          table_name: 'meta_ad_insights_demographics',
          params: {
            time_range: timeRange,
            level: 'ad',
            fields: ['ad_id', 'ad_name', 'campaign_id', 'date_start', 'date_stop', 'clicks', 'impressions', 'spend'],
            breakdowns: ['age', 'gender']
          }
        },
        {
          sequence: 7,
          tool: 'Get IG Posts',
          endpoint: 'get_ig_posts',
          table_name: 'meta_instagram_posts',
          params: {
            limit: 100,
            fields: ['id', 'permalink', 'caption', 'media_type', 'media_url', 'timestamp', 'comments_count', 'like_count']
          }
        }
      ];
      break;
  }
  
  return plan;
}

/**
 * Retorna o intervalo de tempo padrão para análise
 */
function getDefaultTimeRange() {
  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - 30); // Últimos 30 dias por padrão
  
  return {
    since: startDate.toISOString().split('T')[0],
    until: endDate.toISOString().split('T')[0],
    period_type: 'last_30_days'
  };
}

/**
 * Constrói um prompt específico para extração de dados brutos
 */
function buildRawDataExtractionPrompt(extractionPlan, originalQuery) {
  // Garantir que valores indefinidos sejam tratados
  const extractionType = extractionPlan?.extraction_type || 'full_extraction';
  const timeRange = extractionPlan?.date_range || getDefaultTimeRange();
  const since = timeRange.since || 'início do período';
  const until = timeRange.until || 'fim do período';
  const extractions = extractionPlan?.extractions || [];
  
  // Cabeçalho do prompt
  let prompt = `INSTRUÇÕES PARA EXTRAÇÃO DE DADOS BRUTOS DO META ADS

TIPO DE EXTRAÇÃO: ${extractionType.toUpperCase()}
PERÍODO DE ANÁLISE: ${since} a ${until}

IMPORTANTE: RETORNE APENAS OS DADOS BRUTOS SEM ANÁLISE OU FORMATAÇÃO.
ESTES DADOS SERÃO ARMAZENADOS DIRETAMENTE EM TABELAS DE BANCO DE DADOS.

SEQUÊNCIA DE EXTRAÇÕES:
`;

  // Adicionar cada extração ao prompt
  if (extractions.length === 0) {
    prompt += `\nNenhuma extração definida. Por favor, utilize a ferramenta "Lista campanhas" e retorne os dados brutos.\n`;
  } else {
    extractions.forEach((extraction, index) => {
      prompt += `
${extraction.sequence}. USE A FERRAMENTA: "${extraction.tool || 'Lista campanhas'}"
   DESTINO: Tabela "${extraction.table_name || 'meta_dados'}"
   PARÂMETROS:`;
      
      // Adicionar parâmetros formatados
      const params = extraction.params || {};
      if (Object.keys(params).length === 0) {
        prompt += `\n   - Nenhum parâmetro específico requerido`;
      } else {
        for (const [key, value] of Object.entries(params)) {
          if (value !== null && value !== undefined) {
            if (typeof value === 'object') {
              prompt += `
   - ${key}: ${JSON.stringify(value)}`;
            } else {
              prompt += `
   - ${key}: ${value}`;
            }
          }
        }
      }
      
      prompt += `
   
   INSTRUÇÕES ESPECÍFICAS:
   - Retorne TODOS os dados sem omitir nenhum campo
   - NÃO faça análises, resumos ou agregações
   - Preserve todos os tipos de dados originais
   - Inclua metadados como data de extração
   - Formatação: JSON puro ou array de objetos
`;
    });
  }

  // Adicionar instruções finais
  prompt += `
INSTRUÇÕES GERAIS DE EXECUÇÃO:

1. REQUISITOS DE DADOS:
   - TODOS os campos e valores devem ser preservados exatamente como recebidos da API
   - Mantenha os nomes de campo originais para compatibilidade com o esquema do banco de dados
   - Preserve tipos de dados (strings, números, datas, arrays, objetos aninhados)
   - Certifique-se de que todas as relações entre entidades sejam mantidas (IDs)

2. FORMATO DE SAÍDA:
   - Dados brutos estruturados (JSON ou array de objetos)
   - Sem formatação de visualização (sem tabelas markdown, gráficos, etc.)
   - Sem análises ou insights adicionais
   - Sem resumos ou agregações
   - Inclua cabeçalhos de dados para identificação de campos

3. REQUISITOS DE EXECUÇÃO:
   - Execute cada ferramenta na sequência especificada
   - Passe os parâmetros exatos para cada ferramenta
   - Não pule nenhuma etapa da sequência
   - Não faça perguntas durante a execução
   - Não adicione comentários aos dados extraídos

Consulta original: "${originalQuery || 'Extrair dados brutos para o banco de dados'}"
`;

  return prompt;
}

// Executar a função
return processMCP();