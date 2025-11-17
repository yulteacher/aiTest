import { useAppDataContext } from "../context/AppDataContext";

/* ================================
   🎁 XP 지급 규칙 정의
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
     ⭐ 이벤트 기반 XP 지급
  ================================= */
  const addXP = (
    event: "login" | "postCreated" | "commentCreated" | "pollVoted"
  ) => {
    if (!currentUser) return;

    const amount = XP_RULES[event] ?? 0;

    const updatedUser = {
      ...currentUser,
      xp: (currentUser.xp ?? 0) + amount,
    };

    // 저장
    setCurrentUser(updatedUser);
    localStorage.setItem("currentUser", JSON.stringify(updatedUser));

    // users 배열 업데이트
    const users = JSON.parse(localStorage.getItem("users") || "[]");
    const updatedUsers = users.map((u: any) =>
      u.id === updatedUser.id ? updatedUser : u
    );
    localStorage.setItem("users", JSON.stringify(updatedUsers));
  };

  return { getLevelInfo, addXP };
};
