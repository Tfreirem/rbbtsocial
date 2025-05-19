import React from 'react';
import { Lightbulb, ArrowRight } from 'lucide-react';

interface InsightPreviewCardProps {
  id: number | string;
  title: string;
  period: string;
  description: string;
  category?: string;
  onClick?: () => void;
  fullView?: boolean; // New prop to determine if we show full content
}

// Função para determinar a cor de fundo com base na categoria
const getCategoryColor = (category: string) => {
  const lowercaseCategory = category.toLowerCase();
  
  if (lowercaseCategory.includes('campanha')) return 'bg-amber-500';
  if (lowercaseCategory.includes('criativo')) return 'bg-blue-500';
  if (lowercaseCategory.includes('convers')) return 'bg-green-500';
  if (lowercaseCategory.includes('audi')) return 'bg-purple-500';
  
  // Default color
  return 'bg-amber-500';
};

const InsightPreviewCard: React.FC<InsightPreviewCardProps> = ({
  id,
  title,
  period,
  description,
  category = 'Campanha',
  onClick,
  fullView = false // Default to preview mode
}) => {
  // Determinar a cor de fundo baseada na categoria
  const badgeColor = getCategoryColor(category);
  
  // Prevent event propagation when clicking on the details link
  const handleDetailsClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onClick) onClick();
  };
  
  return (
    <div 
      className={`bg-[#111111] rounded-lg p-4 transition-all duration-200 hover:bg-[#191919] cursor-pointer flex flex-col ${fullView ? 'h-auto' : 'h-full'}`}
      onClick={onClick}
    >
      <div className="flex items-center mb-2">
        <span className={`${badgeColor} text-white text-xs rounded px-2 py-1 flex items-center gap-1`}>
          <Lightbulb className="w-3 h-3" /> {category}
        </span>
        <span className="text-gray-500 text-xs ml-2">{period}</span>
      </div>
      
      <h3 className="font-medium text-white mb-2 line-clamp-2">{title}</h3>
      
      <p className={`text-gray-400 text-sm mb-3 ${fullView ? '' : 'line-clamp-2'} flex-grow`}>
        {description}
      </p>
      
      {!fullView && (
        <button 
          onClick={handleDetailsClick}
          className="text-blue-400 text-xs flex items-center justify-end hover:text-blue-300 transition-colors duration-200 w-full mt-auto"
        >
          Ver detalhes <ArrowRight className="w-3 h-3 ml-1" />
        </button>
      )}
    </div>
  );
};

export default InsightPreviewCard; 