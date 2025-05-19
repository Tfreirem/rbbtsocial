import { 
  RiBarChartBoxLine, 
  RiAdvertisementLine, 
  RiLineChartLine, 
  RiTimeLine,
  RiRobotLine
} from 'react-icons/ri';
import rbbtLogo from '/images/rbbt-logo.png';
import { useNavigate } from 'react-router-dom';

interface SidebarProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeSection, setActiveSection }) => {
  const navigate = useNavigate();
  
  const menuItems = [
    { id: 'dashboard', icon: RiBarChartBoxLine, label: 'Dashboard', path: '/overview' },
    { id: 'ads', icon: RiAdvertisementLine, label: 'Ads', path: '/ads' },
    { id: 'insights', icon: RiLineChartLine, label: 'Insights', path: '/insights' },
    { id: 'organic', icon: RiTimeLine, label: 'Organic', path: '/organic' },
    { id: 'aichat', icon: RiRobotLine, label: 'AI Chat', path: '/aichat' },
  ];

  const handleMenuClick = (item: typeof menuItems[0]) => {
    setActiveSection(item.id);
    navigate(item.path);
  };

  return (
    <div className="h-full w-16 bg-black border-r border-gray-800 flex flex-col items-center py-2">
      <div className="mb-4">
        <img src={rbbtLogo} alt="RBBT Logo" className="w-8 h-8" />
      </div>
      
      <div className="flex flex-col items-center space-y-8">
        {menuItems.map((item) => (
          <div 
            key={item.id}
            className={`flex flex-col items-center cursor-pointer ${
              activeSection === item.id ? 'text-white' : 'text-gray-600'
            }`}
            onClick={() => handleMenuClick(item)}
          >
            <div className="w-5 h-5 flex items-center justify-center">
              <item.icon size={16} />
            </div>
            <span className="text-[9px] mt-1">{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
