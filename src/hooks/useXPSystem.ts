// src/hooks/useXPSystem.ts
import { toast } from "sonner";

export function useXPSystem(currentUser, setCurrentUser, userData, setUserData) {
  // ✅ XP 규칙 테이블
  const XP_RULES = {
    postCreate: 10,      // 게시글 작성
    likeReceived: 2,     // 좋아요 받음
    commentReceived: 3,  // 댓글 받음
    pollVoted: 5,        // 투표 참여
  };

  // ✅ 현재 레벨 계산 함수
  const calculateLevel = (xp) => Math.floor(xp / 100) + 1;
  const calculateProgress = (xp) => xp % 100;

  // ✅ XP 추가 함수
  const addXP = (type) => {
    if (!currentUser || !XP_RULES[type]) return;

    const xpGain = XP_RULES[type];
    const prevXP = currentUser.xp || 0;
    const newXP = prevXP + xpGain;

    const prevLevel = calculateLevel(prevXP);
    const newLevel = calculateLevel(newXP);

    const updatedUser = {
      ...currentUser,
      xp: newXP,
      level: newLevel,
    };

    // ✅ 상태 업데이트 (동기화)
    setUserData((prev) => ({
      current: updatedUser,
      all: prev.all.map((u) =>
        u.username === updatedUser.username ? updatedUser : u
      ),
    }));

    setCurrentUser(updatedUser);

    // ✅ localStorage 즉시 반영
    const stored = JSON.parse(localStorage.getItem("userData") || "{}");
    localStorage.setItem(
      "userData",
      JSON.stringify({
        ...stored,
        current: updatedUser,
        all: stored.all?.map((u) =>
          u.username === updatedUser.username ? updatedUser : u
        ),
      })
    );

    // ✅ toast 알림
    if (newLevel > prevLevel) {
      toast.success(`🎉 레벨 업! ${prevLevel} → ${newLevel} ⚾`);
    } else {
      toast.message(`+${xpGain} XP 획득!`, {
        description: `${calculateProgress(newXP)} / 100 XP`,
      });
    }
  };

  // ✅ 현재 유저의 레벨/진행률 계산 유틸
  const getLevelInfo = () => {
    const xp = currentUser?.xp || 0;
    return {
      xp,
      level: calculateLevel(xp),
      progress: calculateProgress(xp),
      toNext: 100 - calculateProgress(xp),
    };
  };

  return { addXP, getLevelInfo };
}
