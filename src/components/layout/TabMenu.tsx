import { useEffect } from 'react';

interface TabMenuProps {
  tabs: string[];
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const TabMenu: React.FC<TabMenuProps> = ({ tabs, activeTab, setActiveTab }) => {
  // Set first tab as active by default if none is selected
  useEffect(() => {
    if (tabs.length > 0 && !activeTab) {
      setActiveTab(tabs[0]);
    }
  }, [tabs, activeTab, setActiveTab]);

  return (
    <div className="flex border-b border-gray-800/30">
      {tabs.map((tab) => (
        <div
          key={tab}
          className={`px-4 py-2 cursor-pointer text-xs transition-all duration-200 ${
            activeTab === tab 
              ? 'border-b border-white text-white font-medium' 
              : 'text-gray-600 hover:text-gray-400'
          }`}
          onClick={() => setActiveTab(tab)}
        >
          {tab}
        </div>
      ))}
    </div>
  );
};

export default TabMenu;
