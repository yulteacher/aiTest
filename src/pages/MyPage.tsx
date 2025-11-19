import { useState, useEffect } from 'react';
import { motion, AnimatePresence, Reorder, useDragControls } from 'framer-motion';
import {
  Edit2, LogOut, Award, Zap, Heart, MessageCircle, TrendingUp,
  UserPlus, X, Camera, Check, ChevronDown, GripVertical
} from 'lucide-react';

import { KBO_TEAMS } from '../data/constants/teams';
import { toast } from 'sonner';

import TeamLogo from '../components/yului/TeamLogo';
import TeamAvatar from '../components/yului/TeamAvatar';

import { useXPSystem } from "../hooks/useXPSystem";
import { useBadgeSystem } from '../hooks/useBadgeSystem';
import { useAppDataContext } from "../context/AppDataContext";

import BadgeLayout from '../components/badges/BadgeLayout';
import BadgeIcon from '../components/badges/BadgeIcon';



// ----------------------------------------------------------------------
// 🧩 Draggable Widget Component
// ----------------------------------------------------------------------
function DraggableWidget({ widgetType, children, setIsDragging, isBadgeDragging }) {
  return (
    <Reorder.Item
      value={widgetType}
      dragListener={true}
      drag={isBadgeDragging ? false : true}   // ⭐ 중요!
      onDragStart={() => !isBadgeDragging && setIsDragging(true)}
      onDragEnd={() => !isBadgeDragging && setIsDragging(false)}
      className="relative group cursor-grab active:cursor-grabbing"
      initial={false}
      whileDrag={{
        scale: 1.02,
        opacity: 0.9,
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        zIndex: 100,
        cursor: 'grabbing'
      }}
      transition={{ duration: 0.2 }}
    >
      {children}
    </Reorder.Item>
  );
}

export default function MyPage({ onLogout, onNavigate }) {
  const [isDragging, setIsDragging] = useState(false);
  const [isBadgeDragging, setIsBadgeDragging] = useState(false);
  /* ==========================================================
     🔥 전역 유저 데이터 (단일 기준: currentUser만 사용)
  ========================================================== */
  const { currentUser, setCurrentUser, users } = useAppDataContext();
  if (!currentUser) return null;
  /* ==========================================================
       🔥 state
    ========================================================== */
  const [activeSection, setActiveSection] = useState<'profile' | 'notifications'>('profile');

  /* ==========================================================
     🔥 XP 시스템 / 레벨 정보
  ========================================================== */
  const { getLevelInfo } = useXPSystem();
  const [levelInfo, setLevelInfo] = useState(() => getLevelInfo());

  // currentUser가 변경될 때마다 레벨 정보 업데이트
  useEffect(() => {
    setLevelInfo(getLevelInfo());
  }, [currentUser]); // getLevelInfo 제거 - 무한 루프 방지

  /* ==========================================================
     🔥 뱃지 시스템
  ========================================================== */
  const { checkAllBadges } = useBadgeSystem();
  const [badgeReady, setBadgeReady] = useState(false);

  useEffect(() => {
    if (currentUser) setBadgeReady(true);
  }, [currentUser]);

  useEffect(() => {
    if (!badgeReady) return;
    checkAllBadges();
  }, [badgeReady]);

  /* ==========================================================
     🔥 프로필 편집 상태
  ========================================================== */
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editedUser, setEditedUser] = useState({ ...currentUser });
  const [newProfileImage, setNewProfileImage] = useState(null);

  /* ==========================================================
     🔥 알림
  ========================================================== */
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem('notifications');

    if (saved) {
      setNotifications(JSON.parse(saved));
      return;
    }

    const defaults = [
      {
        id: '1', type: 'like', user: '야구덕후',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop',
        message: '님이 회원님의 경기 리뷰를 좋아합니다', timestamp: '5분 전', read: false,
      },
      {
        id: '2', type: 'comment', user: 'KBO매니아',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
        message: '님이 회원님의 게시물에 댓글을 남겼습니다', timestamp: '1시간 전', read: false,
      },
      {
        id: '3', type: 'poll', user: '야구팬',
        avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=100&h=100&fit=crop',
        message: '님의 우승팀 예상 투표에 453명이 참여했습니다', timestamp: '2시간 전', read: true,
      },
    ];

    setNotifications(defaults);
    localStorage.setItem('notifications', JSON.stringify(defaults));
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;

  /* ==========================================================
     🔥 응원 구단
  ========================================================== */
  const team =
    KBO_TEAMS.find(t => t.id === (editedUser?.teamId ?? currentUser?.teamId));

  /* ==========================================================
     🔥 이미지 업로드 (자동압축)
  ========================================================== */
  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const img = new Image();
      img.src = reader.result as string;

      img.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        const maxSize = 256;
        let { width, height } = img;

        if (width > height) {
          if (width > maxSize) {
            height *= maxSize / width;
            width = maxSize;
          }
        } else {
          if (height > maxSize) {
            width *= maxSize / height;
            height = maxSize;
          }
        }

        canvas.width = width;
        canvas.height = height;
        ctx?.drawImage(img, 0, 0, width, height);

        const compressed = canvas.toDataURL("image/webp", 0.7);

        setNewProfileImage(compressed);
        setEditedUser(prev => ({ ...prev, avatar: compressed }));
      };
    };
    reader.readAsDataURL(file);
  };

  /* ==========================================================
     🔥 프로필 저장
     (currentUser 모든 필드 보전 필수)
  ========================================================== */
  const handleSaveProfile = () => {
    const updated = {
      ...currentUser,
      teamId: editedUser.teamId,
      bio: editedUser.bio,
      avatar: editedUser.avatar ?? currentUser.avatar,
    };

    // Context 저장
    setCurrentUser(updated);
    localStorage.setItem("currentUser", JSON.stringify(updated));

    // users 배열도 갱신
    const updatedList = users.map(u => (u.id === updated.id ? updated : u));
    localStorage.setItem("users", JSON.stringify(updatedList));

    setIsEditingProfile(false);
    toast.success("프로필이 업데이트되었습니다!");
  };



  /* ==========================================================
     🔥 알림 아이콘
  ========================================================== */
  const getIcon = (type) => {
    const p = { className: "w-5 h-5" };
    switch (type) {
      case 'like': return <Heart {...p} className="text-cyan-500" fill="currentColor" />;
      case 'comment': return <MessageCircle {...p} className="text-teal-600" />;
      case 'poll': return <TrendingUp {...p} className="text-sky-500" />;
      case 'follow': return <UserPlus {...p} className="text-teal-600" />;
      default: return null;
    }
  };

  const markAsRead = (id) => {
    const next = notifications.map(n => n.id === id ? { ...n, read: true } : n);
    setNotifications(next);
    localStorage.setItem("notifications", JSON.stringify(next));
  };

  const markAllAsRead = () => {
    const next = notifications.map(n => ({ ...n, read: true }));
    setNotifications(next);
    localStorage.setItem("notifications", JSON.stringify(next));
  };

  const dismissNotification = (id) => {
    const next = notifications.filter(n => n.id !== id);
    setNotifications(next);
    localStorage.setItem("notifications", JSON.stringify(next));
  };

  /* ==========================================================
     🔥 위젯 순서 변경 (Drag & Drop)
  ========================================================== */
  type WidgetType = 'profile' | 'menu' | 'badges' | 'level';
  const [widgetOrder, setWidgetOrder] = useState<WidgetType[]>(['profile', 'menu', 'badges', 'level']);

  const renderWidget = (type: WidgetType) => {
    switch (type) {
      case 'profile':
        return (
          <div className="bg-gradient-to-br from-teal-500 via-cyan-500 to-sky-600 rounded-2xl p-6 text-white shadow-2xl">
            <div className="flex flex-col items-center">

              {/* 아바타 */}
              {isEditingProfile ? (
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="relative"
                >
                  <TeamAvatar
                    team={team?.name}
                    src={editedUser?.avatar}
                    size="xl"
                    className="border-4 border-white"
                  />
                  <label className="absolute bottom-0 right-0 bg-white text-teal-700 rounded-full p-2 cursor-pointer">
                    <Camera className="w-4 h-4" />
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={handleImageUpload}
                    />
                  </label>
                </motion.div>
              ) : (
                <TeamAvatar
                  team={team?.name}
                  src={currentUser.avatar}
                  size="xl"
                  className="border-4 border-white mb-4"
                />
              )}

              {/* 구단 표시 */}
              {team && (
                <div className="mt-3 bg-white/20 rounded-full px-4 py-2 flex items-center gap-2">
                  <TeamLogo team={team.id} size="md" />
                  <span>{team.name}</span>
                </div>
              )}

              <h2 className="mt-4">{currentUser.username}</h2>
              <p className="text-white/80">@{currentUser.username}</p>

              {/* 소개 */}
              {isEditingProfile ? (
                <div className="mt-3 w-full max-w-xs border-t border-white/20 py-3">
                  <label className="text-white/80 text-sm mb-2 block">소개</label>
                  <textarea
                    value={editedUser.bio || ''}
                    onChange={(e) => setEditedUser({ ...editedUser, bio: e.target.value })}
                    rows={3}
                    className="w-full bg-white/20 text-white rounded-xl px-4 py-2 border border-white/30 resize-none"
                  />
                </div>
              ) : (
                <p className="text-white/90 text-center mt-3 text-sm">
                  {currentUser.bio || 'KBO를 사랑하는 열정적인 야구팬입니다! ⚾'}
                </p>
              )}

              {/* 버튼 */}
              <div className="mt-4 flex gap-2">
                {isEditingProfile ? (
                  <>
                    <button
                      onClick={(e) => {
                        if (isDragging) return e.stopPropagation();
                        setIsEditingProfile(false);
                        setEditedUser({ ...currentUser });
                        setNewProfileImage(null);
                      }}
                      className="px-4 py-2 bg-white/20 rounded-xl cursor-pointer"
                    >
                      취소
                    </button>
                    <button
                      onClick={(e) => {
                        if (isDragging) return e.stopPropagation();
                        handleSaveProfile()
                      }}
                      className="px-4 py-2 bg-white text-teal-700 rounded-xl flex items-center gap-2 cursor-pointer"
                    >
                      <Check className="w-4 h-4" />
                      저장
                    </button>
                  </>
                ) : (
                  <button
                    onClick={(e) => {
                      if (isDragging) return e.stopPropagation();
                      setEditedUser({ ...currentUser });
                      setIsEditingProfile(true);
                    }}
                    className="px-4 py-2 bg-white/20 rounded-xl flex items-center gap-2 cursor-pointer"
                  >
                    <Edit2 className="w-4 h-4" />
                    프로필 수정
                  </button>
                )}
              </div>
            </div>

            {/* 통계 */}
            <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-white/20">
              <div className="text-center">
                <Edit2 className="w-5 h-5 mx-auto mb-2" />
                <p className="text-xl">12</p>
                <span className="text-xs">게시글</span>
              </div>
              <div className="text-center">
                <Heart className="w-5 h-5 mx-auto mb-2" />
                <p className="text-xl">234</p>
                <span className="text-xs">좋아요</span>
              </div>
              <div className="text-center">
                <Award className="w-5 h-5 mx-auto mb-2" />
                <p className="text-xl">89</p>
                <span className="text-xs">댓글</span>
              </div>
            </div>
          </div>
        );

      case 'menu':
        return (
          <div className="glass-card rounded-2xl overflow-hidden">
            <button
              onClick={(e) => {
                if (isDragging) return e.stopPropagation();
                localStorage.setItem("selectedTeamForPolls", JSON.stringify(team));
                onNavigate("polls");
              }}
              className="w-full flex items-center gap-3 px-4 py-3 border-b border-gray-100 dark:border-gray-700/50 cursor-pointer hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
            >
              <TrendingUp className="w-5 h-5 text-teal-600" />
              <span>내 구단 투표 보기</span>
            </button>

            <button
              onClick={(e) => {
                if (isDragging) return e.stopPropagation();
                onLogout()
              }}
              className="w-full flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
            >
              <LogOut className="w-5 h-5 text-rose-600" />
              <span>로그아웃</span>
            </button>
          </div>
        );

      case 'badges':
        return (
          <div className="glass-card rounded-2xl p-5">
            <h3 className="mb-4 font-medium">내 배지</h3>
            <BadgeLayout
              isDragging={isDragging}
              setIsBadgeDragging={setIsBadgeDragging}
              top5Badges={[currentUser.equippedBadges.main, ...currentUser.equippedBadges.slots]}
              showLabel={true}
              onUpdate={(updatedLayout) => {
                if (isDragging) return;
                const nextEquipped = {
                  main: updatedLayout.mainBadge,
                  slots: updatedLayout.slots
                };
                const updated = { ...currentUser, equippedBadges: nextEquipped };
                setCurrentUser(updated);
              }}
            />
          </div>
        );

      case 'level':
        return (
          <div className="glass-card overflow-hidden rounded-2xl p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="flex items-center gap-2 font-medium">
                <Zap className="w-5 h-5 text-teal-500" />
                레벨 {levelInfo.level}
              </h3>
              <span className="text-sm">{levelInfo.progress}%</span>
            </div>

            <div className="h-2.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${levelInfo.progress}%` }}
                transition={{ duration: 0.8 }}
                className="h-full bg-gradient-to-r from-teal-400 to-cyan-500"
              />
            </div>

            <p className="text-sm mt-3">
              다음 레벨까지 {levelInfo.toNext} XP 남음 (총 {levelInfo.xp} XP)
            </p>
          </div>
        );
      default:
        return null;
    }
  };

  /* ==========================================================
     🔥 렌더링
  ========================================================== */
  return (
    <div className="p-4 space-y-4">

      {/* 상단 탭 */}
      <div className="flex gap-2 glass-card rounded-2xl p-2">
        <button
          onClick={
            (e) => {
              if (isDragging) return e.stopPropagation();
              setActiveSection('profile')
            }
          }
          className={`flex-1 py-3 rounded-xl ${activeSection === 'profile'
            ? 'bg-gradient-to-r from-teal-500 to-cyan-500 text-white'
            : 'text-gray-600 dark:text-gray-400'
            }`}
        >
          프로필
        </button>

        <button
          onClick={
            (e) => {
              if (isDragging) return e.stopPropagation();
              setActiveSection('notifications')
            }
          }
          className={`flex-1 py-3 rounded-xl relative ${activeSection === 'notifications'
            ? 'bg-gradient-to-r from-teal-500 to-cyan-500 text-white'
            : 'text-gray-600 dark:text-gray-400'
            }`}
        >
          알림
          {unreadCount > 0 && (
            <span className="absolute top-1 right-6 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
              {unreadCount}
            </span>
          )}
        </button>
      </div>

      {/* ---------------- PROFILE ---------------- */}
      <AnimatePresence mode="wait">
        {activeSection === 'profile' ? (
          <motion.div
            key="profile"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="space-y-4"
          >
            <style>
              {`
                /* Reorder 드래그 플레이스홀더 스타일 */
                [data-framer-component-type="Reorder.Group"] > * {
                  margin-bottom: 1rem;
                }
              `}
            </style>
            <Reorder.Group axis="y" values={widgetOrder} onReorder={setWidgetOrder} className="space-y-4">
              {widgetOrder.map((widgetType) => (
                <DraggableWidget key={widgetType} widgetType={widgetType} setIsDragging={setIsDragging} isBadgeDragging={isBadgeDragging} >
                  {renderWidget(widgetType)}
                </DraggableWidget>
              ))}
            </Reorder.Group>
          </motion.div>
        ) : (
          /* ---------------- 알림 페이지 ---------------- */
          <motion.div
            key="notifications"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-4"
          >
            <div className="flex items-center justify-between">
              <h2>알림</h2>
              <button
                onClick={
                  (e) => {
                    if (isDragging) return e.stopPropagation();
                    markAllAsRead()
                  }
                }
                className="text-teal-600 hover:underline"
              >
                모두 읽음
              </button>
            </div>

            <div className="space-y-2">
              <AnimatePresence>
                {notifications.map((notif, index) => (
                  <motion.div
                    key={notif.id}
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 100, height: 0 }}
                    onClick={() => markAsRead(notif.id)}
                    className={`flex items-start gap-3 p-4 rounded-xl cursor-pointer border ${notif.read
                      ? 'glass-card'
                      : 'bg-gradient-to-r from-teal-50 to-cyan-50'
                      }`}
                  >
                    <img
                      src={notif.avatar}
                      className="w-11 h-11 rounded-full ring-2 ring-teal-200"
                    />

                    <div className="flex-1">
                      <p className="text-sm">
                        <span className="font-medium">{notif.user}</span>
                        <span className="text-gray-600"> {notif.message}</span>
                      </p>
                      <p className="text-xs text-gray-500">{notif.timestamp}</p>
                    </div>

                    {!notif.read && (
                      <div className="w-2 h-2 bg-teal-600 rounded-full mt-2" />
                    )}

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        dismissNotification(notif.id);
                      }}
                      className="p-1.5 bg-red-100 rounded-full"
                    >
                      <X className="w-3.5 h-3.5 text-red-600" />
                    </button>
                  </motion.div>
                ))}
              </AnimatePresence>

              {notifications.length === 0 && (
                <div className="text-center py-16 text-gray-400">
                  <div className="text-5xl mb-3">🔔</div>
                  <p>알림이 없습니다</p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
