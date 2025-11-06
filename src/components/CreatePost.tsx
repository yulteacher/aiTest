import { useState } from "react";
import { Image, Send } from "lucide-react";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { useXPSystem } from "../hooks/useXPSystem";
import { useLocalData } from "../hooks/useLocalData";

interface CreatePostProps {
  onCreatePost?: (content: string, image?: string) => void;
}

export default function CreatePost({ onCreatePost }: CreatePostProps) {
  const [content, setContent] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [showImageInput, setShowImageInput] = useState(false);

  const { currentUser, setCurrentUser, users, setUsers, posts, setPosts } = useLocalData();
  const { addXP } = useXPSystem(currentUser, setCurrentUser, users, setUsers);

  const handleSubmit = () => {
    if (!content.trim() || !currentUser) return;

    // ✅ 새 게시글 객체 생성
    const newPost = {
      id: Date.now(),
      author: currentUser.username,
      avatar: currentUser.avatar,
      team: currentUser.team,
      content: content.trim(),
      image: imageUrl || "",
      likes: [],
      commentsList: [],
      timestamp: new Date().toISOString(),
    };

    // ✅ 로컬 업데이트
    setPosts([newPost, ...posts]);
    localStorage.setItem("posts", JSON.stringify([newPost, ...posts]));

    // ✅ XP 추가
    addXP("postCreate");

    // ✅ 외부 콜백 호출 (필요시)
    if (onCreatePost) onCreatePost(content, imageUrl || undefined);

    // ✅ 초기화
    setContent("");
    setImageUrl("");
    setShowImageInput(false);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-4">
      <Textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="무슨 생각을 하고 계신가요?"
        className="mb-3 resize-none"
        rows={3}
      />

      {showImageInput && (
        <input
          type="text"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          placeholder="이미지 URL을 입력하세요"
          className="w-full px-3 py-2 border rounded-lg mb-3 focus:outline-none focus:ring-2 focus:ring-purple-600"
        />
      )}

      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowImageInput(!showImageInput)}
          className="text-gray-600"
        >
          <Image className="w-5 h-5 mr-2" />
          사진
        </Button>

        <Button
          onClick={handleSubmit}
          disabled={!content.trim()}
          className="bg-gradient-to-r from-blue-600 to-red-600 hover:shadow-lg"
        >
          <Send className="w-4 h-4 mr-2" />
          게시
        </Button>
      </div>
    </div>
  );
}
