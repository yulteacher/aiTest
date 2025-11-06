import { useState, useEffect } from "react";

export function useLocalData() {
  const loadData = (key, fallback) => {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : fallback;
  };

const initialUserData = (() => {
  const stored = localStorage.getItem("userData");
  if (stored) {
    const parsed = JSON.parse(stored);
    // ✅ XP 필드가 없는 오래된 데이터 보정
    if (parsed.current && parsed.current.xp === undefined) {
      parsed.current.xp = 0;
    }
    parsed.all = parsed.all.map((u) => ({
      ...u,
      xp: u.xp ?? 0, // XP가 없으면 0으로 보정
    }));
    return parsed;
  }

  // ✅ legacy 구조 대비
  const savedCurrent = localStorage.getItem("currentUser");
  const savedUsers = localStorage.getItem("users");
  const current = savedCurrent ? JSON.parse(savedCurrent) : null;
  const all = savedUsers ? JSON.parse(savedUsers) : [];

  // XP 필드 추가 보정
  return {
    current: current ? { ...current, xp: current.xp ?? 0 } : null,
    all: all.map((u) => ({ ...u, xp: u.xp ?? 0 })),
  };
})();


  const [userData, setUserData] = useState(() => initialUserData);
  const [posts, setPosts] = useState(() => loadData("posts", []));
  const [polls, setPolls] = useState(() => loadData("polls", []));
  const [notifications, setNotifications] = useState(() =>
    loadData("notifications", [])
  );

  // ✅ 저장 자동 반영
  useEffect(() => {
    localStorage.setItem("userData", JSON.stringify(userData));
  }, [userData]);

  useEffect(() => {
    localStorage.setItem("posts", JSON.stringify(posts));
  }, [posts]);

  useEffect(() => {
    localStorage.setItem("polls", JSON.stringify(polls));
  }, [polls]);

  useEffect(() => {
    localStorage.setItem("notifications", JSON.stringify(notifications));
  }, [notifications]);

  // ✅ 사용자 교체 시 유틸 함수
  const setCurrentUser = (updatedUser) => {
    setUserData((prev) => ({
      current: updatedUser,
      all: prev.all.map((u) =>
        u.username === updatedUser.username ? updatedUser : u
      ),
    }));
  };

  return {
    userData,
    setUserData,
    currentUser: userData.current,
    setCurrentUser,
    users: userData.all,
    setUsers: (updatedUsers) =>
      setUserData((prev) => ({ ...prev, all: updatedUsers })),
    posts,
    setPosts,
    polls,
    setPolls,
    notifications,
    setNotifications,
  };
}
