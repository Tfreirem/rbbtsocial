import { RiArrowUpLine, RiArrowDownLine } from 'react-icons/ri';
import { useEffect } from 'react';

interface KPICardProps {
  title: string;
  value: string;
  subtitle?: string;
  trend?: {
    value: string;
    isPositive: boolean;
  };
}

const KPICard: React.FC<KPICardProps> = ({ 
  title, 
  value, 
  subtitle, 
  trend
}) => {
  // Função para verificar se a variação é zero (0%) ou não
  const isZeroVariation = (value: string) => {
    // Check for different formats of zero
    const zeroFormats = ['0%', '0.0%', '+0%', '+0.0%', '-0%', '-0.0%'];
    if (zeroFormats.includes(value)) return true;
    
    // Also check numeric value
    try {
      const numericValue = parseFloat(value.replace(/[+%]/g, ''));
      return numericValue === 0;
    } catch {
      return false;
    }
  };

  // Log para debug - verificar se os dados de trend estão chegando
  useEffect(() => {
    if (trend) {
      const isZero = isZeroVariation(trend.value);
      console.log(`KPICard ${title}:`, { 
        value, 
        trendValue: trend.value, 
        isPositive: trend.isPositive,
        isZeroVariation: isZero,
        willShowArrow: trend.value && !isZero
      });
    }
  }, [title, value, trend]);

  return (
    <div className="bg-[#111111] rounded-md p-4 h-full">
      <div className="mb-1">
        <h3 className="text-sm font-normal text-white">{title}</h3>
      </div>
      
      <div className="flex items-center mt-1">
        {subtitle ? (
          <div className="flex flex-col">
            <h2 className="text-base text-white">{value}</h2>
            <div className="text-xs text-gray-400 mt-1">
              {subtitle}
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-between w-full">
            <h2 className="text-base text-white">{value}</h2>
            {trend && trend.value && !isZeroVariation(trend.value) ? (
              trend.isPositive ? (
                <div className="flex items-center ml-2 text-green-500">
                  <RiArrowUpLine className="text-green-500" style={{color: '#22c55e'}} size={12} />
                  <span className="text-xs ml-0.5 text-green-500" style={{color: '#22c55e'}}>{trend.value}</span>
                </div>
              ) : (
                <div className="flex items-center ml-2 text-red-500">
                  <RiArrowDownLine className="text-red-500" style={{color: '#ef4444'}} size={12} />
                  <span className="text-xs ml-0.5 text-red-500" style={{color: '#ef4444'}}>{trend.value}</span>
                </div>
              )
            ) : (
              trend && trend.value ? (
                <div className="flex items-center ml-2">
                  <span className="text-xs ml-0.5 text-gray-400">{trend.value}</span>
                </div>
              ) : null
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default KPICard;
