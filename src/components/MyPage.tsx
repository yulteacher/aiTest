import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Edit2, Settings, LogOut, Award, Zap, Heart, Bell, MessageCircle, TrendingUp, UserPlus, X, Camera, Check, ChevronDown } from 'lucide-react';
import TeamAvatar from './TeamAvatar';
import { KBO_TEAMS } from '../constants/teams';
import { toast } from 'sonner';

export default function MyPage({ user, onLogout, onUpdateUser }) {
  const [notifications, setNotifications] = useState([]);
  const [activeSection, setActiveSection] = useState('profile');
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editedUser, setEditedUser] = useState({ ...user });
  const [newProfileImage, setNewProfileImage] = useState(null);

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
      ];
      setNotifications(initialNotifications);
      localStorage.setItem('notifications', JSON.stringify(initialNotifications));
    }
  }, []);

  const stats = [
    { label: '게시글', value: 12, icon: Edit2, color: 'from-teal-500 to-cyan-600' },
    { label: '좋아요', value: 234, icon: Heart, color: 'from-cyan-400 to-sky-600' },
    { label: '댓글', value: 89, icon: Award, color: 'from-teal-400 to-cyan-600' },
  ];

  const getIcon = (type) => {
    const iconProps = { className: "w-5 h-5" };
    switch (type) {
      case 'like':
        return <Heart {...iconProps} className="w-5 h-5 text-cyan-500" fill="currentColor" />;
      case 'comment':
        return <MessageCircle {...iconProps} className="w-5 h-5 text-teal-600" />;
      case 'poll':
        return <TrendingUp {...iconProps} className="w-5 h-5 text-sky-500" />;
      case 'follow':
        return <UserPlus {...iconProps} className="w-5 h-5 text-teal-600" />;
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

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewProfileImage(reader.result);
        setEditedUser({ ...editedUser, avatar: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProfile = () => {
    // 로컬스토리지의 사용자 정보 업데이트
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const updatedUsers = users.map(u => 
      u.username === user.username 
        ? { ...u, avatar: editedUser.avatar, team: editedUser.team, bio: editedUser.bio }
        : u
    );
    localStorage.setItem('users', JSON.stringify(updatedUsers));

    // 현재 세션의 사용자 정보 업데이트 (App.tsx의 user state 업데이트)
    const updatedCurrentUser = { ...user, avatar: editedUser.avatar, team: editedUser.team, bio: editedUser.bio };
    if (onUpdateUser) {
      onUpdateUser(updatedCurrentUser);
    }

    setIsEditingProfile(false);
    setNewProfileImage(null);
    toast.success('프로필이 업데이트되었습니다!');
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="p-4 space-y-4">
      {/* 탭 전환 */}
      <div className="flex gap-2 glass-card rounded-2xl p-2">
        <button
          onClick={() => setActiveSection('profile')}
          className={`flex-1 py-3 rounded-xl transition-all text-center ${
            activeSection === 'profile'
              ? 'bg-gradient-to-r from-teal-500 to-cyan-500 dark:from-[#00d5be] dark:to-[#00b8db] text-white'
              : 'text-gray-600 dark:text-gray-400'
          }`}
        >
          프로필
        </button>
        <button
          onClick={() => setActiveSection('notifications')}
          className={`flex-1 py-3 rounded-xl transition-all relative text-center ${
            activeSection === 'notifications'
              ? 'bg-gradient-to-r from-teal-500 to-cyan-500 dark:from-[#00d5be] dark:to-[#00b8db] text-white'
              : 'text-gray-600 dark:text-gray-400'
          }`}
        >
          <span className="inline-block">알림</span>
          {unreadCount > 0 && (
            <span className="absolute top-1 right-6 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
              {unreadCount}
            </span>
          )}
        </button>
      </div>

      <AnimatePresence mode="wait">
        {activeSection === 'profile' ? (
          <motion.div
            key="profile"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="space-y-4"
          >
            {/* 프로필 카드 */}
            <div 
              className="bg-gradient-to-br from-teal-500 via-cyan-500 to-sky-600 rounded-2xl p-6 text-white shadow-2xl"
              style={{
                background: typeof window !== 'undefined' && document.documentElement.classList.contains('dark')
                  ? 'linear-gradient(135deg, rgba(20, 233, 210, 0.40) 0%, rgba(36, 220, 255, 0.40) 50%, rgba(56, 182, 255, 0.40) 100%)'
                  : undefined
              }}
            >
              <div className="flex flex-col items-center">
                {isEditingProfile ? (
                  <div className="relative">
                    <TeamAvatar
                      team={editedUser?.team?.name}
                      src={editedUser?.avatar}
                      size="xl"
                      className="border-4 border-white"
                    />
                    <label className="absolute bottom-0 right-0 bg-white text-teal-700 rounded-full p-2 cursor-pointer hover:bg-teal-50 transition-colors">
                      <Camera className="w-4 h-4" />
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                    </label>
                  </div>
                ) : (
                  <TeamAvatar
                    team={user?.team?.name}
                    src={user?.avatar}
                    size="xl"
                    className="border-4 border-white mb-4"
                  />
                )}
                
                <h2 className="text-white mb-1 mt-4">{user?.username || '사용자'}</h2>
                <p className="text-white/80">@{user?.username || 'username'}</p>
                
                {isEditingProfile ? (
                  <div className="mt-3 w-full max-w-xs">
                    <label className="block text-white/80 text-sm mb-2">응원 구단</label>
                    <div className="relative">
                      <select
                        value={editedUser?.team?.id || ''}
                        onChange={(e) => {
                          const selectedTeam = KBO_TEAMS.find(t => t.id === e.target.value);
                          setEditedUser({ ...editedUser, team: selectedTeam });
                        }}
                        className="w-full bg-white/20 text-white rounded-xl pl-4 pr-10 py-2 border border-white/30 focus:outline-none focus:ring-2 focus:ring-white/50 appearance-none"
                      >
                        {KBO_TEAMS.map(team => (
                          <option key={team.id} value={team.id} className="text-gray-900">
                            {team.emoji} {team.name}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/70 pointer-events-none" />
                    </div>
                  </div>
                ) : user?.team && (
                  <div className="mt-3 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 flex items-center gap-2">
                    <span className="text-2xl">{user.team.emoji}</span>
                    <span className="text-white">{user.team.name}</span>
                  </div>
                )}
                
                {isEditingProfile ? (
                  <div className="mt-3 w-full max-w-xs">
                    <label className="block text-white/80 text-sm mb-2">소개</label>
                    <textarea
                      value={editedUser?.bio || ''}
                      onChange={(e) => setEditedUser({ ...editedUser, bio: e.target.value })}
                      placeholder="자신을 소개해주세요"
                      rows={3}
                      className="w-full bg-white/20 text-white rounded-xl px-4 py-2 border border-white/30 focus:outline-none focus:ring-2 focus:ring-white/50 placeholder:text-white/50 resize-none"
                    />
                  </div>
                ) : (
                  <p className="text-white/90 text-center mt-3 text-sm">
                    {user?.bio || 'KBO를 사랑하는 열정적인 야구팬입니다! ⚾'}
                  </p>
                )}

                {/* 프로필 수정 버튼 */}
                <div className="mt-4 flex gap-2 justify-center">
                  {isEditingProfile ? (
                    <>
                      <motion.button
                        whileTap={{ scale: 0.95 }}
                        onClick={() => {
                          setIsEditingProfile(false);
                          setEditedUser({ ...user, bio: user.bio || '' });
                          setNewProfileImage(null);
                        }}
                        className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-xl transition-colors text-white"
                      >
                        취소
                      </motion.button>
                      <motion.button
                        whileTap={{ scale: 0.95 }}
                        onClick={handleSaveProfile}
                        className="px-4 py-2 bg-white hover:bg-white/90 text-teal-700 dark:text-teal-700 rounded-xl transition-colors flex items-center gap-2"
                      >
                        <Check className="w-4 h-4" />
                        저장
                      </motion.button>
                    </>
                  ) : (
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        setEditedUser({ ...user, bio: user.bio || '' });
                        setIsEditingProfile(true);
                      }}
                      className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-xl transition-colors flex items-center gap-2 text-white"
                    >
                      <Edit2 className="w-4 h-4" />
                      프로필 수정
                    </motion.button>
                  )}
                </div>
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
                      <Icon className="w-5 h-5 mx-auto mb-2 text-white" />
                      <div className="text-xl text-white mb-1">{stat.value}</div>
                      <p className="text-xs text-white/80">{stat.label}</p>
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* 메뉴 */}
            <div className="glass-card rounded-2xl overflow-hidden border border-teal-100/50 dark:border-[#00d5be]/20">
              <button className="w-full flex items-center gap-3 px-4 py-3 hover:bg-teal-50 dark:hover:bg-[#00d5be]/10 transition-all border-b border-gray-100 dark:border-gray-700/50">
                <div className="w-10 h-10 rounded-full bg-teal-100 dark:bg-[#00d5be]/20 flex items-center justify-center">
                  <Settings className="w-5 h-5 text-teal-600 dark:text-[#00d5be]" />
                </div>
                <span className="text-gray-900 dark:text-gray-100">설정</span>
              </button>
              <button
                onClick={onLogout}
                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-teal-50 dark:hover:bg-[#00d5be]/10 transition-all"
              >
                <div className="w-10 h-10 rounded-full bg-rose-100 dark:bg-rose-900/30 flex items-center justify-center">
                  <LogOut className="w-5 h-5 text-rose-600 dark:text-rose-400" />
                </div>
                <span className="text-gray-900 dark:text-gray-100">로그아웃</span>
              </button>
            </div>

            {/* 배지 */}
            <div className="glass-card rounded-2xl p-5 border border-teal-100/50 dark:border-[#00d5be]/20">
              <h3 className="text-gray-900 dark:text-gray-100 mb-4 font-medium">내 배지</h3>
              <div className="grid grid-cols-4 gap-3">
                {['⚾', '🏆', '⭐', '🔥', '👑', '💪', '🎯', '⚡'].map((badge, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.4 + index * 0.05 }}
                    whileTap={{ scale: 0.9 }}
                    className="aspect-square bg-gradient-to-br from-teal-100 to-cyan-100 dark:from-[#00d5be]/20 dark:to-[#00b8db]/20 rounded-xl flex items-center justify-center text-2xl cursor-pointer"
                  >
                    {badge}
                  </motion.div>
                ))}
              </div>
            </div>

            {/* 레벨 진행바 */}
            <div className="bg-gradient-to-br from-teal-50 to-cyan-50 dark:from-[#00d5be]/10 dark:to-[#00b8db]/10 rounded-2xl p-5 shadow-sm border border-teal-200 dark:border-[#00d5be]/30">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-gray-900 dark:text-gray-100 flex items-center gap-2 font-medium">
                  <Zap className="w-5 h-5 text-teal-500 dark:text-[#00d5be]" />
                  레벨 7
                </h3>
                <span className="text-sm text-gray-600 dark:text-gray-400">75%</span>
              </div>
              <div className="h-2.5 bg-gray-200 dark:bg-gray-700/50 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: '75%' }}
                  transition={{ delay: 0.5, duration: 1, ease: 'easeOut' }}
                  className="h-full bg-gradient-to-r from-teal-400 to-cyan-500 dark:from-[#00d5be] dark:to-[#00b8db] rounded-full"
                />
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-3">
                다음 레벨까지 250XP 남음
              </p>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="notifications"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-4"
          >
            {/* 헤더 */}
            <div className="flex items-center justify-between">
              <h2 className="text-gray-900 dark:text-gray-100">알림</h2>
              <button
                onClick={markAllAsRead}
                className="text-teal-600 dark:text-[#00d5be] hover:underline"
              >
                모두 읽음
              </button>
            </div>

            {/* 알림 목록 */}
            <div className="space-y-2">
              <AnimatePresence>
                {notifications.map((notif, index) => (
                  <motion.div
                    key={notif.id}
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 100, height: 0, marginBottom: 0 }}
                    transition={{ delay: index * 0.05 }}
                    onClick={() => markAsRead(notif.id)}
                    className={`flex items-start gap-3 p-4 rounded-xl cursor-pointer transition-all relative overflow-hidden border touch-manipulation ${
                      notif.read
                        ? 'glass-card border-gray-200/50 dark:border-gray-700/30'
                        : 'glass-card border-teal-200/70 dark:border-[#00d5be]/30 bg-gradient-to-r from-teal-50/30 to-cyan-50/30 dark:from-[#00d5be]/5 dark:to-[#00b8db]/5'
                    }`}
                    style={{ WebkitTapHighlightColor: 'transparent' }}
                  >
                    <img
                      src={notif.avatar}
                      alt={notif.user}
                      className="w-11 h-11 rounded-full flex-shrink-0 ring-2 ring-teal-200 dark:ring-[#00d5be]/30"
                    />
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start gap-2 mb-1">
                        <p className="text-sm text-gray-900 dark:text-gray-100 flex-1">
                          <span className="font-medium">{notif.user}</span>
                          <span className="text-gray-600 dark:text-gray-400">
                            {' '}
                            {notif.message}
                          </span>
                        </p>
                        <div className="flex-shrink-0">
                          {getIcon(notif.type)}
                        </div>
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {notif.timestamp}
                      </p>
                    </div>

                    {!notif.read && (
                      <div className="w-2 h-2 bg-teal-600 dark:bg-[#00d5be] rounded-full flex-shrink-0 mt-2" />
                    )}

                    {/* 삭제 버튼 */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        dismissNotification(notif.id);
                      }}
                      className="p-1.5 bg-red-100 dark:bg-red-900/30 hover:bg-red-200 dark:hover:bg-red-900/50 rounded-full transition-colors touch-manipulation flex-shrink-0"
                    >
                      <X className="w-3.5 h-3.5 text-red-600 dark:text-red-400" />
                    </button>
                  </motion.div>
                ))}
              </AnimatePresence>

              {notifications.length === 0 && (
                <div className="text-center py-16 text-gray-400 dark:text-gray-500">
                  <div className="text-5xl mb-3">🔔</div>
                  <p className="text-sm">알림이 없습니다</p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
