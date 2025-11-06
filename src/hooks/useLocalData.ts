// =============================
// 🧠 useLocalData.ts (v4)
// LocalStorage 기반 전역 상태 관리 (React Hooks)
// - users, posts, polls, notifications, xpHistory 포함
// =============================
import { useState, useEffect } from "react";
import { KBO_TEAMS } from "../data/constants/teams";
import { generateDummyData } from "../data/generateDummy";

export const useLocalData = () => {
  // ✅ 상태 정의
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [posts, setPosts] = useState<any[]>([]);
  const [polls, setPolls] = useState<any[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [xpHistory, setXpHistory] = useState<any[]>([]);

  const KEYS = ["users", "posts", "polls", "notifications", "xpHistory"];
  useEffect(() => {
    const existingUsers = localStorage.getItem("users");
    if (!existingUsers) generateDummyData();
  }, []);

  // ✅ 초기 로드
  useEffect(() => {
    const loadData = (key: string, setter: (val: any) => void) => {
      const saved = localStorage.getItem(key);
      if (saved) setter(JSON.parse(saved));
    };

    loadData("currentUser", setCurrentUser);
    loadData("users", setUsers);
    loadData("posts", setPosts);
    loadData("polls", setPolls);
    loadData("notifications", setNotifications);
    loadData("xpHistory", setXpHistory);
  }, []);

  // ✅ 변경 시 저장
  useEffect(() => {
    if (currentUser)
      localStorage.setItem("currentUser", JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => localStorage.setItem("users", JSON.stringify(users)), [users]);
  useEffect(() => localStorage.setItem("posts", JSON.stringify(posts)), [posts]);
  useEffect(() => localStorage.setItem("polls", JSON.stringify(polls)), [polls]);
  useEffect(
    () => localStorage.setItem("notifications", JSON.stringify(notifications)),
    [notifications]
  );
  useEffect(
    () => localStorage.setItem("xpHistory", JSON.stringify(xpHistory)),
    [xpHistory]
  );

  // ✅ CRUD 유틸 함수
  const get = (key: string) => JSON.parse(localStorage.getItem(key) || "[]");
  const set = (key: string, value: any) =>
    localStorage.setItem(key, JSON.stringify(value));
  const remove = (key: string) => localStorage.removeItem(key);
  const clearAll = () => KEYS.forEach(remove);

  // ✅ 초기화 (admin 계정 생성)
  const initData = () => {
    console.log("⚙️ useLocalData: initData() 실행");

    const existingUsers = JSON.parse(localStorage.getItem("users") || "[]");
    if (existingUsers.length === 0) {
      const defaultAdmin = {
        username: "admin",
        password: "123456",
        team: KBO_TEAMS[0],
        avatar:
          "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop",
        xp: 0,
        level: 1,
        badges: [],
        joinedAt: new Date().toISOString(),
      };
      localStorage.setItem("users", JSON.stringify([defaultAdmin]));
      setUsers([defaultAdmin]);
      console.log("✅ 기본 admin 계정 생성 완료");
    } else {
      setUsers(existingUsers);
      console.log("✅ 기존 유저 데이터 유지");
    }
  };

  // ✅ 회원가입 (기본 초기값 부여)
  const registerUser = (newUser: any) => {
    const allUsers = get("users");
    const fullUser = {
      ...newUser,
      xp: 0,
      level: 1,
      badges: [],
      joinedAt: new Date().toISOString(),
    };
    const updated = [...allUsers, fullUser];
    setUsers(updated);
    localStorage.setItem("users", JSON.stringify(updated));
  };

  // ✅ 반환 (필요한 모든 상태/함수 제공)
  return {
    currentUser,
    setCurrentUser,
    users,
    setUsers,
    posts,
    setPosts,
    polls,
    setPolls,
    notifications,
    setNotifications,
    xpHistory,
    setXpHistory,
    get,
    set,
    remove,
    clearAll,
    initData,
    registerUser,
  };
};
