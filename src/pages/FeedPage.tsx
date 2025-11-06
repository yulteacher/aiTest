import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Heart, MessageCircle, Share2, Image as ImageIcon, Trash2, Edit2 } from "lucide-react";
import { ImageWithFallback } from "../components/figma/ImageWithFallback.js";
import Confetti from "../components/Confetti.js";
import TeamSelector from "../components/TeamSelector.js";
import TeamAvatar from "../components/yului/TeamAvatar.js";
import { toast } from "sonner";
import { dummyPostsData } from "../data/dummyPosts.js"; // ✅ 더미 데이터 import

export default function FeedPage({ onPostClick }) {
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState("");
  const [newPostImage, setNewPostImage] = useState("");
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [newPostTeam, setNewPostTeam] = useState(null);
  const [editingPost, setEditingPost] = useState(null);
  const [editContent, setEditContent] = useState("");
  const [editTeam, setEditTeam] = useState(null);

  // ✅ 초기 더미 데이터 생성
  useEffect(() => {
    const teams = dummyPostsData.teams;
    const postTemplates = dummyPostsData.postTemplates;
    const avatars = dummyPostsData.avatars;
    const images = dummyPostsData.images;
    const timestamps = dummyPostsData.timestamps;

    const savedPosts = localStorage.getItem("posts");
    if (savedPosts) {
      const parsedPosts = JSON.parse(savedPosts);
      const updatedPosts = parsedPosts.map((post) =>
        post.team
          ? post
          : { ...post, team: teams[Math.floor(Math.random() * teams.length)] }
      );
      setPosts(updatedPosts);
      localStorage.setItem("posts", JSON.stringify(updatedPosts));
    } else {
      const initialPosts = [];
      let postId = 1;

      // ✅ 팀별로 고유 이미지 + 콘텐츠 생성
      teams.forEach((team) => {
        const teamImages = images[team.id] || [];
        console.log("📸 team.id:", team.id, "이미지 배열:", images[team.id]);

        postTemplates.forEach((template, idx) => {
          const post = {
            id: postId.toString(),
            author: `${team.name} 팬${idx + 1}`,
            avatar: avatars[idx % avatars.length],
            content: template.content,
            team,
            image: template.hasImage
              ? teamImages[idx % teamImages.length]
              : undefined,
            likes: Math.floor(Math.random() * 500) + 10,
            timestamp: timestamps[idx % timestamps.length],
            liked: Math.random() > 0.7,
            commentsList: [],
          };
          initialPosts.push(post);
          postId++;
        });
      });

      initialPosts.sort(() => Math.random() - 0.5);
      setPosts(initialPosts);
      localStorage.setItem("posts", JSON.stringify(initialPosts));
    }
  }, []);

  // ❤️ 좋아요
  const handleLike = (postId) => {
    const updatedPosts = posts.map((post) => {
      if (post.id === postId) {
        const isLiking = !post.liked;
        if (isLiking) {
          setShowConfetti(true);
          setTimeout(() => setShowConfetti(false), 2000);
        }
        return {
          ...post,
          liked: !post.liked,
          likes: post.liked ? post.likes - 1 : post.likes + 1,
        };
      }
      return post;
    });
    setPosts(updatedPosts);
    localStorage.setItem("posts", JSON.stringify(updatedPosts));
  };

  // 🗑 삭제
  const handleDelete = (postId) => {
    if (window.confirm("이 게시글을 삭제하시겠습니까?")) {
      const updatedPosts = posts.filter((post) => post.id !== postId);
      setPosts(updatedPosts);
      localStorage.setItem("posts", JSON.stringify(updatedPosts));
      toast.success("게시글이 삭제되었습니다");
    }
  };

  // 🖼 이미지 업로드
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setNewPostImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  // ✏️ 게시글 작성
  const handleCreatePost = () => {
    if (!newPost.trim()) return;

    const post = {
      id: Date.now().toString(),
      author: "나",
      avatar:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop",
      content: newPost,
      team: newPostTeam,
      image: newPostImage || undefined,
      likes: 0,
      timestamp: "방금 전",
      liked: false,
      commentsList: [],
    };

    const updatedPosts = [post, ...posts];
    setPosts(updatedPosts);
    localStorage.setItem("posts", JSON.stringify(updatedPosts));
    setNewPost("");
    setNewPostImage("");
    setNewPostTeam(null);
    setShowCreatePost(false);
    setSelectedTeam(null);
    toast.success("게시글이 작성되었습니다!");
  };

  const filteredPosts = selectedTeam
    ? posts.filter((post) => post.team?.id === selectedTeam.id)
    : posts;

  return (
    <div className="p-4 space-y-4">
      {showConfetti && <Confetti />}

      {/* 🧢 구단 필터 */}
      <div className="relative z-40">
        <TeamSelector
          selectedTeam={selectedTeam}
          onSelectTeam={setSelectedTeam}
          showAll={true}
        />
      </div>

      {/* ✍️ 게시글 작성 */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card rounded-2xl p-4 relative z-30"
      >
        {!showCreatePost ? (
          <motion.button
            onClick={() => setShowCreatePost(true)}
            className="w-full text-left text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-400 transition-colors"
            whileTap={{ scale: 0.98 }}
          >
            무슨 생각을 하고 계신가요?
          </motion.button>
        ) : (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
            <textarea
              value={newPost}
              onChange={(e) => setNewPost(e.target.value)}
              placeholder="무슨 생각을 하고 계신가요?"
              className="w-full bg-transparent text-gray-900 dark:text-gray-100 resize-none focus:outline-none px-2 py-2"
              rows={3}
              autoFocus
            />

            {/* 구단 선택 */}
            <div className="px-2">
              <TeamSelector
                selectedTeam={newPostTeam}
                onSelectTeam={setNewPostTeam}
                showAll={false}
                label="구단 선택 (선택사항)"
              />
            </div>

            {/* 이미지 미리보기 */}
            {newPostImage && (
              <div className="px-2 relative">
                <ImageWithFallback
                  src={newPostImage}
                  alt="업로드된 이미지"
                  className="w-full max-h-64 object-cover rounded-lg"
                />
                <button
                  onClick={() => setNewPostImage("")}
                  className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white p-1.5 rounded-full transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            )}

            <div className="flex items-center justify-between">
              <label className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors cursor-pointer">
                <ImageIcon
                  className={`w-5 h-5 ${newPostImage
                    ? "text-teal-600 dark:text-[#00d5be]"
                    : "text-gray-500"
                    }`}
                />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setShowCreatePost(false);
                    setNewPost("");
                    setNewPostImage("");
                    setNewPostTeam(null);
                  }}
                  className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/10 rounded-full transition-colors"
                >
                  취소
                </button>
                <button
                  onClick={handleCreatePost}
                  disabled={!newPost.trim()}
                  className="px-4 py-2 bg-gradient-to-r from-teal-500 to-cyan-500 dark:from-[#00d5be] dark:to-[#00b8db] text-white rounded-full hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  게시
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </motion.div>

      {/* 📢 게시글 목록 */}
      {filteredPosts.map((post, index) => (
        <PostCard
          key={post.id}
          post={post}
          index={index}
          onLike={handleLike}
          onDelete={handleDelete}
          onPostClick={onPostClick}
        />
      ))}
    </div>
  );
}

/* ✅ 기존 PostCard 그대로 사용 */
function PostCard({ post, index, onLike, onDelete, onPostClick }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="glass-card glass-card-hover rounded-2xl overflow-hidden cursor-pointer"
      onClick={() => onPostClick?.(post.id)}
    >
      <div className="p-4">
        <div className="flex items-center gap-3 mb-2">
          <TeamAvatar team={post.team?.name} src={post.avatar} size="md" />
          <div>
            <div className="font-medium text-gray-900 dark:text-gray-100">
              {post.author}
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {post.timestamp}
            </p>
          </div>
        </div>

        <p className="text-gray-800 dark:text-gray-200 mb-3">{post.content}</p>

        {post.image && (
          <ImageWithFallback
            src={post.image}
            alt="Post"
            className="w-full rounded-xl mb-3"
          />
        )}

        <div className="flex items-center gap-6 pt-3 border-t border-gray-100 dark:border-gray-700">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onLike(post.id);
            }}
            className={`flex items-center gap-2 transition-colors active:scale-95 ${post.liked ? "text-rose-500" : "text-gray-600 dark:text-gray-400"
              }`}
          >
            <Heart
              className="w-5 h-5"
              fill={post.liked ? "currentColor" : "none"}
            />
            <span>{post.likes}</span>
          </button>

          <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 ml-auto">
            <MessageCircle className="w-5 h-5" />
            <span>{post.commentsList?.length || 0}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
