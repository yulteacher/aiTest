import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Heart, MessageCircle, Share2, Image as ImageIcon, Trash2, Edit2 } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import Confetti from './Confetti';
import TeamSelector from './TeamSelector';
import TeamLogo from './TeamLogo';
import TeamAvatar from './TeamAvatar';
import { toast } from 'sonner@2.0.3';

export default function FeedPage({ onPostClick }) {
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState('');
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState(null); // 필터용
  const [newPostTeam, setNewPostTeam] = useState(null); // 작성할 피드의 구단
  const [editingPost, setEditingPost] = useState(null);
  const [editContent, setEditContent] = useState('');
  const [editTeam, setEditTeam] = useState(null);

  useEffect(() => {
    const savedPosts = localStorage.getItem('posts');
    if (savedPosts) {
      setPosts(JSON.parse(savedPosts));
    } else {
      const teams = [
        { id: 'doosan', name: '두산 베어스', color: '#131230' },
        { id: 'samsung', name: '삼성 라이온즈', color: '#074CA1' },
        { id: 'lg', name: 'LG 트윈스', color: '#C30452' },
        { id: 'kt', name: 'KT 위즈', color: '#000000' },
        { id: 'ssg', name: 'SSG 랜더스', color: '#CE0E2D' },
        { id: 'lotte', name: '롯데 자이언츠', color: '#041E42' },
        { id: 'hanwha', name: '한화 이글스', color: '#FF6600' },
        { id: 'nc', name: 'NC 다이노스', color: '#315288' },
        { id: 'kiwoom', name: '키움 히어로즈', color: '#570514' },
        { id: 'kia', name: 'KIA 타이거즈', color: '#EA0029' },
      ];

      const postTemplates = [
        { content: '오늘 경기 진짜 명승부였다 ⚾ 9회말 역전승!! 소름돋았어요', hasImage: true },
        { content: '우리 팀 에이스 투수 7이닝 무실점! 👏 시즌 최고의 피칭이었어요', hasImage: false },
        { content: '첫 직관 다녀왔어요! 야구장 분위기 너무 좋다 🏟️', hasImage: true },
        { content: '오늘 홈런 3개 나왔다!! 타선 폭발하는거 보니 기분 좋네요 💪', hasImage: false },
        { content: '수비 실수로 아쉽게 졌지만 다음 경기는 꼭 이길 수 있을 거예요!', hasImage: false },
        { content: '신인 선수 데뷔전 축하합니다! 앞으로가 더 기대되네요 🎉', hasImage: true },
        { content: '오늘 경기 MVP는 단연 우리 4번 타자! 결승타 멋있었어요 ⚡', hasImage: false },
        { content: '야구장에서 먹는 치맥이 최고죠 🍗🍺 경기 보면서 응원하는 재미!', hasImage: true },
        { content: '투수 교체 타이밍이 아쉬웠지만 감독님 믿고 다음 경기도 응원합니다!', hasImage: false },
        { content: '시즌 마지막까지 파이팅! 우리 팀 포스트시즌 가자!! 🔥', hasImage: false },
      ];

      const avatars = [
        'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop',
        'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
        'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=100&h=100&fit=crop',
        'https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=100&h=100&fit=crop',
        'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop',
      ];

      const images = [
        'https://images.unsplash.com/photo-1566577134770-3d85bb3a9cc4?w=600&h=400&fit=crop',
        'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=600&h=400&fit=crop',
        'https://images.unsplash.com/photo-1575870350146-b9b0ae97e2c7?w=600&h=400&fit=crop',
        'https://images.unsplash.com/photo-1560272564-c83b66b1ad12?w=600&h=400&fit=crop',
      ];

      const timestamps = ['방금 전', '10분 전', '30분 전', '1시간 전', '2시간 전', '5시간 전', '12시간 전', '1일 전', '2일 전', '3일 전'];

      const initialPosts = [];
      let postId = 1;

      teams.forEach((team) => {
        postTemplates.forEach((template, idx) => {
          const post = {
            id: postId.toString(),
            author: `${team.name} 팬${idx + 1}`,
            avatar: avatars[idx % avatars.length],
            content: template.content,
            team: team,
            image: template.hasImage ? images[idx % images.length] : undefined,
            likes: Math.floor(Math.random() * 500) + 10,
            timestamp: timestamps[idx % timestamps.length],
            liked: Math.random() > 0.7,
            commentsList: []
          };
          initialPosts.push(post);
          postId++;
        });
      });

      // 최신순으로 정렬 (섞기)
      initialPosts.sort(() => Math.random() - 0.5);

      setPosts(initialPosts);
      localStorage.setItem('posts', JSON.stringify(initialPosts));
    }
  }, []);

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
    localStorage.setItem('posts', JSON.stringify(updatedPosts));
  };

  const handleDelete = (postId) => {
    if (window.confirm('이 게시글을 삭제하시겠습니까?')) {
      const updatedPosts = posts.filter((post) => post.id !== postId);
      setPosts(updatedPosts);
      localStorage.setItem('posts', JSON.stringify(updatedPosts));
      toast.success('게시글이 삭제되었습니다');
    }
  };

  const handleCreatePost = () => {
    if (!newPost.trim()) return;

    const post = {
      id: Date.now().toString(),
      author: '나',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop',
      content: newPost,
      team: newPostTeam,
      likes: 0,
      timestamp: '방금 전',
      liked: false,
      commentsList: []
    };

    const updatedPosts = [post, ...posts];
    setPosts(updatedPosts);
    localStorage.setItem('posts', JSON.stringify(updatedPosts));
    setNewPost('');
    setNewPostTeam(null);
    setShowCreatePost(false);
    setSelectedTeam(null); // 필터를 전체로 리셋
    toast.success('게시글이 작성되었습니다!');
  };

  const handleStartEdit = (post) => {
    setEditingPost(post.id);
    setEditContent(post.content);
    setEditTeam(post.team || null);
  };

  const handleCancelEdit = () => {
    setEditingPost(null);
    setEditContent('');
    setEditTeam(null);
  };

  const handleSaveEdit = (postId) => {
    if (!editContent.trim()) return;

    const updatedPosts = posts.map((post) => {
      if (post.id === postId) {
        return {
          ...post,
          content: editContent,
          team: editTeam,
          timestamp: '방금 전 (수정됨)',
        };
      }
      return post;
    });

    setPosts(updatedPosts);
    localStorage.setItem('posts', JSON.stringify(updatedPosts));
    setEditingPost(null);
    setEditContent('');
    setEditTeam(null);
    toast.success('게시글이 수정되었습니다');
  };

  const filteredPosts = selectedTeam
    ? posts.filter(post => post.team?.id === selectedTeam.id)
    : posts;

  return (
    <div className="p-4 space-y-4">
      {showConfetti && <Confetti />}
      
      {/* 구단 필터 */}
      <TeamSelector selectedTeam={selectedTeam} onSelectTeam={setSelectedTeam} showAll={true} />

      {/* 게시글 작성 */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm"
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
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-3"
          >
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

            <div className="flex items-center justify-between">
              <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors">
                <ImageIcon className="w-5 h-5 text-gray-500" />
              </button>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setShowCreatePost(false);
                    setNewPost('');
                    setNewPostTeam(null);
                  }}
                  className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
                >
                  취소
                </button>
                <button
                  onClick={handleCreatePost}
                  disabled={!newPost.trim()}
                  className="px-4 py-2 bg-gradient-to-r from-slate-600 to-rose-500 text-white rounded-full hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  게시
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </motion.div>

      {/* 게시글 목록 */}
      {filteredPosts.map((post, index) => (
        <PostCard
          key={post.id}
          post={post}
          index={index}
          onLike={handleLike}
          onDelete={handleDelete}
          onEdit={handleStartEdit}
          isEditing={editingPost === post.id}
          editContent={editContent}
          editTeam={editTeam}
          onEditContentChange={setEditContent}
          onEditTeamChange={setEditTeam}
          onSaveEdit={handleSaveEdit}
          onCancelEdit={handleCancelEdit}
          onPostClick={onPostClick}
        />
      ))}

    </div>
  );
}

function PostCard({ post, index, onLike, onDelete, onEdit, isEditing, editContent, editTeam, onEditContentChange, onEditTeamChange, onSaveEdit, onCancelEdit, onPostClick }) {
  const isMyPost = post.author === '나';

  const handleCardClick = (e) => {
    // 수정 중이면 클릭 무시
    if (isEditing) {
      return;
    }
    
    // 버튼이나 인터랙티브 요소를 클릭한 경우 무시
    const target = e.target;
    if (
      target.closest('button') ||
      target.closest('textarea') ||
      target.closest('input')
    ) {
      return;
    }
    
    if (onPostClick) {
      onPostClick(post.id);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm hover:shadow-lg transition-all overflow-hidden cursor-pointer"
      onClick={handleCardClick}
    >
      <div className="p-4">
          {/* 작성자 */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <TeamAvatar
                team={post.team?.name}
                src={post.avatar}
                size="md"
              />
              <div>
                <div className="font-medium text-gray-900 dark:text-gray-100">{post.author}</div>
                <p className="text-xs text-gray-500 dark:text-gray-400">{post.timestamp}</p>
              </div>
            </div>
            {isMyPost && !isEditing && (
              <div className="flex gap-1">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    onEdit(post);
                  }}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors active:scale-95"
                >
                  <Edit2 className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    onDelete(post.id);
                  }}
                  className="p-2 hover:bg-red-100 dark:hover:bg-red-900/20 rounded-full transition-colors active:scale-95"
                >
                  <Trash2 className="w-4 h-4 text-red-500 dark:text-red-400" />
                </button>
              </div>
            )}
          </div>

          {/* 내용 */}
          {isEditing ? (
            <div className="space-y-2 mb-3">
              <textarea
                value={editContent}
                onChange={(e) => onEditContentChange(e.target.value)}
                className="w-full bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg px-4 py-3 resize-none focus:outline-none focus:ring-2 focus:ring-slate-500"
                rows={3}
                autoFocus
              />
              
              {/* 구단 선택 (수정 시) */}
              <TeamSelector 
                selectedTeam={editTeam} 
                onSelectTeam={onEditTeamChange} 
                showAll={false}
                label="구단 선택 (선택사항)"
              />
              
              <div className="flex gap-2 justify-end">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onCancelEdit();
                  }}
                  className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  취소
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onSaveEdit(post.id);
                  }}
                  className="px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-colors"
                >
                  저장
                </button>
              </div>
            </div>
          ) : (
            <p className="text-gray-800 dark:text-gray-200 mb-3">{post.content}</p>
          )}

          {/* 이미지 */}
          {post.image && !isEditing && (
            <ImageWithFallback
              src={post.image}
              alt="Post"
              className="w-full rounded-xl mb-3"
            />
          )}

          {/* 액션 버튼 */}
          {!isEditing && (
            <div className="flex items-center gap-6 pt-3 border-t border-gray-100 dark:border-gray-700">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  onLike(post.id);
                }}
                className={`flex items-center gap-2 transition-colors active:scale-95 ${
                  post.liked
                    ? 'text-rose-500'
                    : 'text-gray-600 dark:text-gray-400'
                }`}
              >
                <Heart
                  className="w-5 h-5"
                  fill={post.liked ? 'currentColor' : 'none'}
                />
                <span>{post.likes}</span>
              </button>

              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                <MessageCircle className="w-5 h-5" />
                <span>{post.commentsList?.length || 0}</span>
              </div>

              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  const shareText = `${post.author}: ${post.content}`;
                  if (navigator.share) {
                    navigator.share({ title: 'KBO 팬덤', text: shareText }).catch(() => {});
                  } else {
                    navigator.clipboard.writeText(shareText);
                    toast.success('링크가 복사되었습니다!');
                  }
                }}
                className="flex items-center gap-2 text-gray-600 dark:text-gray-400 ml-auto active:scale-95 transition-all"
              >
                <Share2 className="w-5 h-5" />
              </button>
            </div>
          )}
      </div>
    </motion.div>
  );
}
