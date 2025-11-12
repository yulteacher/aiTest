import { useAppDataContext } from "../context/AppDataContext";

export const useXPSystem = () => {
  const { currentUser, setCurrentUser } = useAppDataContext();

  const getLevelInfo = () => {
    if (!currentUser) return { level: 1, xp: 0, progress: 0, toNext: 100 };

    const xp = currentUser.xp || 0;
    const level = Math.floor(xp / 100) + 1;
    const progress = xp % 100;
    const toNext = 100 - progress;

    return { level, xp, progress, toNext };
  };

  const addXP = (amount: number) => {
    if (!currentUser) return;

    const updatedUser = { ...currentUser, xp: currentUser.xp + amount };
    setCurrentUser(updatedUser);
    localStorage.setItem("currentUser", JSON.stringify(updatedUser));

    const users = JSON.parse(localStorage.getItem("users") || "[]");
    const updatedUsers = users.map((u: any) =>
      u.id === updatedUser.id ? updatedUser : u
    );
    localStorage.setItem("users", JSON.stringify(updatedUsers));
  };

  return { getLevelInfo, addXP };
};
