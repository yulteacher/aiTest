// components/UserStatsCard.tsx
import { motion } from "framer-motion";
import { Edit2, Heart, MessageCircle, TrendingUp } from "lucide-react";

interface Props {
    postsCount: number;
    likesCount: number;
    commentsCount: number;
    pollCount: number;
}

const icons = {
    posts: Edit2,
    likes: Heart,
    comments: MessageCircle,
    polls: TrendingUp,
};

export default function UserStatsCard({
    postsCount,
    likesCount,
    commentsCount,
    pollCount,
}: Props) {
    const items = [
        { label: "게시글", value: postsCount, Icon: icons.posts, color: "from-teal-500 to-cyan-600" },
        { label: "좋아요", value: likesCount, Icon: icons.likes, color: "from-cyan-400 to-sky-600" },
        { label: "댓글", value: commentsCount, Icon: icons.comments, color: "from-teal-400 to-cyan-600" },
        { label: "투표", value: pollCount, Icon: icons.polls, color: "from-blue-400 to-sky-500" },
    ];

    return (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {items.map(({ label, value, Icon, color }, i) => (
                <motion.div
                    key={label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className={`text-center bg-gradient-to-br ${color} rounded-2xl p-4 text-white shadow-lg`}
                >
                    <Icon className="w-5 h-5 mx-auto mb-2" />
                    <div className="text-2xl font-bold">{value}</div>
                    <p className="text-sm opacity-90">{label}</p>
                </motion.div>
            ))}
        </div>
    );
}
