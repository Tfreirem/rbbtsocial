import { useState } from 'react';
import KPICard from '../cards/KPICard';
import ChartWrapper from '../charts/ChartWrapper';
import DateFilter from '../filters/DateFilter';
import TabMenu from '../layout/TabMenu';
import { RiBarChartBoxLine } from 'react-icons/ri';

const Ads: React.FC = () => {
  const [activeTab, setActiveTab] = useState('Geral');

  // Dados de exemplo para os KPIs
  const adsKpiData = [
    { title: 'CTR %', value: '5,2%', trend: { value: '5,2%', isPositive: true } },
    { title: 'CPC', value: 'R$ 0,72', trend: { value: '3,1%', isPositive: false } },
    { title: 'ROAS', value: '4,5', trend: { value: '12%', isPositive: true } },
    { title: 'Impressões', value: '125 mil', trend: { value: '8,7%', isPositive: true } },
    { title: 'Conversões', value: '8,34 mil', trend: { value: '10,2%', isPositive: true } },
  ];

  // Dados de exemplo para os gráficos
  const ctrData = [
    { name: '1', value: 10 },
    { name: '2', value: 15 },
    { name: '3', value: 13 },
    { name: '4', value: 17 },
    { name: '5', value: 14 },
    { name: '6', value: 12 },
    { name: '7', value: 16 },
    { name: '8', value: 18 },
    { name: '9', value: 20 },
    { name: '10', value: 25 },
    { name: '11', value: 22 },
    { name: '12', value: 30 },
  ];

  const campaignsData = [
    { name: 'Camp 1', value: 20 },
    { name: 'Camp 2', value: 30 },
    { name: 'Camp 3', value: 40 },
    { name: 'Camp 4', value: 50 },
    { name: 'Camp 5', value: 60 },
  ];

  const budgetData = [
    { name: 'Search', value: 400 },
    { name: 'Display', value: 300 },
    { name: 'Social', value: 200 },
    { name: 'Video', value: 100 },
  ];

  // Dados de exemplo para análise de conteúdos
  const contentPerformanceData = [
    { name: 'Imagem', value: 40 },
    { name: 'Vídeo', value: 65 },
    { name: 'Carrossel', value: 55 },
    { name: 'Texto', value: 30 },
  ];

  const handlePeriodChange = () => {
    // Aqui você poderia buscar novos dados baseados no período selecionado
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'Geral':
        return (
          <>
            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
              {adsKpiData.map((kpi, index) => (
                <KPICard
                  key={index}
                  title={kpi.title}
                  value={kpi.value}
                  trend={kpi.trend}
                  icon={<RiBarChartBoxLine size={20} />}
                />
              ))}
            </div>
            
            {/* Charts */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
              <ChartWrapper title="CTR diario" type="line" data={ctrData} />
              <ChartWrapper title="Top campanhas por ROAS" type="bar" data={campaignsData} />
              <ChartWrapper title="Divisão do orçamento" type="pie" data={budgetData} />
            </div>
          </>
        );
      case 'Performance':
        return (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <ChartWrapper title="Performance por Campanha" type="bar" data={campaignsData} />
              <ChartWrapper title="Performance por Período" type="line" data={ctrData} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <ChartWrapper title="ROAS por Campanha" type="bar" data={campaignsData} />
              <ChartWrapper title="CPC por Campanha" type="bar" data={campaignsData} />
            </div>
          </>
        );
      case 'Conteúdos':
        return (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <ChartWrapper title="Performance por Tipo de Conteúdo" type="bar" data={contentPerformanceData} />
              <ChartWrapper title="Engajamento por Tipo de Conteúdo" type="bar" data={contentPerformanceData} />
            </div>
            <div className="card p-6 mb-6">
              <h3 className="text-lg font-medium text-white mb-4">Análise de Criativos</h3>
              <p className="text-gray-400 mb-2">Os criativos em formato de vídeo apresentam performance superior, com CTR 35% maior que outros formatos.</p>
              <p className="text-gray-400 mb-2">Criativos com pessoas reais têm conversão 22% maior que criativos com ilustrações ou gráficos.</p>
              <p className="text-gray-400">Chamadas para ação diretas ("Compre agora") têm performance 18% melhor que indiretas ("Saiba mais").</p>
            </div>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="p-6">
      {/* Header com título e filtro de data */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-white">Ads</h1>
        <DateFilter onFilterChange={handlePeriodChange} />
      </div>

      {/* Tab Menu */}
      <div className="card mb-6">
        <TabMenu
          tabs={['Geral', 'Performance', 'Conteúdos']}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />
      </div>

      {/* Tab Content */}
      {renderTabContent()}
    </div>
  );
};

export default Ads;
