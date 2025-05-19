import { RiCloseLine } from 'react-icons/ri';
import { useState, useEffect } from 'react';

interface HeaderProps {
  activeSection: string;
}

const Header: React.FC<HeaderProps> = ({ activeSection }) => {
  const [activeTab, setActiveTab] = useState('');
  
  // Define tabs for each section
  const sectionTabs = {
    dashboard: ['Overview', 'Performance', 'Histórico'],
    ads: ['Campanhas', 'Criativos', 'Performance', 'Orçamento'],
    insights: ['Análises', 'Relatórios', 'Recomendações'],
    organic: ['Posts', 'Engagement', 'Audiência']
  };
  
  // Get the appropriate tabs for the current section
  const getTabs = () => {
    switch (activeSection) {
      case 'dashboard':
        return sectionTabs.dashboard;
      case 'ads':
        return sectionTabs.ads;
      case 'insights':
        return sectionTabs.insights;
      case 'organic':
        return sectionTabs.organic;
      default:
        return sectionTabs.dashboard;
    }
  };
  
  // Update active tab when section changes
  useEffect(() => {
    const tabs = getTabs();
    if (tabs.length > 0 && !tabs.includes(activeTab)) {
      setActiveTab(tabs[0]);
    }
  }, [activeSection]);
  
  const tabs = getTabs();
  
  return (
    <div className="w-full bg-black border-b border-gray-800">
      <div className="flex justify-between items-center px-3 py-2">
        <div className="flex-1"></div>
        <div className="flex-1 text-center">
          <h1 className="text-sm font-normal tracking-wide text-white">RBBT SOCIAL DASH</h1>
        </div>
        <div className="flex-1 flex justify-end">
          <div className="text-gray-600 cursor-pointer">
            <RiCloseLine size={16} />
          </div>
        </div>
      </div>
      
      <div className="flex border-b border-gray-800">
        {tabs.map((tab) => (
          <div
            key={tab}
            className={`px-4 py-2 cursor-pointer text-xs ${
              activeTab === tab 
                ? 'border-b border-white font-normal text-white' 
                : 'text-gray-600'
            }`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Header;
