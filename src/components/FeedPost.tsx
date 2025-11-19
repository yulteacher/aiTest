// src/components/FeedPost.tsx
import { useRef } from "react";
import { motion, useMotionValue, useTransform } from "framer-motion";
import { Heart, MessageCircle, Share2, Trash2, Edit2 } from "lucide-react";
import TeamAvatar from "../components/yului/TeamAvatar";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { toast } from "sonner";
import { Post } from "../types/interfaces";
import { useAppDataContext } from "../context/AppDataContext";
import TeamLogo from "./yului/TeamLogo";
interface FeedPostProps {
  post: Post;
  index: number;
  onPostClick?: (id: string) => void;
  onEdit?: (post: Post) => void;
  onDelete?: (id: string) => void;
}

export default function FeedPost({
  post,
  index,
  onPostClick,
  onEdit,
  onDelete,
}: FeedPostProps) {
  const { currentUser, updatePost } = useAppDataContext();

  /* ==========================================
     🔐 본인 글 여부 (수정/삭제 권한)
  ========================================== */
  const isMyPost =
    post.authorId === currentUser?.id ||
    post.user?.id === currentUser?.id ||
    post.isMine === true;

  /* ==========================================
     🗑 삭제 드래그 처리
  ========================================== */
  const x = useMotionValue(0);
  const opacity = useTransform(x, [-100, 0], [1, 0]);
  const isDraggingRef = useRef(false);
  const isDeletingRef = useRef(false);

  const handleDragEnd = (_event: any, info: any) => {
    setTimeout(() => { isDraggingRef.current = false; }, 100);

    // 🔥 본인 글만 삭제 가능
    if (!isMyPost) {
      x.set(0);
      toast.error("본인이 작성한 글만 삭제할 수 있습니다!");
      return;
    }

    // 실제 삭제
    if (info.offset.x < -80) {
      if (isDeletingRef.current) return; // 이미 삭제 진행 중이면 무시

      if (window.confirm("이 게시글을 삭제하시겠습니까?")) {
        isDeletingRef.current = true;
        onDelete?.(post.id);
      } else {
        x.set(0);
      }
    } else {
      x.set(0);
    }
  };

  /* ==========================================
     ❤️ 좋아요
  ========================================== */
  /* ==========================================
     ❤️ 좋아요 (동기화 수정)
  ========================================== */
  const isLiked = post.likedUserIds?.includes(currentUser?.id || "") || false;

  const handleLike = (e: any) => {
    e.stopPropagation();
    if (!currentUser) return toast.error("로그인이 필요합니다!");

    const currentLiked = post.likedUserIds?.includes(currentUser.id);
    const newLikedUserIds = currentLiked
      ? post.likedUserIds?.filter((id) => id !== currentUser.id)
      : [...(post.likedUserIds || []), currentUser.id];

    const updated: Post = {
      ...post,
      likedUserIds: newLikedUserIds,
      likes: currentLiked ? post.likes - 1 : post.likes + 1,
      liked: !currentLiked, // deprecated
      isLiked: !currentLiked, // deprecated
    };

    updatePost(updated);
  };

  /* ==========================================
     📤 공유
  ========================================== */
  const handleShare = (e: any) => {
    e.stopPropagation();

    const shareText = `${post.user?.username || post.author}: ${post.content}`;

    if (navigator.share) {
      navigator.share({ title: "KBO 팬덤", text: shareText }).catch(() => { });
    } else {
      navigator.clipboard.writeText(shareText);
      toast.success("링크가 복사되었습니다!");
    }
  };

  /* ==========================================
     📄 상세 보기
  ========================================== */
  const handleCardClick = (e: any) => {
    if (isDraggingRef.current) return;
    if (e.target.closest("button")) return; // 버튼 클릭 시 상세 이동 방지
    onPostClick?.(post.id);
  };

  return (
    <motion.div
      className="relative"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
    >
      {/* 뒤쪽 삭제 레이어 */}
      {isMyPost && (
        <motion.div
          style={{ opacity }}
          className="absolute inset-0 flex items-center justify-end px-6
          bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 font-bold rounded-2xl select-none"
        >
          <Trash2 className="w-6 h-6" />
        </motion.div>
      )}

      {/* 앞쪽 카드 */}
      <motion.div
        drag={isMyPost ? "x" : false}
        onDragStart={() => { isDraggingRef.current = true; }}
        dragConstraints={{ left: -120, right: 0 }}
        dragElastic={0.2}
        onDragEnd={handleDragEnd}
        style={{ x }}
        onClick={handleCardClick}
        className="glass-card glass-card-hover rounded-2xl overflow-hidden cursor-pointer relative z-10"
      >
        <div className="p-4">
          {/* ===============================
              👤 헤더 (아바타 / 작성자 / 시간)
          =============================== */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <TeamAvatar
                team={post.user?.team?.name || post.team?.name}
                src={post.user?.avatar || post.avatar}
                size="md"
              />

              <div>
                <div className="font-medium">
                  {post.user?.username || post.author}
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {post.timestamp}
                </p>
              </div>
            </div>


            {/* Right Side: Team Logo + Buttons */}
            <div className="flex items-center gap-2">
              {/* 🔥 팀 로고 (내 글일 땐 로고만, 남의 글일 땐 이름+로고) */}
              {(post.team || post.user?.team) && (
                <div className="flex items-center gap-2">
                  {!isMyPost && (
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {(post.user?.team?.name || post.team?.name) ?? ""}
                    </span>
                  )}
                  <TeamLogo team={post.user?.team || post.team} size="sm" />
                </div>
              )}

              {/* 수정 / 삭제 버튼(본인만 가능) */}
              {isMyPost && (
                <div className="flex gap-1 ml-1">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onEdit?.(post);
                    }}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
                  >
                    <Edit2 className="w-4 h-4 text-blue-500" />
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete?.(post.id);
                    }}
                    className="p-2 hover:bg-red-100 dark:hover:bg-red-900/20 rounded-full"
                  >
                    <Trash2 className="w-4 h-4 text-rose-500" />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* ===============================
              📝 글 내용
          =============================== */}
          {post.content && (
            <p className="mb-3 whitespace-pre-line text-gray-800 dark:text-gray-200">
              {post.content}
            </p>
          )}

          {/* ===============================
              🖼 이미지
          =============================== */}
          {post.image && (
            <ImageWithFallback
              src={post.image}
              alt="게시글 이미지"
              className="w-full rounded-xl mb-3"
            />
          )}

          {/* ===============================
              ❤️ 액션 버튼
          =============================== */}
          <div className="flex items-center gap-6 pt-3 border-t border-gray-100 dark:border-gray-700">
            {/* 좋아요 */}
            <button
              onClick={handleLike}
              className={`flex items-center gap-2 ${isLiked ? "text-rose-500" : "text-gray-600 dark:text-gray-400"
                }`}
            >
              <Heart className="w-5 h-5" fill={isLiked ? "currentColor" : "none"} />
              <span>{post.likes}</span>
            </button>

            {/* 댓글 수 */}
            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
              <MessageCircle className="w-5 h-5" />
              <span>{post.commentsList?.length || 0}</span>
            </div>

            {/* 공유 */}
            <button
              onClick={handleShare}
              className="flex items-center gap-2 text-gray-600 dark:text-gray-400 ml-auto"
            >
              <Share2 className="w-5 h-5" />
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div >
  );
}
