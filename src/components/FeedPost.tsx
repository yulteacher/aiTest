// src/components/FeedPost.tsx
import { motion, useMotionValue, useTransform } from "framer-motion";
import { Heart, MessageCircle, Share2, Trash2, Edit2 } from "lucide-react";
import TeamAvatar from "../components/yului/TeamAvatar";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { toast } from "sonner";
import { Post } from "../types/interfaces";
import { useAppDataContext } from "../context/AppDataContext";

interface FeedPostProps {
  post: Post;
  index: number;
  onLike: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit?: (post: Post) => void;
  onPostClick?: (id: string) => void;
}

export default function FeedPost({
  post,
  index,
  onLike,
  onDelete,
  onEdit,
  onPostClick,
}: FeedPostProps) {
  const { currentUser } = useAppDataContext();

  // ✅ 작성자 판별
  const isMyPost =
    post.authorId === currentUser?.id ||
    post.user?.id === currentUser?.id ||
    post.isMine;

  // ✅ 관리자 권한
  const isAdmin =
    currentUser?.username === "admin" || currentUser?.id === "u_admin";

  // ✅ swipe 관련
  const x = useMotionValue(0);
  const opacity = useTransform(x, [-100, 0], [1, 0]);

  const handleDragEnd = (_: any, info: any) => {
    // ✋ 일반 사용자는 본인 글만 삭제
    if (!isMyPost && !isAdmin) {
      x.set(0);
      toast.error("본인 또는 관리자만 삭제할 수 있습니다!");
      return;
    }

    // 🧹 왼쪽으로 충분히 밀었을 때 삭제
    if (info.offset.x < -80) {
      onDelete(post.id);
      toast.success(
        isAdmin && !isMyPost
          ? "관리자 권한으로 게시글이 삭제되었습니다 🧹"
          : "게시글이 삭제되었습니다!"
      );
    } else {
      x.set(0);
    }
  };

  const handleCardClick = (e: any) => {
    if (e.target.closest("button")) return;
    onPostClick?.(post.id);
  };

  const handleShare = (e: any) => {
    e.stopPropagation();
    e.preventDefault();
    const shareText = `${post.user?.username || post.author}: ${post.content}`;
    if (navigator.share) {
      navigator
        .share({ title: "KBO 팬덤", text: shareText })
        .catch(() => { });
    } else {
      navigator.clipboard.writeText(shareText);
      toast.success("링크가 복사되었습니다!");
    }
  };

  return (
    <motion.div
      className="relative"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
    >
      {/* 🗑 삭제 배경 (본인 또는 관리자만 표시) */}
      {(isMyPost || isAdmin) && (
        <motion.div
          style={{ opacity }}
          className="absolute inset-0 flex items-center justify-end pr-6 bg-gradient-to-r from-red-600 to-rose-500 rounded-2xl text-white font-semibold select-none"
        >
          삭제 →
        </motion.div>
      )}

      {/* 🎯 카드 본체 */}
      <motion.div
        drag={isMyPost || isAdmin ? "x" : false}
        dragConstraints={{ left: -120, right: 0 }}
        dragElastic={0.2}
        onDragEnd={handleDragEnd}
        style={{ x }}
        className={`glass-card glass-card-hover rounded-2xl overflow-hidden cursor-pointer relative z-10 ${isMyPost || isAdmin ? "touch-pan-y" : "select-none"
          }`}
        onClick={handleCardClick}
      >
        <div className="p-4">
          {/* 작성자 */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <TeamAvatar
                team={post.user?.team?.name || post.team?.name}
                src={post.user?.avatar || post.avatar}
                size="md"
              />
              <div>
                <div className="font-medium text-gray-900 dark:text-gray-100">
                  {post.user?.username || post.author || "익명"}
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {post.timestamp}
                </p>
              </div>
            </div>

            {(isMyPost || isAdmin) && (
              <div className="flex gap-1">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit?.(post);
                  }}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors active:scale-95"
                >
                  <Edit2 className="w-4 h-4 text-blue-500 hover:text-blue-600" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete?.(post.id);
                  }}
                  className="p-2 hover:bg-red-100 dark:hover:bg-red-900/20 rounded-full transition-colors active:scale-95"
                >
                  <Trash2 className="w-4 h-4 text-rose-500 hover:text-rose-600" />
                </button>
              </div>
            )}
          </div>

          {/* 본문 */}
          {post.content && (
            <p className="text-gray-800 dark:text-gray-200 mb-3 whitespace-pre-line">
              {post.content}
            </p>
          )}

          {/* 이미지 */}
          {post.image && (
            <ImageWithFallback
              src={post.image}
              alt="게시글 이미지"
              className="w-full rounded-xl mb-3"
            />
          )}

          {/* 액션 */}
          <div className="flex items-center gap-6 pt-3 border-t border-gray-100 dark:border-gray-700">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onLike?.(post.id);
              }}
              className={`flex items-center gap-2 transition-colors active:scale-95 ${post.liked
                  ? "text-rose-500"
                  : "text-gray-600 dark:text-gray-400"
                }`}
            >
              <Heart
                className="w-5 h-5"
                fill={post.liked ? "currentColor" : "none"}
              />
              <span>{post.likes}</span>
            </button>

            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
              <MessageCircle className="w-5 h-5" />
              <span>{post.commentsList?.length || 0}</span>
            </div>

            <button
              onClick={handleShare}
              className="flex items-center gap-2 text-gray-600 dark:text-gray-400 ml-auto active:scale-95 transition-all"
            >
              <Share2 className="w-5 h-5" />
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
