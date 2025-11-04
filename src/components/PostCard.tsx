// src/components/PostCard.tsx
import { motion } from 'framer-motion';
import { Heart, MessageCircle, Share2, Trash2 } from 'lucide-react';
import TeamAvatar from './TeamAvatar';
import TeamLogo from './TeamLogo';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { toast } from 'sonner';

export default function PostCard({ post, index, onLike, onDelete, onPostClick }) {

    return (
        <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="glass-card rounded-2xl overflow-hidden cursor-pointer"
        >
            <div className="p-4">
                {/* 작성자 */}
                <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                        <TeamAvatar team={post.team?.name} src={post.avatar} size="md" />
                        <div>
                            <div className="font-medium text-gray-900">{post.author}</div>
                            <p className="text-xs text-gray-500">{post.timestamp}</p>
                            {post.team && (
                                <div className="flex items-center gap-1 mt-1 text-xs text-gray-400">
                                    <TeamLogo team={post.team} size="xs" />
                                    <span>{post.team.name}</span>
                                </div>
                            )}
                        </div>
                    </div>
                    <button
                        onClick={() => onDelete(post.id)}
                        className="p-2 hover:bg-red-100 rounded-full transition-colors"
                    >
                        <Trash2 className="w-4 h-4 text-red-500" />
                    </button>
                </div>

                {/* 내용 */}
                <p className="text-gray-800 mb-3">{post.content}</p>

                {/* 이미지 */}
                {post.image && (
                    <ImageWithFallback
                        src={post.image}
                        alt="Post"
                        className="w-full rounded-xl mb-3"
                    />
                )}

                {/* 액션 */}
                <div className="flex items-center gap-6 pt-3 border-t border-gray-100">
                    <button
                        onClick={() => onLike(post.id)}
                        className={`flex items-center gap-2 ${post.liked ? 'text-rose-500' : 'text-gray-600'
                            }`}
                    >
                        <Heart
                            className="w-5 h-5"
                            fill={post.liked ? 'currentColor' : 'none'}
                        />
                        <span>{post.likes}</span>
                    </button>

                    <div className="flex items-center gap-2 text-gray-600">
                        <MessageCircle className="w-5 h-5" />
                        <span>{post.commentsList?.length || 0}</span>
                    </div>

                    <button
                        onClick={() =>
                            navigator.share
                                ? navigator.share({
                                    title: 'KBO 팬덤',
                                    text: `${post.author}: ${post.content}`,
                                })
                                : toast.success('링크가 복사되었습니다!')
                        }
                        className="flex items-center gap-2 text-gray-600 ml-auto"
                    >
                        <Share2 className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </motion.div>
    );
}


