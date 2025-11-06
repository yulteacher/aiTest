// hooks/useUserStats.ts
import { useMemo } from "react";

interface StatsResult {
  postsCount: number;
  likesCount: number;
  commentsCount: number;
  pollCount: number;
  xp: number;
  level: number;
  nextLevelXP: number;
  progress: number;
  badges: string[];
}

export function useUserStats(user, posts, polls): StatsResult {
  return useMemo(() => {
    if (!user) return {
      postsCount: 0,
      likesCount: 0,
      commentsCount: 0,
      pollCount: 0,
      xp: 0,
      level: 1,
      nextLevelXP: 100,
      progress: 0,
      badges: [],
    };

    const userPosts = posts.filter(p => p.author === user.username);
    const postsCount = userPosts.length;
    const likesCount = userPosts.reduce((sum, p) => sum + (p.likes?.length || 0), 0);
    const commentsCount = userPosts.reduce((sum, p) => sum + (p.commentsList?.length || 0), 0);
    const pollCount = polls.filter(p => Object.keys(p.userVotes || {}).includes(user.username)).length;

    // 🎯 XP 계산 로직
    const xp = (postsCount * 10) + (likesCount * 2) + (commentsCount * 3) + (pollCount * 5);

    // 🎯 레벨 구간 설정
    const levels = [
      { level: 1, xp: 0 },
      { level: 2, xp: 100 },
      { level: 3, xp: 250 },
      { level: 4, xp: 500 },
      { level: 5, xp: 1000 },
    ];

    let currentLevel = 1;
    for (let i = 0; i < levels.length; i++) {
      if (xp >= levels[i].xp) currentLevel = levels[i].level;
    }
    const nextLevelXP = levels.find(l => l.level === currentLevel + 1)?.xp || xp;
    const prevXP = levels.find(l => l.level === currentLevel)?.xp || 0;
    const progress = ((xp - prevXP) / (nextLevelXP - prevXP)) * 100;

    // 🏆 배지 조건
    const badges = [];
    if (postsCount >= 10) badges.push("✏️ 작가의 탄생");
    if (likesCount >= 100) badges.push("❤️ 인기인");
    if (commentsCount >= 50) badges.push("💬 소통왕");
    if (pollCount >= 10) badges.push("📊 참여자");
    if (xp >= 1000) badges.push("👑 레전드 팬");

    return {
      postsCount,
      likesCount,
      commentsCount,
      pollCount,
      xp,
      level: currentLevel,
      nextLevelXP,
      progress: Math.min(progress, 100),
      badges,
    };
  }, [user, posts, polls]);
}
