import { useState, useRef, useEffect } from 'react';
import { Send, X, Bot } from 'lucide-react';

interface Message {
  id: string;
  text: string;
  isBot: boolean;
  timestamp: Date;
}

interface ChatBotProps {
  onClose: () => void;
}

export function ChatBot({ onClose }: ChatBotProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: '안녕하세요! KBO 야구 AI 어시스턴트입니다 ⚾\n경기 일정, 순위, 선수 정보 등을 물어보세요!',
      isBot: true,
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Mock AI 응답 - 실제로는 외부 API나 라이브러리를 연결
  const getMockResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();
    
    if (lowerMessage.includes('일정') || lowerMessage.includes('경기')) {
      return '오늘 KBO 리그 경기는 총 5경기가 예정되어 있습니다! ⚾\n자세한 일정은 KBO 공식 사이트에서 확인하실 수 있어요.';
    } else if (lowerMessage.includes('순위') || lowerMessage.includes('랭킹')) {
      return '현재 KBO 리그 순위는 실시간으로 변동됩니다! 📊\n홈 화면에서 최신 순위를 확인해보세요.';
    } else if (lowerMessage.includes('선수') || lowerMessage.includes('타자') || lowerMessage.includes('투수')) {
      return '선수 정보가 궁금하시군요! 🌟\n어떤 선수에 대해 알고 싶으신가요?';
    } else if (lowerMessage.includes('직관') || lowerMessage.includes('야구장')) {
      return '직관 가시나요? 정말 좋은 경험이 될 거예요! 🏟️\n날씨와 교통편을 미리 확인하시는 걸 추천드립니다!';
    } else if (lowerMessage.includes('투표')) {
      return '투표 탭에서 다양한 야구 관련 투표에 참여할 수 있어요! 📊';
    } else if (lowerMessage.includes('안녕') || lowerMessage.includes('hi') || lowerMessage.includes('hello')) {
      return '안녕하세요! KBO 야구에 대해 궁금하신 점이 있으시면 언제든 물어보세요 ⚾';
    } else {
      return 'KBO 야구에 대해 더 궁금한 점이 있으시면 말씀해주세요! 경기 일정, 순위, 선수 정보 등을 물어보세요 ⚾';
    }
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: input,
      isBot: false,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    // Mock API 호출 시뮬레이션
    // 실제로는 여기에 외부 AI API를 연결 (예: OpenAI, Anthropic, Google AI 등)
    setTimeout(() => {
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: getMockResponse(input),
        isBot: true,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-2xl flex flex-col h-[500px] overflow-hidden">
      <div className="bg-gradient-to-r from-orange-600 to-red-600 text-white p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-white/20 p-2 rounded-full">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <div>AI 챗봇</div>
            <p className="text-white/80">온라인</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="hover:bg-white/20 p-2 rounded-full transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map(message => (
          <div
            key={message.id}
            className={`flex ${message.isBot ? 'justify-start' : 'justify-end'}`}
          >
            <div
              className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                message.isBot
                  ? 'bg-gray-100 text-gray-800'
                  : 'bg-gradient-to-r from-orange-600 to-red-600 text-white'
              }`}
            >
              <p className="break-words">{message.text}</p>
            </div>
          </div>
        ))}
        
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-gray-100 rounded-2xl px-4 py-3">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 border-t">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="메시지를 입력하세요..."
            className="flex-1 px-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-purple-600"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim()}
            className="bg-gradient-to-r from-orange-600 to-red-600 text-white p-2 rounded-full hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
        <p className="text-gray-400 text-center mt-2">
          AI API 연결 준비됨 (현재 Mock 모드)
        </p>
      </div>
    </div>
  );
}
