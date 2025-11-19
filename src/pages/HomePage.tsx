import { useState, useEffect, useMemo } from 'react';
import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { Heart, TrendingUp, MessageCircle, Users, Award, ChevronRight, Flame } from 'lucide-react';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import TeamLogo from '../components/yului/TeamLogo';
import LightRays from "../components/reactbits/LightRays";
import { dummyPollsData } from "../data/dummyPolls";
import { useAppDataContext } from "../context/AppDataContext";
import { User } from '../types/interfaces';

interface HomePageProps {
  user: User | null;
  onNavigate: (tab: string) => void;
  onPostClick?: (id: string) => void;
  onPollClick?: (id: string) => void;
  onChatOpen: () => void;
}

export default function HomePage({ user, onNavigate, onPostClick, onPollClick, onChatOpen }: HomePageProps) {
  const { posts, polls, users } = useAppDataContext();
  if (!user || !user.team) return null;
  /*   const [posts, setPosts] = useState([]);
    const [polls, setPolls] = useState([]); */





  const stats = useMemo(() => [
    { icon: Users, label: '총 회원', value: '1,234', color: 'from-teal-500 to-cyan-600' },
    { icon: Heart, label: '좋아요', value: '5,678', color: 'from-cyan-400 to-sky-600' },
    {
      icon: TrendingUp,
      label: '진행중 투표',
      value: polls.length.toString(),
      color: 'from-teal-400 to-cyan-600'
    },
  ], [polls]);


  const recentPosts = useMemo(() => {
    return [...posts]
      .sort((a, b) => {
        const at = a.timestamp || "";
        const bt = b.timestamp || "";
        return bt.localeCompare(at);
      })
      .slice(0, 3);
  }, [posts]);

  const trendingPolls = useMemo(() => {
    return [...polls]
      .sort((a, b) => (b.totalVotes || 0) - (a.totalVotes || 0))
      .slice(0, 2);
  }, [polls]);

  return (
    <div className="relative w-screen min-h-screen overflow-hidden">
      {/* 💫 메인 콘텐츠 */}
      <div className="relative z-10 p-4 space-y-6 backdrop-blur-md bg-white/10 rounded-3xl">
        {/* 환영 배너 */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-teal-500/20 via-cyan-500/20 to-sky-500/20 dark:from-teal-600/20 dark:via-cyan-600/20 dark:to-sky-600/20 rounded-2xl p-6 text-white shadow-lg dark:shadow-teal-500/20"
          style={{
            background:
              "linear-gradient(180deg, rgba(20,180,180,0.8), rgba(0,220,255,0.8))",
            backdropFilter: "blur(50px)",
            overflow: 'hidden',
          }}
        >
          <div className="absolute inset-0 z-0">
            <LightRays
              raysOrigin="bottom-right"
              raysColor="#00ffff"
              raysSpeed={1.5}
              lightSpread={0.8}
              rayLength={1.2}
              followMouse={true}
              mouseInfluence={0.1}
              noiseAmount={0.1}
              distortion={0.05}
              className="custom-rays"
            />
          </div>
          <div className="flex items-center gap-3 mb-2">
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
            >
              <TeamLogo team={user.team?.id} size="md" />
            </motion.div>
            <h2 className="text-white">{user?.username || '사용자'}님 환영합니다!</h2>
          </div>
          <p className="text-white/90 text-sm">오늘도 KBO 팬들과 함께 즐거운 하루 되세요 ⚾</p>
        </motion.div>

        {/* 통계 카드 */}
        <div className="grid grid-cols-3 gap-3">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            const motionValue = useMotionValue(0);
            const rounded = useTransform(motionValue, (latest) =>
              Math.floor(latest).toLocaleString()
            );

            useEffect(() => {
              const end = parseInt(stat.value.replace(/,/g, ""), 10) || 0;
              const controls = animate(motionValue, end, {
                duration: 1.2,
                ease: "easeOut",
              });
              return () => controls.stop();
            }, [stat.value]);

            const handleClick = () => {
              if (stat.label === '진행중 투표' && onNavigate) {
                onNavigate('polls');
              }
            };

            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                onClick={handleClick}
                className={`glass-card glass-card-hover rounded-2xl p-4 text-center ${stat.label === '진행중 투표' ? 'cursor-pointer hover:scale-[1.03]' : ''
                  }`}
              >
                <div
                  className={`w-10 h-10 rounded-full bg-gradient-to-br ${stat.color} flex items-center justify-center mx-auto mb-2 shadow-sm`}
                >
                  <Icon className="w-5 h-5 text-white" />
                </div>

                {/* ✨ 부드러운 숫자 애니메이션 */}
                <motion.span
                  className="text-gray-900 dark:text-gray-100 font-semibold"
                  key={stat.label}
                >
                  {rounded}
                </motion.span>

                <p className="text-gray-500 dark:text-gray-400 text-xs">{stat.label}</p>
              </motion.div>
            );
          })}
        </div>

        {/* 인기 투표 */}
        {trendingPolls.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-gray-900 dark:text-gray-100 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-teal-600 dark:text-[#00d5be]" />
                인기 투표
              </h3>
              <button
                onClick={() => onNavigate && onNavigate('polls')}
                className="text-teal-600 dark:text-teal-400 flex items-center gap-1 hover:text-teal-700 dark:hover:text-teal-300 transition-colors"
              >
                더보기
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              {trendingPolls.map((poll, index) => (
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
                  className="glass-card glass-card-hover rounded-2xl p-4 cursor-pointer transition-all"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <img
                      src={poll.avatar}
                      alt={poll.author}
                      className="w-8 h-8 rounded-full ring-2 ring-teal-200 dark:ring-teal-400/30"
                    />
                    <div className="flex-1">
                      <div className="text-gray-900 dark:text-gray-100">{poll.author}</div>
                    </div>
                    <div className="flex items-center gap-1 text-teal-600 dark:text-teal-400 text-xs">
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
        {recentPosts.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-gray-900 dark:text-gray-100 flex items-center gap-2">
                <Heart className="w-5 h-5 text-cyan-500 dark:text-cyan-400" />
                최근 게시글
              </h3>
              <button
                onClick={() => onNavigate && onNavigate('feed')}
                className="text-teal-600 dark:text-teal-400 flex items-center gap-1 hover:text-teal-700 dark:hover:text-teal-300 transition-colors"
              >
                더보기
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              {recentPosts.map((post, index) => (
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
                  className="glass-card glass-card-hover rounded-2xl p-4 cursor-pointer border border-teal-100/50 dark:border-teal-400/20"
                >
                  <div className="flex items-start gap-3">
                    <img
                      src={post.avatar || "/images/default_avatar.png"}
                      alt={post.authorName}
                      className="w-10 h-10 rounded-full ring-2 ring-teal-200 dark:ring-teal-400/30"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-gray-900 dark:text-gray-100"> {post.authorName || "익명"}</span>
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
            className="glass-card glass-card-hover rounded-2xl p-6 text-center border border-sky-200/50 dark:border-sky-700/30"
          >
            <MessageCircle className="w-8 h-8 text-sky-600 dark:text-sky-400 mx-auto mb-2" />
            <div className="text-gray-900 dark:text-gray-100">AI 채팅</div>
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => onNavigate && onNavigate('polls')}
            className="glass-card glass-card-hover rounded-2xl p-6 text-center border border-teal-200/50 dark:border-teal-700/30"
          >
            <TrendingUp className="w-8 h-8 text-teal-600 dark:text-teal-400 mx-auto mb-2" />
            <div className="text-gray-900 dark:text-gray-100">투표 만들기</div>
          </motion.button>
        </motion.div>

        {/* 공지사항 */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="glass-card rounded-2xl p-4 border border-sky-200/50 dark:border-sky-700/30"
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
    </div>

  );
}
