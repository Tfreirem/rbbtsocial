import { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate, useParams } from 'react-router-dom';
import Sidebar from './components/layout/Sidebar';
import Header from './components/layout/Header';
import Overview from './components/pages/Overview';
import Ads from './components/pages/Ads';
import Organic from './components/pages/Organic';
import Insights from './components/pages/Insights';
import AIChat from './components/pages/AIChat';
import './App.css';

// Adicionar estilo para esconder mensagens de erro relacionadas à API
const hideErrorStyles = `
  .text-red-500 {
    display: none !important;
  }
`;

// Componente para redirecionar para a página de insights com ID
const InsightRedirect = () => {
  const { id } = useParams();
  return <Insights activeInsightId={id} />;
};

function App() {
  const [activeSection, setActiveSection] = useState('dashboard');

  // Atualiza a seção ativa com base na URL atual
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash.startsWith('#/overview')) {
        setActiveSection('dashboard');
      } else if (hash.startsWith('#/ads')) {
        setActiveSection('ads');
      } else if (hash.startsWith('#/organic')) {
        setActiveSection('organic');
      } else if (hash.startsWith('#/insights')) {
        setActiveSection('insights');
      } else if (hash.startsWith('#/aichat')) {
        setActiveSection('aichat');
      }
    };

    // Inicializa com a URL atual
    handleHashChange();

    // Adiciona listener para mudanças na URL
    window.addEventListener('hashchange', handleHashChange);
    
    // Cleanup
    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);

  // Direciona para a página correta quando o activeSection muda via sidebar
  useEffect(() => {
    let path = '/overview';
    switch (activeSection) {
      case 'dashboard':
        path = '/overview';
        break;
      case 'ads':
        path = '/ads';
        break;
      case 'insights':
        path = '/insights';
        break;
      case 'organic':
        path = '/organic';
        break;
      case 'aichat':
        path = '/aichat';
        break;
    }
    
    // Apenas atualiza se a URL atual não corresponder à seção ativa
    const currentHash = window.location.hash.substring(1);
    if (currentHash !== path && !currentHash.startsWith(`${path}/`)) {
      window.location.hash = `#${path}`;
    }
  }, [activeSection]);

  // Injetar os estilos para esconder as mensagens de erro
  useEffect(() => {
    const styleElement = document.createElement('style');
    styleElement.innerHTML = hideErrorStyles;
    document.head.appendChild(styleElement);
    
    return () => {
      document.head.removeChild(styleElement);
    };
  }, []);

  return (
    <Router>
      <div className="flex h-screen bg-black text-white overflow-hidden">
        <Sidebar activeSection={activeSection} setActiveSection={setActiveSection} />
        
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header activeSection={activeSection} />
          
          <div className="flex-1 overflow-auto">
            <Routes>
              <Route path="/" element={<Navigate to="/overview" replace />} />
              <Route path="/overview" element={<Overview navigateToInsights={() => setActiveSection('insights')} />} />
              <Route path="/ads" element={<Ads />} />
              <Route path="/organic" element={<Organic />} />
              <Route path="/insights" element={<Insights />} />
              <Route path="/insights/:id" element={<InsightRedirect />} />
              <Route path="/aichat" element={<AIChat />} />
              {/* Add more routes as needed */}
            </Routes>
          </div>
        </div>
      </div>
    </Router>
  );
}

export default App;
