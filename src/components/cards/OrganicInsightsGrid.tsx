import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import OrganicInsightCard, { OrganicInsight } from './OrganicInsightCard';
import { RiFilterLine, RiRefreshLine, RiLoader4Line, RiEmotionSadLine } from 'react-icons/ri';
import { motion, AnimatePresence } from 'framer-motion';

// URL e chave anônima do Supabase
const supabaseUrl = 'https://abuqzkawztlftojsqjsn.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFidXF6a2F3enRsZnRvanNxanNuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU5MzE4MjIsImV4cCI6MjA2MTUwNzgyMn0.jcmBgi8O_A5MqenblFDCTP7fVGqdk0QY63mt4Bwc-ss';

interface OrganicInsightsGridProps {
  title?: string;
  limit?: number;
  filterByType?: string;
}

const OrganicInsightsGrid: React.FC<OrganicInsightsGridProps> = ({ 
  title = 'Insights Orgânicos', 
  limit = 12,
  filterByType
}) => {
  const [insights, setInsights] = useState<OrganicInsight[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<string | null>(filterByType || null);
  const [showFilters, setShowFilters] = useState(false);

  // Função para buscar insights do Supabase
  const fetchInsights = async () => {
    setLoading(true);
    setError(null);

    try {
      const supabase = createClient(supabaseUrl, supabaseKey);
      
      // Build query
      let query = supabase
        .from('organic_insights')
        .select('*')
        .order('executado_em', { ascending: false });
      
      // Apply type filter if active
      if (activeFilter) {
        query = query.eq('tipo', activeFilter);
      }
      
      // Apply limit
      query = query.limit(limit);
      
      const { data, error } = await query;
      
      if (error) {
        throw new Error(`Erro ao buscar insights: ${error.message}`);
      }
      
      if (data) {
        setInsights(data as OrganicInsight[]);
      }
    } catch (err) {
      console.error('Erro ao carregar insights:', err);
      setError('Não foi possível carregar os insights. Tente novamente mais tarde.');
    } finally {
      setLoading(false);
    }
  };

  // Buscar insights ao montar o componente ou quando o filtro muda
  useEffect(() => {
    fetchInsights();
  }, [activeFilter, limit]);

  // Extrair tipos de insights únicos para os filtros
  const insightTypes = [...new Set(insights.map(insight => insight.tipo))];

  // Variantes de animação para os cards
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.05,
        duration: 0.3,
        ease: "easeOut"
      }
    }),
    exit: { opacity: 0, y: -10, transition: { duration: 0.2 } }
  };

  // Renderizar loading skeleton
  if (loading && insights.length === 0) {
    return (
      <div className="w-full">
        <div className="mb-6 px-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold">{title}</h2>
            <div className="animate-pulse bg-gray-800 rounded-full h-8 w-8"></div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 px-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="relative flex flex-col rounded-xl overflow-hidden h-64 border border-gray-800 bg-gradient-to-b from-zinc-900 to-[#111]">
              <div className="animate-pulse p-4 h-full flex flex-col">
                <div className="flex justify-between items-center mb-3">
                  <div className="h-6 bg-gray-800 rounded-full w-1/4"></div>
                  <div className="h-4 bg-gray-800 rounded w-1/5"></div>
                </div>
                <div className="h-6 bg-gray-800 rounded w-3/4 mb-4"></div>
                <div className="h-4 bg-gray-800 rounded w-full mb-2"></div>
                <div className="h-4 bg-gray-800 rounded w-5/6 mb-2"></div>
                <div className="h-4 bg-gray-800 rounded w-4/6 mb-4"></div>
                <div className="mt-auto">
                  <div className="h-0.5 bg-gray-800 w-full mb-3"></div>
                  <div className="flex justify-between">
                    <div className="h-4 bg-gray-800 rounded w-1/4"></div>
                    <div className="h-4 bg-gray-800 rounded w-1/4"></div>
                  </div>
                </div>
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none rounded-xl"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Renderizar mensagem de erro
  if (error) {
    return (
      <div className="w-full">
        <div className="p-6">
          <h2 className="text-xl font-bold mb-6">{title}</h2>
          <div className="bg-red-900/20 border border-red-800 rounded-xl p-6 flex flex-col items-center justify-center">
            <RiEmotionSadLine className="text-red-400 text-4xl mb-3" />
            <p className="text-red-400 mb-4 text-center">{error}</p>
            <button 
              onClick={fetchInsights}
              className="px-4 py-2 bg-red-700 hover:bg-red-600 transition-colors rounded-md text-white text-sm flex items-center"
            >
              <RiRefreshLine className="mr-2" /> Tentar novamente
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="px-6 mb-6">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold">{title}</h2>
          
          {/* Filters */}
          <div className="relative">
            <button 
              onClick={() => setShowFilters(!showFilters)}
              className="p-2 hover:bg-gray-800 rounded-full transition-colors"
              aria-label="Filtrar insights"
            >
              <RiFilterLine className={`text-lg ${activeFilter ? 'text-pink-500' : 'text-gray-400'}`} />
            </button>
            
            <AnimatePresence>
              {showFilters && (
                <motion.div 
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="absolute right-0 top-10 bg-zinc-900 shadow-xl border border-zinc-800 rounded-xl p-3 z-10 min-w-[200px]"
                >
                  <div className="mb-2 pb-2 border-b border-zinc-800">
                    <button 
                      onClick={() => {
                        setActiveFilter(null);
                        setShowFilters(false);
                      }}
                      className={`text-sm w-full text-left py-1 px-2 rounded ${
                        activeFilter === null 
                          ? 'bg-pink-500/10 text-pink-500' 
                          : 'text-gray-300 hover:bg-zinc-800'
                      }`}
                    >
                      Todos os insights
                    </button>
                  </div>
                  
                  {insightTypes.map(type => (
                    <div key={type} className="py-1">
                      <button 
                        onClick={() => {
                          setActiveFilter(type);
                          setShowFilters(false);
                        }}
                        className={`text-sm w-full text-left py-1 px-2 rounded ${
                          activeFilter === type 
                            ? 'bg-pink-500/10 text-pink-500' 
                            : 'text-gray-300 hover:bg-zinc-800'
                        }`}
                      >
                        {type}
                      </button>
                    </div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
      
      {insights.length === 0 ? (
        <div className="p-6">
          <div className="bg-zinc-900/50 rounded-xl p-12 flex flex-col items-center justify-center text-center border border-zinc-800">
            <RiEmotionSadLine className="text-gray-500 text-5xl mb-4" />
            <h3 className="text-gray-300 text-lg mb-2">Nenhum insight encontrado</h3>
            <p className="text-gray-500 mb-6 max-w-lg">
              Não encontramos insights com os critérios atuais. Tente alterar os filtros ou volte mais tarde.
            </p>
            {activeFilter && (
              <button 
                onClick={() => setActiveFilter(null)}
                className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 rounded-md text-white text-sm"
              >
                Remover filtros
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 px-6">
          <AnimatePresence>
            {insights.map((insight, index) => (
              <motion.div
                key={`${insight.tipo}-${insight.post_id || insight.executado_em}`}
                custom={index}
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                layout
              >
                <OrganicInsightCard insight={insight} />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
      
      {loading && insights.length > 0 && (
        <div className="flex justify-center mt-6 mb-6">
          <div className="flex items-center text-pink-500">
            <RiLoader4Line className="animate-spin mr-2" />
            <span>Carregando mais insights...</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrganicInsightsGrid; 