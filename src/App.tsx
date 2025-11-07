import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, TrendingUp, Moon, Sun, Rss, User, MessageCircle, X, ArrowLeft } from 'lucide-react';
import { useAuth } from "./hooks/useAuth";
import { useLocalData } from './hooks/useLocalData';
import LiquidEther from "./components/reactbits/LiquidEther";
import Navigation from "./components/yului/Navigation";
import { Toaster } from 'react-hot-toast';

import type { Post, Poll } from './types/interfaces'

// Pages
import IntroPage from './pages/IntroPage';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import HomePage from './pages/HomePage';
import FeedPage from './pages/FeedPage';
import PollsPage from './pages/PollsPage';
import MyPage from './pages/MyPage';
import PostDetailPage from './pages/PostDetailPage';
import PollDetailPage from './pages/PollDetailPage';
import ChatPage from './pages/ChatPage';

export default function App() {
  const [showIntro, setShowIntro] = useState(true);
  const [activeTab, setActiveTab] = useState('home');
  const [darkMode, setDarkMode] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
  const [selectedPollId, setSelectedPollId] = useState<string | null>(null);
  // const { initData } = useLocalData();
  const { user, login, logout, signup, updateUser, setUser } = useAuth();

  // ✅ 초기 데이터 1회만 생성
  useEffect(() => {
    const hasInit = localStorage.getItem('initDone');
    if (!hasInit) {
      // initData();
      localStorage.setItem('initDone', 'true');
      console.log('🟢 초기 데이터 생성 완료');
    } else {
      console.log('🟢 기존 데이터 유지 (initData 생략)');
    }
  }, []);

  // ✅ 로그인 유지
  useEffect(() => {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) setUser(JSON.parse(savedUser));
  }, []);

  const navigateTo = (path: string) => {
    setSelectedPostId(null);
    setSelectedPollId(null);
    setActiveTab(path);
    window.history.pushState({ path }, '', `#${path}`);
  };

  // ✅ 다크모드
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      setDarkMode(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

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

  if (showIntro) return <IntroPage onEnter={() => setShowIntro(false)} />;

  if (!user) {
    const hash = window.location.hash.replace('#', '');
    return hash === 'signup'
      ? <SignUpPage
        onSignup={(newUser) => {
          setUser(newUser);      // ✅ useAuth에서 가져온 setUser 사용
          navigateTo("home");    // ✅ navigate → navigateTo (App 내부 함수)
        }}
        navigateTo={navigateTo}
      />
      : <LoginPage onLogin={login} navigateTo={navigateTo} />;
  }

  const renderPage = () => {
    if (selectedPostId)
      return <PostDetailPage postId={selectedPostId} onBack={() => setSelectedPostId(null)} />;

    if (selectedPollId)
      return <PollDetailPage pollId={selectedPollId} onBack={() => setSelectedPollId(null)} />;

    switch (activeTab) {
      case 'home':
        return <HomePage user={user} onNavigate={setActiveTab} onChatOpen={() => setShowChat(true)} />;
      case 'feed':
        return <FeedPage onPostClick={setSelectedPostId} />;
      case 'polls':
        return <PollsPage onPollClick={setSelectedPollId} />;
      case 'mypage':
        return <MyPage user={user} onLogout={logout} onUpdateUser={updateUser} onNavigate={setActiveTab} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen transition-colors relative">
      <LiquidEther colors={['#5227FF', '#FF9FFC', '#B19EEF']} cursorSize={100} />

      {/* Header */}
      <motion.header className="fixed top-0 left-0 right-0 bg-white/80 dark:bg-[#1d293d]/80 backdrop-blur-xl border-b border-teal-200/50 dark:border-[#00d5be]/30 z-50 transition-colors shadow-sm">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center w-12">
            {(selectedPostId || selectedPollId || activeTab !== 'home') && (
              <motion.button
                onClick={() => {
                  if (selectedPostId) setSelectedPostId(null);
                  else if (selectedPollId) setSelectedPollId(null);
                  else setActiveTab('home');
                }}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </motion.button>
            )}
          </div>

          <h1 className="text-slate-700 dark:text-[#e2e8f0]">
            {selectedPostId ? '게시글' : selectedPollId ? '투표' : activeTab === 'mypage' ? '마이페이지' : '⚾ KBO 팬덤'}
          </h1>

          <motion.button
            onClick={toggleDarkMode}
            className="p-2 rounded-full hover:bg-teal-100 dark:hover:bg-[#00d5be]/20 transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <AnimatePresence mode="wait">
              {darkMode ? (
                <motion.div key="sun" initial={{ rotate: -90, scale: 0 }} animate={{ rotate: 0, scale: 1 }} exit={{ rotate: 90, scale: 0 }} transition={{ duration: 0.2 }}>
                  <Sun className="w-5 h-5 text-[#00d5be]" />
                </motion.div>
              ) : (
                <motion.div key="moon" initial={{ rotate: 90, scale: 0 }} animate={{ rotate: 0, scale: 1 }} exit={{ rotate: -90, scale: 0 }} transition={{ duration: 0.2 }}>
                  <Moon className="w-5 h-5 text-teal-600" />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        </div>
      </motion.header>

      {/* Main */}
      <main className="max-w-2xl mx-auto pt-14 pb-20 relative">
        <AnimatePresence mode="wait">{renderPage()}</AnimatePresence>
      </main>

      {/* Chat */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.5, type: 'spring', stiffness: 200 }}
        onClick={() => setShowChat(!showChat)}
        className="fixed bottom-24 right-6 bg-gradient-to-r from-teal-500 to-cyan-500 dark:from-[#00d5be] dark:to-[#00b8db] text-white rounded-full p-4 shadow-lg hover:shadow-xl dark:shadow-[#00d5be]/40 transition-all z-40"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        {showChat ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
      </motion.button>

      <AnimatePresence>
        {showChat && (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowChat(false)} className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
            <div className="relative w-full max-w-md max-h-[80vh]">
              <ChatPage />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <Navigation activeTab={activeTab} setActiveTab={setActiveTab} navigateTo={navigateTo} />
      <Toaster position="top-center" />
    </div>
  );
}