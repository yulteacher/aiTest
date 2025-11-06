import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Bot, Sparkles } from 'lucide-react';

export default function ChatPage({ isFloating = false }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const savedMessages = localStorage.getItem('chatMessages');
    if (savedMessages) {
      setMessages(JSON.parse(savedMessages));
    } else {
      const initialMessages = [
        {
          id: '1',
          text: '안녕하세요! KBO 야구 AI 어시스턴트입니다 ⚾\n경기 일정, 순위, 선수 정보 등을 물어보세요!',
          isBot: true,
          timestamp: new Date().toISOString(),
        },
      ];
      setMessages(initialMessages);
      localStorage.setItem('chatMessages', JSON.stringify(initialMessages));
    }
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const getMockResponse = (userMessage) => {
    const lower = userMessage.toLowerCase();
    
    if (lower.includes('일정') || lower.includes('경기')) {
      return '오늘 KBO 리그 경기는 총 5경기가 예정되어 있습니다! ⚾\n자세한 일정은 KBO 공식 사이트에서 확인하실 수 있어요.';
    } else if (lower.includes('순위') || lower.includes('랭킹')) {
      return '현재 KBO 리그 순위는 실시간으로 변동됩니다! 📊\n홈 화면에서 최신 순위를 확인해보세요.';
    } else if (lower.includes('선수') || lower.includes('타자') || lower.includes('투수')) {
      return '선수 정보가 궁금하시군요! 🌟\n어떤 선수에 대해 알고 싶으신가요?';
    } else if (lower.includes('직관') || lower.includes('야구장')) {
      return '직관 가시나요? 정말 좋은 경험이 될 거예요! 🏟️\n날씨와 교통편을 미리 확인하시는 걸 추천드립니다!';
    } else if (lower.includes('투표')) {
      return '투표 탭에서 다양한 야구 관련 투표에 참여할 수 있어요! 📊';
    } else if (lower.includes('안녕') || lower.includes('hi') || lower.includes('hello')) {
      return '안녕하세요! KBO 야구에 대해 궁금하신 점이 있으시면 언제든 물어보세요 ⚾';
    } else {
      return 'KBO 야구에 대해 더 궁금한 점이 있으시면 말씀해주세요! 경기 일정, 순위, 선수 정보 등을 물어보세요 ⚾';
    }
  };

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage = {
      id: Date.now().toString(),
      text: input,
      isBot: false,
      timestamp: new Date().toISOString(),
    };

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    localStorage.setItem('chatMessages', JSON.stringify(updatedMessages));
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      const botMessage = {
        id: (Date.now() + 1).toString(),
        text: getMockResponse(input),
        isBot: true,
        timestamp: new Date().toISOString(),
      };
      const finalMessages = [...updatedMessages, botMessage];
      setMessages(finalMessages);
      localStorage.setItem('chatMessages', JSON.stringify(finalMessages));
      setIsTyping(false);
    }, 1000);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col glass-card rounded-2xl overflow-hidden h-full max-h-[600px] border border-teal-100/50 dark:border-teal-400/20">
      {/* AI 챗봇 헤더 */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-sky-500 via-cyan-500 to-teal-500 p-4 rounded-t-2xl"
      >
        <div className="flex items-center gap-3 text-white">
          <div className="bg-white/20 p-2 rounded-full">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              AI 챗봇
              <Sparkles className="w-4 h-4" />
            </div>
            <p className="text-white/80">온라인</p>
          </div>
        </div>
      </motion.div>

      {/* 메시지 목록 */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <AnimatePresence>
          {messages.map((message, index) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{
                type: 'spring',
                stiffness: 200,
                damping: 20,
              }}
              className={`flex ${message.isBot ? 'justify-start' : 'justify-end'}`}
            >
              <motion.div
                whileHover={{ scale: 1.02 }}
                className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                  message.isBot
                    ? 'glass-card text-gray-900 dark:text-gray-100 border border-sky-200/50 dark:border-sky-700/30'
                    : 'bg-gradient-to-br from-teal-500 to-cyan-600 text-white shadow-lg backdrop-blur-sm'
                }`}
              >
                <p className="break-words">{message.text}</p>
              </motion.div>
            </motion.div>
          ))}
        </AnimatePresence>

        {isTyping && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-start"
          >
            <div className="glass-card border border-sky-200/50 dark:border-sky-700/30 rounded-2xl px-4 py-3">
              <div className="flex gap-1">
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    className="w-2 h-2 bg-teal-400 rounded-full"
                    animate={{ y: [0, -10, 0] }}
                    transition={{
                      duration: 0.6,
                      repeat: Infinity,
                      delay: i * 0.2,
                    }}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* 입력 영역 */}
      <div className="p-4 rounded-b-2xl border-t border-teal-200 dark:border-teal-700">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="메시지를 입력하세요..."
            className="flex-1 px-5 py-3 bg-teal-50 dark:bg-teal-900/30 text-gray-900 dark:text-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-teal-500 border border-teal-200 dark:border-teal-700"
          />
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={handleSend}
            disabled={!input.trim()}
            className="bg-gradient-to-r from-teal-500 to-cyan-500 dark:from-[#00d5be] dark:to-[#00b8db] text-white dark:text-[#0f1729] p-3 rounded-full hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-5 h-5" />
          </motion.button>
        </div>
        <p className="text-gray-400 dark:text-gray-500 text-center mt-2">
          💡 AI API 연결 가능 (현재 Mock 모드)
        </p>
      </div>


    </div>
  );
}
