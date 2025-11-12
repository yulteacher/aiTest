// src/pages/FeedPage.tsx
import { useState } from "react";
import { motion } from "framer-motion";
import { Image as ImageIcon } from "lucide-react";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import Confetti from "../components/Confetti";
import TeamSelector from "../components/TeamSelector";
import { toast } from "sonner";
import { useAppDataContext } from "../context/AppDataContext";
import { Post } from "../types/interfaces";
import FeedPost from "../components/FeedPost";

export default function FeedPage({ onPostClick }) {
  const { currentUser, posts, setPosts } = useAppDataContext();

  const [newPost, setNewPost] = useState("");
  const [newImage, setNewImage] = useState<string | null>(null);
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState<any>(null);
  const [newPostTeam, setNewPostTeam] = useState<any>(null);
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  /* ❤️ 좋아요 */
  const handleLike = (postId: string) => {
    const updated = posts.map((post) => {
      if (post.id === postId) {
        const isLiked = !post.liked;
        if (isLiked) {
          setShowConfetti(true);
          setTimeout(() => setShowConfetti(false), 1500);
        }
        return { ...post, liked: isLiked, likes: isLiked ? post.likes + 1 : post.likes - 1 };
      }
      return post;
    });
    setPosts(updated);
    localStorage.setItem("posts", JSON.stringify(updated));
  };

  /* 🗑 삭제 */
  const handleDelete = (postId: string) => {
    if (!window.confirm("이 게시글을 삭제하시겠습니까?")) return;
    const updated = posts.filter((p) => p.id !== postId);
    setPosts(updated);
    localStorage.setItem("posts", JSON.stringify(updated));
    toast.success("게시글이 삭제되었습니다!");
  };

  /* 🖼 이미지 업로드 */
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setNewImage(reader.result as string);
    reader.readAsDataURL(file);
  };

  /* ✏️ 새 글 작성 */
  const handleCreatePost = () => {
    if (!newPost.trim()) return toast.error("내용을 입력해주세요!");
    if (!currentUser) return toast.error("로그인 후 작성 가능합니다!");

    const userTeam =
      newPostTeam ||
      currentUser.team ||
      { id: currentUser.teamId || "etc", name: currentUser.team?.name || "기타" };

    const post: Post = {
      id: Date.now().toString(),
      author: currentUser.username,
      authorId: currentUser.id,
      avatar:
        currentUser.avatar ||
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100",
      content: newPost,
      image: newImage || undefined,
      team: userTeam,
      likes: 0,
      liked: false,
      commentsList: [],
      timestamp: "방금 전",
      user: {
        id: currentUser.id,
        username: currentUser.username,
        avatar: currentUser.avatar,
        team: userTeam,
      },
    };

    const updated = [post, ...posts];
    setPosts(updated);
    localStorage.setItem("posts", JSON.stringify(updated));

    setNewPost("");
    setNewImage(null);
    setShowCreatePost(false);
    setNewPostTeam(null);
    toast.success("게시글이 작성되었습니다 🎉");
  };

  /* ✏️ 게시글 수정 저장 */
  const handleUpdatePost = () => {
    if (!editingPost) return;
    if (!newPost.trim()) return toast.error("내용을 입력해주세요!");

    const updated = posts.map((p) =>
      p.id === editingPost.id
        ? { ...p, content: newPost, image: newImage || p.image }
        : p
    );

    setPosts(updated);
    localStorage.setItem("posts", JSON.stringify(updated));

    toast.success("게시글이 수정되었습니다!");
    setEditingPost(null);
    setNewPost("");
    setNewImage(null);
    setShowCreatePost(false);
  };



  /* 🏷 팀 필터 */
  const filteredPosts = selectedTeam
    ? posts.filter((p) => p.team?.id === selectedTeam?.id)
    : posts;

  return (
    <div className="p-4 space-y-4 relative">
      {showConfetti && <Confetti />}

      {/* 상단 팀 필터 */}
      <div className="relative z-40">
        <TeamSelector
          selectedTeam={selectedTeam}
          onSelectTeam={setSelectedTeam}
          showAll={true}
        />
      </div>

      {/* ✏️ 작성창 */}
      {currentUser && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card rounded-2xl p-4 relative z-30"
        >
          {!showCreatePost ? (
            <button
              onClick={() => setShowCreatePost(true)}
              className="w-full text-left text-gray-400 hover:text-gray-600"
            >
              무슨 생각을 하고 계신가요?
            </button>
          ) : (
            <div className="space-y-3">
              <textarea
                value={newPost}
                onChange={(e) => setNewPost(e.target.value)}
                placeholder="무슨 생각을 하고 계신가요?"
                className="w-full bg-transparent text-gray-900 dark:text-gray-100 resize-none px-2 py-2 focus:outline-none"
                rows={3}
                autoFocus
              />

              {/* 미리보기 이미지 */}
              {newImage && (
                <img
                  src={newImage}
                  alt="preview"
                  className="w-full rounded-xl mb-2"
                />
              )}

              <div className="flex justify-between items-center px-2 relative z-40">
                <div className="flex items-center gap-2">
                  {/* 🖼 이미지 업로드 */}
                  <label
                    htmlFor="feedUpload"
                    className="cursor-pointer p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full relative z-50"
                  >
                    <ImageIcon className="w-5 h-5 text-gray-500" />
                  </label>
                  <input
                    id="feedUpload"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />

                  {/* 🏷 구단 선택 (z-index 강화) */}
                  <div className="relative z-50">
                    <TeamSelector
                      selectedTeam={newPostTeam}
                      onSelectTeam={setNewPostTeam}
                      showAll={false}
                    />
                  </div>
                </div>

                {/* ✅ 버튼 그룹 */}
                <div className="flex gap-2 z-50">
                  <button
                    onClick={() => {
                      setShowCreatePost(false);
                      setNewPost("");
                      setNewImage(null);
                      setNewPostTeam(null);
                    }}
                    className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-full"
                  >
                    취소
                  </button>

                  {/* ✅ 항상 표시되게 수정 */}
                  <button
                    onClick={handleCreatePost}
                    disabled={!newPost.trim()}
                    className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-full"
                  >
                    게시
                  </button>

                </div>
              </div>

            </div>
          )}
        </motion.div>
      )}

      {/* 📰 피드 목록 */}
      {filteredPosts.length > 0 ? (
        filteredPosts.map((post, index) => (
          <FeedPost
            key={post.id}
            post={post}
            index={index}
            onLike={handleLike}
            onDelete={handleDelete}
            onPostClick={onPostClick}
          />
        ))
      ) : (
        <p className="text-gray-500 text-center py-10">
          {selectedTeam
            ? "해당 구단의 게시글이 없습니다."
            : "아직 게시글이 없습니다."}
        </p>
      )}
    </div>
  );
}
