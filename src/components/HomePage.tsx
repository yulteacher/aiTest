import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Heart, TrendingUp, MessageCircle, Users, Award, ChevronRight, Flame } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import TeamSelector from './TeamSelector';
import TeamLogo from './TeamLogo';

export default function HomePage({ onNavigate, onPostClick, onPollClick, onChatOpen }) {
  const [posts, setPosts] = useState([]);
  const [polls, setPolls] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState(null);

  useEffect(() => {
    const savedPosts = localStorage.getItem('posts');
    const savedPolls = localStorage.getItem('polls');
    
    if (savedPosts) {
      setPosts(JSON.parse(savedPosts));
    }
    if (savedPolls) {
      setPolls(JSON.parse(savedPolls));
    }
  }, []);

  const stats = [
    { icon: Users, label: '총 회원', value: '1,234', color: 'from-slate-500 to-slate-600' },
    { icon: Heart, label: '좋아요', value: '5,678', color: 'from-rose-400 to-rose-600' },
    { icon: TrendingUp, label: '진행중 투표', value: '12', color: 'from-amber-400 to-amber-600' },
  ];

  const recentPosts = posts.slice(0, 3);
  const trendingPolls = polls.slice(0, 2);

  const filteredPosts = selectedTeam 
    ? posts.filter(post => post.team?.id === selectedTeam.id)
    : posts;

  const filteredPolls = selectedTeam
    ? polls.filter(poll => poll.team?.id === selectedTeam.id)
    : polls;

  return (
    <div className="p-4 space-y-6">
      {/* 구단 선택 */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <TeamSelector selectedTeam={selectedTeam} onSelectTeam={setSelectedTeam} showAll={true} />
      </motion.div>

      {/* 환영 배너 */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-slate-600 to-rose-500 rounded-2xl p-6 text-white shadow-lg"
      >
        <div className="flex items-center gap-3 mb-2">
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
          >
            <Flame className="w-8 h-8" />
          </motion.div>
          <h2 className="text-white">환영합니다!</h2>
        </div>
        <p className="text-white/90 text-sm">오늘도 KBO 팬들과 함께 즐거운 하루 되세요 ⚾</p>
      </motion.div>

      {/* 통계 카드 */}
      <div className="grid grid-cols-3 gap-3">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm text-center"
            >
              <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${stat.color} flex items-center justify-center mx-auto mb-2`}>
                <Icon className="w-5 h-5 text-white" />
              </div>
              <div className="text-gray-900 dark:text-gray-100">{stat.value}</div>
              <p className="text-gray-500 dark:text-gray-400 text-xs">{stat.label}</p>
            </motion.div>
          );
        })}
      </div>

      {/* 인기 투표 */}
      {filteredPolls.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-gray-900 dark:text-gray-100 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-slate-600" />
              인기 투표
            </h3>
            <button 
              onClick={() => onNavigate && onNavigate('polls')}
              className="text-slate-600 dark:text-slate-400 flex items-center gap-1 hover:text-slate-800 dark:hover:text-slate-300 transition-colors"
            >
              더보기
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          
          <div className="space-y-3">
            {filteredPolls.slice(0, 2).map((poll, index) => (
              <motion.div
                key={poll.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + index * 0.1 }}
                onClick={() => {
                  if (onPollClick) {
                    onPollClick(poll.id);
                  }
                }}
                className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm cursor-pointer hover:shadow-md transition-shadow"
              >
                <div className="flex items-center gap-3 mb-3">
                  <img
                    src={poll.avatar}
                    alt={poll.author}
                    className="w-8 h-8 rounded-full"
                  />
                  <div className="flex-1">
                    <div className="text-gray-900 dark:text-gray-100">{poll.author}</div>
                  </div>
                  <div className="flex items-center gap-1 text-slate-600 dark:text-slate-400 text-xs">
                    <Award className="w-4 h-4" />
                    <span>{poll.totalVotes}</span>
                  </div>
                </div>
                <p className="text-gray-800 dark:text-gray-200">{poll.question}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* 최근 게시글 */}
      {filteredPosts.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-gray-900 dark:text-gray-100 flex items-center gap-2">
              <Heart className="w-5 h-5 text-rose-500" />
              최근 게시글
            </h3>
            <button 
              onClick={() => onNavigate && onNavigate('feed')}
              className="text-slate-600 dark:text-slate-400 flex items-center gap-1 hover:text-slate-800 dark:hover:text-slate-300 transition-colors"
            >
              더보기
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-3">
            {filteredPosts.slice(0, 3).map((post, index) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 + index * 0.1 }}
                onClick={() => {
                  if (onPostClick) {
                    onPostClick(post.id);
                  }
                }}
                className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm cursor-pointer hover:shadow-md transition-shadow"
              >
                <div className="flex items-start gap-3">
                  <img
                    src={post.avatar}
                    alt={post.author}
                    className="w-10 h-10 rounded-full"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-gray-900 dark:text-gray-100">{post.author}</span>
                      <span className="text-gray-400 dark:text-gray-500">·</span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">{post.timestamp}</span>
                    </div>
                    <p className="text-sm text-gray-800 dark:text-gray-200 line-clamp-2 mb-2">
                      {post.content}
                    </p>
                    {post.image && (
                      <ImageWithFallback
                        src={post.image}
                        alt="Post"
                        className="w-full h-32 object-cover rounded-lg"
                      />
                    )}
                    <div className="flex items-center gap-4 mt-2 text-xs text-gray-500 dark:text-gray-400">
                      <span className="flex items-center gap-1">
                        <Heart className="w-3.5 h-3.5" />
                        {post.likes}
                      </span>
                      <span className="flex items-center gap-1">
                        <MessageCircle className="w-3.5 h-3.5" />
                        {post.comments || 0}
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* 빠른 액션 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="grid grid-cols-2 gap-3"
      >
        <motion.button 
          whileTap={{ scale: 0.95 }}
          onClick={() => onChatOpen && onChatOpen()}
          className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-2xl p-6 text-center border border-amber-200 dark:border-amber-800 hover:shadow-lg transition-shadow"
        >
          <MessageCircle className="w-8 h-8 text-amber-600 dark:text-amber-400 mx-auto mb-2" />
          <div className="text-gray-900 dark:text-gray-100">AI 채팅</div>
        </motion.button>
        <motion.button 
          whileTap={{ scale: 0.95 }}
          onClick={() => onNavigate && onNavigate('polls')}
          className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900/20 dark:to-slate-800/20 rounded-2xl p-6 text-center border border-slate-200 dark:border-slate-800 hover:shadow-lg transition-shadow"
        >
          <TrendingUp className="w-8 h-8 text-slate-600 dark:text-slate-400 mx-auto mb-2" />
          <div className="text-gray-900 dark:text-gray-100">투표 만들기</div>
        </motion.button>
      </motion.div>

      {/* 공지사항 */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-2xl p-4 border border-yellow-200 dark:border-yellow-800"
      >
        <div className="flex items-start gap-3">
          <div className="text-2xl">📢</div>
          <div className="flex-1">
            <h4 className="text-gray-900 dark:text-gray-100 mb-1 font-medium">공지사항</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              KBO 팬덤에 오신 것을 환영합니다! 10개 구단 팬들과 함께 좋아요, 투표, AI 채팅 기능을 자유롭게 사용해보세요.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
