// src/hooks/useXPSystem.ts
import { toast } from "sonner";

export function useXPSystem(currentUser, setCurrentUser, userData?, setUserData?) {
  // ✅ XP 규칙 테이블
  const XP_RULES = {
    postCreate: 10,      // 게시글 작성
    likeReceived: 2,     // 좋아요 받음
    commentReceived: 3,  // 댓글 받음
    pollVoted: 5,        // 투표 참여
  };

  // ✅ 레벨 계산 유틸
  const calculateLevel = (xp: number) => Math.floor(xp / 100) + 1;
  const calculateProgress = (xp: number) => xp % 100;

  // ✅ XP 추가 함수
  const addXP = (type: keyof typeof XP_RULES) => {
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

    // ✅ 현재 유저 상태 반영
    setCurrentUser(updatedUser);

    // ✅ 전체 유저 데이터 업데이트
    if (setUserData && Array.isArray(userData)) {
      const updatedList = userData.map((u: any) =>
        u.username === updatedUser.username ? updatedUser : u
      );
      setUserData(updatedList);
      localStorage.setItem("users", JSON.stringify(updatedList));
    } else {
      // ✅ fallback (직접 로컬 업데이트)
      const stored = JSON.parse(localStorage.getItem("users") || "[]");
      const updatedList = stored.map((u: any) =>
        u.username === updatedUser.username ? updatedUser : u
      );
      localStorage.setItem("users", JSON.stringify(updatedList));
    }

    // ✅ XP / 레벨업 알림
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
