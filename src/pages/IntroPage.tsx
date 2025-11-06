import { motion } from 'framer-motion';
import { Sparkles, Heart, TrendingUp, MessageCircle } from 'lucide-react';

export default function IntroPage({ onEnter }) {
  const features = [
    { icon: Heart, label: '좋아요', color: 'text-cyan-300' },
    { icon: TrendingUp, label: '투표', color: 'text-teal-300' },
    { icon: MessageCircle, label: 'AI 채팅', color: 'text-sky-300' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-600 via-cyan-500 to-sky-600 flex items-center justify-center p-4 overflow-hidden">
      {/* 배경 애니메이션 */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-white rounded-full"
            initial={{
              x: Math.random() * window.innerWidth,
              y: -20,
              opacity: 0.3,
            }}
            animate={{
              y: window.innerHeight + 20,
              opacity: [0.3, 1, 0.3],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 5,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 max-w-lg w-full">
        {/* ���고 */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
          className="text-center mb-12"
        >
          <motion.div
            animate={{ 
              rotate: [0, 10, -10, 0],
              scale: [1, 1.1, 1]
            }}
            transition={{ 
              duration: 2,
              repeat: Infinity,
              repeatDelay: 1
            }}
            className="text-8xl mb-4"
          >
            ⚾
          </motion.div>
          <h1 className="text-white mb-2">KBO 팬덤</h1>
          <p className="text-white/80">10개 구단 팬들이 모이는 공간</p>
        </motion.div>

        {/* 기능 소개 */}
        <div className="grid grid-cols-3 gap-4 mb-12">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + index * 0.1 }}
                className="bg-white/10 backdrop-blur-lg rounded-2xl p-4 text-center"
              >
                <motion.div
                  animate={{ 
                    y: [0, -10, 0],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: index * 0.3,
                  }}
                >
                  <Icon className={`w-8 h-8 ${feature.color} mx-auto mb-2`} />
                </motion.div>
                <p className="text-white">{feature.label}</p>
              </motion.div>
            );
          })}
        </div>

        {/* 시작 버튼 */}
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onEnter}
          className="w-full bg-white text-teal-700 py-4 rounded-full shadow-2xl relative overflow-hidden group"
        >
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-teal-400/20 to-cyan-400/20"
            animate={{ x: ['-100%', '100%'] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          <span className="relative z-10 flex items-center justify-center gap-2">
            시작하기
            <Sparkles className="w-5 h-5" />
          </span>
        </motion.button>

        {/* 부가 정보 */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="text-center mt-8 text-white/60"
        >
          <p>좋아요, 투표, AI 채팅으로</p>
          <p>KBO 팬들과 소통하세요!</p>
        </motion.div>
      </div>
    </div>
  );
}
