// Função para transformar os dados brutos recebidos em formato adequado para o dashboard

import { campanhasCompletas } from './adsData';
import { postsCompletos } from './organicoData';
import { insightsData, cruzamentoDadosAdsOrganico } from './insightsData';

// Função principal para transformar dados brutos em formato para o dashboard
export const transformarDadosParaDashboard = (dadosBrutos: any[]) => {
  // Transformar dados brutos de campanhas para o formato esperado pelo dashboard
  const dadosTransformados = dadosBrutos.map(campanha => {
    return {
      id: campanha.id || generateId(),
      campanha: campanha.campanha,
      metricas: {
        investimento: campanha.investimento_total,
        impressoes: campanha.impressões,
        cliques: campanha.cliques,
        ctr: campanha.CTR,
        cpc: campanha.CPC,
        conversoes: campanha.conversões,
        custo_por_conversao: campanha.custo_por_conversão,
        roas: campanha.ROAS || 0
      },
      criativo: {
        titulo: campanha.titulo_criativo,
        formato: campanha.formato,
        caption: campanha.caption,
        link: campanha.link_conteudo,
        status: campanha.status_criativo,
        data_criacao: campanha.data_criacao_criativo
      },
      segmentacao: {
        target: campanha.target
      }
    };
  });

  return dadosTransformados;
};

// Função para calcular KPIs agregados a partir dos dados brutos
export const calcularKPIsAgregados = (dadosBrutos: any[]) => {
  // Calcular totais
  const totalImpressoes = dadosBrutos.reduce((sum, item) => sum + (item.impressões || 0), 0);
  const totalCliques = dadosBrutos.reduce((sum, item) => sum + (item.cliques || 0), 0);
  const totalInvestimento = dadosBrutos.reduce((sum, item) => sum + (item.investimento_total || 0), 0);
  const totalConversoes = dadosBrutos.reduce((sum, item) => sum + (item.conversões || 0), 0);
  
  // Calcular médias e taxas
  const ctrMedio = totalCliques / totalImpressoes * 100;
  const cpcMedio = totalInvestimento / totalCliques;
  const custoConversaoMedio = totalConversoes > 0 ? totalInvestimento / totalConversoes : 0;
  
  // Calcular ROAS médio (apenas para campanhas com ROAS > 0)
  const campanhasComRoas = dadosBrutos.filter(item => (item.ROAS || 0) > 0);
  const roasMedio = campanhasComRoas.length > 0 
    ? campanhasComRoas.reduce((sum, item) => sum + item.ROAS, 0) / campanhasComRoas.length 
    : 0;
  
  // Formatar valores para exibição
  const formatarNumero = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(2) + ' mi';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(2) + ' mil';
    } else {
      return num.toFixed(2);
    }
  };
  
  return {
    ctr: {
      value: ctrMedio.toFixed(2) + '%',
      trend: { value: '5,2%', isPositive: true }
    },
    cpc: {
      value: 'R$ ' + cpcMedio.toFixed(2),
      trend: { value: '3,1%', isPositive: false }
    },
    roas: {
      value: roasMedio.toFixed(1),
      trend: { value: '12%', isPositive: true }
    },
    impressoes: {
      value: formatarNumero(totalImpressoes),
      trend: { value: '8,7%', isPositive: true }
    },
    conversoes: {
      value: formatarNumero(totalConversoes),
      trend: { value: '10,2%', isPositive: true }
    }
  };
};

// Função para gerar dados para gráficos a partir dos dados brutos
export const gerarDadosGraficos = (dadosBrutos: any[]) => {
  // Agrupar dados por campanha para gráfico de barras
  const dadosCampanhas = dadosBrutos.reduce((acc: any, campanha: any) => {
    if (!acc[campanha.campanha]) {
      acc[campanha.campanha] = {
        name: campanha.campanha,
        value: 0
      };
    }
    
    // Usar ROAS como valor, ou CTR se ROAS não estiver disponível
    if (campanha.ROAS && campanha.ROAS > 0) {
      acc[campanha.campanha].value = campanha.ROAS;
    } else {
      acc[campanha.campanha].value = campanha.CTR;
    }
    
    return acc;
  }, {});
  
  // Converter para array e ordenar por valor
  const campanhasArray = Object.values(dadosCampanhas);
  campanhasArray.sort((a: any, b: any) => b.value - a.value);
  
  // Agrupar dados por formato para gráfico de pizza
  const dadosFormato = dadosBrutos.reduce((acc: any, campanha: any) => {
    const formato = campanha.formato || 'Desconhecido';
    
    if (!acc[formato]) {
      acc[formato] = {
        name: formato,
        value: 0
      };
    }
    
    acc[formato].value += 1;
    
    return acc;
  }, {});
  
  // Converter para array
  const formatosArray = Object.values(dadosFormato);
  
  return {
    campanhas: campanhasArray.slice(0, 5), // Top 5 campanhas
    formatos: formatosArray
  };
};

// Função para analisar performance de criativos
export const analisarPerformanceCriativos = (dadosBrutos: any[]) => {
  // Agrupar por formato
  const performancePorFormato = dadosBrutos.reduce((acc: any, campanha: any) => {
    const formato = campanha.formato || 'Desconhecido';
    
    if (!acc[formato]) {
      acc[formato] = {
        name: formato,
        count: 0,
        ctr: 0,
        cpc: 0,
        roas: 0,
        conversoes: 0
      };
    }
    
    acc[formato].count += 1;
    acc[formato].ctr += campanha.CTR || 0;
    acc[formato].cpc += campanha.CPC || 0;
    acc[formato].roas += campanha.ROAS || 0;
    acc[formato].conversoes += campanha.conversões || 0;
    
    return acc;
  }, {});
  
  // Calcular médias
  Object.keys(performancePorFormato).forEach(formato => {
    const item = performancePorFormato[formato];
    item.ctr = item.ctr / item.count;
    item.cpc = item.cpc / item.count;
    item.roas = item.roas / item.count;
    item.value = item.ctr; // Para compatibilidade com o componente de gráfico
  });
  
  // Converter para array
  return Object.values(performancePorFormato);
};

// Função para gerar ID único
const generateId = () => {
  return Math.random().toString(36).substring(2, 15);
};

// Função para processar dados brutos e retornar estrutura completa para o dashboard
export const processarDadosParaDashboard = (dadosBrutos: any[]) => {
  const dadosTransformados = transformarDadosParaDashboard(dadosBrutos);
  const kpisAgregados = calcularKPIsAgregados(dadosBrutos);
  const dadosGraficos = gerarDadosGraficos(dadosBrutos);
  const analiseCreativos = analisarPerformanceCriativos(dadosBrutos);
  
  return {
    kpis: kpisAgregados,
    graficos: {
      ctrDiario: [
        { name: '01/04', value: 4.8 },
        { name: '02/04', value: 4.9 },
        { name: '03/04', value: 5.1 },
        { name: '04/04', value: 4.7 },
        { name: '05/04', value: 5.0 },
        { name: '06/04', value: 5.3 },
        { name: '07/04', value: 5.5 },
        { name: '08/04', value: 5.2 },
        { name: '09/04', value: 5.4 },
        { name: '10/04', value: 5.6 },
        { name: '11/04', value: 5.8 },
        { name: '12/04', value: 6.0 }
      ], // Dados fictícios para exemplo
      campanhasRoas: dadosGraficos.campanhas,
      orcamento: dadosGraficos.formatos
    },
    analiseConteudo: analiseCreativos,
    dadosCompletos: dadosTransformados
  };
};

// Exemplo de uso com dados de exemplo
export const dadosProcessadosExemplo = processarDadosParaDashboard(campanhasCompletas);

// Função para integrar dados de Ads e Orgânico para a visão Overview
export const integrarDadosOverview = () => {
  // Calcular KPIs de Ads
  const kpisAds = calcularKPIsAgregados(campanhasCompletas);
  
  // Calcular KPIs de Orgânico (simplificado para exemplo)
  const kpisOrganico = {
    alcance: {
      value: '245 mil',
      trend: { value: '8,3%', isPositive: true }
    },
    engajamento: {
      value: '3,7%',
      trend: { value: '0,5%', isPositive: true }
    },
    conversoes: {
      value: '12,4 mil',
      trend: { value: '15%', isPositive: true }
    }
  };
  
  // Selecionar insights destacados
  const insightsDestacados = insightsData.slice(0, 3);
  
  return {
    kpis: {
      ads: {
        ctr: kpisAds.ctr,
        cpc: kpisAds.cpc,
        roas: kpisAds.roas
      },
      organico: kpisOrganico
    },
    graficos: {
      adsPerformance: [
        { name: 'Jan', value: 10 },
        { name: 'Fev', value: 15 },
        { name: 'Mar', value: 13 },
        { name: 'Abr', value: 17 },
        { name: 'Mai', value: 14 },
        { name: 'Jun', value: 12 },
        { name: 'Jul', value: 16 },
      ],
      organicoPerformance: [
        { name: 'Jan', value: 8 },
        { name: 'Fev', value: 12 },
        { name: 'Mar', value: 15 },
        { name: 'Abr', value: 14 },
        { name: 'Mai', value: 18 },
        { name: 'Jun', value: 20 },
        { name: 'Jul', value: 22 },
      ],
      budgetDistribution: [
        { name: 'Search', value: 35 },
        { name: 'Display', value: 25 },
        { name: 'Social', value: 30 },
        { name: 'Video', value: 10 },
      ]
    },
    insights: insightsDestacados,
    correlacao: cruzamentoDadosAdsOrganico
  };
};

// Dados integrados para o Overview
export const dadosOverviewIntegrados = integrarDadosOverview();
