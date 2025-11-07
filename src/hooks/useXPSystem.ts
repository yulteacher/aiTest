// src/hooks/useXPSystem.ts
import { toast } from "sonner";
import { useAppData } from "./useAppData";

export const useXPSystem = () => {
  const { currentUser, setCurrentUser, users, setUsers } = useAppData();

  const XP_RULES = {
    postCreate: 10,
    likeReceived: 2,
    commentReceived: 3,
    pollVoted: 5,
  };

  const calculateLevel = (xp) => Math.floor(xp / 100) + 1;
  const calculateProgress = (xp) => xp % 100;

  const addXP = (type) => {
    if (!currentUser || !XP_RULES[type]) return;

    const xpGain = XP_RULES[type];
    const newXP = (currentUser.xp || 0) + xpGain;
    const prevLevel = calculateLevel(currentUser.xp || 0);
    const newLevel = calculateLevel(newXP);

    const updatedUser = { ...currentUser, xp: newXP, level: newLevel };
    setCurrentUser(updatedUser);

    const newUsers = users.map(u => u.username === currentUser.username ? updatedUser : u);
    setUsers(newUsers);

    if (newLevel > prevLevel) {
      toast.success(`🎉 레벨 업! ${prevLevel} → ${newLevel}`);
    } else {
      toast.message(`+${xpGain} XP`, {
        description: `${calculateProgress(newXP)} / 100 XP`,
      });
    }
  };

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
};
