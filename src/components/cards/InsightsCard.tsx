import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Spinner } from '../ui/spinner';
import { Check, AlertTriangle, Brain, Lightbulb, ArrowUpRight } from 'lucide-react';

// Tipos para os insights
interface Insight {
  id: number;
  account_id?: string;
  campaign_id?: string;
  ad_set_id?: string;
  ad_id?: string;
  insight_type: string;
  insight_title: string;
  insight_content: string;
  recommendation?: string;
  timestamp: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  is_read: boolean;
  is_implemented: boolean;
  potential_impact?: string;
}

const priorityColors = {
  low: 'bg-slate-500',
  medium: 'bg-blue-500',
  high: 'bg-amber-500',
  critical: 'bg-red-500'
};

const insightTypeIcons = {
  performance: <ArrowUpRight className="w-4 h-4" />,
  budget: <Lightbulb className="w-4 h-4" />,
  audience: <Brain className="w-4 h-4" />,
  default: <Lightbulb className="w-4 h-4" />
};

export const InsightsCard: React.FC = () => {
  const [insights, setInsights] = useState<Insight[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const [unreadCount, setUnreadCount] = useState(0);

  // Buscar insights da API
  useEffect(() => {
    const fetchInsights = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/insights?limit=5');
        if (!response.ok) throw new Error('Falha ao buscar insights');
        
        const data = await response.json();
        setInsights(data.data || []);
        
        // Buscar contagem de não lidos
        const unreadResponse = await fetch('/api/insights/unread-count');
        if (unreadResponse.ok) {
          const unreadData = await unreadResponse.json();
          setUnreadCount(unreadData.count || 0);
        }
      } catch (error) {
        console.error('Erro ao buscar insights:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchInsights();
    
    // Atualizar a cada 5 minutos
    const intervalId = setInterval(fetchInsights, 5 * 60 * 1000);
    return () => clearInterval(intervalId);
  }, []);

  // Filtrar insights baseado na tab ativa
  const filteredInsights = insights.filter(insight => {
    if (activeTab === 'all') return true;
    if (activeTab === 'unread') return !insight.is_read;
    if (activeTab === 'critical') return insight.priority === 'critical';
    return false;
  });

  // Marcar insight como lido
  const markAsRead = async (id: number) => {
    try {
      const response = await fetch(`/api/insights/${id}/read`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ is_read: true }),
      });
      
      if (response.ok) {
        setInsights(insights.map(insight => 
          insight.id === id ? { ...insight, is_read: true } : insight
        ));
        
        // Atualizar contagem de não lidos
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
    } catch (error) {
      console.error('Erro ao marcar insight como lido:', error);
    }
  };

  // Marcar insight como implementado
  const markAsImplemented = async (id: number) => {
    try {
      const response = await fetch(`/api/insights/${id}/implement`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ is_implemented: true }),
      });
      
      if (response.ok) {
        setInsights(insights.map(insight => 
          insight.id === id ? { ...insight, is_implemented: true } : insight
        ));
      }
    } catch (error) {
      console.error('Erro ao marcar insight como implementado:', error);
    }
  };

  // Renderizar cada insight
  const renderInsight = (insight: Insight) => {
    const icon = insightTypeIcons[insight.insight_type as keyof typeof insightTypeIcons] || insightTypeIcons.default;
    
    return (
      <div 
        key={insight.id} 
        className={`border rounded-lg p-4 mb-3 ${!insight.is_read ? 'bg-slate-50' : ''}`}
      >
        <div className="flex justify-between items-start mb-2">
          <div className="flex items-center">
            <Badge className={`mr-2 ${priorityColors[insight.priority]}`}>
              {insight.priority}
            </Badge>
            <Badge variant="outline" className="flex items-center gap-1">
              {icon} {insight.insight_type}
            </Badge>
          </div>
          <div className="text-xs text-gray-500">
            {new Date(insight.timestamp).toLocaleDateString()}
          </div>
        </div>
        
        <h4 className="font-medium mb-1">{insight.insight_title}</h4>
        <p className="text-sm text-gray-700 mb-2">{insight.insight_content}</p>
        
        {insight.recommendation && (
          <div className="bg-blue-50 p-2 rounded text-sm mb-3">
            <span className="font-medium">Recomendação:</span> {insight.recommendation}
          </div>
        )}
        
        <div className="flex gap-2 mt-2">
          {!insight.is_read && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => markAsRead(insight.id)}
            >
              <Check className="w-4 h-4 mr-1" /> Marcar como lido
            </Button>
          )}
          
          {!insight.is_implemented && insight.recommendation && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => markAsImplemented(insight.id)}
            >
              <Check className="w-4 h-4 mr-1" /> Implementar
            </Button>
          )}
        </div>
      </div>
    );
  };

  return (
    <Card className="col-span-1 lg:col-span-2">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center">
            <Brain className="mr-2 h-5 w-5" /> 
            Insights do Agente
            {unreadCount > 0 && (
              <Badge className="ml-2 bg-red-500">{unreadCount} novo{unreadCount > 1 ? 's' : ''}</Badge>
            )}
          </CardTitle>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="all">Todos</TabsTrigger>
            <TabsTrigger value="unread">Não lidos</TabsTrigger>
            <TabsTrigger value="critical">Críticos</TabsTrigger>
          </TabsList>
        </Tabs>
      </CardHeader>
      
      <CardContent>
        {loading ? (
          <div className="flex justify-center p-8">
            <Spinner />
          </div>
        ) : filteredInsights.length === 0 ? (
          <div className="text-center p-8 text-gray-500">
            <div className="flex justify-center mb-2">
              <Lightbulb className="h-8 w-8" />
            </div>
            <p>Nenhum insight encontrado para esta visualização.</p>
          </div>
        ) : (
          <div className="space-y-1">
            {filteredInsights.map(renderInsight)}
            
            {filteredInsights.length > 0 && (
              <Button variant="ghost" className="w-full mt-2">
                Ver todos os insights
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}; 