// components/BadgeGrid.tsx
import { motion } from "framer-motion";

interface Props {
    badges: string[];
}

export default function BadgeGrid({ badges }: Props) {
    if (!badges.length) {
        return (
            <div className="text-center py-12 text-gray-400 dark:text-gray-500">
                <div className="text-4xl mb-3">🥇</div>
                <p>획득한 배지가 아직 없습니다</p>
            </div>
        );
    }

    return (
        <div className="bg-gradient-to-br from-teal-50 to-cyan-50 dark:from-[#00d5be]/10 dark:to-[#00b8db]/10 rounded-2xl p-5 border border-teal-200 dark:border-[#00d5be]/30">
            <h3 className="text-gray-900 dark:text-gray-100 mb-4 font-medium">내 배지</h3>
            <div className="grid grid-cols-4 sm:grid-cols-6 gap-4">
                {badges.map((badge, i) => (
                    <motion.div
                        key={badge}
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.1 + i * 0.05 }}
                        className="aspect-square bg-gradient-to-br from-teal-100 to-cyan-100 dark:from-[#00d5be]/20 dark:to-[#00b8db]/20 rounded-xl flex flex-col items-center justify-center text-2xl font-medium"
                    >
                        <span>{badge.split(" ")[0]}</span>
                        <p className="text-xs mt-1 text-gray-700 dark:text-gray-300">{badge.split(" ")[1]}</p>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
