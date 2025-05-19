import { useState, useEffect } from 'react';
import DateFilter from '../filters/DateFilter';
import { CampaignInsightsCard } from '../cards/CampaignInsightsCard';
import InsightCardsGrid from '../cards/InsightCardsGrid';
import OrganicInsightsGrid from '../cards/OrganicInsightsGrid';
import { createClient } from '@supabase/supabase-js';
import { Spinner } from '../ui/spinner';
import { Calendar, Lightbulb, Check, ArrowRight } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';

// URL e chave anônima do Supabase
const supabaseUrl = 'https://abuqzkawztlftojsqjsn.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFidXF6a2F3enRsZnRvanNxanNuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTQzMzgyNDksImV4cCI6MjAyOTkxNDI0OX0.1Fd47D5_L4x_QgGp9YQkZG_Gq9uMuG3XUgZvKh7XpFc';

// Função para determinar a cor de fundo com base na categoria
const getCategoryColor = (category: string = 'Campanha') => {
  const lowercaseCategory = category.toLowerCase();
  
  if (lowercaseCategory.includes('campanha')) return 'bg-amber-500';
  if (lowercaseCategory.includes('criativo')) return 'bg-blue-500';
  if (lowercaseCategory.includes('convers')) return 'bg-green-500';
  if (lowercaseCategory.includes('audi')) return 'bg-purple-500';
  
  // Default color
  return 'bg-amber-500';
};

interface InsightsProps {
  activeInsightId?: string;
}

const Insights: React.FC<InsightsProps> = ({ activeInsightId }) => {
  const [loading, setLoading] = useState(true);
  const [activeInsight, setActiveInsight] = useState<any>(null);
  const [relatedInsights, setRelatedInsights] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('campaign');

  const handlePeriodChange = () => {
    // Aqui você poderia buscar novos dados baseados no período selecionado
  };

  // Buscar insight ativo e insights relacionados
  useEffect(() => {
    if (!activeInsightId) {
      setLoading(false);
      return;
    }

    const fetchActiveInsight = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const supabase = createClient(supabaseUrl, supabaseKey);
        
        // Buscar o insight específico
        const { data: insightData, error: insightError } = await supabase
          .from('insights_campanha')
          .select('*')
          .eq('id', activeInsightId)
          .single();
        
        if (insightError) {
          console.error('Erro ao buscar insight específico:', insightError);
          setError(`Erro ao buscar insight: ${insightError.message}`);
          setLoading(false);
          return;
        }
        
        if (!insightData) {
          setError('Insight não encontrado');
          setLoading(false);
          return;
        }
        
        // Processar arrays se estiverem como strings
        const processedInsight = {
          ...insightData,
          insights: typeof insightData.insights === 'string' 
            ? JSON.parse(insightData.insights) 
            : insightData.insights,
          recomendacoes: typeof insightData.recomendacoes === 'string' 
            ? JSON.parse(insightData.recomendacoes) 
            : insightData.recomendacoes
        };
        
        setActiveInsight(processedInsight);
        
        // Buscar insights relacionados (da mesma categoria)
        const { data: relatedData, error: relatedError } = await supabase
          .from('insights_campanha')
          .select('*')
          .neq('id', activeInsightId)
          .limit(3);
        
        if (!relatedError && relatedData) {
          setRelatedInsights(relatedData);
        }
      } catch (error: any) {
        console.error('Erro ao buscar insight:', error);
        setError(`Erro inesperado: ${error.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchActiveInsight();
  }, [activeInsightId]);

  // Exibir tela de carregamento
  if (loading && activeInsightId) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner size="lg" />
      </div>
    );
  }

  // Se tiver um insight ativo e ele foi carregado com sucesso, mostrar detalhes
  if (activeInsightId && activeInsight) {
    const categoryColor = getCategoryColor(activeInsight.categoria);
    
    return (
      <div className="p-6">
        {/* Header com título e filtro de data */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-white mr-4">Insight Detalhado</h1>
            <div className={`${categoryColor} text-white text-xs rounded px-2 py-1 flex items-center gap-1`}>
              <Lightbulb className="w-3 h-3" /> {activeInsight.categoria || 'Campanha'}
            </div>
          </div>
          <DateFilter onFilterChange={handlePeriodChange} />
        </div>

        {/* Insight Card Detalhado */}
        <div className="bg-[#111111] rounded-lg p-6 mb-6">
          <div className="flex items-center mb-4">
            <h2 className="text-xl font-semibold text-white">{activeInsight.nome}</h2>
            <div className="ml-auto flex items-center text-gray-500 text-sm">
              <Calendar className="w-4 h-4 mr-1" />
              <span>{activeInsight.periodo}</span>
            </div>
          </div>
          
          {/* Descrição completa como texto inicial */}
          {activeInsight.descricao && (
            <div className="mb-6">
              <p className="text-gray-300 mb-4">{activeInsight.descricao}</p>
            </div>
          )}
          
          {/* Insights */}
          {activeInsight.insights && activeInsight.insights.length > 0 && (
            <div className="mb-6">
              <h4 className="font-medium mb-3 flex items-center">
                <Lightbulb className="w-4 h-4 mr-2 text-amber-500" /> 
                Insights Principais
              </h4>
              <ul className="list-disc pl-5 space-y-2 text-gray-300">
                {activeInsight.insights.map((item: string, index: number) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>
          )}
          
          {/* Recomendações */}
          {activeInsight.recomendacoes && activeInsight.recomendacoes.length > 0 && (
            <div className="mb-6">
              <h4 className="font-medium mb-3 flex items-center">
                <Check className="w-4 h-4 mr-2 text-green-500" /> 
                Recomendações
              </h4>
              <ul className="list-disc pl-5 space-y-2 text-gray-300">
                {activeInsight.recomendacoes.map((item: string, index: number) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>
          )}
          
          {/* Conclusão */}
          {activeInsight.conclusao && (
            <div className="mb-6">
              <h4 className="font-medium mb-3">Conclusão</h4>
              <p className="text-gray-300 bg-[#191919] p-4 rounded">{activeInsight.conclusao}</p>
            </div>
          )}
          
          {/* Data de criação */}
          <div className="text-right text-xs text-gray-500">
            Gerado em: {new Date(activeInsight.criado_em).toLocaleDateString('pt-BR', { 
              day: '2-digit', 
              month: '2-digit', 
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </div>
        </div>

        {/* Insights Relacionados */}
        {relatedInsights.length > 0 && (
          <div className="mt-8">
            <h3 className="text-lg font-semibold text-white mb-4">Insights Relacionados</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {relatedInsights.map(insight => {
                const relatedCategoryColor = getCategoryColor(insight.categoria);
                
                const handleCardClick = () => {
                  window.location.hash = `#/insights/${insight.id}`;
                };
                
                return (
                  <div 
                    key={insight.id}
                    className="bg-[#111111] rounded-lg p-4 cursor-pointer hover:bg-[#191919] transition-all duration-200 flex flex-col h-full"
                    onClick={handleCardClick}
                  >
                    <div className="flex items-center mb-2">
                      <span className={`${relatedCategoryColor} text-white text-xs rounded px-2 py-1 flex items-center gap-1`}>
                        <Lightbulb className="w-3 h-3" /> {insight.categoria || 'Campanha'}
                      </span>
                      <span className="text-gray-500 text-xs ml-2">{insight.periodo}</span>
                    </div>
                    <h4 className="font-medium text-white mb-2 line-clamp-2">{insight.nome}</h4>
                    <p className="text-gray-400 text-sm mb-3 flex-grow">
                      {insight.descricao}
                    </p>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCardClick();
                      }}
                      className="text-blue-400 text-xs flex items-center justify-end hover:text-blue-300 transition-colors duration-200 w-full mt-auto"
                    >
                      Ver detalhes <ArrowRight className="w-3 h-3 ml-1" />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}
        
        {error && (
          <div className="p-4 bg-red-900/20 border border-red-700 rounded-md text-red-400 my-6">
            {error}
          </div>
        )}
      </div>
    );
  }

  // Se não tiver insight ativo, mostrar grid com todos os insights
  return (
    <div className="p-6">
      {/* Header com título e filtro de data */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-white">Insights</h1>
        <DateFilter onFilterChange={handlePeriodChange} />
      </div>

      {/* Tabs para alternar entre tipos de insights */}
      <div className="mb-6">
        <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="bg-gray-800">
            <TabsTrigger value="campaign">Campanha</TabsTrigger>
            <TabsTrigger value="organic">Orgânico</TabsTrigger>
          </TabsList>
          <TabsContent value="campaign">
            <InsightCardsGrid />
          </TabsContent>
          <TabsContent value="organic">
            <OrganicInsightsGrid />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Insights;
