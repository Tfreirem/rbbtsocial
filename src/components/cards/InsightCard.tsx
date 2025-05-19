import { useState } from 'react';
import { RiArrowRightLine } from 'react-icons/ri';

interface InsightCardProps {
  title: string;
  description: string;
  category: string;
  onClick: () => void;
}

const InsightCard: React.FC<InsightCardProps> = ({ title, description, category, onClick }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case 'ads':
        return 'bg-blue-500';
      case 'orgânico':
      case 'organico':
        return 'bg-green-500';
      case 'combinado':
        return 'bg-purple-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div 
      className={`card cursor-pointer transition-all duration-300 ${
        isHovered ? 'transform scale-[1.02] shadow-xl border-pink-500/50' : ''
      }`}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex justify-between items-start mb-2">
        <div className={`px-2 py-1 rounded-md text-xs text-white ${getCategoryColor(category)}`}>
          {category}
        </div>
      </div>
      
      <h3 className="text-lg font-medium text-white mb-2">{title}</h3>
      <p className="text-sm text-gray-400 mb-4">{description}</p>
      
      <div className={`flex items-center justify-end text-sm transition-all duration-300 ${
        isHovered ? 'text-pink-500' : 'text-gray-400'
      }`}>
        <span>Ver detalhes</span>
        <RiArrowRightLine className="ml-1" />
      </div>
    </div>
  );
};

export default InsightCard;
