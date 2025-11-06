import { motion } from "framer-motion";
import { Home, Rss, TrendingUp, User } from "lucide-react";

interface NavigationProps {
    activeTab: string;
    setActiveTab: (tab: string) => void;
    selectedPostId?: string | null;
    setSelectedPostId?: (id: string | null) => void;
    selectedPollId?: string | null;
    setSelectedPollId?: (id: string | null) => void;
    navigateTo: (tab: string) => void;
}

export default function Navigation({
    activeTab,
    setActiveTab,
    selectedPostId,
    setSelectedPostId,
    selectedPollId,
    setSelectedPollId,
    navigateTo,
}: NavigationProps) {
    const tabs = [
        { id: "home", icon: Home, label: "홈" },
        { id: "feed", icon: Rss, label: "피드" },
        { id: "polls", icon: TrendingUp, label: "투표" },
        { id: "mypage", icon: User, label: "마이" },
    ];

    return (
        <motion.nav
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            transition={{ type: "spring", stiffness: 100, delay: 0.2 }}
            className="fixed bottom-0 left-0 right-0 bg-white/80 dark:bg-[#1d293d]/80 backdrop-blur-xl border-t border-[rgba(150,247,228,0.5)] dark:border-[#00d5be]/30 z-50 shadow-lg dark:shadow-[#00d5be]/10"
        >
            <div className="max-w-2xl mx-auto px-2 py-2">
                <div className="flex items-center justify-around">
                    {tabs.map((tab, index) => {
                        const Icon = tab.icon;
                        const isActive = activeTab === tab.id;

                        const handleTabClick = () => {
                            if (selectedPostId && setSelectedPostId) setSelectedPostId(null);
                            if (selectedPollId && setSelectedPollId) setSelectedPollId(null);
                            navigateTo(tab.id);
                            window.scrollTo({ top: 0, behavior: "smooth" });
                        };

                        return (
                            <motion.button
                                key={tab.id}
                                onClick={handleTabClick}
                                className="flex flex-col items-center gap-1 px-5 py-2 rounded-2xl transition-colors relative cursor-pointer"
                                whileTap={{ scale: 0.95 }}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                            >
                                <Icon
                                    className={`w-6 h-6 ${isActive
                                        ? "text-white dark:text-[#00d5be]"
                                        : "text-[#01B9D1] dark:text-gray-500"
                                        }`}
                                />
                                <span
                                    className={`text-xs ${isActive
                                        ? "text-white dark:text-[#00d5be]"
                                        : "text-[#01B9D1] dark:text-gray-500"
                                        }`}
                                >
                                    {tab.label}
                                </span>

                                {isActive && (
                                    <motion.div
                                        layoutId="activeTab"
                                        className="absolute inset-0 bg-gradient-to-r from-[#00BBA7] to-[#00B8DB] dark:from-[#00d5be]/20 dark:to-[#00d5be]/20 rounded-2xl -z-10"
                                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                    />
                                )}
                            </motion.button>
                        );
                    })}
                </div>
            </div>
        </motion.nav>
    );
}
