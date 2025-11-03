import { useState } from 'react';
import { motion } from 'framer-motion';
import { Edit2, Settings, LogOut, Award, Zap, Heart, Camera } from 'lucide-react';

export default function ProfilePage() {
  const [imageHover, setImageHover] = useState(false);
  
  const stats = [
    { label: '게시글', value: 12, icon: Edit2, color: 'from-blue-500 to-blue-700' },
    { label: '좋아요', value: 234, icon: Heart, color: 'from-red-500 to-red-700' },
    { label: '댓글', value: 89, icon: Award, color: 'from-orange-500 to-orange-700' },
  ];

  const menuItems = [
    { icon: Edit2, label: '프로필 수정', color: 'text-blue-600 dark:text-blue-400', bgColor: 'bg-blue-50 dark:bg-blue-900/20' },
    { icon: Settings, label: '설정', color: 'text-gray-600 dark:text-gray-400', bgColor: 'bg-gray-50 dark:bg-gray-700' },
    { icon: LogOut, label: '로그아웃', color: 'text-red-600 dark:text-red-400', bgColor: 'bg-red-50 dark:bg-red-900/20' },
  ];

  return (
    <div className="p-4 space-y-6">
      {/* 프로필 카드 */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-gradient-to-br from-blue-600 via-red-600 to-blue-900 rounded-2xl p-6 text-white shadow-2xl relative overflow-hidden"
      >

        <div className="flex flex-col items-center">
          <img
            src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop"
            alt="프로필"
            className="w-24 h-24 rounded-full border-4 border-white mb-4"
          />

          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-white mb-1"
          >
            나의 프로필
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-white/80"
          >
            @username
          </motion.p>
          
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-white/90 text-center mt-3"
          >
            팬덤을 사랑하는 열정적인 팬입니다! 💜
          </motion.p>
        </div>

        {/* 통계 */}
        <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-white/20">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + index * 0.1 }}
                className="text-center"
              >
                <Icon className="w-6 h-6 mx-auto mb-1 text-white" />
                <div className="text-white">{stat.value}</div>
                <p className="text-white/80">{stat.label}</p>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* 메뉴 */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg">
        {menuItems.map((item, index) => {
          const Icon = item.icon;
          return (
            <button
              key={item.label}
              className={`w-full flex items-center gap-3 p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all border-b border-gray-100 dark:border-gray-700 last:border-b-0`}
            >
              <Icon className={`w-5 h-5 ${item.color}`} />
              <span className="text-gray-900 dark:text-gray-100">{item.label}</span>
            </button>
          );
        })}
      </div>

      {/* 배지 */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-lg">
        <h3 className="text-gray-900 dark:text-gray-100 mb-4">내 배지</h3>
        <div className="grid grid-cols-4 gap-3">
          {['🌟', '🎵', '💜', '🔥', '⭐', '🎤', '👑', '💎'].map((badge, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 + index * 0.05 }}
              whileTap={{ scale: 0.9 }}
              className="aspect-square bg-gradient-to-br from-blue-100 to-red-100 dark:from-blue-900/30 dark:to-red-900/30 rounded-xl flex items-center justify-center text-2xl cursor-pointer"
            >
              {badge}
            </motion.div>
          ))}
        </div>
      </div>

      {/* 레벨 진행바 */}
      <div className="bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-2xl p-4 shadow-lg">

        <div className="flex items-center justify-between mb-2">
          <h3 className="text-gray-900 dark:text-gray-100 flex items-center gap-2">
            <Zap className="w-5 h-5 text-yellow-500" />
            레벨 7
          </h3>
          <span className="text-gray-600 dark:text-gray-400">75%</span>
        </div>
        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: '75%' }}
            transition={{ 
              delay: 0.5,
              duration: 1,
              ease: 'easeOut'
            }}
            className="h-full bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full"
          />
        </div>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          다음 레벨까지 250XP 남음
        </p>
      </div>
    </div>
  );
}
