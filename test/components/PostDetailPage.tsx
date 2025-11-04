import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Heart, MessageCircle, Share2, ArrowLeft, Edit2, Trash2, Send, Check, X, Moon, Sun } from 'lucide-react';
import { toast } from 'sonner';
import TeamLogo from './TeamLogo';
import TeamAvatar from './TeamAvatar';
import { ImageWithFallback } from './figma/ImageWithFallback';

export default function PostDetailPage({ postId, onBack, isDarkMode, onToggleDarkMode }) {
  const [post, setPost] = useState(null);
  const [posts, setPosts] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [editingComment, setEditingComment] = useState(null);
  const [editCommentContent, setEditCommentContent] = useState('');
  const [isEditingPost, setIsEditingPost] = useState(false);
  const [editPostContent, setEditPostContent] = useState('');
  const [showShareMenu, setShowShareMenu] = useState(false);

  useEffect(() => {
    // 스크롤을 최상단으로
    window.scrollTo(0, 0);
    
    const savedPosts = localStorage.getItem('posts');
    if (savedPosts) {
      const parsedPosts = JSON.parse(savedPosts);
      setPosts(parsedPosts);
      const foundPost = parsedPosts.find(p => p.id === postId);
      setPost(foundPost);
      if (foundPost) {
        setEditPostContent(foundPost.content);
      }
    }
  }, [postId]);

  const handleLike = () => {
    const updatedPosts = posts.map(p => {
      if (p.id === postId) {
        return { ...p, isLiked: !p.isLiked, likes: p.isLiked ? p.likes - 1 : p.likes + 1 };
      }
      return p;
    });
    setPosts(updatedPosts);
    localStorage.setItem('posts', JSON.stringify(updatedPosts));
    const updatedPost = updatedPosts.find(p => p.id === postId);
    setPost(updatedPost);
  };

  const handleAddComment = () => {
    if (!newComment.trim()) return;

    const comment = {
      id: Date.now().toString(),
      author: '나',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop',
      content: newComment,
      timestamp: '방금 전'
    };

    const updatedPosts = posts.map(p => {
      if (p.id === postId) {
        return {
          ...p,
          commentsList: [...(p.commentsList || []), comment],
          comments: (p.comments || 0) + 1
        };
      }
      return p;
    });

    setPosts(updatedPosts);
    localStorage.setItem('posts', JSON.stringify(updatedPosts));
    const updatedPost = updatedPosts.find(p => p.id === postId);
    setPost(updatedPost);
    setNewComment('');
    toast.success('댓글이 작성되었습니다');
  };

  const handleDeleteComment = (commentId) => {
    if (window.confirm('이 댓글을 삭제하시겠습니까?')) {
      const updatedPosts = posts.map(p => {
        if (p.id === postId) {
          return {
            ...p,
            commentsList: p.commentsList.filter(c => c.id !== commentId),
            comments: (p.comments || 0) - 1
          };
        }
        return p;
      });

      setPosts(updatedPosts);
      localStorage.setItem('posts', JSON.stringify(updatedPosts));
      const updatedPost = updatedPosts.find(p => p.id === postId);
      setPost(updatedPost);
      toast.success('댓글이 삭제되었습니다');
    }
  };

  const handleEditComment = (commentId) => {
    const updatedPosts = posts.map(p => {
      if (p.id === postId) {
        return {
          ...p,
          commentsList: p.commentsList.map(c => 
            c.id === commentId ? { ...c, content: editCommentContent, timestamp: '방금 전 (수정됨)' } : c
          )
        };
      }
      return p;
    });

    setPosts(updatedPosts);
    localStorage.setItem('posts', JSON.stringify(updatedPosts));
    const updatedPost = updatedPosts.find(p => p.id === postId);
    setPost(updatedPost);
    setEditingComment(null);
    setEditCommentContent('');
    toast.success('댓글이 수정되었습니다');
  };

  const handleEditPost = () => {
    if (!editPostContent.trim()) return;

    const updatedPosts = posts.map(p => {
      if (p.id === postId) {
        return { ...p, content: editPostContent, timestamp: '방금 전 (수정됨)' };
      }
      return p;
    });

    setPosts(updatedPosts);
    localStorage.setItem('posts', JSON.stringify(updatedPosts));
    const updatedPost = updatedPosts.find(p => p.id === postId);
    setPost(updatedPost);
    setIsEditingPost(false);
    toast.success('게시글이 수정되었습니다');
  };

  const handleDeletePost = () => {
    if (window.confirm('이 게시글을 삭제하시겠습니까?')) {
      const updatedPosts = posts.filter(p => p.id !== postId);
      setPosts(updatedPosts);
      localStorage.setItem('posts', JSON.stringify(updatedPosts));
      toast.success('게시글이 삭제되었습니다');
      onBack();
    }
  };

  const handleShare = () => {
    const shareText = `${post.author}: ${post.content}`;
    if (navigator.share) {
      navigator.share({ title: 'KBO 팬덤', text: shareText }).catch(() => {
        try {
          // Fallback for clipboard
          const textArea = document.createElement('textarea');
          textArea.value = shareText;
          textArea.style.position = 'fixed';
          textArea.style.left = '-999999px';
          document.body.appendChild(textArea);
          textArea.select();
          document.execCommand('copy');
          document.body.removeChild(textArea);
          toast.success('링크가 복사되었습니다!');
        } catch (err) {
          toast.error('복사에 실패했습니다');
        }
      });
    } else {
      try {
        // Fallback for clipboard
        const textArea = document.createElement('textarea');
        textArea.value = shareText;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        toast.success('링크가 복사되었습니다!');
      } catch (err) {
        toast.error('복사에 실패했습니다');
      }
    }
    setShowShareMenu(false);
  };

  if (!post) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <p className="text-gray-600 dark:text-gray-400">게시글을 찾을 수 없습니다.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-20">
      <div className="max-w-2xl mx-auto px-4 py-6">
        {/* 게시글 내용 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-lg mb-6"
        >
          {/* 작성자 정보 */}
          <div className="flex items-center gap-3 mb-4">
            <TeamAvatar
              team={post.team?.name}
              src={post.avatar}
              size="lg"
            />
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="font-medium text-gray-900 dark:text-gray-100">{post.author}</span>
                {post.team && <TeamLogo team={post.team} size="sm" />}
              </div>
              <span className="text-sm text-gray-500 dark:text-gray-400">{post.timestamp}</span>
            </div>
            {post.author === '나' && (
              <div className="flex gap-2">
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setIsEditingPost(true)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
                >
                  <Edit2 className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                </motion.button>
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={handleDeletePost}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
                >
                  <Trash2 className="w-4 h-4 text-red-500" />
                </motion.button>
              </div>
            )}
          </div>

          {/* 게시글 내용 */}
          {isEditingPost ? (
            <div className="space-y-3 mb-4">
              <textarea
                value={editPostContent}
                onChange={(e) => setEditPostContent(e.target.value)}
                className="w-full bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-slate-500"
                rows={4}
                autoFocus
              />
              <div className="flex gap-2 justify-end">
                <button
                  onClick={() => {
                    setIsEditingPost(false);
                    setEditPostContent(post.content);
                  }}
                  className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl"
                >
                  취소
                </button>
                <button
                  onClick={handleEditPost}
                  className="px-4 py-2 bg-slate-600 text-white rounded-xl hover:bg-slate-700"
                >
                  저장
                </button>
              </div>
            </div>
          ) : (
            <p className="text-gray-800 dark:text-gray-200 mb-4 whitespace-pre-wrap">{post.content}</p>
          )}

          {/* 이미지 */}
          {post.image && (
            <ImageWithFallback
              src={post.image}
              alt="Post"
              className="w-full rounded-2xl mb-4"
            />
          )}

          {/* 액션 버튼 */}
          <div className="flex items-center gap-6 pt-3 border-t border-gray-100 dark:border-gray-700">
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={handleLike}
              className={`flex items-center gap-2 ${
                post.isLiked ? 'text-red-500' : 'text-gray-600 dark:text-gray-400'
              }`}
            >
              <Heart className="w-5 h-5" fill={post.isLiked ? 'currentColor' : 'none'} />
              <span>{post.likes}</span>
            </motion.button>

            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
              <MessageCircle className="w-5 h-5" />
              <span>{post.commentsList?.length || 0}</span>
            </div>

            <div className="relative ml-auto">
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => setShowShareMenu(!showShareMenu)}
                className="flex items-center gap-2 text-gray-600 dark:text-gray-400"
              >
                <Share2 className="w-5 h-5" />
              </motion.button>

              {showShareMenu && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="absolute right-0 top-8 bg-white dark:bg-gray-700 rounded-xl shadow-lg p-2 min-w-[120px] z-10"
                >
                  <button
                    onClick={handleShare}
                    className="w-full text-left px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg text-sm text-gray-900 dark:text-gray-100"
                  >
                    공유하기
                  </button>
                </motion.div>
              )}
            </div>
          </div>
        </motion.div>

        {/* 댓글 섹션 */}
        <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-lg">
          <h3 className="text-gray-900 dark:text-gray-100 mb-4">
            댓글 {post.commentsList?.length || 0}개
          </h3>

          {/* 댓글 입력 */}
          <div className="mb-6">
            <div className="flex gap-2">
              <input
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddComment()}
                placeholder="댓글을 입력하세요..."
                className="flex-1 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-slate-500"
              />
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={handleAddComment}
                disabled={!newComment.trim()}
                className="p-3 bg-slate-600 text-white rounded-xl hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="w-5 h-5" />
              </motion.button>
            </div>
          </div>

          {/* 댓글 목록 */}
          <div className="space-y-4">
            {post.commentsList?.map((comment) => (
              <motion.div
                key={comment.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4"
              >
                {editingComment === comment.id ? (
                  <div className="space-y-2">
                    <textarea
                      value={editCommentContent}
                      onChange={(e) => setEditCommentContent(e.target.value)}
                      className="w-full bg-white dark:bg-gray-600 text-gray-900 dark:text-gray-100 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-500"
                      rows={2}
                      autoFocus
                    />
                    <div className="flex gap-2 justify-end">
                      <button
                        onClick={() => {
                          setEditingComment(null);
                          setEditCommentContent('');
                        }}
                        className="px-3 py-1 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg"
                      >
                        취소
                      </button>
                      <button
                        onClick={() => handleEditComment(comment.id)}
                        className="px-3 py-1 text-sm bg-slate-600 text-white rounded-lg hover:bg-slate-700"
                      >
                        저장
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-start gap-3">
                    <TeamAvatar
                      team={comment.team?.name}
                      src={comment.avatar}
                      size="md"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-gray-900 dark:text-gray-100">{comment.author}</span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">{comment.timestamp}</span>
                      </div>
                      <p className="text-gray-800 dark:text-gray-200">{comment.content}</p>
                    </div>
                    {comment.author === '나' && (
                      <div className="flex gap-1">
                        <motion.button
                          whileTap={{ scale: 0.9 }}
                          onClick={() => {
                            setEditingComment(comment.id);
                            setEditCommentContent(comment.content);
                          }}
                          className="p-1.5 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-full transition-colors"
                        >
                          <Edit2 className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                        </motion.button>
                        <motion.button
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleDeleteComment(comment.id)}
                          className="p-1.5 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-full transition-colors"
                        >
                          <Trash2 className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                        </motion.button>
                      </div>
                    )}
                  </div>
                )}
              </motion.div>
            ))}

            {(!post.commentsList || post.commentsList.length === 0) && (
              <p className="text-center text-gray-500 dark:text-gray-400 py-8">
                첫 번째 댓글을 작성해보세요!
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
