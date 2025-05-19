// Estrutura de dados para alimentar a seção Ads do dashboard RBBT Social Dash

// Dados para os KPIs principais
export const adsKpiData = {
  ctr: {
    value: '5,2%',
    trend: { value: '5,2%', isPositive: true }
  },
  cpc: {
    value: 'R$ 0,72',
    trend: { value: '3,1%', isPositive: false }
  },
  roas: {
    value: '4,5',
    trend: { value: '12%', isPositive: true }
  },
  impressoes: {
    value: '125 mil',
    trend: { value: '8,7%', isPositive: true }
  },
  conversoes: {
    value: '8,34 mil',
    trend: { value: '10,2%', isPositive: true }
  }
};

// Dados para o gráfico de CTR diário
export const ctrDiarioData = [
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
];

// Dados para o gráfico de campanhas por ROAS
export const campanhasRoasData = [
  { name: '[MAR][CONVERSÃO][VENDA-SITE]', value: 6.2 },
  { name: '[MAR][REMARKETING][ABANDONO]', value: 5.8 },
  { name: '[FEV][CONVERSÃO][VENDA-SITE]', value: 4.9 },
  { name: '[ABR][REMARKETING][ABANDONO]', value: 4.5 },
  { name: '[ABR][AWARENESS][VISITA-PERFIL]', value: 3.2 }
];

// Dados para o gráfico de divisão do orçamento
export const orcamentoData = [
  { name: 'Awareness', value: 25 },
  { name: 'Consideração', value: 30 },
  { name: 'Conversão', value: 35 },
  { name: 'Remarketing', value: 10 }
];

// Dados para análise de performance por tipo de conteúdo
export const conteudoPerformanceData = [
  { name: 'Imagem', value: 40, ctr: 3.8, cpc: 0.85, roas: 3.2 },
  { name: 'Vídeo', value: 65, ctr: 5.6, cpc: 0.65, roas: 4.8 },
  { name: 'Carrossel', value: 55, ctr: 4.9, cpc: 0.72, roas: 4.2 },
  { name: 'Texto', value: 30, ctr: 3.2, cpc: 0.95, roas: 2.8 }
];

// Dados completos das campanhas (baseado no formato recebido)
export const campanhasCompletas = [
  {
    id: 1,
    campanha: "[FEV][AWARENESS][VISITA-PERFIL]",
    investimento_total: 3743.58,
    impressões: 1323080,
    cliques: 15437,
    CTR: 1.17,
    CPC: 0.24,
    conversões: 9,
    custo_por_conversão: 415.95,
    ROAS: 0,
    titulo_criativo: "Proteção de verdade é aquela que continua depois da compra",
    formato: "Carrossel com 5 imagens",
    caption: "Proteção de verdade é aquela que continua depois da compra.\n\nE com a garantia da X-ONE, você tem suporte real, ágil e transparente.\n\n📲 Registre sua garantia direto no site em poucos minutos: http://garantia.x-onebrasil.com.br\n\n✔️ Precisa acionar? É só falar com a gente pelo WhatsApp.\n✔️ Ativação em até 24h.\n✔️ Garantia válida por até 3 dias úteis após a compra.\n\nConfiança não se promete. Se garante.",
    target: "Público aberto Brasil, 18-65 anos",
    link_conteudo: "https://www.instagram.com/p/DIBsEqYBXG2/",
    status_criativo: "ACTIVE",
    data_criacao_criativo: "2024-02-15T09:45:23Z"
  },
  {
    id: 2,
    campanha: "[MAR][CONVERSÃO][VENDA-SITE]",
    investimento_total: 5621.45,
    impressões: 982450,
    cliques: 28765,
    CTR: 2.93,
    CPC: 0.19,
    conversões: 187,
    custo_por_conversão: 30.06,
    ROAS: 6.2,
    titulo_criativo: "Proteção que você pode confiar, com preço que cabe no bolso",
    formato: "Vídeo de 15 segundos",
    caption: "Proteção que você pode confiar, com preço que cabe no bolso.\n\nA X-ONE tem os melhores acessórios para seu smartphone com qualidade premium e garantia real.\n\n🔥 PROMOÇÃO: Compre qualquer capinha e ganhe um protetor de tela grátis!\n\n✅ Frete grátis para todo Brasil\n✅ Garantia de 90 dias\n✅ Parcelamento em até 12x\n\nAcesse agora: www.x-onebrasil.com.br",
    target: "Interesse em tecnologia, compras online, 25-45 anos",
    link_conteudo: "https://www.instagram.com/p/FGhJkLmNpQ3/",
    status_criativo: "ACTIVE",
    data_criacao_criativo: "2024-03-10T14:30:12Z"
  },
  {
    id: 3,
    campanha: "[MAR][REMARKETING][ABANDONO]",
    investimento_total: 2845.32,
    impressões: 542680,
    cliques: 18932,
    CTR: 3.49,
    CPC: 0.15,
    conversões: 142,
    custo_por_conversão: 20.04,
    ROAS: 5.8,
    titulo_criativo: "Ei, você esqueceu algo no carrinho!",
    formato: "Imagem única",
    caption: "Ei, você esqueceu algo no carrinho!\n\nSua proteção está esperando por você. E tem mais: use o cupom VOLTE10 e ganhe 10% de desconto na sua compra.\n\n⏰ Oferta válida por 24 horas\n🛒 Finalize sua compra agora\n\nwww.x-onebrasil.com.br/carrinho",
    target: "Visitantes do site que adicionaram produtos ao carrinho mas não finalizaram a compra",
    link_conteudo: "https://www.instagram.com/p/HiJkLmNoPq7/",
    status_criativo: "ACTIVE",
    data_criacao_criativo: "2024-03-18T10:15:45Z"
  },
  {
    id: 4,
    campanha: "[ABR][AWARENESS][VISITA-PERFIL]",
    investimento_total: 4125.75,
    impressões: 1568920,
    cliques: 19845,
    CTR: 1.26,
    CPC: 0.21,
    conversões: 28,
    custo_por_conversão: 147.35,
    ROAS: 3.2,
    titulo_criativo: "Seu smartphone merece o melhor. Você também.",
    formato: "Carrossel com 3 imagens",
    caption: "Seu smartphone merece o melhor. Você também.\n\nConheça a linha premium de acessórios X-ONE, desenvolvida para quem não abre mão de qualidade e estilo.\n\n🔒 Proteção de impacto militar\n🎨 Design exclusivo\n♻️ Materiais sustentáveis\n\nDescubra mais no nosso perfil.",
    target: "Interesse em smartphones premium, estilo de vida, 20-55 anos",
    link_conteudo: "https://www.instagram.com/p/KlMnOpQrSt9/",
    status_criativo: "ACTIVE",
    data_criacao_criativo: "2024-04-05T08:20:33Z"
  },
  {
    id: 5,
    campanha: "[ABR][REMARKETING][ABANDONO]",
    investimento_total: 3250.48,
    impressões: 625780,
    cliques: 22145,
    CTR: 3.54,
    CPC: 0.15,
    conversões: 168,
    custo_por_conversão: 19.35,
    ROAS: 4.5,
    titulo_criativo: "Sua proteção está esperando por você!",
    formato: "Vídeo de 10 segundos",
    caption: "Sua proteção está esperando por você!\n\nFinalize sua compra agora e ganhe frete grátis com o cupom FRETEGRATIS.\n\n⚡ Entrega expressa disponível\n🔄 30 dias para troca ou devolução\n💳 Parcele em até 12x sem juros\n\nwww.x-onebrasil.com.br/carrinho",
    target: "Visitantes do site que adicionaram produtos ao carrinho mas não finalizaram a compra",
    link_conteudo: "https://www.instagram.com/p/MnOpQrStUv1/",
    status_criativo: "ACTIVE",
    data_criacao_criativo: "2024-04-12T16:40:22Z"
  }
];

// Função para filtrar dados por período
export const filtrarPorPeriodo = (dados: any[], periodo: string) => {
  // Implementação da lógica de filtragem por período
  // Esta é uma função de exemplo que seria implementada com base nas necessidades específicas
  return dados;
};

// Função para calcular métricas agregadas
export const calcularMetricasAgregadas = (campanhas: any[]) => {
  const totalImpressoes = campanhas.reduce((sum, camp) => sum + camp.impressões, 0);
  const totalCliques = campanhas.reduce((sum, camp) => sum + camp.cliques, 0);
  const totalInvestimento = campanhas.reduce((sum, camp) => sum + camp.investimento_total, 0);
  const totalConversoes = campanhas.reduce((sum, camp) => sum + camp.conversões, 0);
  
  const ctrMedio = totalCliques / totalImpressoes * 100;
  const cpcMedio = totalInvestimento / totalCliques;
  const custoConversaoMedio = totalInvestimento / totalConversoes;
  
  // Cálculo do ROAS médio (apenas para campanhas com ROAS > 0)
  const campanhasComRoas = campanhas.filter(camp => camp.ROAS > 0);
  const roasMedio = campanhasComRoas.length > 0 
    ? campanhasComRoas.reduce((sum, camp) => sum + camp.ROAS, 0) / campanhasComRoas.length 
    : 0;
  
  return {
    impressoes: totalImpressoes,
    cliques: totalCliques,
    ctr: ctrMedio.toFixed(2),
    cpc: cpcMedio.toFixed(2),
    conversoes: totalConversoes,
    custoConversao: custoConversaoMedio.toFixed(2),
    roas: roasMedio.toFixed(2)
  };
};
