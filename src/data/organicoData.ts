// Estrutura de dados para alimentar a seção Orgânico do dashboard RBBT Social Dash

// Dados para os KPIs principais
export const organicoKpiData = {
  alcance: {
    value: '245 mil',
    trend: { value: '8,3%', isPositive: true }
  },
  engajamento: {
    value: '3,7%',
    trend: { value: '0,5%', isPositive: true }
  },
  impressoes: {
    value: '320 mil',
    trend: { value: '12,4%', isPositive: true }
  },
  cliques: {
    value: '18,5 mil',
    trend: { value: '7,2%', isPositive: true }
  },
  conversoes: {
    value: '12,4 mil',
    trend: { value: '15%', isPositive: true }
  }
};

// Dados para o gráfico de engajamento diário
export const engajamentoDiarioData = [
  { name: '01/04', value: 3.2 },
  { name: '02/04', value: 3.4 },
  { name: '03/04', value: 3.5 },
  { name: '04/04', value: 3.3 },
  { name: '05/04', value: 3.6 },
  { name: '06/04', value: 3.8 },
  { name: '07/04', value: 4.0 },
  { name: '08/04', value: 3.9 },
  { name: '09/04', value: 4.1 },
  { name: '10/04', value: 4.2 },
  { name: '11/04', value: 4.3 },
  { name: '12/04', value: 4.5 }
];

// Dados para o gráfico de top posts por engajamento
export const postsEngajamentoData = [
  { name: 'Lançamento X-ONE Pro', value: 8.5 },
  { name: 'Dicas de proteção', value: 7.2 },
  { name: 'Review X-ONE Glass', value: 6.8 },
  { name: 'Tutorial instalação', value: 5.9 },
  { name: 'FAQ garantia', value: 5.3 }
];

// Dados para o gráfico de distribuição por tipo de conteúdo
export const tipoConteudoData = [
  { name: 'Imagem', value: 40 },
  { name: 'Vídeo', value: 30 },
  { name: 'Carrossel', value: 20 },
  { name: 'Texto', value: 10 }
];

// Dados para análise de performance por tipo de conteúdo
export const conteudoPerformanceData = [
  { name: 'Imagem', value: 40, engajamento: 3.2, alcance: 15000, cliques: 850 },
  { name: 'Vídeo', value: 65, engajamento: 6.5, alcance: 22000, cliques: 1450 },
  { name: 'Carrossel', value: 55, engajamento: 5.8, alcance: 18500, cliques: 1200 },
  { name: 'Texto', value: 30, engajamento: 2.5, alcance: 12000, cliques: 620 }
];

// Dados completos dos posts orgânicos
export const postsCompletos = [
  {
    id: 1,
    titulo: "Lançamento X-ONE Pro: A nova geração de proteção para seu smartphone",
    tipo: "Carrossel",
    data_publicacao: "2024-04-10T10:00:00Z",
    alcance: 45680,
    impressoes: 52340,
    engajamento: 8.5,
    curtidas: 3250,
    comentarios: 428,
    compartilhamentos: 865,
    salvamentos: 1240,
    cliques_link: 1850,
    conversoes: 215,
    taxa_conversao: 11.62,
    conteudo: "Apresentamos a nova linha X-ONE Pro! 🚀\n\nDesenvolvida com tecnologia de absorção de impacto militar e design ultra-fino, a X-ONE Pro é a proteção definitiva para seu smartphone.\n\n✅ Proteção contra quedas de até 4 metros\n✅ Material anti-amarelamento\n✅ Compatível com carregamento sem fio\n✅ Design exclusivo com 5 opções de cores\n\nDisponível agora para os principais modelos de smartphones. Acesse o link na bio e garanta o seu!",
    hashtags: ["#XONEPro", "#ProteçãoPremium", "#Smartphone", "#Lançamento"],
    link: "https://www.x-onebrasil.com.br/pro",
    status: "ACTIVE"
  },
  {
    id: 2,
    titulo: "5 dicas para prolongar a vida útil do seu smartphone",
    tipo: "Carrossel",
    data_publicacao: "2024-04-05T14:30:00Z",
    alcance: 38750,
    impressoes: 42180,
    engajamento: 7.2,
    curtidas: 2840,
    comentarios: 356,
    compartilhamentos: 1120,
    salvamentos: 1680,
    cliques_link: 980,
    conversoes: 145,
    taxa_conversao: 14.80,
    conteudo: "Seu smartphone merece cuidados especiais! 📱✨\n\nSeparamos 5 dicas essenciais para prolongar a vida útil do seu aparelho:\n\n1️⃣ Use sempre uma capinha de qualidade\n2️⃣ Aplique um protetor de tela resistente\n3️⃣ Evite exposição prolongada ao sol\n4️⃣ Mantenha a bateria entre 20% e 80%\n5️⃣ Limpe regularmente as entradas de carregamento\n\nQual dessas dicas você já segue? Conte nos comentários! 👇",
    hashtags: ["#DicasSmartphone", "#CuidadosComCelular", "#VidaÚtil", "#Tecnologia"],
    link: "https://blog.x-onebrasil.com.br/dicas-smartphone",
    status: "ACTIVE"
  },
  {
    id: 3,
    titulo: "Review completo: X-ONE Glass - Protetor de tela premium",
    tipo: "Vídeo",
    data_publicacao: "2024-03-28T16:45:00Z",
    alcance: 35420,
    impressoes: 39680,
    engajamento: 6.8,
    curtidas: 2560,
    comentarios: 312,
    compartilhamentos: 685,
    salvamentos: 920,
    cliques_link: 1450,
    conversoes: 185,
    taxa_conversao: 12.76,
    conteudo: "REVIEW COMPLETO: X-ONE Glass 🔍\n\nTestamos o protetor de tela X-ONE Glass em condições extremas para mostrar sua resistência incrível!\n\n⚡ Teste de queda com chaves\n⚡ Teste de riscos com objetos pontiagudos\n⚡ Teste de impacto direto\n\nO resultado? Proteção incomparável com clareza cristalina e sensibilidade ao toque preservada.\n\nAssista ao vídeo completo e veja por que o X-ONE Glass é considerado o melhor protetor do mercado!",
    hashtags: ["#XONEGlass", "#ProtetorDeTela", "#Review", "#Tecnologia"],
    link: "https://www.x-onebrasil.com.br/glass",
    status: "ACTIVE"
  },
  {
    id: 4,
    titulo: "Tutorial: Como instalar perfeitamente sua capinha e protetor de tela",
    tipo: "Vídeo",
    data_publicacao: "2024-03-20T11:15:00Z",
    alcance: 32150,
    impressoes: 36480,
    engajamento: 5.9,
    curtidas: 2180,
    comentarios: 345,
    compartilhamentos: 520,
    salvamentos: 1450,
    cliques_link: 980,
    conversoes: 110,
    taxa_conversao: 11.22,
    conteudo: "TUTORIAL COMPLETO: Instalação perfeita em 3 passos simples! 👨‍🔧\n\nAprenda como instalar sua capinha e protetor de tela X-ONE como um profissional:\n\n1️⃣ Preparação e limpeza do smartphone\n2️⃣ Alinhamento perfeito do protetor\n3️⃣ Técnica de aplicação sem bolhas\n\nCom essas dicas, você garante proteção máxima e acabamento impecável! Assista ao vídeo completo e nunca mais erre na instalação.",
    hashtags: ["#Tutorial", "#Instalação", "#ProtetorDeTela", "#Capinha", "#DicasXONE"],
    link: "https://blog.x-onebrasil.com.br/tutorial-instalacao",
    status: "ACTIVE"
  },
  {
    id: 5,
    titulo: "FAQ: Tudo sobre a garantia X-ONE",
    tipo: "Imagem",
    data_publicacao: "2024-03-15T09:30:00Z",
    alcance: 28750,
    impressoes: 32480,
    engajamento: 5.3,
    curtidas: 1850,
    comentarios: 285,
    compartilhamentos: 420,
    salvamentos: 780,
    cliques_link: 1250,
    conversoes: 95,
    taxa_conversao: 7.60,
    conteudo: "PERGUNTAS FREQUENTES: Garantia X-ONE 🛡️\n\n❓ Como ativar minha garantia?\nR: Registre seu produto em até 3 dias após a compra no site garantia.x-onebrasil.com.br\n\n❓ Qual o prazo da garantia?\nR: Todos os produtos têm garantia de 90 dias contra defeitos de fabricação\n\n❓ Como acionar a garantia?\nR: Entre em contato pelo WhatsApp oficial ou pelo formulário no site\n\n❓ Preciso da nota fiscal?\nR: Sim, a nota fiscal é necessária para o acionamento da garantia\n\nMais dúvidas? Deixe nos comentários! 👇",
    hashtags: ["#GarantiaXONE", "#FAQ", "#Suporte", "#Proteção"],
    link: "https://www.x-onebrasil.com.br/garantia",
    status: "ACTIVE"
  }
];

// Função para filtrar dados por período
export const filtrarPorPeriodo = (dados: any[], periodo: string) => {
  // Implementação da lógica de filtragem por período
  // Esta é uma função de exemplo que seria implementada com base nas necessidades específicas
  return dados;
};

// Função para calcular métricas agregadas
export const calcularMetricasAgregadas = (posts: any[]) => {
  const totalAlcance = posts.reduce((sum, post) => sum + post.alcance, 0);
  const totalImpressoes = posts.reduce((sum, post) => sum + post.impressoes, 0);
  const totalCurtidas = posts.reduce((sum, post) => sum + post.curtidas, 0);
  const totalComentarios = posts.reduce((sum, post) => sum + post.comentarios, 0);
  const totalCompartilhamentos = posts.reduce((sum, post) => sum + post.compartilhamentos, 0);
  const totalSalvamentos = posts.reduce((sum, post) => sum + post.salvamentos, 0);
  const totalCliquesLink = posts.reduce((sum, post) => sum + post.cliques_link, 0);
  const totalConversoes = posts.reduce((sum, post) => sum + post.conversoes, 0);
  
  const totalInteracoes = totalCurtidas + totalComentarios + totalCompartilhamentos + totalSalvamentos;
  const taxaEngajamentoMedia = totalInteracoes / totalImpressoes * 100;
  const taxaConversaoMedia = totalConversoes / totalCliquesLink * 100;
  
  return {
    alcance: totalAlcance,
    impressoes: totalImpressoes,
    engajamento: taxaEngajamentoMedia.toFixed(2),
    curtidas: totalCurtidas,
    comentarios: totalComentarios,
    compartilhamentos: totalCompartilhamentos,
    salvamentos: totalSalvamentos,
    cliques_link: totalCliquesLink,
    conversoes: totalConversoes,
    taxa_conversao: taxaConversaoMedia.toFixed(2)
  };
};
