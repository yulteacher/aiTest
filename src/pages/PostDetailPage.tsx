import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Heart, MessageCircle, Share2, ArrowLeft, Edit2, Trash2, Send } from 'lucide-react';
import { toast } from 'sonner';
import TeamLogo from '../components/yului/TeamLogo';
import TeamAvatar from '../components/yului/TeamAvatar';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { useAppDataContext } from "../context/AppDataContext";

interface PostDetailPageProps {
  postId: string | null;
  onBack: () => void;
  isDarkMode?: boolean;
  onToggleDarkMode?: () => void;
}

export default function PostDetailPage({ postId, onBack }: PostDetailPageProps) {
  const {
    currentUser,
    posts: contextPosts,
    updatePost,
    deletePost,
    addComment,
    updateComment,
    deleteComment,
  } = useAppDataContext();

  const [localPost, setLocalPost] = useState<any>(null);
  const [localPosts, setLocalPosts] = useState<any[]>([]);
  const [newComment, setNewComment] = useState("");
  const [editingComment, setEditingComment] = useState<string | null>(null);
  const [editCommentContent, setEditCommentContent] = useState("");
  const [isEditingPost, setIsEditingPost] = useState(false);
  const [editPostContent, setEditPostContent] = useState("");
  const [showShareMenu, setShowShareMenu] = useState(false);

  // ----------------------------
  // 초기 로드
  // ----------------------------
  useEffect(() => {
    window.scrollTo(0, 0);

    setLocalPosts(contextPosts);
    const found = contextPosts.find((p) => p.id === postId) || null;

    setLocalPost(found);
    if (found) {
      setEditPostContent(found.content);
    }
  }, [contextPosts, postId]);


  // ----------------------------
  // 좋아요
  // ----------------------------
  const handleLike = () => {
    if (!localPost) return;

    const updated = {
      ...localPost,
      isLiked: !localPost.isLiked,
      likes: localPost.isLiked ? localPost.likes - 1 : localPost.likes + 1,
    };

    updatePost(updated);
    setLocalPost(updated);
  };


  // ----------------------------
  // 댓글 추가
  // ----------------------------
  const handleAddComment = () => {
    if (!newComment.trim() || !localPost) return;

    const newCommentObj = {
      id: Date.now().toString(),
      authorId: currentUser?.id || null,
      author: currentUser?.username || "익명",
      avatar: currentUser?.avatar || "/images/default_avatar.png",
      content: newComment,
      timestamp: "방금 전",
    };

    addComment(localPost.id, newCommentObj);

    setNewComment("");
    toast.success("댓글 작성 완료!");
  };


  // ----------------------------
  // 댓글 삭제
  // ----------------------------
  const handleDeleteComment = (commentId: string) => {
    if (!localPost) return;

    if (!window.confirm("댓글을 삭제할까요?")) return;

    deleteComment(localPost.id, commentId);
    toast.success("댓글이 삭제되었습니다.");
  };


  // ----------------------------
  // 댓글 수정
  // ----------------------------
  const handleEditComment = (commentId: string) => {
    if (!localPost) return;

    updateComment(
      localPost.id,
      commentId,
      {
        id: commentId,
        authorId: currentUser?.id || "",
        author: currentUser?.username || "익명",
        avatar: currentUser?.avatar,
        content: editCommentContent,
        timestamp: "방금 전 (수정됨)",
      }
    );

    setEditingComment(null);
    setEditCommentContent("");
    toast.success("댓글이 수정되었습니다.");
  };


  // ----------------------------
  // 게시글 수정
  // ----------------------------
  const handleEditPost = () => {
    if (!localPost || !editPostContent.trim()) return;

    const updated = {
      ...localPost,
      content: editPostContent,
      timestamp: "방금 전 (수정됨)",
    };

    updatePost(updated);
    setLocalPost(updated);
    setIsEditingPost(false);

    toast.success("게시글을 수정했습니다.");
  };


  // ----------------------------
  // 게시글 삭제
  // ----------------------------
  const handleDeletePost = () => {
    if (!localPost) return;

    if (!window.confirm("이 게시글을 삭제할까요?")) return;

    deletePost(localPost.id);
    toast.success("게시글이 삭제되었습니다.");
    onBack();
  };


  if (!localPost) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>게시글이 없습니다.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-20">
      <div className="max-w-2xl mx-auto px-4 py-6">
        {/* 📝 게시글 카드 */}
        <motion.div className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-lg mb-6">

          {/* 작성자 */}
          <div className="flex items-center gap-3 mb-4">
            <TeamAvatar src={localPost.avatar} size="lg" team={localPost.team?.name} />
            <div className="flex-1">
              <p className="font-medium">{localPost.author}</p>
              <span className="text-sm text-gray-500">{localPost.timestamp}</span>
            </div>

            {/* 수정 삭제 버튼 */}
            {localPost.author === currentUser?.username && (
              <div className="flex gap-2">
                <button onClick={() => setIsEditingPost(true)}>
                  <Edit2 />
                </button>
                <button onClick={handleDeletePost}>
                  <Trash2 className="text-red-500" />
                </button>
              </div>
            )}
          </div>

          {/* 게시글 내용 */}
          {isEditingPost ? (
            <div className="space-y-3 mb-4">
              <textarea
                value={editPostContent}
                onChange={(e) => setEditPostContent(e.target.value)}
                className="w-full p-3 bg-gray-100 rounded-xl"
                rows={4}
              />
              <div className="flex justify-end gap-2">
                <button onClick={() => setIsEditingPost(false)}>취소</button>
                <button onClick={handleEditPost}>저장</button>
              </div>
            </div>
          ) : (
            <p className="mb-4 whitespace-pre-wrap">{localPost.content}</p>
          )}

          {/* 이미지 */}
          {localPost.image && (
            <ImageWithFallback src={localPost.image} className="w-full rounded-2xl mb-4" />
          )}

          {/* 🧡 좋아요 댓글 */}
          <div className="flex items-center gap-6 border-t pt-3">
            <button onClick={handleLike} className="flex items-center gap-2">
              <Heart className="w-5" fill={localPost.isLiked ? "currentColor" : "none"} />
              {localPost.likes}
            </button>

            <div className="flex items-center gap-2">
              <MessageCircle className="w-5" />
              {localPost.commentsList?.length || 0}
            </div>
          </div>

        </motion.div>

        {/* 💬 댓글 섹션 */}
        <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-lg">
          <h3 className="mb-4">댓글 {localPost.commentsList?.length || 0}개</h3>

          {/* 입력 */}
          <div className="flex gap-2 mb-6">
            <input
              className="flex-1 p-3 bg-gray-100 rounded-xl"
              placeholder="댓글 작성..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAddComment()}
            />
            <button onClick={handleAddComment} className="p-3 bg-slate-600 text-white rounded-xl">
              <Send />
            </button>
          </div>

          {/* 댓글 */}
          <div className="space-y-4">
            {localPost.commentsList?.map((comment) => (
              <motion.div key={comment.id} className="bg-gray-100 p-4 rounded-xl">

                {editingComment === comment.id ? (
                  <>
                    <textarea
                      className="w-full p-2 bg-white rounded"
                      rows={2}
                      value={editCommentContent}
                      onChange={(e) => setEditCommentContent(e.target.value)}
                    />
                    <div className="flex justify-end gap-2 mt-2">
                      <button onClick={() => setEditingComment(null)}>취소</button>
                      <button onClick={() => handleEditComment(comment.id)}>저장</button>
                    </div>
                  </>
                ) : (
                  <div className="flex gap-3">
                    <TeamAvatar src={comment.avatar} size="md" />
                    <div className="flex-1">
                      <p className="font-medium">{comment.author}</p>
                      <p>{comment.content}</p>
                    </div>

                    {comment.author === currentUser?.username && (
                      <div className="flex gap-1">
                        <button onClick={() => {
                          setEditingComment(comment.id);
                          setEditCommentContent(comment.content);
                        }}>
                          <Edit2 />
                        </button>
                        <button onClick={() => handleDeleteComment(comment.id)}>
                          <Trash2 className="text-red-500" />
                        </button>
                      </div>
                    )}
                  </div>
                )}

              </motion.div>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
}
