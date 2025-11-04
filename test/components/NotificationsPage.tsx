import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, MessageCircle, TrendingUp, UserPlus, X } from 'lucide-react';

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const savedNotifications = localStorage.getItem('notifications');
    if (savedNotifications) {
      setNotifications(JSON.parse(savedNotifications));
    } else {
      const initialNotifications = [
        {
          id: '1',
          type: 'like',
          user: '야구덕후',
          avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop',
          message: '님이 회원님의 경기 리뷰를 좋아합니다',
          timestamp: '5분 전',
          read: false,
        },
        {
          id: '2',
          type: 'comment',
          user: 'KBO매니아',
          avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
          message: '님이 회원님의 게시물에 댓글을 남겼습니다',
          timestamp: '1시간 전',
          read: false,
        },
        {
          id: '3',
          type: 'poll',
          user: '야구팬',
          avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=100&h=100&fit=crop',
          message: '님의 우승팀 예상 투표에 453명이 참여했습니다',
          timestamp: '2시간 전',
          read: true,
        },
        {
          id: '4',
          type: 'follow',
          user: '직관러버',
          avatar: 'https://images.unsplash.com/photo-1607746882042-944635dfe10e?w=100&h=100&fit=crop',
          message: '님이 회원님을 팔로우하기 시작했습니다',
          timestamp: '1일 전',
          read: true,
        },
      ];
      setNotifications(initialNotifications);
      localStorage.setItem('notifications', JSON.stringify(initialNotifications));
    }
  }, []);

  const getIcon = (type) => {
    const iconProps = { className: "w-5 h-5" };
    switch (type) {
      case 'like':
        return <Heart {...iconProps} className="w-5 h-5 text-red-600" fill="currentColor" />;
      case 'comment':
        return <MessageCircle {...iconProps} className="w-5 h-5 text-blue-600" />;
      case 'poll':
        return <TrendingUp {...iconProps} className="w-5 h-5 text-orange-600" />;
      case 'follow':
        return <UserPlus {...iconProps} className="w-5 h-5 text-green-600" />;
      default:
        return null;
    }
  };

  const markAsRead = (id) => {
    const updatedNotifications = notifications.map((notif) =>
      notif.id === id ? { ...notif, read: true } : notif
    );
    setNotifications(updatedNotifications);
    localStorage.setItem('notifications', JSON.stringify(updatedNotifications));
  };

  const markAllAsRead = () => {
    const updatedNotifications = notifications.map((notif) => ({
      ...notif,
      read: true,
    }));
    setNotifications(updatedNotifications);
    localStorage.setItem('notifications', JSON.stringify(updatedNotifications));
  };

  const dismissNotification = (id) => {
    const updatedNotifications = notifications.filter((notif) => notif.id !== id);
    setNotifications(updatedNotifications);
    localStorage.setItem('notifications', JSON.stringify(updatedNotifications));
  };

  return (
    <div className="p-4">
      {/* 헤더 */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between mb-4"
      >
        <h2 className="text-gray-900 dark:text-gray-100">알림</h2>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={markAllAsRead}
          className="text-blue-600 dark:text-blue-400 hover:underline"
        >
          모두 읽음
        </motion.button>
      </motion.div>

      {/* 알림 목록 */}
      <div className="space-y-2">
        <AnimatePresence>
          {notifications.map((notif, index) => (
            <motion.div
              key={notif.id}
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ 
                opacity: 0, 
                x: 100, 
                height: 0,
                marginBottom: 0,
                transition: { duration: 0.3 }
              }}
              transition={{ 
                delay: index * 0.05,
              }}
              onClick={() => markAsRead(notif.id)}
              className={`flex items-start gap-3 p-4 rounded-2xl cursor-pointer transition-all relative overflow-hidden ${
                notif.read
                  ? 'bg-white dark:bg-gray-800'
                  : 'bg-gradient-to-r from-blue-50 to-red-50 dark:from-blue-900/20 dark:to-red-900/20'
              }`}
            >
              <img
                src={notif.avatar}
                alt={notif.user}
                className="w-12 h-12 rounded-full"
              />
              
              <div className="flex-1">
                <div className="flex items-start gap-2">
                  <p className="text-gray-900 dark:text-gray-100 flex-1">
                    <span>{notif.user}</span>
                    <span className="text-gray-600 dark:text-gray-400">
                      {' '}
                      {notif.message}
                    </span>
                  </p>
                  {getIcon(notif.type)}
                </div>
                <p className="text-gray-500 dark:text-gray-400 mt-1">
                  {notif.timestamp}
                </p>
              </div>

              {!notif.read && (
                <div className="w-2 h-2 bg-purple-600 rounded-full mt-2" />
              )}

              {/* 삭제 버튼 */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  dismissNotification(notif.id);
                }}
                className="opacity-0 hover:opacity-100 transition-opacity p-1 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-full"
              >
                <X className="w-4 h-4 text-red-600" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>

        {notifications.length === 0 && (
          <div className="text-center py-12 text-gray-400 dark:text-gray-500">
            <div className="text-6xl mb-4">🔔</div>
            알림이 없습니다
          </div>
        )}
      </div>
    </div>
  );
}
