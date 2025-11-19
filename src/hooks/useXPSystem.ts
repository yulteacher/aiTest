import { useAppDataContext } from "../context/AppDataContext";
import { useBadgeSystem } from "./useBadgeSystem";

/* ================================
   🎁 XP 지급 규칙
================================ */
const XP_RULES: Record<
  "login" | "postCreated" | "commentCreated" | "pollVoted",
  number
> = {
  login: 10,
  postCreated: 20,
  commentCreated: 10,
  pollVoted: 15,
};

export const useXPSystem = () => {
  const { currentUser, setCurrentUser } = useAppDataContext();
  const { checkAllBadges } = useBadgeSystem();

  /* ================================
     🔥 레벨 / 진행도 계산
  ================================= */
  const getLevelInfo = () => {
    if (!currentUser)
      return { level: 1, xp: 0, progress: 0, toNext: 100 };

    const xp = currentUser.xp ?? 0;
    const level = Math.floor(xp / 100) + 1;
    const progress = xp % 100;
    const toNext = 100 - progress;

    return { level, xp, progress, toNext };
  };

  /* ================================
     ⭐ XP 지급 + 레벨 업데이트
  ================================= */
  const addXP = (
    event: "login" | "postCreated" | "commentCreated" | "pollVoted"
  ) => {
    if (!currentUser) return;

    const amount = XP_RULES[event] ?? 0;

    const newXP = (currentUser.xp ?? 0) + amount;
    const newLevel = Math.floor(newXP / 100) + 1;

    const updatedUser = {
      ...currentUser,
      xp: newXP,
      level: newLevel, // ⭐ 레벨 갱신 매우 중요!
    };

    // ----------------------------------
    // 저장
    // ----------------------------------
    setCurrentUser(updatedUser);
    localStorage.setItem("currentUser", JSON.stringify(updatedUser));

    // 전체 users 업데이트
    const users = JSON.parse(localStorage.getItem("users") || "[]");
    const updatedUsers = users.map((u: any) =>
      u.id === updatedUser.id ? updatedUser : u
    );
    localStorage.setItem("users", JSON.stringify(updatedUsers));

    // ----------------------------------
    // 🎖 XP로 인한 레벨업 → 배지 재검사
    // ----------------------------------
    checkAllBadges();
  };

  return { getLevelInfo, addXP };
};
