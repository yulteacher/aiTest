// src/MainApp.tsx
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Moon, Sun, MessageCircle, X, ArrowLeft } from "lucide-react";

import { useXPSystem } from "./hooks/useXPSystem";
import Navigation from "./components/yului/Navigation";
import LiquidEther from "./components/reactbits/LiquidEther";
import { Toaster } from "react-hot-toast";

import IntroPage from "./pages/IntroPage";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";
import HomePage from "./pages/HomePage";
import FeedPage from "./pages/FeedPage";
import PollsPage from "./pages/PollsPage";
import MyPage from "./pages/MyPage";
import PostDetailPage from "./pages/PostDetailPage";
import PollDetailPage from "./pages/PollDetailPage";
import ChatPage from "./pages/ChatPage";
import TestGrid from "./pages/WidgetGridTest";

import { useAppDataContext } from "./context/AppDataContext";

export default function MainApp() {
    const {
        currentUser,
        setCurrentUser,
        users,
        posts,
        polls,
        addPost,
        updatePost,
        deletePost,
        addComment,
        updateComment,
        deleteComment,
        addPoll,
        updatePoll,
        deletePoll,
    } = useAppDataContext();
    const { addXP } = useXPSystem();
    const [showIntro, setShowIntro] = useState(
        localStorage.getItem("introSeen") !== "true"
    );
    const [activeTab, setActiveTab] = useState(
        localStorage.getItem("activeTab") || "home"
    );
    const [darkMode, setDarkMode] = useState(false);
    const [showChat, setShowChat] = useState(false);
    const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
    const [selectedPollId, setSelectedPollId] = useState<string | null>(null);
    /* 로그인 유지 */
    useEffect(() => {
        const loadUser = async () => {
            const saved = localStorage.getItem("currentUser");
            if (saved) {
                const parsed = JSON.parse(saved);

                // ✅ KBO_TEAM 복원
                if (!parsed.team && parsed.teamId) {
                    const { KBO_TEAMS } = await import("./data/constants/teams");
                    const teamInfo = KBO_TEAMS.find((t) => t.id === parsed.teamId);
                    parsed.team = teamInfo || null;
                }

                setCurrentUser(parsed);
            }
        };

        loadUser(); // ✅ async 함수 실행
    }, []);

    /* 다크모드 */
    useEffect(() => {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'dark') {
            setDarkMode(true);
            document.documentElement.classList.add('dark');
        }
    }, []);


    useEffect(() => {
        const handlePop = () => {
            const hash = window.location.hash;

            if (hash.startsWith('#post/')) {
                const id = hash.replace('#post/', '');
                setSelectedPostId(id);
            } else if (hash.startsWith('#poll/')) {
                const id = hash.replace('#poll/', '');
                setSelectedPollId(id);
            } else {
                setSelectedPostId(null);
                setSelectedPollId(null);
            }
        };

        window.addEventListener('popstate', handlePop);
        handlePop(); // 페이지 진입 시 현재 hash 확인
        return () => window.removeEventListener('popstate', handlePop);
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

    const navigateTo = (path: string) => {
        setSelectedPostId(null);
        setSelectedPollId(null);
        setActiveTab(path);
        // ⭐ 여기가 없어서 계속 home으로 돌아간 것
        localStorage.setItem("activeTab", path);
        window.history.pushState({ path }, '', `#${path}`);
    };

    if (showIntro) return <IntroPage onEnter={() => {
        localStorage.setItem("introSeen", "true");
        setShowIntro(false)
    }} />;

    if (!currentUser) {
        const hash = window.location.hash.replace('#', '');
        return hash === 'signup'
            ? (
                <SignUpPage
                    onSignup={(newUser) => setCurrentUser(newUser)}
                    navigateTo={navigateTo}
                />
            )
            : (
                <LoginPage
                    onLogin={(foundUser) => setCurrentUser(foundUser)} // ✅ 로그인 성공 시 유저 저장
                    navigateTo={navigateTo}
                />
            );
    }

    const handleLogout = () => {
        localStorage.removeItem("currentUser");
        // localStorage.clear(); // 🔥 데이터 유지를 위해 전체 초기화 제거
        window.location.reload();
    };

    const renderPage = () => {
        if (selectedPostId)
            return <PostDetailPage postId={selectedPostId} onBack={() => setSelectedPostId(null)} />;

        if (selectedPollId)
            return <PollDetailPage pollId={selectedPollId} onBack={() => setSelectedPollId(null)} />;

        switch (activeTab) {
            case 'home':
                return <HomePage user={currentUser} onNavigate={setActiveTab} onChatOpen={() => setShowChat(true)} onPostClick={(id) => setSelectedPostId(id)} onPollClick={(id) => setSelectedPollId(id)} />;
            case 'feed':
                return <FeedPage onPostClick={(id) => {
                    setSelectedPostId(id);
                    window.history.pushState({ postId: id }, '', `#post/${id}`);
                }} />;
            case 'polls':
                return <PollsPage onPollClick={(id) => {
                    setSelectedPollId(id);
                    window.history.pushState({ pollId: id }, '', `#poll/${id}`);
                }} />;
            case 'mypage':
                return <MyPage onLogout={handleLogout} onNavigate={setActiveTab} />;
            case 'test':
                return <TestGrid />;
            default:
                return null;
        }
    };

    return (
        <div className="min-h-screen transition-colors relative">
            {/* LiquidEther 배경 */}
            <div style={{ width: '100%', height: '100vh', position: 'fixed' }}>
                <LiquidEther
                    colors={['#5227FF', '#FF9FFC', '#B19EEF']}
                    mouseForce={20}
                    cursorSize={100}
                    isViscous={false}
                    viscous={30}
                    iterationsViscous={32}
                    iterationsPoisson={32}
                    resolution={0.5}
                    isBounce={false}
                    autoDemo={true}
                    autoSpeed={0.5}
                    autoIntensity={2.2}
                    takeoverDuration={0.25}
                    autoResumeDelay={3000}
                    autoRampDuration={0.6}
                />
            </div>
            {/* 배경 그라디언트 */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden opacity-40 dark:opacity-30">
                <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-teal-400/20 to-cyan-400/20 dark:from-teal-400/30 dark:to-cyan-400/30 rounded-full blur-3xl" />
                <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-tl from-cyan-400/20 to-sky-400/20 dark:from-cyan-400/30 dark:to-teal-400/30 rounded-full blur-3xl" />
            </div>
            {/* 헤더 */}
            <motion.header className="fixed top-0 left-0 right-0 bg-white/80 dark:bg-[#1d293d]/80 backdrop-blur-xl border-b border-teal-200/50 dark:border-[#00d5be]/30 z-50 shadow-sm">
                <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
                    <div className="flex items-center w-12">
                        {(selectedPostId || selectedPollId || activeTab !== 'home') && (
                            <motion.button
                                onClick={() => {
                                    if (selectedPostId || selectedPollId) window.history.back();
                                    else setActiveTab('home');
                                }}
                                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors cursor-pointer"
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
                        className="p-2 rounded-full hover:bg-teal-100 dark:hover:bg-[#00d5be]/20"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                    >
                        <AnimatePresence mode="wait">
                            {darkMode ? (
                                <motion.div key="sun" initial={{ rotate: -90, scale: 0 }} animate={{ rotate: 0, scale: 1 }} exit={{ rotate: 90, scale: 0 }}>
                                    <Sun className="w-5 h-5 text-[#00d5be]" />
                                </motion.div>
                            ) : (
                                <motion.div key="moon" initial={{ rotate: 90, scale: 0 }} animate={{ rotate: 0, scale: 1 }} exit={{ rotate: -90, scale: 0 }}>
                                    <Moon className="w-5 h-5 text-teal-600" />
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.button>
                </div>
            </motion.header>

            {/* 메인 콘텐츠 */}
            <main className="max-w-2xl mx-auto pt-14 pb-20 relative">
                <AnimatePresence mode="wait">{renderPage()}</AnimatePresence>
            </main>

            {/* AI 챗봇 */}
            <motion.button
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                onClick={() => setShowChat(!showChat)}
                className="fixed bottom-24 right-6 bg-gradient-to-r from-teal-500 to-cyan-500 dark:from-[#00d5be] dark:to-[#00b8db] text-white rounded-full p-4 shadow-lg hover:shadow-xl dark:shadow-[#00d5be]/40 z-40"
            >
                {showChat ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
            </motion.button>

            <AnimatePresence>
                {showChat && (
                    <motion.div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div onClick={() => setShowChat(false)} className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
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

