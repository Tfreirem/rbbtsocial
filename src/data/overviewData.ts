// Estrutura de dados para alimentar a seção Overview do dashboard RBBT Social Dash

import { adsKpiData as adsKPIs } from './adsData';
import { organicoKpiData as organicoKPIs } from './organicoData';
import { insightsData } from './insightsData';

// Dados para os KPIs principais na visão Overview
export const overviewKpiData = {
  // KPIs de Ads selecionados para o Overview
  ads: {
    ctr: adsKPIs.ctr,
    cpc: adsKPIs.cpc,
    roas: adsKPIs.roas
  },
  
  // KPIs de Orgânico selecionados para o Overview
  organico: {
    alcance: organicoKPIs.alcance,
    engajamento: organicoKPIs.engajamento,
    conversoes: organicoKPIs.conversoes
  }
};

// Dados para os gráficos de performance combinada
export const performanceCombinada = {
  // Dados para o gráfico de performance de Ads ao longo do tempo
  adsPerformance: [
    { name: 'Jan', value: 10 },
    { name: 'Fev', value: 15 },
    { name: 'Mar', value: 13 },
    { name: 'Abr', value: 17 },
    { name: 'Mai', value: 14 },
    { name: 'Jun', value: 12 },
    { name: 'Jul', value: 16 },
  ],
  
  // Dados para o gráfico de performance de Orgânico ao longo do tempo
  organicoPerformance: [
    { name: 'Jan', value: 8 },
    { name: 'Fev', value: 12 },
    { name: 'Mar', value: 15 },
    { name: 'Abr', value: 14 },
    { name: 'Mai', value: 18 },
    { name: 'Jun', value: 20 },
    { name: 'Jul', value: 22 },
  ],
  
  // Dados para o gráfico de distribuição de orçamento
  budgetDistribution: [
    { name: 'Search', value: 35 },
    { name: 'Display', value: 25 },
    { name: 'Social', value: 30 },
    { name: 'Video', value: 10 },
  ]
};

// Insights destacados para o Overview
export const insightsDestacados = insightsData.slice(0, 3);

// Métricas de correlação entre Ads e Orgânico
export const correlacaoAdsOrganico = {
  // Impacto do engajamento orgânico nas conversões de Ads
  impactoEngajamentoConversoes: [
    { nivel_engajamento: 'Baixo', taxa_conversao_ads: 1.2 },
    { nivel_engajamento: 'Médio', taxa_conversao_ads: 2.8 },
    { nivel_engajamento: 'Alto', taxa_conversao_ads: 4.5 }
  ],
  
  // Eficiência de custo por tipo de jornada
  eficienciaCusto: [
    { tipo_jornada: 'Apenas Ads', cpa_medio: 42.5 },
    { tipo_jornada: 'Orgânico → Ads', cpa_medio: 28.3 },
    { tipo_jornada: 'Orgânico → Remarketing', cpa_medio: 18.7 }
  ],
  
  // Comparativo de performance por canal
  comparativoCanais: [
    { canal: 'Ads - Search', ctr: 3.2, conversao: 2.5 },
    { canal: 'Ads - Social', ctr: 1.8, conversao: 1.2 },
    { canal: 'Orgânico - Feed', ctr: 4.5, conversao: 1.8 },
    { canal: 'Orgânico - Stories', ctr: 5.2, conversao: 0.9 }
  ]
};

// Função para filtrar dados por período
export const filtrarDadosPorPeriodo = (dados: any[], periodo: string) => {
  // Implementação da lógica de filtragem por período
  // Esta é uma função de exemplo que seria implementada com base nas necessidades específicas
  return dados;
};

// Função para calcular métricas combinadas
export const calcularMetricasCombinadas = (dadosAds: any[], dadosOrganico: any[]) => {
  // Esta função calcularia métricas que combinam dados de Ads e Orgânico
  // Por exemplo, correlações, impacto cruzado, etc.
  
  return {
    correlacao_engajamento_conversao: 0.78, // Correlação entre engajamento orgânico e taxa de conversão em ads
    impacto_organico_cpa: -32, // Redução percentual no CPA para usuários que interagiram com conteúdo orgânico
    eficiencia_jornada_combinada: 1.45 // Multiplicador de eficiência para jornadas que combinam orgânico e ads
  };
};
