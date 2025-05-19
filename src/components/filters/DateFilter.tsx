import { useState, useEffect, useRef } from 'react';
import { RiCalendarLine, RiFilter2Line } from 'react-icons/ri';

interface DateFilterProps {
  onFilterChange: (period: string, customRange?: { start: Date; end: Date }) => void;
  initialPeriod?: string;
  customDateLabel?: string | null;
}

const DateFilter: React.FC<DateFilterProps> = ({ onFilterChange, initialPeriod = '30d', customDateLabel = null }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState(initialPeriod);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [displayLabel, setDisplayLabel] = useState<string | null>(null);
  const [lastCustomRange, setLastCustomRange] = useState<{start: string, end: string} | null>(null);
  const filterRef = useRef<HTMLDivElement>(null);

  // Initialize with the provided period
  useEffect(() => {
    setSelectedPeriod(initialPeriod);
  }, [initialPeriod]);

  // Store last custom range when user applies a custom date filter
  useEffect(() => {
    if (selectedPeriod === 'custom' && startDate && endDate) {
      setLastCustomRange({start: startDate, end: endDate});
    }
  }, [selectedPeriod, startDate, endDate]);

  // When customDateLabel changes from parent, update our display label
  useEffect(() => {
    if (selectedPeriod === 'custom' && customDateLabel) {
      setDisplayLabel(customDateLabel);
    }
  }, [customDateLabel, selectedPeriod]);

  const periods = [
    { id: '7d', label: 'Últimos 7 dias' },
    { id: '15d', label: 'Últimos 15 dias' },
    { id: '30d', label: 'Últimos 30 dias' },
    { id: '60d', label: 'Últimos 60 dias' },
    { id: '90d', label: 'Últimos 90 dias' },
    { id: 'custom', label: 'Selecionar Data' }
  ];

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setShowDatePicker(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handlePeriodSelect = (period: string) => {
    if (period === 'custom') {
      // Initialize with previously selected custom range if available
      if (lastCustomRange) {
        setStartDate(lastCustomRange.start);
        setEndDate(lastCustomRange.end);
      } else if (customDateLabel && selectedPeriod === 'custom') {
        // Current selection is already a custom date range, but we don't have the dates stored
        // Try to parse from the label or use defaults
        try {
          // Attempt to parse the dates from the label (if it follows the expected format)
          const dateRegex = /(\d{2}\/\d{2}\/\d{4}) a (\d{2}\/\d{2}\/\d{4})/;
          const match = customDateLabel.match(dateRegex);
          
          if (match && match.length === 3) {
            // Parse Brazilian date format DD/MM/YYYY to Date objects
            const parseDate = (dateStr: string) => {
              const [day, month, year] = dateStr.split('/').map(Number);
              return new Date(year, month - 1, day);
            };
            
            const start = parseDate(match[1]);
            const end = parseDate(match[2]);
            
            // Format as YYYY-MM-DD for the input fields
            setStartDate(start.toISOString().split('T')[0]);
            setEndDate(end.toISOString().split('T')[0]);
          } else {
            // Fallback to defaults
            const today = new Date();
            const weekAgo = new Date();
            weekAgo.setDate(today.getDate() - 7);
            
            setStartDate(weekAgo.toISOString().split('T')[0]);
            setEndDate(today.toISOString().split('T')[0]);
          }
        } catch (e) {
          // If parsing fails, use default values
          const today = new Date();
          const weekAgo = new Date();
          weekAgo.setDate(today.getDate() - 7);
          
          setStartDate(weekAgo.toISOString().split('T')[0]);
          setEndDate(today.toISOString().split('T')[0]);
        }
      } else {
        // Initialize with today and a week ago as defaults
        const today = new Date();
        const weekAgo = new Date();
        weekAgo.setDate(today.getDate() - 7);
        
        // Format as YYYY-MM-DD for the input fields
        setStartDate(weekAgo.toISOString().split('T')[0]);
        setEndDate(today.toISOString().split('T')[0]);
      }
      
      setShowDatePicker(true);
      return;
    }
    
    setSelectedPeriod(period);
    setDisplayLabel(null); // Clear custom display when selecting preset period
    onFilterChange(period);
    setIsOpen(false);
    setShowDatePicker(false);
  };

  const handleCustomDateApply = () => {
    if (startDate && endDate) {
      // Create exact date objects from the selected string dates
      // Important: Use the exact date strings without adjustments
      const start = new Date(startDate + 'T00:00:00');
      const end = new Date(endDate + 'T00:00:00');
      
      if (start <= end) {
        setSelectedPeriod('custom');
        
        // Save this custom range for future reference
        setLastCustomRange({start: startDate, end: endDate});
        
        // Format display date directly here, ensuring we show exactly what user selected
        const formatDate = (dateStr: string | Date) => {
          const date = dateStr instanceof Date ? dateStr : new Date(dateStr);
          // Format using Brazilian locale, ensuring day is preserved exactly
          return date.toLocaleDateString('pt-BR');
        };
        
        // Set our internal display label with exactly user's selected dates
        const userSelectedLabel = `${formatDate(start)} a ${formatDate(end)}`;
        setDisplayLabel(userSelectedLabel);
        
        // Pass the exact dates to parent component - ensuring we pass the exact dates
        // without any timezone adjustments
        onFilterChange('custom', { 
          start: start,
          end: end
        });
        
        setIsOpen(false);
        setShowDatePicker(false);
      } else {
        alert('A data de início deve ser anterior à data de fim');
      }
    } else {
      alert('Por favor, selecione as datas de início e fim');
    }
  };

  const formatDisplayDate = () => {
    // For custom period, prioritize our internal display label that was set during apply
    if (selectedPeriod === 'custom' && displayLabel) {
      return displayLabel;
    }
    
    // For custom period, if we have start and end dates but no label yet (shouldn't happen normally)
    if (selectedPeriod === 'custom' && startDate && endDate) {
      const formatDate = (dateStr: string | Date) => {
        const date = dateStr instanceof Date ? dateStr : new Date(dateStr);
        return date.toLocaleDateString('pt-BR');
      };
      return `${formatDate(startDate)} a ${formatDate(endDate)}`;
    }
    
    // For custom period with parent-provided label
    if (selectedPeriod === 'custom' && customDateLabel) {
      return customDateLabel;
    }
    
    // For predefined periods, show standard label
    if (selectedPeriod !== 'custom') {
      return periods.find(p => p.id === selectedPeriod)?.label;
    }
    
    // Final fallback
    return 'Período personalizado';
  };

  return (
    <div className="relative" ref={filterRef}>
      <button 
        className="flex items-center space-x-2 bg-gray-800/50 hover:bg-gray-700/50 text-white px-4 py-2 rounded-lg transition-all duration-200"
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
      >
        <RiCalendarLine />
        <span>{formatDisplayDate()}</span>
        <RiFilter2Line />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-72 bg-gray-800 rounded-lg shadow-lg z-[9999] py-2">
          {!showDatePicker ? (
            periods.map((period) => (
              <div 
                key={period.id}
                className={`px-4 py-2 cursor-pointer hover:bg-gray-700 ${
                  selectedPeriod === period.id ? 'text-pink-500' : 'text-white'
                }`}
                onClick={(e) => {
                  e.stopPropagation();
                  handlePeriodSelect(period.id);
                }}
              >
                {period.label}
              </div>
            ))
          ) : (
            <div className="p-4">
              <h3 className="text-white text-sm font-medium mb-3">Selecione o intervalo de datas</h3>
              
              <div className="mb-3">
                <label className="block text-gray-400 text-xs mb-1">Data de início</label>
                <input 
                  type="date" 
                  className="w-full px-3 py-2 bg-gray-700 text-white text-sm rounded border border-gray-600 focus:outline-none focus:border-pink-500"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-400 text-xs mb-1">Data de fim</label>
                <input 
                  type="date" 
                  className="w-full px-3 py-2 bg-gray-700 text-white text-sm rounded border border-gray-600 focus:outline-none focus:border-pink-500"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>
              
              <div className="flex space-x-2">
                <button 
                  className="flex-1 px-3 py-2 bg-gray-600 hover:bg-gray-500 text-white text-sm rounded transition-colors"
                  onClick={() => setShowDatePicker(false)}
                >
                  Cancelar
                </button>
                <button 
                  className="flex-1 px-3 py-2 bg-pink-600 hover:bg-pink-500 text-white text-sm rounded transition-colors"
                  onClick={handleCustomDateApply}
                >
                  Aplicar
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DateFilter;

