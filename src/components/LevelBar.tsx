// components/LevelBar.tsx
import { motion } from "framer-motion";
import { Zap } from "lucide-react";

interface Props {
    level: number;
    progress: number;
    xp: number;
    nextLevelXP?: number;
}

export default function LevelBar({ level, progress, xp, nextLevelXP }: Props) {
    return (
        <div className="bg-gradient-to-br from-teal-50 to-cyan-50 dark:from-[#00d5be]/10 dark:to-[#00b8db]/10 rounded-2xl p-5 shadow-sm border border-teal-200 dark:border-[#00d5be]/30">
            <div className="flex items-center justify-between mb-3">
                <h3 className="text-gray-900 dark:text-gray-100 flex items-center gap-2 font-medium">
                    <Zap className="w-5 h-5 text-teal-500 dark:text-[#00d5be]" />
                    레벨 {level}
                </h3>
                <span className="text-sm text-gray-600 dark:text-gray-400">{Math.round(progress)}%</span>
            </div>

            <div className="h-2.5 bg-gray-200 dark:bg-gray-700/50 rounded-full overflow-hidden">
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 1 }}
                    className="h-full bg-gradient-to-r from-teal-400 to-cyan-500 dark:from-[#00d5be] dark:to-[#00b8db] rounded-full"
                />
            </div>

            <p className="text-sm text-gray-600 dark:text-gray-400 mt-3 text-right">
                {nextLevelXP ? `다음 레벨까지 ${nextLevelXP - xp} XP 남음` : "최고 레벨 달성!"}
            </p>
        </div>
    );
}
