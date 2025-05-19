import { useState } from 'react';
import { RiSendPlane2Line } from 'react-icons/ri';

const AIChat: React.FC = () => {
  const [messages, setMessages] = useState<Array<{type: 'user' | 'ai', content: string}>>([
    { type: 'ai', content: 'Olá! Como posso ajudar você com suas estratégias de marketing hoje?' }
  ]);
  const [inputMessage, setInputMessage] = useState('');

  const handleSendMessage = () => {
    if (inputMessage.trim() === '') return;
    
    // Adiciona a mensagem do usuário
    setMessages(prev => [...prev, { type: 'user', content: inputMessage }]);
    
    // Simula uma resposta do AI após um breve delay
    setTimeout(() => {
      setMessages(prev => [...prev, { 
        type: 'ai', 
        content: 'Estou processando sua solicitação. Esta é uma demonstração da funcionalidade de chat AI.' 
      }]);
    }, 1000);
    
    setInputMessage('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="p-4 h-full flex flex-col">
      {/* Cabeçalho da página */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-normal text-white">AI Chat</h1>
      </div>

      {/* Área de chat */}
      <div className="flex-1 bg-[#111111] rounded-lg p-4 mb-4 overflow-y-auto">
        <div className="flex flex-col space-y-4">
          {messages.map((message, index) => (
            <div 
              key={index}
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div 
                className={`max-w-[70%] rounded-lg px-4 py-2 ${
                  message.type === 'user' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-[#222222] text-gray-200'
                }`}
              >
                {message.content}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Área de entrada de mensagem */}
      <div className="bg-[#111111] rounded-lg p-2 flex items-center">
        <textarea
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder="Digite sua mensagem aqui..."
          className="flex-1 bg-transparent outline-none text-white resize-none px-2 py-1"
          rows={1}
        />
        <button 
          onClick={handleSendMessage}
          className="bg-blue-600 text-white rounded-full p-2 hover:bg-blue-700 transition"
          disabled={inputMessage.trim() === ''}
        >
          <RiSendPlane2Line size={20} />
        </button>
      </div>
    </div>
  );
};

export default AIChat; 