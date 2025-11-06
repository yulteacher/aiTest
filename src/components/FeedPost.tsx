import { motion } from "framer-motion";
import { Heart, MessageCircle } from "lucide-react";
import { useXPSystem } from "../hooks/useXPSystem";
import { useLocalData } from "../hooks/useLocalData";

export default function FeedPost({ post }) {
  const { currentUser, setCurrentUser, users, setUsers, posts, setPosts } = useLocalData();
  const { addXP } = useXPSystem(currentUser, setCurrentUser, users, setUsers);

  const hasLiked = post.likes.includes(currentUser.username);

  // ✅ 좋아요 클릭 이벤트
  const handleLike = () => {
    if (!currentUser) return;
    if (hasLiked) return; // 중복 방지

    // 게시글 업데이트
    const updatedPosts = posts.map((p) =>
      p.id === post.id
        ? { ...p, likes: [...p.likes, currentUser.username] }
        : p
    );
    setPosts(updatedPosts);
    localStorage.setItem("posts", JSON.stringify(updatedPosts));

    // ✅ 작성자 XP 추가
    const author = users.find((u) => u.username === post.author);
    if (author) {
      const updatedUsers = users.map((u) =>
        u.username === author.username
          ? { ...u, xp: (u.xp || 0) + 2 }
          : u
      );
      setUsers(updatedUsers);
      localStorage.setItem("users", JSON.stringify(updatedUsers));
    }

    // ✅ 좋아요를 누른 사용자에게는 (보상 없음)
  };

  return (
    <motion.div
      className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 dark:bg-gray-900 dark:border-gray-700"
      whileHover={{ scale: 1.01 }}
    >
      <div className="flex items-center gap-3 mb-3">
        <img
          src={post.avatar}
          alt={post.author}
          className="w-10 h-10 rounded-full border border-gray-200 dark:border-gray-600"
        />
        <div>
          <p className="text-gray-900 dark:text-white font-semibold">{post.author}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">{post.team?.name}</p>
        </div>
      </div>

      <p className="text-gray-800 dark:text-gray-200 mb-3">{post.content}</p>
      {post.image && (
        <img
          src={post.image}
          alt=""
          className="rounded-xl w-full max-h-80 object-cover mb-3"
        />
      )}

      <div className="flex items-center justify-between mt-2">
        <button
          onClick={handleLike}
          className={`flex items-center gap-2 transition-all ${hasLiked
              ? "text-rose-500"
              : "text-gray-600 hover:text-rose-500 dark:text-gray-300"
            }`}
        >
          <Heart
            className={`w-5 h-5 ${hasLiked ? "fill-rose-500" : "fill-none"
              }`}
          />
          <span>{post.likes.length}</span>
        </button>

        <button className="flex items-center gap-2 text-gray-600 hover:text-sky-500 dark:text-gray-300">
          <MessageCircle className="w-5 h-5" />
          <span>{post.commentsList.length}</span>
        </button>
      </div>
    </motion.div>
  );
}
