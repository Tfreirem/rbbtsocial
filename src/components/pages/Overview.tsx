import KPICard from '../cards/KPICard';
import ChartWrapper from '../charts/ChartWrapper';
import { RiCalendarLine } from 'react-icons/ri';
import InsightCardsGrid from '../cards/InsightCardsGrid';

interface OverviewProps {
  navigateToInsights: (insightId: string) => void;
}

const Overview: React.FC<OverviewProps> = ({ navigateToInsights }) => {
  // Dados de exemplo para os KPIs
  const kpiData = [
    { title: 'CTR %', value: '5,2%', trend: { value: '5,2%', isPositive: true } },
    { title: 'CPC 0,72', value: '—' },
    { title: 'ROAS', value: '4,5', trend: { value: '4,5', isPositive: true } },
    { title: '125 mil', subtitle: 'Impressões', value: '' },
    { title: '8,34 mil', subtitle: 'Conversões', value: '' }
  ];

  // Dados de exemplo para os gráficos
  const dailyCtrData = [
    { name: '1', value: 3 },
    { name: '2', value: 2 },
    { name: '3', value: 4 },
    { name: '4', value: 3 },
    { name: '5', value: 2 },
    { name: '6', value: 3 },
    { name: '7', value: 4 },
    { name: '8', value: 6 },
    { name: '9', value: 8 },
    { name: '10', value: 9 },
    { name: '11', value: 7 },
    { name: '12', value: 8 }
  ];

  const topCampaignData = [
    { name: 'Camp 1', value: 15 },
    { name: 'Camp 2', value: 25 },
    { name: 'Camp 3', value: 30 },
    { name: 'Camp 4', value: 35 }
  ];

  const budgetData = [
    { name: 'Search', value: 35 },
    { name: 'Display', value: 25 },
    { name: 'Social', value: 20 },
    { name: 'Video', value: 20 }
  ];

  return (
    <div className="p-4">
      {/* Cabeçalho da página */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-normal text-white">Overview</h1>
        <div className="flex items-center text-xs bg-[#111111] px-2 py-1 rounded-md">
          <RiCalendarLine className="mr-1" size={12} />
          <span>Últimos 7 dias</span>
          <span className="ml-1">▼</span>
        </div>
      </div>

      {/* Cards de KPIs */}
      <div className="grid grid-cols-5 gap-3 mb-6">
        {kpiData.map((kpi, index) => (
          <KPICard
            key={`kpi-${index}`}
            title={kpi.title}
            value={kpi.value}
            subtitle={kpi.subtitle}
            trend={kpi.trend}
          />
        ))}
      </div>

      {/* Tabs secundárias */}
      <div className="mb-3 border-b border-gray-800">
        <div className="flex">
          <div className="px-4 py-1 border-b border-white text-white text-sm">Resumo</div>
          <div className="px-4 py-1 text-gray-500 text-sm">Posumo</div>
          <div className="px-4 py-1 text-gray-500 text-sm">Performance</div>
        </div>
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <ChartWrapper title="CTR diario" type="line" data={dailyCtrData} />
        <ChartWrapper title="Top campanhas por ROAS" type="bar" data={topCampaignData} />
        <ChartWrapper title="Divisão do orçamento" type="pie" data={budgetData} />
      </div>

      {/* Seção aprovado */}
      <div className="bg-[#111111] rounded-md p-4 mb-6">
        <h3 className="text-sm font-normal text-gray-500">Ablo aprovdo</h3>
      </div>

      {/* Seção de Insights */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-normal text-white">Insights</h2>
          <div 
            className="text-blue-400 text-sm cursor-pointer" 
            onClick={() => window.location.hash = '#/insights'}
          >
            Ver todos →
          </div>
        </div>
        
        <InsightCardsGrid limit={3} />
      </div>
    </div>
  );
};

export default Overview;
