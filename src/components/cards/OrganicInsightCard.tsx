import { useState } from 'react';
import { RiLineChartLine, RiChat3Line, RiHeartFill, RiPlayCircleLine, RiImageLine, RiGalleryLine, RiInstagramLine, RiExternalLinkLine } from 'react-icons/ri';

export interface OrganicInsight {
  tipo: string;
  pergunta: string;
  insight: string;
  justificativa: string;
  sugestao: string;
  post_id: string | null;
  caption: string | null;
  permalink: string | null;
  timestamp_post: string | null;
  like_count: number | null;
  comments_count: number | null;
  executado_em: string;
}

interface OrganicInsightCardProps {
  insight: OrganicInsight;
}

const OrganicInsightCard: React.FC<OrganicInsightCardProps> = ({ insight }) => {
  const [isHovered, setIsHovered] = useState(false);

  // Get type badge color and icon
  const getTypeBadgeInfo = (tipo: string) => {
    switch (tipo.toLowerCase()) {
      case 'melhor_post':
        return { 
          color: 'bg-gradient-to-r from-green-600 to-emerald-500',
          label: 'Destaque',
          icon: <RiLineChartLine className="w-3 h-3 mr-1" />
        };
      case 'pior_post':
        return { 
          color: 'bg-gradient-to-r from-red-600 to-orange-500',
          label: 'Alerta',
          icon: <RiLineChartLine className="w-3 h-3 mr-1" />
        };
      case 'tendencia':
        return { 
          color: 'bg-gradient-to-r from-blue-600 to-indigo-500',
          label: 'Tendência',
          icon: <RiLineChartLine className="w-3 h-3 mr-1" />
        };
      default:
        return { 
          color: 'bg-gradient-to-r from-purple-600 to-pink-500',
          label: 'Insight',
          icon: <RiLineChartLine className="w-3 h-3 mr-1" />
        };
    }
  };

  // Get media type icon
  const getMediaTypeIcon = () => {
    // Determine if it's a reel based on permalink
    const permalink = insight.permalink || '';
    
    if (permalink.includes('/reel/')) {
      return <RiPlayCircleLine className="text-lg text-pink-500" />;
    } else if (permalink.includes('/p/')) {
      // For regular posts, determine if it's likely a carousel
      if (insight.caption && (
        insight.caption.includes('Swipe') || 
        insight.caption.includes('Deslize') || 
        insight.caption.includes('➡️') ||
        insight.caption.includes('Slide')
      )) {
        return <RiGalleryLine className="text-lg text-blue-500" />;
      }
      return <RiImageLine className="text-lg text-green-500" />;
    }
    
    return <RiInstagramLine className="text-lg text-gray-400" />;
  };

  // Format date if available
  const formattedDate = insight.timestamp_post 
    ? new Date(insight.timestamp_post).toLocaleDateString('pt-BR') 
    : null;

  const typeBadge = getTypeBadgeInfo(insight.tipo);
  const mediaIcon = getMediaTypeIcon();
  const hasPermalink = Boolean(insight.permalink);
  
  // Handle opening the post URL when clicked
  const openPostUrl = (e: React.MouseEvent) => {
    // Prevent event from bubbling up if clicked on button
    e.stopPropagation();
    
    if (insight.permalink) {
      window.open(insight.permalink, '_blank');
    }
  };

  return (
    <div 
      className={`h-full bg-[#151515] border border-zinc-800 rounded-xl flex flex-col ${hasPermalink ? 'cursor-pointer hover:border-pink-500/30' : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={hasPermalink ? openPostUrl : undefined}
    >
      {/* Header - Always visible */}
      <div className="p-4 pb-2">
        <div className="flex justify-between items-center">
          <div className={`px-2 py-1 rounded-full text-xs text-white flex items-center ${typeBadge.color}`}>
            {typeBadge.icon}
            {typeBadge.label}
          </div>
          
          <div className="flex items-center gap-2">
            {mediaIcon}
            {formattedDate && (
              <span className="text-xs text-gray-400">{formattedDate}</span>
            )}
          </div>
        </div>
      </div>
      
      {/* Question - Always visible */}
      <div className="px-4 pb-2">
        <h3 className="text-base font-semibold text-white">{insight.pergunta}</h3>
      </div>
      
      {/* Main content - Switchable on hover */}
      <div className="px-4 flex-grow">
        {/* Front content - Insight */}
        {!isHovered && (
          <p className="text-sm text-gray-300">{insight.insight}</p>
        )}
        
        {/* Back content - Justificativa & Sugestão */}
        {isHovered && (
          <div>
            <div className="mb-3">
              <h4 className="text-sm font-semibold text-white mb-1">Justificativa</h4>
              <p className="text-sm text-gray-400">{insight.justificativa}</p>
            </div>
            
            {insight.sugestao && (
              <div>
                <h4 className="text-sm font-semibold text-white mb-1">Sugestão</h4>
                <p className="text-sm text-emerald-400">{insight.sugestao}</p>
              </div>
            )}
          </div>
        )}
      </div>
      
      {/* Footer with metrics */}
      <div className="mt-auto p-4 pt-3 border-t border-zinc-800/50">
        <div className="flex justify-between items-center">
          <div className="flex gap-4">
            {insight.like_count !== null && (
              <span className="flex items-center text-gray-300">
                <RiHeartFill className="text-red-500 mr-1" /> 
                <span className="text-sm">{insight.like_count}</span>
              </span>
            )}
            {insight.comments_count !== null && (
              <span className="flex items-center text-gray-300">
                <RiChat3Line className="text-blue-500 mr-1" /> 
                <span className="text-sm">{insight.comments_count}</span>
              </span>
            )}
          </div>
          
          {hasPermalink && (
            <button 
              onClick={openPostUrl}
              className="flex items-center px-3 py-1.5 rounded-full text-white bg-pink-600 hover:bg-pink-500 transition-all duration-200"
            >
              <span className="text-xs mr-1.5">Ver post</span>
              <RiExternalLinkLine className="text-xs" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrganicInsightCard; 