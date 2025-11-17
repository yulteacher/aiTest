// src/pages/HomePage.tsx
import { useMemo } from 'react';
import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { Heart, TrendingUp, MessageCircle, Users, Award, ChevronRight } from 'lucide-react';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import TeamLogo from '../components/yului/TeamLogo';
import LightRays from "../components/reactbits/LightRays";

import { useAppDataContext } from "../context/AppDataContext";

interface HomePageProps {
  user: any;
  onNavigate: (tab: string) => void;
  onPostClick?: (id: string) => void;
  onPollClick?: (id: string) => void;
  onChatOpen: () => void;
}

export default function HomePage({ user, onNavigate, onPostClick, onPollClick, onChatOpen }: HomePageProps) {

  if (!user || !user.team) return null;

  const { posts, polls, users } = useAppDataContext();

  /** --------------------------------------------------
   *  🔥 데이터 보정 + 랜덤 정렬된 posts / polls 계산
   *  useMemo → 렌더 최적화
   -------------------------------------------------- */
  const enrichedPosts = useMemo(() => {
    return [...posts]
      .map((p: any) => {
        const author = users.find((u: any) => u.id === p.authorId);

        return {
          ...p,
          authorName: author?.username || p.authorName || "익명",
          avatar: author?.avatar || p.avatar || "/images/default_avatar.png",
          likes: p.likes ?? 0,
          comments: p.commentsList?.length ?? 0,
        };
      })
      .sort(() => Math.random() - 0.5); // 🔥 랜덤 섞기
  }, [posts, users]);


  const enrichedPolls = useMemo(() => {
    return [...polls]
      .map((poll: any) => {
        const author = users.find((u: any) => u.id === poll.createdBy);
        return {
          ...poll,
          author: author?.username || "익명",
          avatar: author?.avatar || "/images/default_avatar.png",
        };
      })
      .sort(() => Math.random() - 0.5); // 🔥 랜덤 섞기
  }, [polls, users]);


  // 🔥 홈 화면에서 보여줄 갯수 필터
  const recentPosts = enrichedPosts.slice(0, 3);
  const trendingPolls = enrichedPolls.slice(0, 2);


  /** --------------------------------------------------
   *  📊 상단 통계 카드 (회원수/좋아요수/투표수)
   -------------------------------------------------- */
  const totalMembers = Array.isArray(users) ? users.length : 0;

  const totalLikes = Array.isArray(posts)
    ? posts.reduce((sum, p) => sum + (p.likes ?? 0), 0)
    : 0;

  const activePolls = Array.isArray(polls) ? polls.length : 0;
  const stats = useMemo(() => [
    { icon: Users, label: '총 회원', value: totalMembers, color: 'from-teal-500 to-cyan-600' },
    { icon: Heart, label: '좋아요', value: totalLikes, color: 'from-cyan-400 to-sky-600' },
    { icon: TrendingUp, label: '진행중 투표', value: activePolls, color: 'from-teal-400 to-cyan-600' },
  ], [users, posts, polls]);


  return (
    <div className="relative w-screen min-h-screen overflow-hidden">
      <div className="relative z-10 p-4 space-y-6 backdrop-blur-md bg-white/10 rounded-3xl">

        {/* --------------------------------------------- */}
        {/* 🔥 환영 배너 */}
        {/* --------------------------------------------- */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-teal-500/20 via-cyan-500/20 to-sky-500/20 rounded-2xl p-6 text-white shadow-lg"
        >
          <div className="absolute inset-0 z-0">
            <LightRays
              raysOrigin="bottom-right"
              raysColor="#00ffff"
              raysSpeed={1.5}
              lightSpread={0.8}
              rayLength={1.2}
              followMouse={true}
            />
          </div>

          <div className="flex items-center gap-3 mb-2">
            <motion.div animate={{ rotate: [0, 10, -10, 0] }} transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}>
              <TeamLogo team={user.team} size="md" />
            </motion.div>
            <h2 className="text-white">{user.username}님 환영합니다!</h2>
          </div>

          <p className="text-white/90 text-sm">오늘도 KBO 팬들과 함께 즐거운 하루 되세요 ⚾</p>
        </motion.div>

        {/* --------------------------------------------- */}
        {/* 📊 통계 카드 */}
        {/* --------------------------------------------- */}
        <div className="grid grid-cols-3 gap-3">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            const motionValue = useMotionValue(0);
            const rounded = useTransform(motionValue, (latest) =>
              Math.floor(latest).toLocaleString()
            );

            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="glass-card rounded-2xl p-4 text-center"
              >
                <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${stat.color} flex items-center justify-center mx-auto mb-2`}>
                  <Icon className="w-5 h-5 text-white" />
                </div>

                <motion.span className="text-gray-900 dark:text-gray-100 font-semibold">
                  {rounded}
                </motion.span>
                <p className="text-gray-500 dark:text-gray-400 text-xs">{stat.label}</p>
              </motion.div>
            );
          })}
        </div>

        {/* --------------------------------------------- */}
        {/* 🔥 인기 투표 */}
        {/* --------------------------------------------- */}
        {trendingPolls.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-gray-900 dark:text-gray-100 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-teal-600" />
                인기 투표
              </h3>
              <button onClick={() => onNavigate('polls')} className="text-teal-600 flex items-center gap-1">
                더보기 <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              {trendingPolls.map((poll, index) => (
                <motion.div
                  key={poll.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  onClick={() => onPollClick?.(poll.id)}
                  className="glass-card rounded-2xl p-4 cursor-pointer"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <img src={poll.avatar} className="w-8 h-8 rounded-full ring-2 ring-teal-200" />
                    <div className="flex-1 text-gray-900 dark:text-gray-100">{poll.author}</div>
                    <div className="flex items-center gap-1 text-teal-600 text-xs">
                      <Award className="w-4 h-4" /> {poll.totalVotes}
                    </div>
                  </div>

                  <p className="text-gray-800 dark:text-gray-200">{poll.question}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* --------------------------------------------- */}
        {/* 🔥 최근 게시글 */}
        {/* --------------------------------------------- */}
        {recentPosts.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-gray-900 dark:text-gray-100 flex items-center gap-2">
                <Heart className="w-5 h-5 text-cyan-500" />
                최근 게시글
              </h3>
              <button onClick={() => onNavigate('feed')} className="text-teal-600 flex items-center gap-1">
                더보기 <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              {recentPosts.map((post, index) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  onClick={() => onPostClick?.(post.id)}
                  className="glass-card rounded-2xl p-4 cursor-pointer border border-teal-100/50"
                >
                  <div className="flex items-start gap-3">
                    <img src={post.avatar} className="w-10 h-10 rounded-full ring-2 ring-teal-200" />

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-gray-900">{post.authorName}</span>
                        <span className="text-xs text-gray-500">{post.timestamp}</span>
                      </div>

                      <p className="text-sm text-gray-800 line-clamp-2 mb-2">{post.content}</p>

                      {post.image && (
                        <ImageWithFallback src={post.image} className="w-full h-32 object-cover rounded-lg" />
                      )}

                      <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                        <span className="flex items-center gap-1"><Heart className="w-3.5 h-3.5" />{post.likes}</span>
                        <span className="flex items-center gap-1"><MessageCircle className="w-3.5 h-3.5" />{post.comments}</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* --------------------------------------------- */}
        {/* 🔥 빠른 액션 */}
        {/* --------------------------------------------- */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-2 gap-3">
          <motion.button whileTap={{ scale: 0.95 }} onClick={() => onChatOpen()} className="glass-card rounded-2xl p-6 text-center">
            <MessageCircle className="w-8 h-8 text-sky-600 mx-auto mb-2" />
            <div className="text-gray-900">AI 채팅</div>
          </motion.button>

          <motion.button whileTap={{ scale: 0.95 }} onClick={() => onNavigate('polls')} className="glass-card rounded-2xl p-6 text-center">
            <TrendingUp className="w-8 h-8 text-teal-600 mx-auto mb-2" />
            <div className="text-gray-900">투표 만들기</div>
          </motion.button>
        </motion.div>

      </div>
    </div>
  );
}
