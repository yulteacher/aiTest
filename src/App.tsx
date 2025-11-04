import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, TrendingUp, Moon, Sun, Rss, User, MessageCircle, X, ArrowLeft } from 'lucide-react';
import IntroPage from './components/IntroPage';
import LoginPage from './components/LoginPage';
import HomePage from './components/HomePage';
import FeedPage from './components/FeedPage';
import PollsPage from './components/PollsPage';
import ChatPage from './components/ChatPage';
import MyPage from './components/MyPage';
import PostDetailPage from './components/PostDetailPage';
import PollDetailPage from './components/PollDetailPage';
import { Toaster } from './components/ui/sonner';
import { dummyPostsData } from './data/dummyPosts';
import { dummyPollsData } from './data/dummyPolls';

export interface Post {
  id: string;
  author: string;
  avatar: string;
  timestamp: string;
  content: string;
  image?: string;
  likes: number;
  comments: number;
  liked: boolean;
  team?: string;
}

export interface Poll {
  id: string;
  question: string;
  options: Array<{
    id: string;
    text: string;
    votes: number;
  }>;
  author: string;
  avatar: string;
  timestamp: string;
  team?: string;
  totalVotes: number;
  userVoted?: string;
}

export default function App() {
  const [showIntro, setShowIntro] = useState(true);
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('home');
  const [darkMode, setDarkMode] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState(null);
  const [selectedPollId, setSelectedPollId] = useState(null);

  // 인트로 확인 및 초기 데이터 생성
  useEffect(() => {
    const hasVisited = localStorage.getItem('hasVisited');
    if (hasVisited) {
      setShowIntro(false);
    }
    
    // 🔧 콘텐츠 업데이트: 기존 데이터 초기화 (한 번만 실행)
    const contentVersion = localStorage.getItem('contentVersion');
    if (contentVersion !== 'kbo-v2') {
      localStorage.removeItem('posts');
      localStorage.removeItem('polls');
      localStorage.removeItem('chatMessages');
      localStorage.setItem('contentVersion', 'kbo-v2');
      console.log('✅ KBO 콘텐츠로 업데이트되었습니다!');
    }

    // 🆕 초기 더미 데이터 생성
    initializeDummyData();
  }, []);

  // 초기 더미 데이터 생성 함수
  const initializeDummyData = () => {
    // Posts 더미 데이터 생성
    if (!localStorage.getItem('posts')) {
      const { teams, postTemplates, avatars, images, timestamps } = dummyPostsData;
      const initialPosts = [];
      let postId = 1;

      teams.forEach((team) => {
        postTemplates.forEach((template, idx) => {
          const post = {
            id: postId.toString(),
            author: `${team.name} 팬${idx + 1}`,
            avatar: avatars[idx % avatars.length],
            content: template.content,
            team: team,
            image: template.hasImage ? images[idx % images.length] : undefined,
            likes: Math.floor(Math.random() * 500) + 10,
            timestamp: timestamps[idx % timestamps.length],
            liked: Math.random() > 0.7,
            commentsList: []
          };
          initialPosts.push(post);
          postId++;
        });
      });

      initialPosts.sort(() => Math.random() - 0.5);
      localStorage.setItem('posts', JSON.stringify(initialPosts));
      console.log('✅ Posts 더미 데이터 생성 완료!');
    }

    // Polls 더미 데이터 생성
    if (!localStorage.getItem('polls')) {
      localStorage.setItem('polls', JSON.stringify(dummyPollsData));
      console.log('✅ Polls 더미 데이터 생성 완료!');
    }
  };

  // 사용자 로그인 상태 확인
  useEffect(() => {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  // 다크모드 로컬스토리지에서 불러오기
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      setDarkMode(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  // 탭 전환시 스크롤 맨 위로
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [activeTab]);

  // 다크모드 토글
  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    if (newMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  const handleEnterApp = () => {
    localStorage.setItem('hasVisited', 'true');
    setShowIntro(false);
  };

  const handleLogin = (userData) => {
    setUser(userData);
    localStorage.setItem('currentUser', JSON.stringify(userData));
  };

  const handleUpdateUser = (updatedUserData) => {
    setUser(updatedUserData);
    localStorage.setItem('currentUser', JSON.stringify(updatedUserData));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('currentUser');
    setActiveTab('home');
  };

  const tabs = [
    { id: 'home', icon: Home, label: '홈' },
    { id: 'feed', icon: Rss, label: '피드' },
    { id: 'polls', icon: TrendingUp, label: '투표' },
    { id: 'mypage', icon: User, label: '마이' },
  ];

  const renderPage = () => {
    // 게시글 상세 페이지
    if (selectedPostId) {
      return (
        <PostDetailPage 
          postId={selectedPostId} 
          onBack={() => setSelectedPostId(null)}
          isDarkMode={darkMode}
          onToggleDarkMode={toggleDarkMode}
        />
      );
    }

    // 투표 상세 페이지
    if (selectedPollId) {
      return (
        <PollDetailPage 
          pollId={selectedPollId} 
          onBack={() => setSelectedPollId(null)}
          isDarkMode={darkMode}
          onToggleDarkMode={toggleDarkMode}
        />
      );
    }

    // 일반 페이지
    switch (activeTab) {
      case 'home':
        return (
          <HomePage 
            user={user}
            onNavigate={setActiveTab}
            onPostClick={setSelectedPostId}
            onPollClick={setSelectedPollId}
            onChatOpen={() => setShowChat(true)}
          />
        );
      case 'feed':
        return <FeedPage onPostClick={setSelectedPostId} />;
      case 'polls':
        return <PollsPage onPollClick={setSelectedPollId} />;
      case 'mypage':
        return <MyPage user={user} onLogout={handleLogout} onUpdateUser={handleUpdateUser} />;
      default:
        return (
          <HomePage 
            user={user}
            onNavigate={setActiveTab}
            onPostClick={setSelectedPostId}
            onPollClick={setSelectedPollId}
            onChatOpen={() => setShowChat(true)}
          />
        );
    }
  };

  const pageVariants = {
    initial: { 
      opacity: 0, 
      y: 20,
    },
    animate: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.3,
      }
    },
    exit: { 
      opacity: 0,
      transition: {
        duration: 0.2
      }
    }
  };

  // 인트로 페이지 표시
  if (showIntro) {
    return <IntroPage onEnter={handleEnterApp} />;
  }

  // 로그인하지 않은 경우
  if (!user) {
    return <LoginPage onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen transition-colors">
      {/* 배경 그라디언트 */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden opacity-40 dark:opacity-30">
        <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-teal-400/20 to-cyan-400/20 dark:from-teal-400/30 dark:to-cyan-400/30 rounded-full blur-3xl" />
        <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-tl from-cyan-400/20 to-sky-400/20 dark:from-cyan-400/30 dark:to-teal-400/30 rounded-full blur-3xl" />
      </div>

      {/* 헤더 - 통일된 헤더 */}
      <motion.header 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: 'spring', stiffness: 100 }}
        className="fixed top-0 left-0 right-0 bg-white/80 dark:bg-[#1d293d]/80 backdrop-blur-xl border-b border-teal-200/50 dark:border-[#00d5be]/30 z-50 transition-colors shadow-sm dark:shadow-[#00d5be]/10"
      >
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between relative">
          {/* 왼쪽 영역 - 뒤로가기 버튼 */}
          <div className="flex items-center w-12">
            {(selectedPostId || selectedPollId || activeTab !== 'home') && (
              <motion.button
                onClick={() => {
                  if (selectedPostId) {
                    setSelectedPostId(null);
                  } else if (selectedPollId) {
                    setSelectedPollId(null);
                  } else {
                    setActiveTab('home');
                  }
                }}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </motion.button>
            )}
          </div>
          
          {/* 중앙 영역 - 제목 */}
          <h1 className="absolute left-1/2 -translate-x-1/2 text-slate-700 dark:text-[#e2e8f0] flex items-center gap-2">
            {selectedPostId ? (
              '게시글'
            ) : selectedPollId ? (
              '투표'
            ) : activeTab === 'home' ? (
              '⚾ KBO 팬덤'
            ) : activeTab === 'feed' ? (
              '피드'
            ) : activeTab === 'polls' ? (
              '투표'
            ) : activeTab === 'mypage' ? (
              '마이페이지'
            ) : (
              '⚾ KBO 팬덤'
            )}
          </h1>
          
          {/* 오른쪽 영역 - 다크모드 토글 */}
          <motion.button
            onClick={toggleDarkMode}
            className="p-2 rounded-full hover:bg-teal-100 dark:hover:bg-[#00d5be]/20 transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <AnimatePresence mode="wait">
              {darkMode ? (
                <motion.div
                  key="sun"
                  initial={{ rotate: -90, scale: 0 }}
                  animate={{ rotate: 0, scale: 1 }}
                  exit={{ rotate: 90, scale: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Sun className="w-5 h-5 text-[#00d5be]" />
                </motion.div>
              ) : (
                <motion.div
                  key="moon"
                  initial={{ rotate: 90, scale: 0 }}
                  animate={{ rotate: 0, scale: 1 }}
                  exit={{ rotate: -90, scale: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Moon className="w-5 h-5 text-teal-600" />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        </div>
      </motion.header>

      {/* 메인 콘텐츠 */}
      <main className="max-w-2xl mx-auto pt-14 pb-20 relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedPostId || selectedPollId || activeTab}
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            {renderPage()}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* AI 챗봇 플로팅 버튼 */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.5, type: 'spring', stiffness: 200 }}
        onClick={() => setShowChat(!showChat)}
        className="fixed bottom-24 right-6 bg-gradient-to-r from-teal-500 to-cyan-500 dark:from-[#00d5be] dark:to-[#00b8db] text-white rounded-full p-4 shadow-lg hover:shadow-xl dark:shadow-[#00d5be]/40 transition-all z-40"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        {showChat ? (
          <X className="w-6 h-6" />
        ) : (
          <MessageCircle className="w-6 h-6" />
        )}
      </motion.button>

      {/* AI 챗봇 */}
      <AnimatePresence>
        {showChat && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            {/* 배경 오버레이 */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowChat(false)}
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            />
            {/* 챗봇 창 */}
            <div className="relative w-full max-w-md max-h-[80vh]">
              <ChatPage />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 하단 네비게이션 */}
      <motion.nav 
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        transition={{ type: 'spring', stiffness: 100, delay: 0.2 }}
        className="fixed bottom-0 left-0 right-0 bg-white/80 dark:bg-[#1d293d]/80 backdrop-blur-xl border-t border-[rgba(150,247,228,0.5)] dark:border-[#00d5be]/30 z-50 transition-colors shadow-lg dark:shadow-[#00d5be]/10"
      >
        <div className="max-w-2xl mx-auto px-2 py-2">
          <div className="flex items-center justify-around">
            {tabs.map((tab, index) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <motion.button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className="flex flex-col items-center gap-1 px-4 py-2 rounded-2xl transition-colors relative"
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Icon
                    className={`w-6 h-6 transition-colors ${
                      isActive
                        ? 'text-white dark:text-[#00d5be]'
                        : 'text-[#01B9D1] dark:text-gray-500'
                    }`}
                  />
                  <span
                    className={`text-xs transition-colors ${
                      isActive
                        ? 'text-white dark:text-[#00d5be]'
                        : 'text-[#01B9D1] dark:text-gray-500'
                    }`}
                  >
                    {tab.label}
                  </span>
                  {isActive && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute inset-0 bg-gradient-to-r from-[#00BBA7] to-[#00B8DB] dark:bg-gradient-to-r dark:from-[#00d5be]/20 dark:to-[#00d5be]/20 rounded-2xl -z-10"
                      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    />
                  )}
                </motion.button>
              );
            })}
          </div>
        </div>
      </motion.nav>
    </div>
  );
}
